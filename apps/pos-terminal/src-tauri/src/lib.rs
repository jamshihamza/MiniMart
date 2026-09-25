mod system_status;

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![system_status::check_store_node])
        .run(tauri::generate_context!())
        .expect("MiniMart POS desktop host failed");
}
