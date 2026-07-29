export function getPhotoUrl(photoUrl) {
  if (!photoUrl) {
    return "";
  }

  const normalizedPath = photoUrl
    .replaceAll("\\", "/")
    .replace(/^\/+/, "");
  const apiBaseUrl = (process.env.REACT_APP_API_BASE_URL || "").replace(
    /\/+$/,
    "",
  );

  return `${apiBaseUrl}/${normalizedPath}`;
}
