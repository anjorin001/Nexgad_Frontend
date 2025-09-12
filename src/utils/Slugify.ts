export function slugifyProduct(name: string, id: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") 
    .replace(/\s+/g, "-")     
    .trim();

  return `${slug}-${id}`;
}