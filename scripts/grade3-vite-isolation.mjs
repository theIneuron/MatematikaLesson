/**
 * Grade-specific acceptance should not be blocked by an unfinished registry
 * belonging to another grade in a dirty worktree.
 */
export function createGrade3IsolationPlugin() {
  return {
    name: 'grade3-isolate-unrelated-registry',
    enforce: 'pre',
    load(id) {
      const normalized = id.replaceAll('\\', '/')
      if (normalized.endsWith('/src/lessons/grade8.js')) {
        return 'export const grade8Nazariy = []'
      }
      return null
    },
  }
}
