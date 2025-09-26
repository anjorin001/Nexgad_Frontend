export function extractProductId(slug: string): string {
  const prodMatch = slug.match(/PROD-\d+$/);
  if (prodMatch) {
    return prodMatch[0]; 
  }

  const numMatch = slug.match(/(\d+)$/);
  if (numMatch) {
    return numMatch[1]; 
  }

  return slug;
}
