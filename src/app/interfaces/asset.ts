export interface AssetData {
  altText: string;
  isLoaded: boolean;
  url: string | null;
}

// TODO rename to ImageRgba8?
export interface AssetImageData {
  width: number;
  height: number;
  rgba8: number[];
}
