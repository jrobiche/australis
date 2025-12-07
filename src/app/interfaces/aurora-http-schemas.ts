export interface ConsoleAchievement {
  cred: number;
  hidden: number;
  id: number;
  imageid: number;
  strings: ConsoleAchievementStrings;
  type: number;
}

export interface ConsoleAchievementPlayer {
  id: number;
  player: [number, number, number, number];
}

export interface ConsoleAchievementStrings {
  caption: string;
  description: string;
  unachieved: string;
}

export interface ConsoleDashlaunch {
  options: ConsoleDashlaunchOption[];
  version: ConsoleDashlaunchVersion;
}

export interface ConsoleDashlaunchOption {
  id: number;
  category: string;
  name: string;
  value: string;
}

export interface ConsoleDashlaunchVersion {
  kernel: number;
  number: ConsoleDashlaunchVersionNumber;
}

export interface ConsoleDashlaunchVersionNumber {
  build: number;
  major: number;
  minor: number;
}

export interface ConsoleFilebrowserEntry {
  name: string;
  attributes: number;
  size: number;
}

export interface ConsoleMemory {
  free: number;
  total: number;
  used: number;
}

export interface ConsoleMultidisc {
  disc: ConsoleMultidiscDisc;
  entries: [
    ConsoleMultidiscEntry,
    ConsoleMultidiscEntry,
    ConsoleMultidiscEntry,
    ConsoleMultidiscEntry,
    ConsoleMultidiscEntry,
  ];
  titleid: string;
}

export interface ConsoleMultidiscDisc {
  current: number;
  total: number;
}

export interface ConsoleMultidiscEntry {
  container: number;
  path: string;
}

export interface ConsolePlugin {
  features: {
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
  path: {
    launcher: string;
    root: string;
    user: string;
    web: string;
  };
  version: {
    api: number;
    number: {
      build: number;
      major: number;
      minor: number;
      type: number;
    };
  };
}

export interface ConsoleProfile {
  gamerscore: number;
  gamertag: string;
  index: number;
  signedin: number;
  xuid: string;
}

export interface ConsoleScreencaptureMeta {
  filename: string;
  filesize: number;
  info: ConsoleScreencaptureMetaInfo;
  timestamp: string;
  titleid: string;
}

export interface ConsoleScreencaptureMetaInfo {
  format: string;
  height: number;
  width: number;
}

export interface ConsoleScreencaptureMetaListCount {
  total: number;
}

export interface ConsoleSmc {
  avpack: number;
  dvdmediatype: number;
  smcversion: string;
  temperature: {
    celsius: boolean;
    max: {
      cpu: number;
      gpu: number;
      memory: number;
    };
    target: {
      cpu: number;
      gpu: number;
      memory: number;
    };
  };
  tiltstate: number;
  traystate: number;
}

export interface ConsoleSystem {
  console: {
    motherboard: string;
    type: string;
  };
  consoleid: string;
  cpukey: string;
  dvdkey: string;
  serial: string;
  version: {
    build: number;
    major: number;
    minor: number;
    qfe: number;
  };
}

export interface ConsoleSystemlink {
  apikey: string;
  broadcastport: number;
  dataport: number;
  enabled: number;
  gatewayip: string;
  gatewaymac: string;
  username: string;
  xboxip: string;
  xboxmac: string;
}

export interface ConsoleSystemlinkBandwidth {
  bytes: ConsoleSystemlinkBandwidthBytes;
  rate: ConsoleSystemlinkBandwidthRate;
}

export interface ConsoleSystemlinkBandwidthBytes {
  downstream: number;
  upstream: number;
}

export interface ConsoleSystemlinkBandwidthRate {
  downstream: number;
  upstream: number;
}

export interface ConsoleTemperature {
  celsius: boolean;
  case: number;
  cpu: number;
  gpu: number;
  memory: number;
}

export interface ConsoleThread {
  address: string;
  flags: string;
  id: string;
  priority: number;
  state: number;
  type: number;
}

export interface ConsoleThreadState {
  state: number;
}

export interface ConsoleTitle {
  disc: ConsoleTitleDisc;
  mediaid: string;
  path: string;
  resolution: ConsoleTitleResolution;
  titleid: string;
  tuver: number;
  version: ConsoleTitleVersion;
}

export interface ConsoleTitleDisc {
  count: number;
  current: number;
}

export interface ConsoleTitleResolution {
  height: number;
  width: number;
}

export interface ConsoleTitleVersion {
  base: string;
  current: string;
}

export interface ConsoleUpdateNotification {
  achievements: number;
  profiles: number;
  screencapture: number;
  title: number;
}
