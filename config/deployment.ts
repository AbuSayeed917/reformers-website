export const staticDeployment = process.env.NEXT_PUBLIC_STATIC_SITE === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export function publicPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//")
    ? `${basePath}${path}`
    : path;
}
