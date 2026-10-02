use minimart_hw_printer::{PrinterError, Submission, print_diagnostic_once};
use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiagnosticReply {
    outcome: &'static str,
    error_category: Option<&'static str>,
    windows_job_id: Option<u32>,
    bytes_submitted: Option<usize>,
    physical_output_verified: bool,
}

impl DiagnosticReply {
    fn from_result(result: Result<Submission, PrinterError>) -> Self {
        match result {
            Ok(submission) => Self {
                outcome: "SUCCESS",
                error_category: None,
                windows_job_id: Some(submission.windows_job_id),
                bytes_submitted: Some(submission.bytes_submitted),
                physical_output_verified: false,
            },
            Err(error) => Self {
                outcome: error.outcome(),
                error_category: Some(error.category()),
                windows_job_id: None,
                bytes_submitted: None,
                physical_output_verified: false,
            },
        }
    }
}

/// Pure gating logic for the diagnostic command, kept free of I/O and of the
/// `async`/Tauri runtime so it is directly unit-testable. `enable_flag` and
/// `printer_name` are the raw values of the two host environment variables
/// (`None` when unset). Returns the validated queue name to submit to, or the
/// exact reply the command should return without attempting a submission.
fn diagnostic_gate<'a>(
    enable_flag: Option<&str>,
    printer_name: Option<&'a str>,
) -> Result<&'a str, DiagnosticReply> {
    if enable_flag != Some("1") {
        return Err(DiagnosticReply::from_result(Err(
            PrinterError::UnsupportedPlatform,
        )));
    }
    printer_name.ok_or_else(|| DiagnosticReply::from_result(Err(PrinterError::InvalidPrinterName)))
}

/// Development-only native diagnostic. This command only exists in debug
/// builds (see the `#[cfg(debug_assertions)]` module gate in `lib.rs`); a
/// release build neither compiles nor registers it. It accepts no bytes or
/// printer name from the WebView; both the enable flag and queue come from
/// the host environment, and still require explicit opt-in even in a debug
/// build.
#[tauri::command]
pub async fn print_mm007_diagnostic() -> DiagnosticReply {
    let enable_flag = std::env::var("MINIMART_MM007_ENABLE_TEST_PRINT");
    let queue = std::env::var("MINIMART_MM007_PRINTER");
    let printer_name = match diagnostic_gate(enable_flag.as_deref().ok(), queue.as_deref().ok()) {
        Ok(name) => name.to_owned(),
        Err(reply) => return reply,
    };
    tauri::async_runtime::spawn_blocking(move || {
        DiagnosticReply::from_result(print_diagnostic_once(&printer_name))
    })
    .await
    .unwrap_or_else(|_| DiagnosticReply::from_result(Err(PrinterError::UncertainOutput)))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reply_never_claims_physical_output() {
        let reply = DiagnosticReply::from_result(Ok(Submission {
            windows_job_id: 7,
            bytes_submitted: 150,
        }));
        assert_eq!(reply.outcome, "SUCCESS");
        assert!(!reply.physical_output_verified);
        assert_eq!(reply.windows_job_id, Some(7));
        let uncertain = DiagnosticReply::from_result(Err(PrinterError::UncertainOutput));
        assert_eq!(uncertain.outcome, "UNKNOWN");
        assert!(!uncertain.physical_output_verified);
    }

    #[test]
    fn gate_rejects_when_the_enable_flag_is_unset_or_not_exactly_one() {
        for enable_flag in [None, Some(""), Some("0"), Some("true"), Some("1 ")] {
            let reply = diagnostic_gate(enable_flag, Some("Queue")).unwrap_err();
            assert_eq!(reply.outcome, "FAILED");
            assert_eq!(reply.error_category, Some("UNSUPPORTED"));
            assert!(!reply.physical_output_verified);
        }
    }

    #[test]
    fn gate_rejects_missing_printer_queue_even_when_enabled() {
        let reply = diagnostic_gate(Some("1"), None).unwrap_err();
        assert_eq!(reply.outcome, "FAILED");
        assert_eq!(reply.error_category, Some("INVALID_DATA"));
        assert!(!reply.physical_output_verified);
    }

    #[test]
    fn gate_passes_the_queue_name_through_only_when_explicitly_enabled() {
        let Ok(queue) = diagnostic_gate(Some("1"), Some("Queue")) else {
            panic!("gate should pass");
        };
        assert_eq!(queue, "Queue");
    }
}
