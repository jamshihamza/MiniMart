//! MM-007 development-only receipt-printer transport spike.
//! Successful submission proves only spooler acceptance, never physical paper output.

use std::sync::atomic::{AtomicBool, Ordering};

mod raster;

#[cfg(windows)]
#[allow(unsafe_code)]
mod windows_spooler;

const DIAGNOSTIC: &[u8] = b"MiniMart\r\nPrinter Spike MM-007\r\n--------------------------------\r\n012345678901234567890123456789\r\nABCDEFGHIJKLMNOPQRSTUVWXYZ\r\nabcdefghijklmnopqrstuvwxyz\r\n--------------------------------\r\n\r\n";

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PrinterError {
    InvalidPrinterName,
    AlreadyAttempted,
    UnsupportedPlatform,
    PrinterUnavailable,
    JobSubmissionFailed,
    UncertainOutput,
    IncompleteWrite,
}

impl PrinterError {
    #[must_use]
    pub const fn category(self) -> &'static str {
        match self {
            Self::InvalidPrinterName => "INVALID_DATA",
            Self::AlreadyAttempted => "BUSY",
            Self::UnsupportedPlatform => "UNSUPPORTED",
            Self::PrinterUnavailable => "NOT_CONNECTED",
            Self::JobSubmissionFailed => "DRIVER_ERROR",
            Self::UncertainOutput | Self::IncompleteWrite => "UNKNOWN",
        }
    }

    #[must_use]
    pub const fn outcome(self) -> &'static str {
        match self {
            Self::UncertainOutput | Self::IncompleteWrite => "UNKNOWN",
            _ => "FAILED",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Submission {
    pub windows_job_id: u32,
    pub bytes_submitted: usize,
}

/// Checks an explicit Windows queue name supplied by the native host.
///
/// # Errors
/// Returns `InvalidPrinterName` for blank, overlong, or control-bearing names.
pub fn validate_printer_name(name: &str) -> Result<&str, PrinterError> {
    let name = name.trim();
    if name.is_empty() || name.len() > 128 || name.chars().any(char::is_control) {
        return Err(PrinterError::InvalidPrinterName);
    }
    Ok(name)
}

#[must_use]
pub const fn diagnostic_payload() -> &'static [u8] {
    DIAGNOSTIC
}

/// One attempt per process; an uncertain failure must not trigger duplicate paper.
///
/// # Errors
/// Returns a validation, platform, spooler, or already-attempted error.
pub fn print_diagnostic_once(printer_name: &str) -> Result<Submission, PrinterError> {
    static ATTEMPTED: AtomicBool = AtomicBool::new(false);
    let printer_name = validate_printer_name(printer_name)?;
    attempt_once(&ATTEMPTED, || submit(printer_name, diagnostic_payload()))
}

fn attempt_once<T>(
    gate: &AtomicBool,
    operation: impl FnOnce() -> Result<T, PrinterError>,
) -> Result<T, PrinterError> {
    gate.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
        .map_err(|_| PrinterError::AlreadyAttempted)?;
    operation()
}

#[cfg(windows)]
fn submit(printer_name: &str, payload: &[u8]) -> Result<Submission, PrinterError> {
    windows_spooler::submit(printer_name, payload)
}

#[cfg(not(windows))]
fn submit(_printer_name: &str, _payload: &[u8]) -> Result<Submission, PrinterError> {
    Err(PrinterError::UnsupportedPlatform)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn diagnostic_is_bounded_ascii_with_windows_line_endings() {
        let payload = diagnostic_payload();
        assert!(payload.len() < 256);
        assert!(payload.is_ascii());
        assert!(payload.windows(2).any(|pair| pair == b"\r\n"));
        assert!(payload.starts_with(b"MiniMart\r\nPrinter Spike MM-007\r\n"));
    }

    #[test]
    fn printer_name_must_be_explicit_and_bounded() {
        assert_eq!(validate_printer_name("  Queue  "), Ok("Queue"));
        for name in ["", " \t", "Queue\nOther", "Queue\0Other"] {
            assert_eq!(
                validate_printer_name(name),
                Err(PrinterError::InvalidPrinterName)
            );
        }
        assert_eq!(
            validate_printer_name(&"x".repeat(129)),
            Err(PrinterError::InvalidPrinterName)
        );
    }

    #[test]
    fn attempt_never_retries_even_after_uncertain_failure() {
        let gate = AtomicBool::new(false);
        let mut calls = 0;
        let first: Result<(), PrinterError> = attempt_once(&gate, || {
            calls += 1;
            Err(PrinterError::JobSubmissionFailed)
        });
        let second = attempt_once(&gate, || {
            calls += 1;
            Ok(())
        });
        assert_eq!(first, Err(PrinterError::JobSubmissionFailed));
        assert_eq!(second, Err(PrinterError::AlreadyAttempted));
        assert_eq!(calls, 1);
    }

    #[test]
    fn errors_have_stable_hardware_categories() {
        assert_eq!(PrinterError::InvalidPrinterName.category(), "INVALID_DATA");
        assert_eq!(PrinterError::PrinterUnavailable.category(), "NOT_CONNECTED");
        assert_eq!(PrinterError::JobSubmissionFailed.category(), "DRIVER_ERROR");
        assert_eq!(PrinterError::AlreadyAttempted.category(), "BUSY");
        assert_eq!(PrinterError::UncertainOutput.outcome(), "UNKNOWN");
        assert_eq!(PrinterError::IncompleteWrite.outcome(), "UNKNOWN");
    }
}
