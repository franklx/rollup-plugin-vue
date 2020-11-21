'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.resolveScript = exports.getResolvedScript = void 0
const compiler_sfc_1 = require('@vue/compiler-sfc')
const template_1 = require('./template')
const error_1 = require('./utils/error')
// ssr and non ssr builds would output different script content
const clientCache = new WeakMap()
const serverCache = new WeakMap()
function getResolvedScript(descriptor, isServer) {
  return (isServer ? serverCache : clientCache).get(descriptor)
}
exports.getResolvedScript = getResolvedScript
function resolveScript(
  descriptor,
  scopeId,
  isProd,
  isServer,
  options,
  pluginContext
) {
  if (!descriptor.script && !descriptor.scriptSetup) {
    return null
  }
  const cacheToUse = isServer ? serverCache : clientCache
  const cached = cacheToUse.get(descriptor)
  if (cached) {
    return cached
  }
  let resolved = null
  if (compiler_sfc_1.compileScript) {
    try {
      resolved = compiler_sfc_1.compileScript(descriptor, {
        // @ts-ignore
        id: scopeId,
        isProd,
        inlineTemplate: true,
        templateOptions: template_1.getTemplateCompilerOptions(
          options,
          descriptor,
          scopeId
        ),
      })
    } catch (e) {
      pluginContext.error(error_1.createRollupError(descriptor.filename, e))
    }
  } else if (descriptor.scriptSetup) {
    pluginContext.error(
      `<script setup> is not supported by the installed version of ` +
        `@vue/compiler-sfc - please upgrade.`
    )
  } else {
    resolved = descriptor.script
  }
  cacheToUse.set(descriptor, resolved)
  return resolved
}
exports.resolveScript = resolveScript
