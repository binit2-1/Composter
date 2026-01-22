function normalizeText(text) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Fuzzy match a component by title across all components
 */
export async function fuzzyFindComponent(searchTitle) {
  const allComponents = await getAllComponents();
  const normalized = normalizeText(searchTitle);
  
  // Exact match first
  let match = allComponents.find(c => 
    normalizeText(c.title) === normalized
  );
  if (match) return match;

  // Partial match
  match = allComponents.find(c => 
    normalizeText(c.title).includes(normalized) ||
    normalized.includes(normalizeText(c.title))
  );
  if (match) return match;

  // Word-based match
  const searchWords = normalized.split(/\s+/);
  match = allComponents.find(c => {
    const titleNorm = normalizeText(c.title);
    return searchWords.every(word => titleNorm.includes(word));
  });

  return match;
}

/**
 * Fuzzy match a category by name
 */
export async function fuzzyFindCategory(searchName) {
  const categories = await getAllCategories();
  const normalized = normalizeText(searchName);
  
  // Exact match
  let match = categories.find(c => normalizeText(c.name) === normalized);
  if (match) return match.name;

  // Partial match
  match = categories.find(c => 
    normalizeText(c.name).includes(normalized) ||
    normalized.includes(normalizeText(c.name))
  );
  
  return match?.name || null;
}
