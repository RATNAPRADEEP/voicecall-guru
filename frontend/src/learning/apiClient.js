const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function isCloudPersistenceConfigured() {
  return Boolean(API_BASE_URL);
}

export async function loadCloudLearner(learnerId, signal) {
  if (!API_BASE_URL) return null;

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/learner/${encodeURIComponent(learnerId)}`, {
    method: 'GET',
    signal,
    headers: { accept: 'application/json' },
  });

  if (!response.ok) throw new Error(`Learner GET failed: ${response.status}`);
  return response.json();
}

export async function saveCloudLearner(learnerId, profile, signal) {
  if (!API_BASE_URL) return null;

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/learner/${encodeURIComponent(learnerId)}`, {
    method: 'PUT',
    signal,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(profile),
  });

  if (!response.ok) throw new Error(`Learner PUT failed: ${response.status}`);
  return response.json();
}
