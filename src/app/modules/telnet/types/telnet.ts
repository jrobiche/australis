export type TelnetResponse = {
  status: TelnetResponseStatus;
  data: number[]; // TODO is there a better data type for Vec<u8>?
};

export type TelnetResponseStatus = {
  code: number;
  text: string;
};

export type DrivelistEntry = {
  drivename: string;
};

export type DirlistEntry = {
  name: string;
  sizehi: number;
  sizelo: number;
  createhi: number;
  createlo: number;
  changehi: number;
  changelo: number;
  directory: boolean;
  hidden: boolean;
};

export type Drivefreespace = {
  freetocallerlo: number;
  freetocallerhi: number;
  totalbyteslo: number;
  totalbyteshi: number;
  totalfreebyteslo: number;
  totalfreebyteshi: number;
};
