use super::game_console_configuration::{
    read_game_console_configurations, write_game_console_configurations, GameConsoleConfiguration,
};
use std::sync::atomic::{AtomicU32, Ordering};

static NEXT_GAME_CONSOLE_ID: AtomicU32 = AtomicU32::new(0);

#[tauri::command]
pub fn create_game_console_configuration(
    app_handle: tauri::AppHandle,
    name: String,
    ip_address: String,
    aurora_ftp_port: u32,
    aurora_ftp_username: Option<String>,
    aurora_ftp_password: Option<String>,
    aurora_http_port: u32,
    aurora_http_username: Option<String>,
    aurora_http_password: Option<String>,
) -> Result<GameConsoleConfiguration, String> {
    let id = NEXT_GAME_CONSOLE_ID.fetch_add(1, Ordering::SeqCst);
    if id == 0 {
        return Err(String::from("Failed to increment game console id."));
    }
    let config_path = resolve_game_console_configurations_path(app_handle.path_resolver())?;
    let data_directory = resolve_game_console_data_path(app_handle.path_resolver(), id)?;
    let mut configs = read_game_console_configurations(&config_path)?;
    // create a new config with given information
    let config: GameConsoleConfiguration = GameConsoleConfiguration::new(
        id,
        name,
        data_directory,
        ip_address,
        aurora_ftp_port,
        aurora_ftp_username,
        aurora_ftp_password,
        aurora_http_port,
        aurora_http_username,
        aurora_http_password,
    );
    // add the new configuration to the list of configurations
    configs.push(config.clone());
    write_game_console_configurations(&config_path, &configs)?;
    return Ok(config);
}

#[tauri::command]
pub fn delete_game_console_configuration(
    app_handle: tauri::AppHandle,
    id: u32,
) -> Result<GameConsoleConfiguration, String> {
    let config_path = resolve_game_console_configurations_path(app_handle.path_resolver())?;
    let mut configs = read_game_console_configurations(&config_path)?;
    // find index of config with id matching `id`
    let config_index = configs.iter().position(|gcc| gcc.id() == id);
    let config_index = match config_index {
        Some(x) => x,
        None => {
            return Err(format!(
                "No game console configuration with id '{}' exists.",
                id
            ));
        }
    };
    // remove config
    let deleted_game_console_config: GameConsoleConfiguration = configs.remove(config_index);
    write_game_console_configurations(&config_path, &configs)?;
    return Ok(deleted_game_console_config);
}

#[tauri::command]
pub fn get_game_console_configurations(
    app_handle: tauri::AppHandle,
) -> Result<Vec<GameConsoleConfiguration>, String> {
    let config_path = resolve_game_console_configurations_path(app_handle.path_resolver())?;
    return read_game_console_configurations(&config_path);
}

#[tauri::command]
pub fn update_game_console_configuration(
    app_handle: tauri::AppHandle,
    id: u32,
    name: String,
    ip_address: String,
    aurora_ftp_port: u32,
    aurora_ftp_username: Option<String>,
    aurora_ftp_password: Option<String>,
    aurora_http_port: u32,
    aurora_http_username: Option<String>,
    aurora_http_password: Option<String>,
) -> Result<GameConsoleConfiguration, String> {
    let config_path = resolve_game_console_configurations_path(app_handle.path_resolver())?;
    let data_directory = resolve_game_console_data_path(app_handle.path_resolver(), id)?;
    let mut configs = read_game_console_configurations(&config_path)?;
    // find index of config with id matching `id`
    let config_index = configs.iter().position(|gc| gc.id() == id);
    let config_index = match config_index {
        Some(x) => x,
        None => {
            return Err(format!(
                "No game console configuration with id '{}' exists.",
                id
            ));
        }
    };
    // create new config with updated information
    let updated_game_console_config = GameConsoleConfiguration::new(
        id,
        name,
        data_directory,
        ip_address,
        aurora_ftp_port,
        aurora_ftp_username,
        aurora_ftp_password,
        aurora_http_port,
        aurora_http_username,
        aurora_http_password,
    );
    // overwrite old config with new config
    configs[config_index] = updated_game_console_config.clone();
    write_game_console_configurations(&config_path, &configs)?;
    return Ok(updated_game_console_config);
}

fn resolve_game_console_configurations_path(
    path_resolver: tauri::PathResolver,
) -> Result<std::path::PathBuf, String> {
    return match path_resolver.app_config_dir() {
        Some(mut config_path) => {
            config_path.push("consoles.json");
            Ok(config_path)
        }
        None => Err(String::from(
            "Failed to resolve application configuration directory.",
        )),
    };
}

fn resolve_game_console_data_path(
    path_resolver: tauri::PathResolver,
    game_console_configuration_id: u32,
) -> Result<std::path::PathBuf, String> {
    return match path_resolver.app_data_dir() {
        Some(mut data_path) => {
            data_path.push("consoles");
            data_path.push(format!("{:08X}", game_console_configuration_id));
            Ok(data_path)
        }
        None => Err(String::from(
            "Failed to resolve application data directory.",
        )),
    };
}

pub fn setup_app(app: &tauri::App) -> Result<(), String> {
    let config_path = resolve_game_console_configurations_path(app.path_resolver())?;
    let configs = read_game_console_configurations(&config_path)?;
    // set `NEXT_GAME_CONSOLE_ID` to largest existing game console id plus one
    let largest_game_console_id: Option<u32> = match configs.iter().max_by_key(|x| x.id()) {
        Some(config) => Some(config.id()),
        None => None,
    };
    let next_game_console_id: u32 = match largest_game_console_id {
        Some(x) => {
            if x == u32::MAX {
                return Err(String::from(
                    "Cannot increment game console id. The largest game console id equals largest possible integer value."
                ));
            }
            x + 1
        }
        None => 0,
    };
    NEXT_GAME_CONSOLE_ID.store(next_game_console_id, std::sync::atomic::Ordering::SeqCst);
    Ok(())
}
