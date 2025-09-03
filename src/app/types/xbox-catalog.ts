/**
 * These types are the structures of the data
 * you would get back from the Xbox Catalog API.
 */
export type LiveImage = {
  mediaType: string;
  relationshipType: string | null;
  format: string;
  size: string;
  fileUrl: string;
};
