use base64::{engine::general_purpose, Engine as _};
use log::{error, warn};
use sqlite;
use uuid::Uuid;

use crate::australis::structs::{
    AuroraGame, GameAssetTypes, GameConsoleConfiguration, GameListEntry,
};
use crate::australis::utils::{
    delete_directory, determine_title_launch_data, path_game_console_aurora_asset,
    path_game_console_aurora_content_db, path_game_console_aurora_game_data,
    path_game_console_aurora_settings_db, path_game_console_configuration,
    path_game_console_configuration_from_id, path_game_console_configuration_root,
    path_game_console_configurations_root, write_str_to_path,
};
use libaustralis;

// TODO make path_... commands for remote aurora file/dir locations
////////////////////////////////////////////////////////////////////////////////
// aurora ftp commands
////////////////////////////////////////////////////////////////////////////////
#[tauri::command]
pub async fn aurora_ftp_download_aurora_databases(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
) -> Result<(), String> {
    // TODO if `FtpClient::new()` accepted `str` instead of `String` would the clones be required?
    let ftp_client = libaustralis::aurora::ftp::FtpClient::new(
        console_configuration.ip_address.clone(),
        console_configuration.aurora_ftp_port.clone(),
        console_configuration.aurora_ftp_username.clone(),
        console_configuration.aurora_ftp_password.clone(),
    );
    let files = vec![
        // source and destination of content.db
        (
            "/Game/Data/Databases/content.db",
            path_game_console_aurora_content_db(&app_handle, &console_configuration)?,
        ),
        // source and destination of settings.db
        (
            "/Game/Data/Databases/settings.db",
            path_game_console_aurora_settings_db(&app_handle, &console_configuration)?,
        ),
    ];
    for (file_src, file_dest) in files {
        match ftp_client.download_file(None, &file_src, &file_dest) {
            Ok(_) => (),
            Err(err) => {
                let msg = format!(
                    "Failed to download file over FTP from '{}' to '{}'. Got the following error: {}",
                    &file_src,
                    &file_dest.display(),
                    err
                );
                error!("{}", &msg);
                return Err(msg);
            }
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn aurora_ftp_download_aurora_game_data_directory(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
    directory_name: String,
) -> Result<(), String> {
    // TODO if `FtpClient::new()` accepted `str` instead of `String` would the clones be required?
    let ftp_client = libaustralis::aurora::ftp::FtpClient::new(
        console_configuration.ip_address.clone(),
        console_configuration.aurora_ftp_port.clone(),
        console_configuration.aurora_ftp_username.clone(),
        console_configuration.aurora_ftp_password.clone(),
    );
    let game_data_path_src = format!("/Game/Data/GameData/{}", &directory_name);
    let game_data_path_dest =
        path_game_console_aurora_game_data(&app_handle, &console_configuration)?
            .join(directory_name);
    match ftp_client.download_directory(None, &game_data_path_src, &game_data_path_dest) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                    "Failed to download directory over FTP from '{}' to '{}'. Got the following error: {}",
                    &game_data_path_src,
                    &game_data_path_dest.display(),
                    err
                );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    Ok(())
}

#[tauri::command]
pub async fn aurora_ftp_list_aurora_game_data_directories(
    console_configuration: GameConsoleConfiguration,
) -> Result<Vec<String>, String> {
    // TODO if `FtpClient::new()` accepted `str` instead of `String` would the clones be required?
    let ftp_client = libaustralis::aurora::ftp::FtpClient::new(
        console_configuration.ip_address.clone(),
        console_configuration.aurora_ftp_port.clone(),
        console_configuration.aurora_ftp_username.clone(),
        console_configuration.aurora_ftp_password.clone(),
    );
    let game_data_path_remote = "/Game/Data/GameData";
    let mut dirs: Vec<String> = Vec::new();
    match ftp_client.list_directory_contents(None, &game_data_path_remote) {
        Ok(entries) => {
            for entry in entries {
                if entry.is_directory() {
                    dirs.push(entry.name().to_string());
                }
            }
        }
        Err(err) => {
            let msg = format!(
                "Failed to list directory contents of '{}' over FTP. Got the following error: {}",
                &game_data_path_remote, err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    Ok(dirs)
}

#[tauri::command(async)]
pub async fn aurora_ftp_upload_game_assets(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
    game: AuroraGame,
) -> Result<(), String> {
    // TODO if `FtpClient::new()` accepted `str` instead of `String` would the clones be required?
    let ftp_client = libaustralis::aurora::ftp::FtpClient::new(
        console_configuration.ip_address.clone(),
        console_configuration.aurora_ftp_port.clone(),
        console_configuration.aurora_ftp_username.clone(),
        console_configuration.aurora_ftp_password.clone(),
    );
    let mut files = vec![];
    for asset_type in libaustralis::aurora::assets::AssetType::into_iter() {
        if asset_type == libaustralis::aurora::assets::AssetType::Slot {
            continue;
        }
        let file_src = path_game_console_aurora_asset(
            &app_handle,
            &console_configuration,
            (game.title_id & 0xFFFFFFFF) as u32,
            (game.id & 0xFFFFFFFF) as u32,
            asset_type,
        )?;
        if !file_src.is_file() {
            continue;
        }
        // TODO print warning?
        let asset_path_name = match file_src.as_path().file_name() {
            Some(x) => x.to_string_lossy(),
            None => continue,
        };
        let file_dest = format!(
            "/Game/Data/GameData/{:0>8X}_{:0>8X}/{}",
            (game.title_id & 0xFFFFFFFF) as u32,
            (game.id & 0xFFFFFFFF) as u32,
            asset_path_name
        );
        files.push((file_src, file_dest));
    }
    for (file_src, file_dest) in files {
        match ftp_client.upload_file(None, &file_src, &file_dest) {
            Ok(_) => (),
            Err(err) => {
                let msg = format!(
                    "Failed to upload file over FTP from '{}' to '{}'. Got the following error: {}",
                    &file_src.display(),
                    &file_dest,
                    err
                );
                error!("{}", &msg);
                return Err(msg);
            }
        }
    }
    Ok(())
}

////////////////////////////////////////////////////////////////////////////////
// aurora game commands
////////////////////////////////////////////////////////////////////////////////
#[tauri::command(async)]
pub async fn aurora_game_asset_image_delete(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
    game: AuroraGame,
    asset_type_usize: usize,
) -> Result<(), String> {
    let asset_type = match libaustralis::aurora::assets::AssetType::from_usize(asset_type_usize) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to create AssetType from '{}'. Got the following error: {}",
                asset_type_usize, err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let asset_path = path_game_console_aurora_asset(
        &app_handle,
        &console_configuration,
        (game.title_id & 0xFFFFFFFF) as u32,
        (game.id & 0xFFFFFFFF) as u32,
        asset_type,
    )?;
    let mut asset: libaustralis::aurora::assets::Asset;
    if asset_path.is_file() {
        asset = match libaustralis::aurora::assets::Asset::load(&asset_path) {
            Ok(x) => x,
            Err(err) => {
                let msg = format!(
                    "Failed to read asset file at '{}'. Got the following error: {}",
                    &asset_path.display(),
                    err
                );
                error!("{}", &msg);
                return Err(msg);
            }
        };
    } else {
        asset = libaustralis::aurora::assets::Asset::new();
    }
    match asset.delete_image(asset_type) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to delete image in asset at '{}'. Got the following error: {}",
                &asset_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    match asset.save(&asset_path) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to write asset to '{}'. Got the following error: {}",
                &asset_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    Ok(())
}

// #[tauri::command(async)]
// pub async fn aurora_game_asset_image_read(
//     app_handle: tauri::AppHandle,
//     console_configuration: GameConsoleConfiguration,
//     game: AuroraGame,
//     asset_type_usize: usize,
// ) -> Result<Option<AuroraAssetImageData>, String> {
//     let asset_type = match libaustralis::aurora::assets::AssetType::from_usize(asset_type_usize) {
//         Ok(x) => x,
//         Err(err) => {
//             let msg = format!(
//                 "Failed to create AssetType from '{}'. Got the following error: {}",
//                 asset_type_usize, err
//             );
//             error!("{}", &msg);
//             return Err(msg);
//         }
//     };
//     let asset_path = path_game_console_aurora_asset(
//         &app_handle,
//         &console_configuration,
//         (game.title_id & 0xFFFFFFFF) as u32,
//         (game.id & 0xFFFFFFFF) as u32,
//         asset_type,
//     )?;
//     // TODO warn?
//     if !asset_path.is_file() {
//         return Ok(None);
//     }
//     let asset = match libaustralis::aurora::assets::Asset::load(&asset_path) {
//         Ok(x) => x,
//         Err(err) => {
//             let msg = format!(
//                 "Failed to read asset at '{}'. Got the following error: {}",
//                 &asset_path.display(),
//                 err
//             );
//             error!("{}", &msg);
//             return Err(msg);
//         }
//     };
//     if !asset.is_image_set(asset_type) {
//         return Ok(None);
//     }
//     let (width, height) = match asset.image_dimensions(asset_type) {
//         (Some(w), Some(h), None) => (w, h),
//         _ => {
//             let msg = format!("Failed to read '{}' image in asset at '{}'. Could not determine image width and height.",
//                 &asset_type.display(),
//                 &asset_path.display()
//             );
//             error!("{}", &msg);
//             return Err(msg);
//         }
//     };
//     let rgba8 = match asset.image_rgba8(asset_type) {
//         Ok(x) => match x {
//             Some(y) => y,
//             None => Vec::new(),
//         },
//         Err(err) => {
//             let msg = format!(
//                 "Failed to read '{}' image in asset at '{}'. Failed to get image RGBA8. Got the following error: {}",
//                 &asset_type.display(),
//                 &asset_path.display(),
//                 err
//             );
//             error!("{}", &msg);
//             return Err(msg);
//         }
//     };
//     Ok(Some(AuroraAssetImageData {
//         width,
//         height,
//         rgba8,
//     }))
// }

#[tauri::command(async)]
pub async fn aurora_game_asset_image_read_url(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
    game: AuroraGame,
    asset_type_usize: usize,
) -> Result<Option<String>, String> {
    let asset_type = match libaustralis::aurora::assets::AssetType::from_usize(asset_type_usize) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to create AssetType from '{}'. Got the following error: {}",
                asset_type_usize, err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let asset_path = path_game_console_aurora_asset(
        &app_handle,
        &console_configuration,
        (game.title_id & 0xFFFFFFFF) as u32,
        (game.id & 0xFFFFFFFF) as u32,
        asset_type,
    )?;
    // TODO warn?
    if !asset_path.is_file() {
        return Ok(None);
    }
    let asset = match libaustralis::aurora::assets::Asset::load(&asset_path) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to read asset file at '{}'. Got the following error: {}",
                &asset_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    if !asset.is_image_set(asset_type) {
        return Ok(None);
    }
    let image = match asset.image(asset_type) {
        Ok(x) => match x {
            Some(y) => y,
            None => return Ok(None),
        },
        Err(err) => {
            let msg = format!(
                "Failed to read '{}' image in asset at '{}'. Got the following error: {}",
                &asset_type.display(),
                &asset_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let mut buff = std::io::Cursor::new(Vec::new());
    match image.as_rgba8() {
        Some(x) => match x.write_to(
            &mut buff,
            libaustralis::aurora::assets::image::ImageFormat::Png,
        ) {
            Ok(_) => (),
            Err(err) => {
                let msg = format!(
                    "Failed to write '{}' image in asset at '{}' to buffer. Got the following error: {}",
                    &asset_type.display(),
                    &asset_path.display(),
                    err
                );
                error!("{}", &msg);
                return Err(msg);
            }
        },
        None => (),
    }
    return Ok(Some(format!(
        "data:image/png;base64,{}",
        general_purpose::STANDARD.encode(&buff.get_ref())
    )));
}

#[tauri::command(async)]
pub async fn aurora_game_asset_image_update(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
    game: AuroraGame,
    asset_type_usize: usize,
    file_data: Vec<u8>,
) -> Result<(), String> {
    let asset_type = match libaustralis::aurora::assets::AssetType::from_usize(asset_type_usize) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to create AssetType from '{}'. Got the following error: {}",
                asset_type_usize, err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let asset_path = path_game_console_aurora_asset(
        &app_handle,
        &console_configuration,
        (game.title_id & 0xFFFFFFFF) as u32,
        (game.id & 0xFFFFFFFF) as u32,
        asset_type,
    )?;
    let mut asset: libaustralis::aurora::assets::Asset;
    if asset_path.is_file() {
        asset = match libaustralis::aurora::assets::Asset::load(&asset_path) {
            Ok(x) => x,
            Err(err) => {
                let msg = format!(
                    "Failed to read asset file at '{}'. Got the following error: {}",
                    &asset_path.display(),
                    err
                );
                error!("{}", &msg);
                return Err(msg);
            }
        };
    } else {
        // TODO should this warn? should this error?
        asset = libaustralis::aurora::assets::Asset::new();
    }
    let image = match libaustralis::utils::image_from_be_bytes(file_data) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to update '{}' image in asset at '{}'. Failed to create image from file data. Got the following error: {}",
                &asset_type.display(),
                &asset_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    match asset.set_image(image, asset_type, libaustralis::utils::TextureFormat::RGBA8) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to update '{}' image in asset at '{}'. Got the following error: {}",
                &asset_type.display(),
                &asset_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    match asset.save(&asset_path) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to update '{}' image in asset at '{}'. Failed to save asset to '{}'. Got the following error: {}",
                &asset_type.display(),
                &asset_path.display(),
                &asset_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    Ok(())
}

#[tauri::command(async)]
pub async fn aurora_game_asset_types_read_all(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
) -> Result<Vec<GameAssetTypes>, String> {
    // TODO move some db logic into libaustralis
    // TODO this logic can be simplified
    let mut all_game_asset_types: Vec<GameAssetTypes> = Vec::new();
    let game_list_entries =
        aurora_game_entry_read_all(app_handle.clone(), console_configuration.clone()).await?;
    for game_list_entry in game_list_entries {
        let game = match aurora_game_read(
            app_handle.clone(),
            console_configuration.clone(),
            (game_list_entry.id & 0xFFFFFFFF) as u32,
        )
        .await?
        {
            Some(x) => x,
            None => continue,
        };
        let mut game_asset_types = GameAssetTypes {
            id: game.id,
            has_icon: false,
            has_banner: false,
            has_boxart: false,
            has_slot: false,
            has_background: false,
            has_screenshot1: false,
            has_screenshot2: false,
            has_screenshot3: false,
            has_screenshot4: false,
            has_screenshot5: false,
            has_screenshot6: false,
            has_screenshot7: false,
            has_screenshot8: false,
            has_screenshot9: false,
            has_screenshot10: false,
            has_screenshot11: false,
            has_screenshot12: false,
            has_screenshot13: false,
            has_screenshot14: false,
            has_screenshot15: false,
            has_screenshot16: false,
            has_screenshot17: false,
            has_screenshot18: false,
            has_screenshot19: false,
            has_screenshot20: false,
        };
        for asset_type in libaustralis::aurora::assets::AssetType::into_iter() {
            let asset_path = match path_game_console_aurora_asset(
                &app_handle,
                &console_configuration,
                (game.title_id & 0xFFFFFFFF) as u32,
                (game.id & 0xFFFFFFFF) as u32,
                asset_type,
            ) {
                Ok(x) => x,
                Err(_) => {
                    // TODO message
                    continue;
                }
            };
            // TODO warn?
            if !asset_path.is_file() {
                // return Ok(None);
                continue;
            }
            let asset = match libaustralis::aurora::assets::Asset::load(&asset_path) {
                Ok(x) => x,
                Err(_) => {
                    // TODO
                    // let msg = format!(
                    //     "Failed to read asset file at '{}'. Got the following error: {}",
                    //     &asset_path.display(),
                    //     err
                    // );
                    continue;
                    // error!("{}", &msg);
                    // return Err(msg);
                }
            };
            if asset.is_image_set(asset_type) {
                match asset_type {
                    libaustralis::aurora::assets::AssetType::Icon => {
                        game_asset_types.has_icon = true
                    }
                    libaustralis::aurora::assets::AssetType::Banner => {
                        game_asset_types.has_banner = true
                    }
                    libaustralis::aurora::assets::AssetType::Boxart => {
                        game_asset_types.has_boxart = true
                    }
                    libaustralis::aurora::assets::AssetType::Slot => {
                        game_asset_types.has_slot = true
                    }
                    libaustralis::aurora::assets::AssetType::Background => {
                        game_asset_types.has_background = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot1 => {
                        game_asset_types.has_screenshot1 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot2 => {
                        game_asset_types.has_screenshot2 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot3 => {
                        game_asset_types.has_screenshot3 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot4 => {
                        game_asset_types.has_screenshot4 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot5 => {
                        game_asset_types.has_screenshot5 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot6 => {
                        game_asset_types.has_screenshot6 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot7 => {
                        game_asset_types.has_screenshot7 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot8 => {
                        game_asset_types.has_screenshot8 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot9 => {
                        game_asset_types.has_screenshot9 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot10 => {
                        game_asset_types.has_screenshot10 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot11 => {
                        game_asset_types.has_screenshot11 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot12 => {
                        game_asset_types.has_screenshot12 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot13 => {
                        game_asset_types.has_screenshot13 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot14 => {
                        game_asset_types.has_screenshot14 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot15 => {
                        game_asset_types.has_screenshot15 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot16 => {
                        game_asset_types.has_screenshot16 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot17 => {
                        game_asset_types.has_screenshot17 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot18 => {
                        game_asset_types.has_screenshot18 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot19 => {
                        game_asset_types.has_screenshot19 = true
                    }
                    libaustralis::aurora::assets::AssetType::Screenshot20 => {
                        game_asset_types.has_screenshot20 = true
                    }
                }
            }
        }
        all_game_asset_types.push(game_asset_types);
    }
    Ok(all_game_asset_types)
}

// TODO include game type
#[tauri::command]
pub async fn aurora_game_entry_read_all(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
) -> Result<Vec<GameListEntry>, String> {
    let mut game_list_entries: Vec<GameListEntry> = Vec::new();
    let content_db_file = path_game_console_aurora_content_db(&app_handle, &console_configuration)?;
    if !&content_db_file.is_file() {
        return Ok(game_list_entries);
    }
    let connection = match sqlite::open(&content_db_file) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to open connection to database at '{}'. Got the following error: {}",
                &content_db_file.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let query = "SELECT Id, TitleName FROM ContentItems";
    let mut statement = match connection.prepare(query) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to prepare query to select game entries from database at '{}'. Got the following error: {}",
                &content_db_file.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    while let Ok(sqlite::State::Row) = statement.next() {
        match (
            statement.read::<i64, _>("Id"),
            statement.read::<String, _>("TitleName"),
        ) {
            (Ok(id), Ok(title_name)) => {
                let game_list_entry = GameListEntry {
                    id: id as u64,
                    title_name,
                };
                game_list_entries.push(game_list_entry);
            }
            _ => {
                let msg = format!(
                    "Ignoring invalid game list entry row data in database at '{}'.",
                    &content_db_file.display(),
                );
                warn!("{}", &msg);
                continue;
            }
        }
    }
    return Ok(game_list_entries);
}

#[tauri::command]
pub async fn aurora_game_launch(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    game: AuroraGame,
) -> Result<(), String> {
    let (path, exec, exec_type) =
        determine_title_launch_data(&app_handle, &console_configuration, &game)?;
    aurora_http_title_launch_post(console_configuration, token, &path, &exec, exec_type).await
}

#[tauri::command]
pub async fn aurora_game_read(
    app_handle: tauri::AppHandle,
    console_configuration: GameConsoleConfiguration,
    game_id: u32,
) -> Result<Option<AuroraGame>, String> {
    let mut game: Option<AuroraGame> = None;
    let content_db_file = path_game_console_aurora_content_db(&app_handle, &console_configuration)?;
    if !&content_db_file.is_file() {
        return Ok(game);
    }
    let connection = match sqlite::open(&content_db_file) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to open connection to database at '{}'. Got the following error: {}",
                &content_db_file.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let query = "SELECT * FROM ContentItems WHERE Id = ?";
    let mut statement = match connection.prepare(query) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to prepare query to select game from database at '{}'. Got the following error: {}",
                &content_db_file.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    match statement.bind((1, i64::from(game_id))) {
        Ok(_) => (),
        Err(err) => {
            let msg = format!(
                "Failed to bind game id '{}' to SQL query to select game from database at '{}'. Got the following error: {}",
                &content_db_file.display(),
                i64::from(game_id),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    while let Ok(sqlite::State::Row) = statement.next() {
        match (
            statement.read::<i64, _>("Id"),
            statement.read::<String, _>("Directory"),
            statement.read::<String, _>("Executable"),
            statement.read::<i64, _>("TitleId"),
            statement.read::<i64, _>("MediaId"),
            statement.read::<i64, _>("BaseVersion"),
            statement.read::<i64, _>("DiscNum"),
            statement.read::<i64, _>("DiscsInSet"),
            statement.read::<String, _>("TitleName"),
            statement.read::<String, _>("Description"),
            statement.read::<String, _>("Publisher"),
            statement.read::<String, _>("Developer"),
            statement.read::<f64, _>("LiveRating"),
            statement.read::<i64, _>("LiveRaters"),
            statement.read::<String, _>("ReleaseDate"),
            statement.read::<i64, _>("GenreFlag"),
            statement.read::<i64, _>("ContentFlags"),
            statement.read::<String, _>("Hash"),
            statement.read::<i64, _>("GameCapsOffline"),
            statement.read::<i64, _>("GameCapsFlags"),
            statement.read::<i64, _>("FileType"),
            statement.read::<i64, _>("ContentType"),
            statement.read::<i64, _>("ContentGroup"),
            statement.read::<i64, _>("DefaultGroup"),
            statement.read::<i64, _>("DateAdded"),
            statement.read::<i64, _>("FoundAtDepth"),
            statement.read::<i64, _>("SystemLink"),
            statement.read::<i64, _>("ScanPathId"),
            statement.read::<i64, _>("CaseIndex"),
        ) {
            (
                Ok(id),
                Ok(directory),
                Ok(executable),
                Ok(title_id),
                Ok(media_id),
                Ok(base_version),
                Ok(disc_num),
                Ok(discs_in_set),
                Ok(title_name),
                Ok(description),
                Ok(publisher),
                Ok(developer),
                Ok(live_rating),
                Ok(live_raters),
                Ok(release_date),
                Ok(genre_flag),
                Ok(content_flags),
                Ok(hash),
                Ok(game_caps_offline),
                Ok(game_caps_flags),
                Ok(file_type),
                Ok(content_type),
                Ok(content_group),
                Ok(default_group),
                Ok(date_added),
                Ok(found_at_depth),
                Ok(system_link),
                Ok(scan_path_id),
                Ok(case_index),
            ) => {
                let title_id_u32: u32 = (title_id as u64 & 0xFFFFFFFF) as u32;
                let media_id_u32: u32 = (media_id as u64 & 0xFFFFFFFF) as u32;
                game = Some(AuroraGame {
                    id: id as u64,
                    directory,
                    executable,
                    title_id: title_id_u32,
                    media_id: media_id_u32,
                    base_version: base_version as u64,
                    disc_num: disc_num as u64,
                    discs_in_set: discs_in_set as u64,
                    title_name,
                    description,
                    publisher,
                    developer,
                    live_rating: live_rating as f64,
                    live_raters: live_raters as u64,
                    release_date,
                    genre_flag: genre_flag as u64,
                    content_flags: content_flags as u64,
                    hash,
                    game_caps_offline: game_caps_offline as u64,
                    game_caps_flags: game_caps_flags as u64,
                    file_type: file_type as u64,
                    content_type: content_type as u64,
                    content_group: content_group as u64,
                    default_group: default_group as u64,
                    date_added: date_added as u64,
                    found_at_depth: found_at_depth as u64,
                    system_link: system_link as u64,
                    scan_path_id: scan_path_id as u64,
                    case_index: case_index as u64,
                })
            }
            _ => {
                let msg = format!(
                    "Invalid row data for game with id '{}' in database at '{}'.",
                    game_id,
                    &content_db_file.display()
                );
                error!("{}", &msg);
                return Err(msg);
            }
        }
    }
    Ok(game)
}

////////////////////////////////////////////////////////////////////////////////
// aurora http commands
////////////////////////////////////////////////////////////////////////////////
#[tauri::command]
pub async fn aurora_http_achievement_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<Vec<libaustralis::aurora::http_schemas::Achievement>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_achievement(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get achievements. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_achievement_player_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<Vec<libaustralis::aurora::http_schemas::AchievementPlayer>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_achievement_player(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get players achievements. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_authentication_token_get(
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
            let msg = format!(
                "Failed to get console authentication token. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_dashlaunch_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::Dashlaunch, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_dashlaunch(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console dashlaunch. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_filebrowser_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    path: Option<&str>,
    filter: Option<&str>,
) -> Result<Vec<libaustralis::aurora::http_schemas::FilebrowserEntry>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_filebrowser(token, path, filter).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console filebrowser entries. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_image_achievement_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    uuid: &str,
) -> Result<Vec<u8>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_image_achievement(token, uuid).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console achievement image. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_image_achievement_get_url(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    uuid: &str,
) -> Result<String, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_image_achievement(token, uuid).await {
        Ok(x) => Ok(format!(
            "data:image/png;base64,{}",
            general_purpose::STANDARD.encode(&x)
        )),
        Err(err) => {
            let msg = format!(
                "Failed to get console achievement image. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_image_profile_get(
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
            let msg = format!(
                "Failed to get console profile image. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_image_profile_get_url(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    uuid: u32,
) -> Result<String, String> {
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
        Ok(x) => Ok(format!(
            "data:image/png;base64,{}",
            general_purpose::STANDARD.encode(&x)
        )),
        Err(err) => {
            let msg = format!(
                "Failed to get console profile image. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_image_screencapture_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    uuid: &str,
) -> Result<Vec<u8>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_image_screencapture(token, uuid).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console screenshot image. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_image_screencapture_get_url(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    uuid: &str,
) -> Result<String, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_image_screencapture(token, uuid).await {
        Ok(x) => Ok(format!(
            "data:image/png;base64,{}",
            general_purpose::STANDARD.encode(&x)
        )),
        Err(err) => {
            let msg = format!(
                "Failed to get console screenshot image. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_memory_get(
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
            let msg = format!(
                "Failed to get console memory. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_multidisc_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::Multidisc, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_multidisc(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console multidisc. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_plugin_get(
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
            let msg = format!(
                "Failed to get console plugin. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_profile_get(
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
            let msg = format!(
                "Failed to get console profile. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_screencapture_delete(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    uuid: &str,
) -> Result<(), String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.delete_screencapture(token, uuid).await {
        Ok(_) => Ok(()),
        Err(err) => {
            let msg = format!(
                "Failed to delete console screencapture. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_screencapture_meta_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::ScreencaptureMeta, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_screencapture_meta(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console screencapture meta. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_screencapture_meta_list_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<Vec<libaustralis::aurora::http_schemas::ScreencaptureMeta>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_screencapture_meta_list(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console screencapture meta list. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_screencapture_meta_list_count_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::ScreencaptureMetaListCount, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_screencapture_meta_list_count(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console screencapture meta list count. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_smc_get(
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
            let msg = format!(
                "Failed to get console smc. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_system_get(
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
            let msg = format!(
                "Failed to get console system. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_systemlink_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::Systemlink, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_systemlink(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console systemlink. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_systemlink_bandwidth_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::SystemlinkBandwidth, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_systemlink_bandwidth(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console systemlink bandwidth. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_temperature_get(
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
            let msg = format!(
                "Failed to get console temperature. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_thread_get(
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
            let msg = format!(
                "Failed to get console threads. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_thread_state_get(
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
            let msg = format!(
                "Failed to get console thread state. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_thread_state_post(
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
            let msg = format!(
                "Failed to post console thread state. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_title_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::Title, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_title(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console title. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_title_file_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    path: &str,
) -> Result<Vec<u8>, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_title_file(token, path).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console title file. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_title_launch_post(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    path: &str,
    exec: &str,
    exec_type: u32,
) -> Result<(), String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client
        .post_title_launch(token, &path, &exec, exec_type)
        .await
    {
        Ok(_) => Ok(()),
        Err(err) => {
            let msg = format!(
                "Failed to post console title launch. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_title_live_cache_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<String, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_title_live_cache(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console title live cache. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_title_live_cache_post(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
    liveinfo: &str,
) -> Result<(), String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.post_title_live_cache(token, liveinfo).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to post console title live cache. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn aurora_http_update_notification_get(
    console_configuration: GameConsoleConfiguration,
    token: Option<&str>,
) -> Result<libaustralis::aurora::http_schemas::UpdateNotification, String> {
    let http_client = libaustralis::aurora::http::HttpClient::new(
        console_configuration.ip_address,
        console_configuration.aurora_http_port,
        console_configuration.aurora_http_username,
        console_configuration.aurora_http_password,
    );
    match http_client.get_update_notification(token).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to get console update notification. Got the following error: {}",
                err
            );
            error!("{}", &msg);
            Err(msg)
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// game console configuration commands
////////////////////////////////////////////////////////////////////////////////
#[tauri::command]
pub fn game_console_configuration_create(
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
    // serialize `console_configuration` and save to disk
    match serde_json::to_string(&console_configuration) {
        Ok(console_configuration_string) => {
            write_str_to_path(
                &path_game_console_configuration(&app_handle, &console_configuration)?,
                &console_configuration_string,
            )?;
            Ok(console_configuration)
        }
        Err(err) => {
            let msg = format!(
                "Failed to serialize game console configuration. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub fn game_console_configuration_delete(
    app_handle: tauri::AppHandle,
    console_configuration_id: Uuid,
) -> Result<(), String> {
    Ok(delete_directory(&path_game_console_configuration_root(
        &app_handle,
        &console_configuration_id,
    )?)?)
}

#[tauri::command]
pub fn game_console_configuration_read(
    app_handle: tauri::AppHandle,
    console_configuration_id: Uuid,
) -> Result<GameConsoleConfiguration, String> {
    let console_configuration_path =
        path_game_console_configuration_from_id(&app_handle, &console_configuration_id)?;
    let file = match std::fs::OpenOptions::new()
        .read(true)
        .open(&console_configuration_path)
    {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to open game console configuration file at '{}' for reading. Got the following error: {}",
                &console_configuration_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    let console_configuration: GameConsoleConfiguration = match serde_json::from_reader(file) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to parse game console configuration from file at '{}'. Got the following error: {}",
                &console_configuration_path.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    if console_configuration.id() != console_configuration_id {
        let msg = format!(
            "The console configuration id in '{}' does not match parent directory name. Expected '{}' but got '{}'.",
            &console_configuration_path.display(), &console_configuration_id, &console_configuration.id()
        );
        error!("{}", &msg);
        return Err(msg);
    }
    Ok(console_configuration)
}

#[tauri::command]
pub fn game_console_configuration_read_all(
    app_handle: tauri::AppHandle,
) -> Result<Vec<GameConsoleConfiguration>, String> {
    let mut console_configuration_ids = Vec::new();
    let mut console_configurations = Vec::new();
    let game_console_configurations_root = path_game_console_configurations_root(&app_handle)?;
    match std::fs::exists(&game_console_configurations_root) {
        Ok(x) => {
            if !x {
                warn!(
                    "The game console configurations root directory '{}' does not exist.",
                    game_console_configurations_root.display(),
                );
                return Ok(console_configurations);
            }
        }
        Err(err) => {
            let msg = format!(
                "Failed to determine if path '{}' exists. Got the following error: {}",
                &game_console_configurations_root.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    }
    let console_configuration_entries = match std::fs::read_dir(&game_console_configurations_root) {
        Ok(x) => x,
        Err(err) => {
            let msg = format!(
                "Failed to read contents of directory '{}'. Got the following error: {}",
                &game_console_configurations_root.display(),
                err
            );
            error!("{}", &msg);
            return Err(msg);
        }
    };
    for entry in console_configuration_entries {
        let entry_path = match entry {
            Ok(x) => x.path(),
            Err(err) => {
                warn!(
                    "Ignoring invalid entry in directory '{}'. Got the following error: {}",
                    game_console_configurations_root.display(),
                    err
                );
                continue;
            }
        };
        let entry_file_name = match entry_path.as_path().file_name() {
            Some(x) => match x.to_str() {
                Some(y) => y,
                None => {
                    warn!(
                        "Ignoring entry at '{}'. Failed to convert file name to str.",
                        &entry_path.display()
                    );
                    continue;
                }
            },
            None => {
                warn!(
                    "Ignoring entry at '{}'. Failed to get file name of path. The path does not have a file name.",
                    &entry_path.display()
                );
                continue;
            }
        };
        match uuid::Uuid::parse_str(entry_file_name) {
            Ok(x) => console_configuration_ids.push(x),
            Err(err) => {
                warn!(
                    "Ignoring entry at '{}' The entry name is not a valid uuid. Got the following error: {}",
                    &entry_path.display(),
                    err
                );
                continue;
            }
        }
    }
    for console_configuration_id in console_configuration_ids {
        match game_console_configuration_read(app_handle.clone(), console_configuration_id.clone())
        {
            Ok(config) => {
                console_configurations.push(config);
            }
            Err(err) => {
                warn!(
                    "Ignoring console configuration for id '{}'. Failed to read console configuration. Got the following error: {}",
                    &console_configuration_id, err
                );
                continue;
            }
        }
    }
    Ok(console_configurations)
}

#[tauri::command]
pub fn game_console_configuration_update(
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
    let mut console_configuration =
        match game_console_configuration_read(app_handle.clone(), id.clone()) {
            Ok(x) => x,
            Err(err) => {
                let msg = format!(
                "Failed to load console configuration with id '{}'. Got the following error: {}",
                &id,
                err
            );
                error!("{}", &msg);
                return Err(msg);
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
    // serialize `console_configuration` and save to disk
    match serde_json::to_string(&console_configuration) {
        Ok(console_configuration_string) => {
            write_str_to_path(
                &path_game_console_configuration(&app_handle, &console_configuration)?,
                &console_configuration_string,
            )?;
            Ok(console_configuration)
        }
        Err(err) => {
            let msg = format!(
                "Failed to serialize updated game console configuration. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// xbox unity commands
////////////////////////////////////////////////////////////////////////////////
#[tauri::command]
pub async fn xboxunity_cover_image_bytes_url(
    cover_id: &str,
    cover_size: &str,
) -> Result<Option<String>, String> {
    let cover_size = match cover_size {
        "small" => libaustralis::xboxunity::CoverSize::Small,
        "large" => libaustralis::xboxunity::CoverSize::Large,
        _ => return Err(format!("Invalid cover size: {}", cover_size)),
    };
    match libaustralis::xboxunity::cover_image_bytes(cover_id, cover_size).await {
        Ok(x) => Ok(Some(format!(
            "data:image/png;base64,{}",
            general_purpose::STANDARD.encode(&x)
        ))),
        Err(err) => {
            let msg = format!(
                "Failed to retrieve cover image bytes from XboxUnity. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub fn xboxunity_cover_image_url(cover_id: &str, cover_size: &str) -> Result<String, String> {
    let cover_size = match cover_size {
        "small" => libaustralis::xboxunity::CoverSize::Small,
        "large" => libaustralis::xboxunity::CoverSize::Large,
        _ => return Err(format!("Invalid cover size: {}", cover_size)),
    };
    Ok(libaustralis::xboxunity::cover_image_url(
        cover_id, cover_size,
    ))
}

#[tauri::command]
pub async fn xboxunity_cover_info(
    title_id: &str,
) -> Result<libaustralis::xboxunity::CoverInfoResult, String> {
    match libaustralis::xboxunity::cover_info(title_id).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to retrieve cover information from XboxUnity. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub fn xboxunity_icon_image_url(title_id: &str) -> Result<String, String> {
    Ok(libaustralis::xboxunity::icon_image_url(title_id))
}

#[tauri::command]
pub async fn xboxunity_title_list(
    query: &str,
    page: usize,
    count: Option<usize>,
) -> Result<libaustralis::xboxunity::TitleListResult, String> {
    let count = match count {
        Some(x) => x,
        None => 10,
    };
    match libaustralis::xboxunity::title_list(
        query,
        page,
        count,
        libaustralis::xboxunity::SearchSort::Name,
        libaustralis::xboxunity::SearchDirection::Ascending,
        libaustralis::xboxunity::SearchCategory::All,
        libaustralis::xboxunity::SearchFilter::All,
    )
    .await
    {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to retrieve titles from XboxUnity. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// xbox catalog commands
////////////////////////////////////////////////////////////////////////////////
#[tauri::command]
pub async fn xboxcatalog_live_image_bytes_url(
    live_image: libaustralis::xboxcatalog::LiveImage,
) -> Result<Option<String>, String> {
    match libaustralis::xboxcatalog::image_bytes(live_image).await {
        Ok(x) => Ok(Some(format!(
            "data:image/png;base64,{}",
            general_purpose::STANDARD.encode(&x)
        ))),
        Err(err) => {
            let msg = format!(
                "Failed to retrieve image bytes from Xbox Catalog. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}

#[tauri::command]
pub async fn xboxcatalog_live_images(
    title_id: &str,
    locale: &str,
) -> Result<Vec<libaustralis::xboxcatalog::LiveImage>, String> {
    match libaustralis::xboxcatalog::live_images_for_title_id(title_id, locale).await {
        Ok(x) => Ok(x),
        Err(err) => {
            let msg = format!(
                "Failed to retrieve images from XboxCatalog. Got the following error: {}",
                err
            );
            error!("{}", msg);
            Err(msg)
        }
    }
}
