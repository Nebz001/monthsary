// Edit this file to change photo alt text, crop focus, and the caption stickers.
// Photos show in this order (sorted by file name) as Photo 1, Photo 2, and so on.

export type Photo = {
  // File name inside public/images/photos/.
  file: string
  // Describes the photo for screen readers. Replace the placeholders.
  alt: string
  // Pixel size of the original, so the layout does not jump while loading.
  width: number
  height: number
  // Where the square grid crop is centred, as a CSS object-position. Defaults to center.
  // Example: "50% 20%" keeps the top of a tall photo, "left center" keeps the left side.
  focus?: string
}

export const PHOTOS: Photo[] = [
  { file: "2130245f-8b1a-48c3-992b-a249ccb68ef3.jpg", alt: "Us, photo 1", width: 1366, height: 2049 },
  { file: "271d1790-9769-4940-b827-a995d5d165d3.jpg", alt: "Us, photo 2", width: 1080, height: 1440 },
  { file: "2837f051-6cf5-4a41-afc2-634d19439e53.jpg", alt: "Us, photo 3", width: 2048, height: 1536 },
  { file: "32c2ae34-e4b0-4932-a946-792120a96f5c.jpg", alt: "Us, photo 4", width: 2048, height: 1536 },
  { file: "511c727b-06da-46b2-ae79-3a8df6a0dc3c.jpg", alt: "Us, photo 5", width: 1440, height: 1440 },
  { file: "64eade7a-c0e3-4779-a156-db2ae46f2532.jpg", alt: "Us, photo 6", width: 1179, height: 1179 },
  { file: "8943144d-6fe3-4250-8dbf-360b09aa783d.jpg", alt: "Us, photo 7", width: 1179, height: 1179 },
  { file: "8d13327c-d146-4aa4-934a-5851f61862a9.jpg", alt: "Us, photo 8", width: 2048, height: 1536 },
  { file: "b720c0fe-eb93-4831-a20a-e468b4dd3312.jpg", alt: "Us, photo 9", width: 480, height: 745 },
  { file: "b84c697c-d9d2-43b5-b75e-982246897eed.jpg", alt: "Us, photo 10", width: 1080, height: 1440 },
  { file: "cb61a633-13a8-4cf6-afb6-2019e04ec95c.jpg", alt: "Us, photo 11", width: 2048, height: 1536 },
  { file: "e796593d-bcbd-4820-bc8d-9ccff09c03ef.jpg", alt: "Us, photo 12", width: 1366, height: 2049 },
  { file: "ebdb9eff-b59a-4465-b5a8-88c3b3990361.jpg", alt: "Us, photo 13", width: 2048, height: 1536 },
  { file: "f7d11706-0edf-4ed4-91d5-33f47478c9a6.jpg", alt: "Us, photo 14", width: 2048, height: 1536 },
]

export type CaptionTone = "pink" | "cream" | "gold"

export type Caption = {
  text: string
  tone: CaptionTone
  // Photo number (1 is the first photo) the sticker sits on the corner of.
  near: number
}

export const CAPTIONS: Caption[] = [
  { text: "You make my days softer", tone: "pink", near: 4 },
  { text: "My favorite person", tone: "cream", near: 6 },
  { text: "Still falling for you", tone: "gold", near: 8 },
  { text: "Thank you for choosing me", tone: "cream", near: 12 },
  { text: "I love your smile", tone: "pink", near: 13 },
  { text: "Forever my babyy", tone: "gold", near: 14 },
]

export const PAGE_TITLE = "Our little moments"
export const PAGE_SUBTITLE = "My favorite pictures, all of them with you"
export const PAGE_FOOTER = "Every day with you is my favorite"
