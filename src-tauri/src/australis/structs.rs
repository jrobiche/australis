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

// TODO is this still used?
#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuroraAssetImageData {
    pub width: u32,
    pub height: u32,
    pub rgba8: Vec<u8>,
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuroraGameListEntry {
    pub id: u64,
    pub title_name: String,
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuroraGame {
    pub id: u64,
    pub directory: String,
    pub executable: String,
    pub title_id: u64,
    pub media_id: u64,
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
