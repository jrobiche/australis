use std::path::PathBuf;
use tauri::AppHandle;
use uuid::Uuid;

use log::error;
use tauri::Manager;

use crate::australis::utils::uuid_to_string;

pub struct PathResolver {
    app_handle: tauri::AppHandle,
}

impl PathResolver {
    pub fn new(app_handle: &AppHandle) -> Self {
        Self {
            app_handle: app_handle.clone(),
        }
    }

    pub fn game_console_configurations_root(&self) -> Result<PathBuf, String> {
        self.app_handle
            .path()
            .resolve("game-consoles", tauri::path::BaseDirectory::AppData)
            .map_err(|err| {
                let msg = format!(
                    "Failed to resolve consoles root directory. Got the following error: {}",
                    err
                );
                error!("{}", msg);
                msg
            })
    }

    pub fn game_console_configuration_directory(
        &self,
        console_configuration_id: &Uuid,
    ) -> Result<PathBuf, String> {
        Ok(self
            .game_console_configurations_root()?
            .join(uuid_to_string(console_configuration_id)))
    }

    pub fn game_console_configuration_file(
        &self,
        console_configuration_id: &Uuid,
    ) -> Result<PathBuf, String> {
        Ok(self
            .game_console_configuration_directory(console_configuration_id)?
            .join("configuration.json"))
    }

    // file system within `aurora-data` should mirror remote aurora installation directory
    pub fn game_console_aurora_data(
        &self,
        console_configuration: &GameConsoleConfiguration,
    ) -> Result<PathBuf, String> {
        Ok(self
            .game_console_configurations_root()?
            .join(console_configuration.id_string())
            .join("aurora-data"))
    }

    pub fn game_console_aurora_game_data(
        &self,
        console_configuration: &GameConsoleConfiguration,
    ) -> Result<PathBuf, String> {
        Ok(self
            .game_console_aurora_data(console_configuration)?
            .join("Data")
            .join("GameData"))
    }

    pub fn game_console_aurora_content_db(
        &self,
        console_configuration: &GameConsoleConfiguration,
    ) -> Result<PathBuf, String> {
        Ok(self
            .game_console_aurora_data(console_configuration)?
            .join("Data")
            .join("Databases")
            .join("content.db"))
    }

    pub fn game_console_aurora_settings_db(
        &self,
        console_configuration: &GameConsoleConfiguration,
    ) -> Result<PathBuf, String> {
        Ok(self
            .game_console_aurora_data(console_configuration)?
            .join("Data")
            .join("Databases")
            .join("settings.db"))
    }

    pub fn game_console_aurora_assets_root(
        &self,
        console_configuration: &GameConsoleConfiguration,
        title_id: u32,
        game_id: u32,
    ) -> Result<PathBuf, String> {
        Ok(self
            .game_console_aurora_data(console_configuration)?
            .join("Data")
            .join("GameData")
            .join(format!("{:0>8X}_{:0>8X}", title_id, game_id)))
    }

    pub fn game_console_aurora_asset(
        &self,
        console_configuration: &GameConsoleConfiguration,
        title_id: u32,
        game_id: u32,
        asset_type: libaustralis::aurora::assets::AssetType,
    ) -> Result<PathBuf, String> {
        let asset_file_name = match asset_type {
            libaustralis::aurora::assets::AssetType::Background => {
                format!("BK{:0>8X}.asset", title_id)
            }
            libaustralis::aurora::assets::AssetType::Boxart => {
                format!("GC{:0>8X}.asset", title_id)
            }
            libaustralis::aurora::assets::AssetType::Icon
            | libaustralis::aurora::assets::AssetType::Banner => {
                format!("GL{:0>8X}.asset", title_id)
            }
            libaustralis::aurora::assets::AssetType::Screenshot1
            | libaustralis::aurora::assets::AssetType::Screenshot2
            | libaustralis::aurora::assets::AssetType::Screenshot3
            | libaustralis::aurora::assets::AssetType::Screenshot4
            | libaustralis::aurora::assets::AssetType::Screenshot5
            | libaustralis::aurora::assets::AssetType::Screenshot6
            | libaustralis::aurora::assets::AssetType::Screenshot7
            | libaustralis::aurora::assets::AssetType::Screenshot8
            | libaustralis::aurora::assets::AssetType::Screenshot9
            | libaustralis::aurora::assets::AssetType::Screenshot10
            | libaustralis::aurora::assets::AssetType::Screenshot11
            | libaustralis::aurora::assets::AssetType::Screenshot12
            | libaustralis::aurora::assets::AssetType::Screenshot13
            | libaustralis::aurora::assets::AssetType::Screenshot14
            | libaustralis::aurora::assets::AssetType::Screenshot15
            | libaustralis::aurora::assets::AssetType::Screenshot16
            | libaustralis::aurora::assets::AssetType::Screenshot17
            | libaustralis::aurora::assets::AssetType::Screenshot18
            | libaustralis::aurora::assets::AssetType::Screenshot19
            | libaustralis::aurora::assets::AssetType::Screenshot20 => {
                format!("SS{:0>8X}.asset", title_id)
            }
            _ => {
                let msg = format!(
                    "Could not determine file name containing asset type {}.",
                    asset_type
                );
                error!("{}", &msg);
                return Err(msg.into());
            }
        };
        Ok(self
            .game_console_aurora_assets_root(console_configuration, title_id, game_id)?
            .join(asset_file_name))
    }
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameConsoleConfiguration {
    id: Uuid,
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

    pub fn id(&self) -> Uuid {
        self.id
    }

    pub fn id_string(&self) -> String {
        uuid_to_string(&self.id)
    }
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameListEntry {
    pub id: u64,
    pub title_name: String,
}

// TODO remove
// #[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub struct GameAssetTypes {
//     pub id: u64,
//     pub has_icon: bool,
//     pub has_banner: bool,
//     pub has_boxart: bool,
//     pub has_slot: bool,
//     pub has_background: bool,
//     pub has_screenshot1: bool,
//     pub has_screenshot2: bool,
//     pub has_screenshot3: bool,
//     pub has_screenshot4: bool,
//     pub has_screenshot5: bool,
//     pub has_screenshot6: bool,
//     pub has_screenshot7: bool,
//     pub has_screenshot8: bool,
//     pub has_screenshot9: bool,
//     pub has_screenshot10: bool,
//     pub has_screenshot11: bool,
//     pub has_screenshot12: bool,
//     pub has_screenshot13: bool,
//     pub has_screenshot14: bool,
//     pub has_screenshot15: bool,
//     pub has_screenshot16: bool,
//     pub has_screenshot17: bool,
//     pub has_screenshot18: bool,
//     pub has_screenshot19: bool,
//     pub has_screenshot20: bool,
// }

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuroraGame {
    pub id: u64,
    pub directory: String,
    pub executable: String,
    pub title_id: u32,
    pub media_id: u32,
    pub base_version: u64,
    pub disc_num: u64,
    pub discs_in_set: u64,
    pub title_name: String,
    pub description: String,
    pub publisher: String,
    pub developer: String,
    pub live_rating: f64,
    pub live_raters: u64,
    pub release_date: String,
    pub genre_flag: u64,
    pub content_flags: u64,
    pub hash: String,
    pub game_caps_offline: u64,
    pub game_caps_flags: u64,
    pub file_type: u64,
    pub content_type: u64,
    pub content_group: u64,
    pub default_group: u64,
    pub date_added: u64,
    pub found_at_depth: u64,
    pub system_link: u64,
    pub scan_path_id: u64,
    pub case_index: u64,
}
