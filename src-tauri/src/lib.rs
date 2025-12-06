mod australis;

use australis::commands;

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
            // aurora ftp functions
            commands::aurora_ftp_download_aurora_databases,
            commands::aurora_ftp_download_aurora_game_data_directory,
            commands::aurora_ftp_list_aurora_game_data_directories,
            commands::aurora_ftp_upload_game_assets,
            // aurora game commands
            commands::aurora_game_asset_image_delete,
            commands::aurora_game_asset_image_read_url,
            commands::aurora_game_asset_image_update,
            commands::aurora_game_entry_read_all,
            commands::aurora_game_launch,
            commands::aurora_game_read,
            // aurora http commands
            commands::aurora_http_achievement_get,
            commands::aurora_http_achievement_player_get,
            commands::aurora_http_authentication_token_get,
            commands::aurora_http_dashlaunch_get,
            commands::aurora_http_filebrowser_get,
            commands::aurora_http_image_achievement_get,
            commands::aurora_http_image_achievement_get_url,
            commands::aurora_http_image_profile_get,
            commands::aurora_http_image_profile_get_url,
            commands::aurora_http_image_screencapture_get,
            commands::aurora_http_image_screencapture_get_url,
            commands::aurora_http_memory_get,
            commands::aurora_http_multidisc_get,
            commands::aurora_http_plugin_get,
            commands::aurora_http_profile_get,
            commands::aurora_http_screencapture_delete,
            commands::aurora_http_screencapture_meta_get,
            commands::aurora_http_screencapture_meta_list_count_get,
            commands::aurora_http_screencapture_meta_list_get,
            commands::aurora_http_smc_get,
            commands::aurora_http_system_get,
            commands::aurora_http_systemlink_bandwidth_get,
            commands::aurora_http_systemlink_get,
            commands::aurora_http_temperature_get,
            commands::aurora_http_thread_get,
            commands::aurora_http_thread_state_get,
            commands::aurora_http_thread_state_post,
            commands::aurora_http_title_file_get,
            commands::aurora_http_title_get,
            commands::aurora_http_title_launch_post,
            commands::aurora_http_title_live_cache_get,
            commands::aurora_http_title_live_cache_post,
            commands::aurora_http_update_notification_get,
            // game console configuration commands
            commands::game_console_configuration_create,
            commands::game_console_configuration_delete,
            commands::game_console_configuration_read,
            commands::game_console_configuration_read_all,
            commands::game_console_configuration_update,
            // xboxcatalog commands
            commands::xboxcatalog_live_image_bytes_url,
            commands::xboxcatalog_live_images,
            // xboxunity commands
            commands::xboxunity_cover_image_bytes_url,
            commands::xboxunity_cover_info,
            commands::xboxunity_title_icon_image_bytes_url,
            commands::xboxunity_title_list,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
