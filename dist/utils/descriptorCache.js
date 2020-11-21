'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getDescriptor = exports.setDescriptor = void 0
const cache = new Map()
function setDescriptor(id, entry) {
  cache.set(id, entry)
}
exports.setDescriptor = setDescriptor
function getDescriptor(id) {
  if (cache.has(id)) {
    return cache.get(id)
  }
  throw new Error(`${id} is not parsed yet`)
}
exports.getDescriptor = getDescriptor
