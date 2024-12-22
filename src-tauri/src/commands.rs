use log::{error, warn};
use std::io::Write;
use tauri::Manager;
use uuid::Uuid;

use libaustralis;

// game-consoles directory structure
// <AppData>/game-consoles/
// <AppData>/game-consoles/default.??? TODO
// <AppData>/game-consoles/<UUID>/
// <AppData>/game-consoles/<UUID>/configuration.json
// <AppData>/game-consoles/<UUID>/asset-images/ (images extracted from asset files in `console-data`)
// <AppData>/game-consoles/<UUID>/console-data/ (file system within `console-data` should mirror remote filesystem)

fn game_consoles_root_dir(
    app_handle: &tauri::AppHandle,
) -> Result<std::path::PathBuf, tauri::Error> {
    app_handle
        .path()
        .resolve("game-consoles", tauri::path::BaseDirectory::AppData)
}

fn game_console_configuration_path(
    app_handle: &tauri::AppHandle,
    console_configuration_id: Uuid,
) -> Result<std::path::PathBuf, tauri::Error> {
    Ok(game_consoles_root_dir(app_handle)?
        .join(id_as_string(console_configuration_id))
        .join("configuration.json"))
}

fn id_as_string(id: Uuid) -> String {
    id.as_hyphenated().to_string()
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameConsoleConfiguration {
    id: uuid::Uuid, // idk if this is ok
    pub name: String,
    pub ip_address: String,
    pub aurora_ftp_port: usize,
    pub aurora_ftp_username: Option<String>,
    pub aurora_ftp_password: Option<String>,
    pub aurora_http_port: usize,
    pub aurora_http_username: Option<String>,
    pub aurora_http_password: Option<String>,
}

impl GameConsoleConfiguration {
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4(),
            name: String::from(""),
            ip_address: String::from("0.0.0.0"),
            aurora_ftp_port: 21,
            aurora_ftp_username: None,
            aurora_ftp_password: None,
            aurora_http_port: 9999,
            aurora_http_username: None,
            aurora_http_password: None,
        }
    }

    // TODO?
    // pub fn from_file(path: ...) -> Result<Self, ...>

    pub fn id(&self) -> Uuid {
        self.id
    }
}

// Game Console Configuration Commands
#[tauri::command]
pub fn create_game_console_configuration(
    app_handle: tauri::AppHandle,
    name: String,
    ip_address: String,
    aurora_ftp_port: usize,
    aurora_ftp_username: Option<String>,
    aurora_ftp_password: Option<String>,
    aurora_http_port: usize,
    aurora_http_username: Option<String>,
    aurora_http_password: Option<String>,
) -> Result<GameConsoleConfiguration, String> {
    let mut console_configuration = GameConsoleConfiguration::new();
    console_configuration.name = name;
    console_configuration.ip_address = ip_address;
    console_configuration.aurora_ftp_port = aurora_ftp_port;
    console_configuration.aurora_ftp_username = aurora_ftp_username;
    console_configuration.aurora_ftp_password = aurora_ftp_password;
    console_configuration.aurora_http_port = aurora_http_port;
    console_configuration.aurora_http_username = aurora_http_username;
    console_configuration.aurora_http_password = aurora_http_password;
    // write console config to disk
    let config_path = match game_console_configuration_path(&app_handle, console_configuration.id())
    {
        Ok(x) => x,
        Err(err) => {
            error!(
                "Failed to get console configuration path. Got the following error: {}",
                err
            );
            return Err("Failed to get console configuration path.".into());
        }
    };
    match libaustralis::utils::create_parent_dirs(&config_path) {
        Ok(_) => (),
        Err(err) => {
            error!(
                "Failed to create parent directories of file '{}'. Got the following error: {}",
                &config_path.display(),
                err
            );
            return Err(
                "Failed to create parent directories of console configuration file.".into(),
            );
        }
    }
    let config_data = match serde_json::to_string(&console_configuration) {
        Ok(x) => x,
        Err(err) => {
            error!("Failed to serialize console configuration as a string. Got the following error: {}", err);
            return Err("Failed to serialize console configuration as a string.".into());
        }
    };
    let mut file = match std::fs::OpenOptions::new()
        .create_new(true)
        .write(true)
        .open(&config_path)
    {
        Ok(x) => x,
        Err(err) => {
            error!("Failed to open console configuration file for writing. Got the following error: {}", err);
            return Err("Failed to open console configuration file for writing.".into());
        }
    };
    match file.write_all(config_data.as_bytes()) {
        Ok(_) => (),
        Err(err) => {
            error!(
                "Failed to write console configuration to file. Got the following error: {}",
                err
            );
            return Err("Failed to write console configuration to file.".into());
        }
    };
    Ok(console_configuration)
}

#[tauri::command]
pub fn read_game_console_configuration(
    app_handle: tauri::AppHandle,
    console_configuration_id: Uuid,
) -> Result<GameConsoleConfiguration, String> {
    // load console configuration
    let console_configuration_path =
        match game_console_configuration_path(&app_handle, console_configuration_id) {
            Ok(x) => x,
            Err(err) => {
                error!(
                    "Failed to get console configuration path. Got the following error: {}",
                    err
                );
                return Err("Failed to get console configuration path.".into());
            }
        };
    let file = match std::fs::OpenOptions::new()
        .read(true)
        .open(&console_configuration_path)
    {
        Ok(x) => x,
        Err(err) => {
            error!("Failed to open console configuration file at '{}' for reading. Got the following error: {}", &console_configuration_path.display(), err);
            return Err("Failed to open console configuration file for reading.".into());
        }
    };
    match serde_json::from_reader(file) {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to parse console configuration at '{}'. Got the following error: {}",
                console_configuration_path.display(),
                err
            );
            Err("Failed to parse console configuration.".into())
        }
    }
}

#[tauri::command]
pub fn delete_game_console_configuration(
    app_handle: tauri::AppHandle,
    console_configuration_id: Uuid,
    delete_data: bool,
) -> Result<(), String> {
    let configuration_path =
        match game_console_configuration_path(&app_handle, console_configuration_id) {
            Ok(x) => x,
            Err(err) => {
                error!(
                    "Failed to get console configuration path. Got the following error: {}",
                    err
                );
                return Err("Failed to get console configuration path.".into());
            }
        };
    match std::fs::remove_file(&configuration_path) {
        Ok(_) => (),
        Err(err) => {
            error!(
                "Failed to remove console configuration at '{}'. Got the following error: {}",
                &configuration_path.display(),
                err
            );
            return Err("Failed to remove console configuration.".into());
        }
    }
    if delete_data {
        let configuration_path_parent = match configuration_path.as_path().parent() {
            Some(x) => x,
            None => {
                error!(
                    "Failed to get parent directory of console configuration path '{}'.",
                    &configuration_path.display()
                );
                return Err("Failed to get parent directory of console configuration path.".into());
            }
        };
        match std::fs::remove_dir_all(&configuration_path_parent) {
            Ok(_) => (),
            Err(err) => {
                error!(
                    "Failed to delete directory '{}'. Got the following error: {}",
                    &configuration_path_parent.display(),
                    err
                );
                return Err("Failed to delete directory.".into());
            }
        }
    }
    Ok(())
}

#[tauri::command]
pub fn read_game_console_configurations(
    app_handle: tauri::AppHandle,
) -> Result<Vec<GameConsoleConfiguration>, String> {
    let mut console_configurations = Vec::new();
    let consoles_root_dir = match game_consoles_root_dir(&app_handle) {
        Ok(x) => x,
        Err(err) => {
            error!(
                "Failed to get consoles root directory. Got the following error: {}",
                err
            );
            return Err("Failed to get consoles root directory.".into());
        }
    };
    // if directory doesnt exist, return
    if !consoles_root_dir.is_dir() {
        return Ok(console_configurations);
    }
    let entries = match std::fs::read_dir(&consoles_root_dir) {
        Ok(x) => x,
        Err(err) => {
            error!(
                "Failed to read contents of directory '{}'. Got the following error: {}",
                consoles_root_dir.display(),
                err
            );
            return Err("Failed to read contents of consoles root directory.".into());
        }
    };
    for entry in entries {
        let path = match entry {
            Ok(x) => x.path(),
            Err(err) => {
                error!(
                    "Invalid entry in directory '{}'. Got the following error: {}",
                    consoles_root_dir.display(),
                    err
                );
                return Err("Invalid entry in consoles root directory.".into());
            }
        };
        let path = path.as_path();
        let entry_file_name = match path.file_name() {
            Some(x) => match x.to_str() {
                Some(y) => y,
                None => {
                    warn!(
                        "Failed to convert file name of path '{}' to str.",
                        path.display()
                    );
                    continue;
                }
            },
            None => {
                warn!("Failed to get file name of path '{}'.", path.display());
                continue;
            }
        };
        let console_configuration_id = match uuid::Uuid::parse_str(entry_file_name) {
            Ok(x) => x,
            Err(_) => {
                warn!(
                    "The entry '{}' in '{}' is not a valid uuid.",
                    entry_file_name,
                    consoles_root_dir.display()
                );
                continue;
            }
        };
        match read_game_console_configuration(app_handle.clone(), console_configuration_id) {
            Ok(gc) => console_configurations.push(gc),
            Err(err) => {
                error!(
                    "Failed to read console configuration. Got the following error: {}",
                    err
                );
            }
        }
    }
    Ok(console_configurations)
}

#[tauri::command]
pub fn update_game_console_configuration(
    app_handle: tauri::AppHandle,
    id: Uuid,
    name: String,
    ip_address: String,
    aurora_ftp_port: usize,
    aurora_ftp_username: Option<String>,
    aurora_ftp_password: Option<String>,
    aurora_http_port: usize,
    aurora_http_username: Option<String>,
    aurora_http_password: Option<String>,
) -> Result<GameConsoleConfiguration, String> {
    let mut console_configuration = match read_game_console_configuration(
        app_handle.clone(),
        id.clone(),
    ) {
        Ok(x) => x,
        Err(err) => {
            error!("Failed to load existing console configuration with id '{}'. Got the following error: {}", id_as_string(id), err);
            return Err("Failed to load existing console configuration.".into());
        }
    };
    console_configuration.name = name;
    console_configuration.ip_address = ip_address;
    console_configuration.aurora_ftp_port = aurora_ftp_port;
    console_configuration.aurora_ftp_username = aurora_ftp_username;
    console_configuration.aurora_ftp_password = aurora_ftp_password;
    console_configuration.aurora_http_port = aurora_http_port;
    console_configuration.aurora_http_username = aurora_http_username;
    console_configuration.aurora_http_password = aurora_http_password;
    // write console config to disk
    let config_path = match game_console_configuration_path(&app_handle, console_configuration.id())
    {
        Ok(x) => x,
        Err(err) => {
            error!(
                "Failed to get console configuration path. Got the following error: {}",
                err
            );
            return Err("Failed to get console configuration path.".into());
        }
    };
    match libaustralis::utils::create_parent_dirs(&config_path) {
        Ok(_) => (),
        Err(err) => {
            error!(
                "Failed to create parent directories of file '{}'. Got the following error: {}",
                &config_path.display(),
                err
            );
            return Err(
                "Failed to create parent directories of console configuration file.".into(),
            );
        }
    }
    let config_data = match serde_json::to_string(&console_configuration) {
        Ok(x) => x,
        Err(err) => {
            error!("Failed to serialize console configuration as a string. Got the following error: {}", err);
            return Err("Failed to serialize console configuration as a string.".into());
        }
    };
    let mut file = match std::fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&config_path)
    {
        Ok(x) => x,
        Err(err) => {
            error!("Failed to open console configuration file for writing. Got the following error: {}", err);
            return Err("Failed to open console configuration file for writing.".into());
        }
    };
    match file.write_all(config_data.as_bytes()) {
        Ok(_) => (),
        Err(err) => {
            error!(
                "Failed to write console configuration to file. Got the following error: {}",
                err
            );
            return Err("Failed to write console configuration to file.".into());
        }
    };
    Ok(console_configuration)
}

// HTTP Commands
#[tauri::command]
pub async fn http_get_console_authentication_token(
    console_configuration: GameConsoleConfiguration,
) -> Result<Option<String>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.new_token().await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console authentication token. Got the following error: {}",
                err
            );
            Err("Failed to get console authentication token.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_memory(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::Memory, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_memory(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console memory. Got the following error: {}",
                err
            );
            Err("Failed to get console memory.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_image_profile(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    uuid: u32,
) -> Result<Vec<u8>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client
        .get_image_profile(token, &format!("{}", uuid))
        .await
    {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console Image Profile. Got the following error: {}",
                err
            );
            Err("Failed to get console Image Profile.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_profile(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<Vec<libaustralis::aurora::http_schemas::Profile>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_profile(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console Profile. Got the following error: {}",
                err
            );
            Err("Failed to get console Profile.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_plugin(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::Plugin, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_plugin(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console Plugin. Got the following error: {}",
                err
            );
            Err("Failed to get console Plugin.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_smc(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::Smc, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_smc(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console Smc. Got the following error: {}",
                err
            );
            Err("Failed to get console Smc.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_system(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::System, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_system(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console system. Got the following error: {}",
                err
            );
            Err("Failed to get console system.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_temperature(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::Temperature, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_temperature(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console temperatures. Got the following error: {}",
                err
            );
            Err("Failed to get console temperatures.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_thread(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<Vec<libaustralis::aurora::http_schemas::Thread>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_thread(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console threads. Got the following error: {}",
                err
            );
            Err("Failed to get console threads.".into())
        }
    }
}

#[tauri::command]
pub async fn http_get_console_thread_state(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::ThreadState, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_thread_state(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to get console thread state. Got the following error: {}",
                err
            );
            Err("Failed to get console thread state.".into())
        }
    }
}

#[tauri::command]
pub async fn http_post_console_thread_state(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    suspend: bool,
) -> Result<(), String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.post_thread_state(token, suspend).await {
        Ok(x) => Ok(x),
        Err(err) => {
            error!(
                "Failed to set console thread state. Got the following error: {}",
                err
            );
            Err("Failed to set console thread state.".into())
        }
    }
}
