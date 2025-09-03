/**
 * These types are structures made up for
 * this application. They are not found in
 * Aurora.
 */
import { WritableSignal } from '@angular/core';
import {
  AuroraAchievement,
  AuroraDashlaunch,
  AuroraGameData,
  AuroraMemory,
  AuroraPlugin,
  AuroraProfile,
  AuroraScreencaptureMeta,
  AuroraSmc,
  AuroraSystem,
  AuroraTemperature,
  AuroraThread,
  AuroraThreadState,
  AuroraTitle,
} from '@app/types/aurora';

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

export type GameConsoleData = {
  activeTitle: WritableSignal<AuroraTitle | null>;
  // TODO activeTitleAchievementImageUrls: WritableSignal<(string | null)[]>;
  activeTitleAchievements: WritableSignal<AuroraAchievement[]>;
  activeTitleScreencaptureMetas: WritableSignal<AuroraScreencaptureMeta[]>;
  dashlaunch: WritableSignal<AuroraDashlaunch | null>;
  memory: WritableSignal<AuroraMemory | null>;
  plugin: WritableSignal<AuroraPlugin | null>;
  profileImageUrls: WritableSignal<[string, string, string, string]>;
  // TODO make [AuroraProfile | null, AuroraProfile | null, AuroraProfile | null, AuroraProfile | null]
  profiles: WritableSignal<(AuroraProfile | null)[]>;
  smc: WritableSignal<AuroraSmc | null>;
  system: WritableSignal<AuroraSystem | null>;
  temperature: WritableSignal<AuroraTemperature | null>;
  threadState: WritableSignal<AuroraThreadState | null>;
  threads: WritableSignal<AuroraThread[]>;
};

export type ConfirmationDialogData = {
  bodyParagraphs: string[];
  confirmButtonText: string;
  title: string;
};

// TODO is this used?
export type GameAssetTypes = {
  id: number;
  hasIcon: boolean;
  hasBanner: boolean;
  hasBoxart: boolean;
  hasSlot: boolean;
  hasBackground: boolean;
  hasScreenshot1: boolean;
  hasScreenshot2: boolean;
  hasScreenshot3: boolean;
  hasScreenshot4: boolean;
  hasScreenshot5: boolean;
  hasScreenshot6: boolean;
  hasScreenshot7: boolean;
  hasScreenshot8: boolean;
  hasScreenshot9: boolean;
  hasScreenshot10: boolean;
  hasScreenshot11: boolean;
  hasScreenshot12: boolean;
  hasScreenshot13: boolean;
  hasScreenshot14: boolean;
  hasScreenshot15: boolean;
  hasScreenshot16: boolean;
  hasScreenshot17: boolean;
  hasScreenshot18: boolean;
  hasScreenshot19: boolean;
  hasScreenshot20: boolean;
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
