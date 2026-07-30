const STORAGE_PREFIX = 'matematika:grade3:v2'

export function grade3StorageKey(scope, lessonId) {
  return `${STORAGE_PREFIX}:${scope}:${String(lessonId).padStart(2, '0')}`
}

export function readGrade3State(key, fallback) {
  if (typeof window === 'undefined') return fallback

  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch (error) {
    console.warn(`[grade3] Could not read saved state for ${key}.`, error)
    return fallback
  }
}

export function writeGrade3State(key, value) {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`[grade3] Could not save state for ${key}.`, error)
    return false
  }
}

export function clearGrade3State(key) {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`[grade3] Could not clear saved state for ${key}.`, error)
    return false
  }
}
