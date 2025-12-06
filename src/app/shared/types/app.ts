/**
 * These types are structures made up for
 * this application. They are not found in
 * Aurora.
 */
import { AuroraGameData } from '@app/modules/aurora/types/aurora';

export type GameConsoleConfiguration = {
  id: string;
  name: string;
  ipAddress: string;
  auroraFtpPort: number;
  auroraFtpUsername: string | null;
  auroraFtpPassword: string | null;
  auroraHttpPort: number;
  auroraHttpUsername: string | null;
  auroraHttpPassword: string | null;
};

export type ConfirmationDialogData = {
  bodyParagraphs: string[];
  confirmButtonText: string;
  title: string;
};

export type GameListEntry = {
  id: number;
  titleName: string;
};

export type IntervalState = {
  id: number | null;
  delay: number;
  consecutiveErrors: number;
  consecutiveErrorsMax: number;
};

export type UploadAssetsDialogData = {
  gameConsoleConfiguration: GameConsoleConfiguration;
  gameData: AuroraGameData;
};
