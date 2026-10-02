// The MM-007 diagnostic command is a development-only spike: it must not be
// compiled into, or registered in, a release build.
#[cfg(debug_assertions)]
mod printer_spike;
mod system_status;

pub fn run() {
    #[cfg(debug_assertions)]
    let builder = tauri::Builder::default().invoke_handler(tauri::generate_handler![
        system_status::check_store_node,
        printer_spike::print_mm007_diagnostic
    ]);
    #[cfg(not(debug_assertions))]
    let builder = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![system_status::check_store_node]);

    builder
        .run(tauri::generate_context!())
        .expect("MiniMart POS desktop host failed");
}
