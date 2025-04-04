export function slugify(input: string) {
  input = input.replace(/^\s+|\s+$/g, "");
  input = input.toLowerCase();
  input = input.replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return input;
}

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
