'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.normalizeSourceMap = void 0
function normalizeSourceMap(map, request) {
  if (!map) return null
  if (!request.includes('type=script')) {
    map.file = request
    map.sources[0] = request
  }
  return {
    ...map,
    version: Number(map.version),
    mappings: typeof map.mappings === 'string' ? map.mappings : '',
  }
}
exports.normalizeSourceMap = normalizeSourceMap
