use std::io::Write;
use std::path::{Path, PathBuf};

use log::{error, warn};
use tauri::Manager;
use uuid::Uuid;

use crate::australis::structs::{AuroraGame, GameConsoleConfiguration};

// TODO move path functions to their own module
// TODO move sql functions to their own module

// game-consoles directory structure
// <AppData>/game-consoles/
// <AppData>/game-consoles/<UUID>/
// <AppData>/game-consoles/<UUID>/configuration.json
// <AppData>/game-consoles/<UUID>/aurora-data/ (file system within `aurora-data` should mirror remote aurora installation directory)

// <AppData>/game-consoles/default.??? TODO?
// <AppData>/game-consoles/<UUID>/console-data/ (file system within `console-data` should mirror remote filesystem)
// <AppData>/game-consoles/<UUID>/asset-images/ (images extracted from asset files)

// TODO rename `path_game_console_...` to `path_local_...` and create corresponding `path_remote_...` functions
////////////////////////////////////////////////////////////////////////////////
// path resolving functions
////////////////////////////////////////////////////////////////////////////////
pub fn path_game_consoles_root(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    match app_handle
        .path()
        .resolve("game-consoles", tauri::path::BaseDirectory::AppData)
    {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to resolve game consoles root directory. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}

pub fn path_game_console_aurora_data(
    app_handle: &tauri::AppHandle,
    console_configuration: &GameConsoleConfiguration,
) -> Result<PathBuf, String> {
    Ok(path_game_consoles_root(app_handle)?
        .join(console_configuration.id_string())
        .join("aurora-data"))
}

pub fn path_game_console_aurora_content_db(
    app_handle: &tauri::AppHandle,
    console_configuration: &GameConsoleConfiguration,
) -> Result<PathBuf, String> {
    Ok(
        path_game_console_aurora_data(&app_handle, console_configuration)?
            .join("Data")
            .join("Databases")
            .join("content.db"),
    )
}

pub fn path_game_console_aurora_game_data(
    app_handle: &tauri::AppHandle,
    console_configuration: &GameConsoleConfiguration,
) -> Result<PathBuf, String> {
    Ok(
        path_game_console_aurora_data(&app_handle, console_configuration)?
            .join("Data")
            .join("GameData"),
    )
}

pub fn path_game_console_aurora_settings_db(
    app_handle: &tauri::AppHandle,
    console_configuration: &GameConsoleConfiguration,
) -> Result<PathBuf, String> {
    Ok(
        path_game_console_aurora_data(&app_handle, console_configuration)?
            .join("Data")
            .join("Databases")
            .join("settings.db"),
    )
}

pub fn path_game_console_aurora_assets_root(
    app_handle: &tauri::AppHandle,
    console_configuration: &GameConsoleConfiguration,
    title_id: u32,
    game_id: u32,
) -> Result<PathBuf, String> {
    Ok(
        path_game_console_aurora_data(app_handle, console_configuration)?
            .join("Data")
            .join("GameData")
            .join(format!("{:0>8X}_{:0>8X}", title_id, game_id)),
    )
}

pub fn path_game_console_aurora_asset(
    app_handle: &tauri::AppHandle,
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
    Ok(
        path_game_console_aurora_assets_root(app_handle, console_configuration, title_id, game_id)?
            .join(asset_file_name),
    )
}

pub fn path_game_console_configurations_root(
    app_handle: &tauri::AppHandle,
) -> Result<PathBuf, String> {
    match app_handle
        .path()
        .resolve("game-consoles", tauri::path::BaseDirectory::AppData)
    {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to resolve consoles root directory. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}

pub fn path_game_console_configuration_root(
    app_handle: &tauri::AppHandle,
    console_configuration_id: &Uuid,
) -> Result<PathBuf, String> {
    Ok(path_game_console_configurations_root(app_handle)?
        .join(uuid_to_string(console_configuration_id)))
}

pub fn path_game_console_configuration(
    app_handle: &tauri::AppHandle,
    console_configuration: &GameConsoleConfiguration,
) -> Result<PathBuf, String> {
    Ok(path_game_console_configuration_from_id(
        app_handle,
        &console_configuration.id(),
    )?)
}

pub fn path_game_console_configuration_from_id(
    app_handle: &tauri::AppHandle,
    console_configuration_id: &Uuid,
) -> Result<PathBuf, String> {
    Ok(path_game_console_configurations_root(app_handle)?
        .join(uuid_to_string(console_configuration_id))
        .join("configuration.json"))
}

////////////////////////////////////////////////////////////////////////////////
// misc
////////////////////////////////////////////////////////////////////////////////
// TODO confirm if it should be `..._to_string()` or `..._as_string()` or something else
pub fn uuid_to_string(id: &Uuid) -> String {
    id.as_hyphenated().to_string()
}

// TODO remove
// pub fn delete_file(file_path: &Path) -> Result<(), String> {
//     match std::fs::remove_file(file_path) {
//         Ok(_) => Ok(()),
//         Err(err) => {
//             let msg = format!(
//                 "Failed to delete file '{}'. Got the following error: {}",
//                 file_path.display(),
//                 err
//             );
//             error!("{}", &msg);
//             Err(msg)
//         }
//     }
// }

pub fn delete_directory(dir_path: &Path) -> Result<(), String> {
    match std::fs::remove_dir_all(&dir_path) {
        Ok(_) => Ok(()),
        Err(err) => {
            let msg = format!(
                "Failed to delete directory '{}'. Got the following error: {}",
                dir_path.display(),
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

pub fn write_str_to_path(file_path: &Path, data: &str) -> Result<(), String> {
    match file_path.parent() {
        Some(file_path_parent) => match std::fs::create_dir_all(file_path_parent) {
            Ok(_) => (),
            Err(err) => {
                let msg = format!(
                    "Failed to create parent directories of file '{}'. Got the following error: {}",
                    file_path.display(),
                    err
                );
                error!("{}", &msg);
                return Err(msg);
            }
        },
        None => (),
    }
    // TODO should this use std::fs::write?
    let mut file = match std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&file_path)
    {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to open file at '{}' for writing. Got the following error: {}",
                file_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    match file.write_all(data.as_bytes()) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to write to file at '{}'. Got the following error: {}",
                file_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    Ok(())
}

////////////////////////////////////////////////////////////////////////////////
// unorganized
////////////////////////////////////////////////////////////////////////////////
fn game_executable_type(game: &AuroraGame) -> Option<u32> {
    // 0: Xbox 360 Executable (xex)
    // 1: Classic Xbox Executable (xbe)
    // 2: Xbox 360 Container
    // 3: Classic Xbox Container
    // 4: XNA Container
    if game.executable.to_lowercase().ends_with(".xex") {
        return Some(0);
    }
    if game.executable.to_lowercase().ends_with(".xbe") {
        return Some(1);
    }
    // assume game is in container format
    if game.default_group == 3 {
        return Some(4);
    }
    if game.default_group == 4 {
        return Some(3);
    }
    return Some(2);
}

fn path_from_mount_point(mount_point: &str) -> Option<String> {
    match mount_point {
        "Dvd:" => Some(String::from("\\Device\\Cdrom0")),
        "Flash:" => Some(String::from("\\SystemRoot")),
        "HdDvdPlayer:" => Some(String::from("\\Device\\HdDvdPlayer")),
        "HdDvdStorage:" => Some(String::from("\\Device\\HdDvdStorage")),
        "Hdd0:" => Some(String::from("\\Device\\Harddisk0\\Partition0")),
        "Hdd1:" => Some(String::from("\\Device\\Harddisk0\\Partition1")),
        "Hddx:" => Some(String::from("\\Device\\Harddisk0\\SystemPartition")),
        "Memunit0:" => Some(String::from("\\Device\\Mu0")),
        "Memunit1:" => Some(String::from("\\Device\\Mu1")),
        "SysExt:" => Some(String::from("\\sep")),
        "Transfercable:" => Some(String::from("\\Device\\Transfercable")),
        "TransfercableXbox1:" => Some(String::from(
            "\\Device\\Transfercable\\Compatibility\\Xbox1",
        )),
        "USBMU0:" => Some(String::from("\\Device\\Mass0PartitionFile\\Storage")),
        "USBMU1:" => Some(String::from("\\Device\\Mass1PartitionFile\\Storage")),
        "USBMU2:" => Some(String::from("\\Device\\Mass2PartitionFile\\Storage")),
        "USBMUCache0:" => Some(String::from("\\Device\\Mass0PartitionFile\\StorageSystem")),
        "USBMUCache1:" => Some(String::from("\\Device\\Mass1PartitionFile\\StorageSystem")),
        "USBMUCache2:" => Some(String::from("\\Device\\Mass2PartitionFile\\StorageSystem")),
        "Usb0:" => Some(String::from("\\Device\\Mass0")),
        "Usb1:" => Some(String::from("\\Device\\Mass1")),
        "Usb2:" => Some(String::from("\\Device\\Mass2")),
        _ => None,
    }
}

pub fn determine_title_launch_data(
    app_handle: &tauri::AppHandle,
    console_configuration: &GameConsoleConfiguration,
    game: &AuroraGame,
) -> Result<(String, String, u32), String> {
    let content_db_file = path_game_console_aurora_content_db(&app_handle, &console_configuration)?;
    let settings_db_file =
        path_game_console_aurora_settings_db(&app_handle, &console_configuration)?;
    if !content_db_file.is_file() {
        let msg = format!("No database exists at '{}'.", content_db_file.display());
        error!("{}", &msg);
        return Err(msg);
    }
    if !settings_db_file.is_file() {
        let msg = format!("No database exists at '{}'.", content_db_file.display());
        error!("{}", &msg);
        return Err(msg);
    }
    let content_db_connection = match sqlite::open(&content_db_file) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to open connection to database at '{}'. Got the following error: {}",
                content_db_file.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let settings_db_connection = match sqlite::open(&settings_db_file) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to open connection to database at '{}'. Got the following error: {}",
                content_db_file.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    // get scan path of game
    let mut scan_path_id: Option<i64> = None;
    let query = "SELECT ScanPathId FROM ContentItems WHERE Id = ?";
    let mut statement = match content_db_connection.prepare(query) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!("Failed to prepare query. Got the following error: {}", err);
            error!("{}", &msg);
            return Err(msg);
        }
    };
    match statement.bind((1, game.id as i64)) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to bind game id '{}' to SQL query. Got the following error: {}",
                game.id as i64, err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    while let Ok(sqlite::State::Row) = statement.next() {
        match (statement.read::<i64, _>("ScanPathId"),) {
            (Ok(row_scan_path_id),) => {
                scan_path_id = Some(row_scan_path_id);
            }
            _ => {
                warn!("Invalid row data in database.");
                continue;
            }
        }
    }
    let scan_path_id = match scan_path_id {
        Some(x) => x,
        None => {
            let msg = format!("Failed to get scan path id for game with id '{}'.", game.id);
            error!("{}", &msg);
            return Err(msg);
        }
    };
    // get device id of scan path
    let mut device_id: Option<String> = None;
    let query = "SELECT DeviceId FROM ScanPaths WHERE Id = ?";
    let mut statement = match settings_db_connection.prepare(query) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!("Failed to prepare query. Got the following error: {}", err);
            error!("{}", &msg);
            return Err(msg);
        }
    };
    match statement.bind((1, scan_path_id)) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to bind scan path id '{}' to SQL query. Got the following error: {}",
                scan_path_id, err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    while let Ok(sqlite::State::Row) = statement.next() {
        match (statement.read::<String, _>("DeviceId"),) {
            (Ok(row_device_id),) => {
                device_id = Some(row_device_id);
            }
            _ => {
                warn!("Invalid row data in database.");
                continue;
            }
        }
    }
    let device_id: String = match device_id {
        Some(x) => x,
        None => {
            let msg = format!(
                "Failed to get device id for scan path id '{}'.",
                scan_path_id
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    // get mount point of device
    let mut mount_point: Option<String> = None;
    let query = "SELECT MountPoint FROM MountedDevices WHERE DeviceId = ?";
    let mut statement = match content_db_connection.prepare(query) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!("Failed to prepare query. Got the following error: {}", err);
            error!("{}", &msg);
            return Err(msg);
        }
    };
    match statement.bind::<(usize, &str)>((1, &device_id)) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to bind device id '{}' to SQL query. Got the following error: {}",
                device_id, err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    while let Ok(sqlite::State::Row) = statement.next() {
        match (statement.read::<String, _>("MountPoint"),) {
            (Ok(row_mount_point),) => {
                mount_point = Some(row_mount_point);
            }
            _ => {
                warn!("Invalid row data in database.");
                continue;
            }
        }
    }
    let mount_point = match mount_point {
        Some(x) => x,
        None => {
            let msg = format!("Failed to get mount point for device id '{}'.", device_id);
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let path = match path_from_mount_point(&mount_point) {
        Some(x) => format!("{}{}", x, game.directory),
        None => {
            let msg = format!("Failed to get path for mount point '{}'.", mount_point);
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let exec_type = match game_executable_type(&game) {
        Some(x) => x,
        None => {
            let msg = format!(
                "Failed to get executable type for game with id '{}'.",
                game.id
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    Ok((path, game.executable.clone(), exec_type))
}
