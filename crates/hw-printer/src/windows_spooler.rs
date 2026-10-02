//! The only MM-007 native FFI surface. No printer handle or arbitrary bytes
//! escape this module.

use crate::{PrinterError, Submission};
use windows::{
    Win32::Graphics::Printing::{
        AbortPrinter, ClosePrinter, DOC_INFO_1W, EndDocPrinter, EndPagePrinter, OpenPrinterW,
        PRINTER_HANDLE, StartDocPrinterW, StartPagePrinter, WritePrinter,
    },
    core::{PCWSTR, PWSTR},
};

struct PrinterHandle(PRINTER_HANDLE);

impl Drop for PrinterHandle {
    fn drop(&mut self) {
        // SAFETY: The handle was initialized by OpenPrinterW and is owned here.
        let _ = unsafe { ClosePrinter(self.0) };
    }
}

struct Job<'a> {
    printer: &'a PrinterHandle,
    open: bool,
}

impl Drop for Job<'_> {
    fn drop(&mut self) {
        if self.open {
            // SAFETY: A successful StartDocPrinterW created this job. Abort on
            // any early exit, including partial writes.
            let _ = unsafe { AbortPrinter(self.printer.0) };
        }
    }
}

pub(super) fn submit(name: &str, payload: &[u8]) -> Result<Submission, PrinterError> {
    let name: Vec<u16> = name.encode_utf16().chain(Some(0)).collect();
    let mut raw_handle = PRINTER_HANDLE::default();
    // SAFETY: The name is NUL-terminated and raw_handle is writable. Windows
    // owns no pointers beyond this call.
    unsafe { OpenPrinterW(PCWSTR(name.as_ptr()), &mut raw_handle, None) }
        .map_err(|_| PrinterError::PrinterUnavailable)?;
    let printer = PrinterHandle(raw_handle);

    let mut document: Vec<u16> = "MiniMart MM-007 diagnostic\0".encode_utf16().collect();
    let mut datatype: Vec<u16> = "RAW\0".encode_utf16().collect();
    let info = DOC_INFO_1W {
        pDocName: PWSTR(document.as_mut_ptr()),
        pOutputFile: PWSTR::null(),
        pDatatype: PWSTR(datatype.as_mut_ptr()),
    };
    // SAFETY: The printer handle is live and DOC_INFO_1W points to live,
    // NUL-terminated UTF-16 buffers for the duration of the call.
    let job_id = unsafe { StartDocPrinterW(printer.0, 1, &info) };
    if job_id == 0 {
        return Err(PrinterError::JobSubmissionFailed);
    }
    let mut job = Job {
        printer: &printer,
        open: true,
    };
    // SAFETY: The print job is active and the printer handle is live.
    if !unsafe { StartPagePrinter(printer.0) }.as_bool() {
        return Err(PrinterError::UncertainOutput);
    }
    let mut written = 0u32;
    // SAFETY: The payload buffer lives for this synchronous call, the job is
    // active, and written is a valid output pointer.
    let accepted = unsafe {
        WritePrinter(
            printer.0,
            payload.as_ptr().cast(),
            u32::try_from(payload.len()).map_err(|_| PrinterError::UncertainOutput)?,
            &mut written,
        )
    };
    if !accepted.as_bool() {
        return Err(PrinterError::UncertainOutput);
    }
    if written as usize != payload.len() {
        return Err(PrinterError::IncompleteWrite);
    }
    // SAFETY: This call balances the successful StartPagePrinter call.
    if !unsafe { EndPagePrinter(printer.0) }.as_bool() {
        return Err(PrinterError::UncertainOutput);
    }
    // SAFETY: This call balances the successful StartDocPrinterW call.
    if !unsafe { EndDocPrinter(printer.0) }.as_bool() {
        return Err(PrinterError::UncertainOutput);
    }
    job.open = false;
    Ok(Submission {
        windows_job_id: job_id,
        bytes_submitted: payload.len(),
    })
}
