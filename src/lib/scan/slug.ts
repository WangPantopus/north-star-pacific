const SLUG_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
const SLUG_LENGTH = 10;

export function createScanSlug(): string {
  const bytes = new Uint8Array(SLUG_LENGTH);
  crypto.getRandomValues(bytes);
  let slug = "";
  for (let index = 0; index < SLUG_LENGTH; index += 1) {
    slug += SLUG_CHARS[bytes[index] % SLUG_CHARS.length];
  }
  return slug;
}
