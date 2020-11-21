'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.parseVuePartRequest = void 0
const querystring_1 = __importDefault(require('querystring'))
function parseVuePartRequest(id) {
  const [filename, query] = id.split('?', 2)
  if (!query) return { vue: false, filename }
  const raw = querystring_1.default.parse(query)
  if ('vue' in raw) {
    return {
      ...raw,
      filename,
      vue: true,
      index: Number(raw.index),
      src: 'src' in raw,
      scoped: 'scoped' in raw,
    }
  }
  return { vue: false, filename }
}
exports.parseVuePartRequest = parseVuePartRequest
