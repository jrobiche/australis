// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod australis;

use crate::australis::tauri::{
    create_game_console_configuration, delete_game_console_configuration,
    get_game_console_configurations, setup_app, update_game_console_configuration,
};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            match setup_app(&app) {
                Ok(_) => (),
                Err(err) => panic!("{err}"),
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_game_console_configuration,
            delete_game_console_configuration,
            get_game_console_configurations,
            update_game_console_configuration,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
