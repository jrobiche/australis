/**
 * These types are the structures of the data
 * you would get back from the Xbox Catalog API.
 */
export type LiveImage = {
  mediaType: number;
  relationshipType: number | null;
  format: number;
  size: number;
  fileUrl: string;
};
