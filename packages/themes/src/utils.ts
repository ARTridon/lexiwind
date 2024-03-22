export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter((c): c is string => typeof c === "string")
    .join(" ")
    .trim();
}
