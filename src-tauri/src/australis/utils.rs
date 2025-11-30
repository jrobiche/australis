use std::io::Write;
use std::path::Path;

use log::{error, warn};
use uuid::Uuid;

use crate::australis::structs::{AuroraGame, GameConsoleConfiguration, PathResolver};

// TODO move sql functions to their own module

pub fn uuid_to_string(id: &Uuid) -> String {
    id.as_hyphenated().to_string()
}

pub fn write_str_to_path(file_path: &Path, data: &str) -> Result<(), String> {
    match file_path.parent() {
        Some(file_path_parent) => std::fs::create_dir_all(file_path_parent).map_err(|err| {
            let msg = format!(
                "Failed to create parent directories of file '{}'. Got the following error: {}",
                file_path.display(),
                err
            );
            error!("{}", &msg);
            msg
        })?,
        None => (),
    }
    let mut file = std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(&file_path)
        .map_err(|err| {
            let msg = format!(
                "Failed to open file at '{}' for writing. Got the following error: {}",
                file_path.display(),
                err
            );
            error!("{}", &msg);
            msg
        })?;
    file.write_all(data.as_bytes()).map_err(|err| {
        let msg = format!(
            "Failed to write to file at '{}'. Got the following error: {}",
            file_path.display(),
            err
        );
        error!("{}", &msg);
        msg
    })
}

fn mount_point_to_path_string(mount_point: &str) -> Option<String> {
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
    let path_resolver = PathResolver::new(&app_handle);
    let content_db_file = path_resolver.game_console_aurora_content_db(&console_configuration)?;
    let settings_db_file = path_resolver.game_console_aurora_settings_db(&console_configuration)?;
    let content_db_connection = sqlite::open(&content_db_file).map_err(|err| {
        let msg = format!(
            "Failed to open connection to database at '{}'. Got the following error: {}",
            content_db_file.display(),
            err
        );
        error!("{}", &msg);
        msg
    })?;
    let settings_db_connection = sqlite::open(&settings_db_file).map_err(|err| {
        let msg = format!(
            "Failed to open connection to database at '{}'. Got the following error: {}",
            content_db_file.display(),
            err
        );
        error!("{}", &msg);
        msg
    })?;
    // get scan path id of game
    let mut scan_path_id: Option<i64> = None;
    let query = "SELECT ScanPathId FROM ContentItems WHERE Id = ?";
    let mut statement = content_db_connection.prepare(query).map_err(|err| {
        let msg = format!("Failed to prepare query. Got the following error: {}", err);
        error!("{}", &msg);
        msg
    })?;
    statement.bind((1, game.id as i64)).map_err(|err| {
        let msg = format!(
            "Failed to bind game id '{}' to SQL query. Got the following error: {}",
            game.id as i64, err
        );
        error!("{}", &msg);
        msg
    })?;
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
    // get device id of scan path id
    let mut device_id: Option<String> = None;
    let query = "SELECT DeviceId FROM ScanPaths WHERE Id = ?";
    let mut statement = settings_db_connection.prepare(query).map_err(|err| {
        let msg = format!("Failed to prepare query. Got the following error: {}", err);
        error!("{}", &msg);
        msg
    })?;
    statement.bind((1, scan_path_id)).map_err(|err| {
        let msg = format!(
            "Failed to bind scan path id '{}' to SQL query. Got the following error: {}",
            scan_path_id, err
        );
        error!("{}", &msg);
        msg
    })?;
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
    // get mount point of device id
    let mut mount_point: Option<String> = None;
    let query = "SELECT MountPoint FROM MountedDevices WHERE DeviceId = ?";
    let mut statement = content_db_connection.prepare(query).map_err(|err| {
        let msg = format!("Failed to prepare query. Got the following error: {}", err);
        error!("{}", &msg);
        msg
    })?;
    statement
        .bind::<(usize, &str)>((1, &device_id))
        .map_err(|err| {
            let msg = format!(
                "Failed to bind device id '{}' to SQL query. Got the following error: {}",
                device_id, err
            );
            error!("{}", &msg);
            msg
        })?;
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
    let path = match mount_point_to_path_string(&mount_point) {
        Some(x) => format!("{}{}", x, game.directory),
        None => {
            let msg = format!("Failed to get path for mount point '{}'.", mount_point);
            error!("{}", &msg);
            return Err(msg);
        }
    };
    Ok((path, game.executable.clone(), game.executable_type()))
}
