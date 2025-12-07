mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::create_game_console_configuration,
            commands::delete_game_console_configuration,
            commands::read_game_console_configurations,
            commands::update_game_console_configuration,
            commands::http_get_console_authentication_token,
            commands::http_get_console_image_profile,
            commands::http_get_console_memory,
            commands::http_get_console_plugin,
            commands::http_get_console_profile,
            commands::http_get_console_smc,
            commands::http_get_console_system,
            commands::http_get_console_temperature,
            commands::http_get_console_thread,
            commands::http_get_console_thread_state,
            commands::http_post_console_thread_state
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
