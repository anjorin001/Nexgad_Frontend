export function slugifyProduct(name: string, id: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-")     // replace spaces with dashes
    .trim();

  return `${slug}-${id}`;
}