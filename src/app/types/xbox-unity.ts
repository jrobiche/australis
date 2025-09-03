/**
 * These types are the structures of the data
 * you would get back from the Xbox Unity API.
 */
export type CoverInfoItem = {
  CoverID: string;
  Rating: string | null;
  Official: string;
  Username: string;
  FileSize: string;
  UploadDate: string;
  NoRate: boolean;
};

export type CoverInfoResult = {
  Covers: CoverInfoItem[];
  CoversCount: number;
};

export type TitleListItem = {
  TitleID: string;
  HBTitleID: string;
  Name: string;
  LinkEnabled: string;
  TitleType: string;
  Covers: string;
  Updates: string;
  MediaIDCount: string;
  UserCount: string;
  NewestContent: string;
};

export type TitleListResult = {
  Items: TitleListItem[];
  Count: number;
  Pages: number;
  Page: number;
  Filter: string;
  Category: string;
  Sort: string;
  Direction: string;
};
