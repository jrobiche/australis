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
} from '@app/modules/aurora/types/aurora';

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

// TODO move to modules/aurora/types
// TODO rename to AuroraState?
export type GameConsoleData = {
  activeTitle: WritableSignal<AuroraTitle | null>;
  // TODO activeTitleAchievementImageUrls: WritableSignal<(string | null)[]>;
  activeTitleAchievements: WritableSignal<AuroraAchievement[]>;
  activeTitleScreencaptureMetas: WritableSignal<AuroraScreencaptureMeta[]>;
  dashlaunch: WritableSignal<AuroraDashlaunch | null>;
  memory: WritableSignal<AuroraMemory | null>;
  plugin: WritableSignal<AuroraPlugin | null>;
  profileImageUrls: WritableSignal<[string, string, string, string]>;
  // TODO make [AuroraProfile | null, AuroraProfile | null, AuroraProfile | null, AuroraProfile | null]?
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
