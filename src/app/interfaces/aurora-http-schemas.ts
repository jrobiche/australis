export interface ConsoleTemperature {
  celsius: boolean;
  case: number;
  cpu: number;
  gpu: number;
  memory: number;
}

export interface ConsoleMemory {
  free: number;
  total: number;
  used: number;
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
