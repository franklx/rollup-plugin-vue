'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createRollupError = void 0
function createRollupError(id, error) {
  if ('code' in error) {
    return {
      id,
      plugin: 'vue',
      pluginCode: String(error.code),
      message: error.message,
      frame: error.loc.source,
      parserError: error,
      loc: error.loc
        ? {
            file: id,
            line: error.loc.start.line,
            column: error.loc.start.column,
          }
        : undefined,
    }
  } else {
    return {
      id,
      plugin: 'vue',
      message: error.message,
      parserError: error,
    }
  }
}
exports.createRollupError = createRollupError
