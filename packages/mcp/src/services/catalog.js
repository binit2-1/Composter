import api from "./api.js";

async function getAllCategories() {
  const res = await api("/categories");
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.categories || [];
}

async function getAllComponents() {
  const res = await api("/components/list");
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.components || [];
}

async function getComponentsByCategory(categoryName) {
  const res = await api(`/components/list-by-category?category=${encodeURIComponent(categoryName)}`);
  if (res.status === 404) return null; // Category not found
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.components || [];
}

async function getComponent(category, title) {
  const res = await api(`/components?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.component;
}

async function searchComponents(query) {
  const res = await api(`/components/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(await getErrorMessage(res));
  const data = await res.json();
  return data.components || [];
}

async function getErrorMessage(res) {
  try {
    const data = await res.json();
    return data.message || data.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

export {
  getAllCategories,
  getAllComponents,
  getComponentsByCategory,
  getComponent,
  searchComponents,
};
