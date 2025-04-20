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

// TODO rename to AuroraGame?
export interface AuroraGameData {
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
}
