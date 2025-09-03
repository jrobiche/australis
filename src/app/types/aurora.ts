/**
 * These types are the structures of the data
 * you would get back from Aurora. This includes
 * things such as HTTP responses and DB schemas.
 */

export enum AuroraAssetType {
  Icon = 0,
  Banner = 1,
  Boxart = 2,
  Slot = 3,
  Background = 4,
  Screenshot1 = 5,
  Screenshot2 = 6,
  Screenshot3 = 7,
  Screenshot4 = 8,
  Screenshot5 = 9,
  Screenshot6 = 10,
  Screenshot7 = 11,
  Screenshot8 = 12,
  Screenshot9 = 13,
  Screenshot10 = 14,
  Screenshot11 = 15,
  Screenshot12 = 16,
  Screenshot13 = 17,
  Screenshot14 = 18,
  Screenshot15 = 19,
  Screenshot16 = 20,
  Screenshot17 = 21,
  Screenshot18 = 22,
  Screenshot19 = 23,
  Screenshot20 = 24,
}

////////////////////////////////////////////////////////////////////////////////
// HTTP Response Schemas
////////////////////////////////////////////////////////////////////////////////
export type AuroraAchievement = {
  cred: number;
  hidden: number;
  id: number;
  imageid: number;
  strings: AuroraAchievementStrings;
  type: number;
};

export type AuroraAchievementPlayer = {
  id: number;
  player: [number, number, number, number];
};

export type AuroraAchievementStrings = {
  caption: string;
  description: string;
  unachieved: string;
};

export type AuroraDashlaunch = {
  options: AuroraDashlaunchOption[];
  version: AuroraDashlaunchVersion;
};

export type AuroraDashlaunchOption = {
  id: number;
  category: string;
  name: string;
  value: string;
};

export type AuroraDashlaunchVersion = {
  kernel: number;
  number: AuroraDashlaunchVersionNumber;
};

export type AuroraDashlaunchVersionNumber = {
  build: number;
  major: number;
  minor: number;
};

export type AuroraFilebrowserEntry = {
  name: string;
  attributes: number;
  size: number;
};

export type AuroraMemory = {
  free: number;
  total: number;
  used: number;
};

export type AuroraMultidisc = {
  disc: AuroraMultidiscDisc;
  entries: [
    AuroraMultidiscEntry,
    AuroraMultidiscEntry,
    AuroraMultidiscEntry,
    AuroraMultidiscEntry,
    AuroraMultidiscEntry,
  ];
  titleid: string;
};

export type AuroraMultidiscDisc = {
  current: number;
  total: number;
};

export type AuroraMultidiscEntry = {
  container: number;
  path: string;
};

export type AuroraPlugin = {
  features: AuroraPluginFeatures;
  path: AuroraPluginPaths;
  version: AuroraPluginVersion;
};

export type AuroraPluginFeatures = {
  achievements: number;
  debugger: number;
  gamepad: number;
  httpdaemon: number;
  multidisc: number;
  network: number;
  systemlink: number;
  threads: number;
  trainers: number;
};

export type AuroraPluginPaths = {
  launcher: string;
  root: string;
  user: string;
  web: string;
};

export type AuroraPluginVersion = {
  api: number;
  number: AuroraPluginVersionNumber;
};

export type AuroraPluginVersionNumber = {
  build: number;
  major: number;
  minor: number;
  type: number;
};

export type AuroraProfile = {
  gamerscore: number;
  gamertag: string;
  index: number;
  signedin: number;
  xuid: string;
};

export type AuroraScreencaptureMeta = {
  filename: string;
  filesize: number;
  info: AuroraScreencaptureMetaInfo;
  timestamp: string;
  titleid: string;
};

export type AuroraScreencaptureMetaInfo = {
  format: string;
  height: number;
  width: number;
};

export type AuroraScreencaptureMetaListCount = {
  total: number;
};

export type AuroraSmc = {
  avpack: number;
  dvdmediatype: number;
  smcversion: string;
  temperature: AuroraSmcTemperature;
  tiltstate: number;
  traystate: number;
};

export type AuroraSmcTemperature = {
  celsius: boolean;
  max: AuroraSmcTemperatureComponents;
  target: AuroraSmcTemperatureComponents;
};

export type AuroraSmcTemperatureComponents = {
  cpu: number;
  gpu: number;
  memory: number;
};

export type AuroraSystem = {
  console: AuroraSystemConsole;
  consoleid: string;
  cpukey: string;
  dvdkey: string;
  serial: string;
  version: AuroraSystemVersion;
};

export type AuroraSystemConsole = {
  motherboard: string;
  type: string;
};

export type AuroraSystemVersion = {
  build: number;
  major: number;
  minor: number;
  qfe: number;
};

export type AuroraSystemlink = {
  apikey: string;
  broadcastport: number;
  dataport: number;
  enabled: number;
  gatewayip: string;
  gatewaymac: string;
  username: string;
  xboxip: string;
  xboxmac: string;
};

export type AuroraSystemlinkBandwidth = {
  bytes: AuroraSystemlinkBandwidthBytes;
  rate: AuroraSystemlinkBandwidthRate;
};

export type AuroraSystemlinkBandwidthBytes = {
  downstream: number;
  upstream: number;
};

export type AuroraSystemlinkBandwidthRate = {
  downstream: number;
  upstream: number;
};

export type AuroraTemperature = {
  celsius: boolean;
  case: number;
  cpu: number;
  gpu: number;
  memory: number;
};

export type AuroraThread = {
  address: string;
  flags: string;
  id: string;
  priority: number;
  state: number;
  type: number;
};

export type AuroraThreadState = {
  state: number;
};

export type AuroraTitle = {
  disc: AuroraTitleDisc;
  mediaid: string;
  path: string;
  resolution: AuroraTitleResolution;
  titleid: string;
  tuver: number;
  version: AuroraTitleVersion;
};

export type AuroraTitleDisc = {
  count: number;
  current: number;
};

export type AuroraTitleResolution = {
  height: number;
  width: number;
};

export type AuroraTitleVersion = {
  base: string;
  current: string;
};

export type AuroraUpdateNotification = {
  achievements: number;
  profiles: number;
  screencapture: number;
  title: number;
};

////////////////////////////////////////////////////////////////////////////////
// DB Schemas
////////////////////////////////////////////////////////////////////////////////
export type AuroraGameData = {
  id: number;
  directory: string;
  executable: string;
  titleId: number;
  mediaId: number;
  baseVersion: number;
  discNum: number;
  discsInSet: number;
  titleName: string;
  description: string;
  publisher: string;
  developer: string;
  liveRating: number;
  liveRaters: number;
  releaseDate: string;
  genreFlag: number;
  contentFlags: number;
  hash: string;
  gameCapsOffline: number;
  gameCapsFlags: number;
  fileType: number;
  contentType: number;
  contentGroup: number;
  defaultGroup: number;
  dateAdded: number;
  foundAtDepth: number;
  systemLink: number;
  scanPathId: number;
  caseIndex: number;
};
