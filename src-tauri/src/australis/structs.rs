use uuid::Uuid;

use crate::australis::utils::uuid_to_string;

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

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameAssetTypes {
    pub id: u64,
    pub has_icon: bool,
    pub has_banner: bool,
    pub has_boxart: bool,
    pub has_slot: bool,
    pub has_background: bool,
    pub has_screenshot1: bool,
    pub has_screenshot2: bool,
    pub has_screenshot3: bool,
    pub has_screenshot4: bool,
    pub has_screenshot5: bool,
    pub has_screenshot6: bool,
    pub has_screenshot7: bool,
    pub has_screenshot8: bool,
    pub has_screenshot9: bool,
    pub has_screenshot10: bool,
    pub has_screenshot11: bool,
    pub has_screenshot12: bool,
    pub has_screenshot13: bool,
    pub has_screenshot14: bool,
    pub has_screenshot15: bool,
    pub has_screenshot16: bool,
    pub has_screenshot17: bool,
    pub has_screenshot18: bool,
    pub has_screenshot19: bool,
    pub has_screenshot20: bool,
}

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
