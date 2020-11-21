'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createCustomBlockFilter = void 0
function createCustomBlockFilter(queries) {
  if (!queries || queries.length === 0) return () => false
  const allowed = new Set(queries.filter((query) => /^[a-z]/i.test(query)))
  const disallowed = new Set(
    queries
      .filter((query) => /^![a-z]/i.test(query))
      .map((query) => query.substr(1))
  )
  const allowAll = queries.includes('*') || !queries.includes('!*')
  return (type) => {
    if (allowed.has(type)) return true
    if (disallowed.has(type)) return true
    return allowAll
  }
}
exports.createCustomBlockFilter = createCustomBlockFilter
