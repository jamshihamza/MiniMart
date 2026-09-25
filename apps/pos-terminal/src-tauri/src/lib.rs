pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("MiniMart POS desktop host failed");
}
