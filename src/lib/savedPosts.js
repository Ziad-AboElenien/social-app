const KEY = "saved_post_ids";

export function getSavedPostIds() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isPostSaved(postId) {
  return getSavedPostIds().includes(postId);
}

export function toggleSavedPost(postId) {
  const current = getSavedPostIds();
  const next = current.includes(postId) ? current.filter((id) => id !== postId) : [postId, ...current];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

