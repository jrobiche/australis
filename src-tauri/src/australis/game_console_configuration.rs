use super::utils::empty_string_option_to_none_option;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GameConsoleConfiguration {
    id: u32,
    name: String,
    data_directory: std::path::PathBuf,
    ip_address: String,
    aurora_ftp_port: u32,
    aurora_ftp_username: Option<String>,
    aurora_ftp_password: Option<String>,
    aurora_http_port: u32,
    aurora_http_username: Option<String>,
    aurora_http_password: Option<String>,
}

impl GameConsoleConfiguration {
    pub fn new(
        id: u32,
        name: String,
        data_directory: std::path::PathBuf,
        ip_address: String,
        aurora_ftp_port: u32,
        aurora_ftp_username: Option<String>,
        aurora_ftp_password: Option<String>,
        aurora_http_port: u32,
        aurora_http_username: Option<String>,
        aurora_http_password: Option<String>,
    ) -> Self {
        let aurora_ftp_username = empty_string_option_to_none_option(aurora_ftp_username);
        let aurora_ftp_password = empty_string_option_to_none_option(aurora_ftp_password);
        let aurora_http_username = empty_string_option_to_none_option(aurora_http_username);
        let aurora_http_password = empty_string_option_to_none_option(aurora_http_password);
        Self {
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
        }
    }

    pub fn id(&self) -> u32 {
        return self.id;
    }
}

pub fn read_game_console_configurations(
    config_path: &std::path::PathBuf,
) -> Result<Vec<GameConsoleConfiguration>, String> {
    // if configuration file does not exist, initialize it with an empty list
    if !config_path.exists() {
        write_game_console_configurations(config_path, &Vec::new())?;
    }
    // read config file into a string
    let config_data = match std::fs::read_to_string(config_path) {
        Ok(file_data) => file_data,
        Err(err) => {
            return Err(format!(
                "Failed to read console configurations from '{}'. Got the following error:\n{}",
                &config_path.display(),
                err
            ));
        }
    };
    // deserialize game console configurations vector from a json string
    return match serde_json::from_str(&config_data) {
        Ok(x) => Ok(x),
        Err(err) => Err(format!(
            "Failed to parse console configurations. Got the following error:\n{}",
            err
        )),
    };
}

pub fn write_game_console_configurations(
    config_path: &std::path::PathBuf,
    game_console_configs: &Vec<GameConsoleConfiguration>,
) -> Result<(), String> {
    // create parent directories of the configuration file
    match config_path.parent() {
        Some(config_path_parents) => match std::fs::create_dir_all(config_path_parents) {
            Ok(_) => (),
            Err(err) => {
                return Err(format!(
                    "Failed to create directory structure of '{}'. Got the following error:\n{}",
                    config_path_parents.display(),
                    err
                ));
            }
        },
        None => (),
    };
    // serialize game console configurations vector to a json string
    let config_data = match serde_json::to_string(&game_console_configs) {
        Ok(x) => x,
        Err(err) => {
            return Err(format!(
                "Failed to serialize list of game console configurations as a string. Got the following error:\n{}",
                err
            ));
        }
    };
    // write game console configurations json string to file
    match std::fs::write(config_path, config_data) {
        Ok(_) => {}
        Err(err) => {
            return Err(format!(
                "Failed to write console configurations to '{}'. Got the following error:\n{}",
                config_path.display(),
                err
            ));
        }
    }
    return Ok(());
}
