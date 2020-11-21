'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getTemplateCompilerOptions = exports.transformTemplate = void 0
const compiler_sfc_1 = require('@vue/compiler-sfc')
const script_1 = require('./script')
const descriptorCache_1 = require('./utils/descriptorCache')
const error_1 = require('./utils/error')
const sourceMap_1 = require('./utils/sourceMap')
function transformTemplate(code, request, options, query, pluginContext) {
  const descriptor = descriptorCache_1.getDescriptor(query.filename)
  const result = compiler_sfc_1.compileTemplate({
    ...getTemplateCompilerOptions(options, descriptor, query.id),
    source: code,
    filename: query.filename,
  })
  if (result.errors.length) {
    result.errors.forEach((error) =>
      pluginContext.error(
        typeof error === 'string'
          ? { id: query.filename, message: error }
          : error_1.createRollupError(query.filename, error)
      )
    )
    return null
  }
  if (result.tips.length) {
    result.tips.forEach((tip) =>
      pluginContext.warn({
        id: query.filename,
        message: tip,
      })
    )
  }
  return {
    code: result.code,
    map: sourceMap_1.normalizeSourceMap(result.map, request),
  }
}
exports.transformTemplate = transformTemplate
function getTemplateCompilerOptions(options, descriptor, scopeId) {
  const block = descriptor.template
  if (!block) {
    return
  }
  const isProd =
    process.env.NODE_ENV === 'production' || process.env.BUILD === 'production'
  const isServer = options.target === 'node'
  const hasScoped = descriptor.styles.some((s) => s.scoped)
  const preprocessLang = block.lang
  const preprocessOptions =
    preprocessLang &&
    options.templatePreprocessOptions &&
    options.templatePreprocessOptions[preprocessLang]
  const resolvedScript = script_1.getResolvedScript(descriptor, isServer)
  return {
    // @ts-ignore
    id: scopeId,
    scoped: hasScoped,
    isProd,
    filename: descriptor.filename,
    inMap: block.src ? undefined : block.map,
    preprocessLang,
    preprocessOptions,
    preprocessCustomRequire: options.preprocessCustomRequire,
    compiler: options.compiler,
    ssr: isServer,
    // @ts-ignore
    ssrCssVars: descriptor.cssVars,
    compilerOptions: {
      ...options.compilerOptions,
      scopeId: hasScoped ? `data-v-${scopeId}` : undefined,
      bindingMetadata: resolvedScript ? resolvedScript.bindings : undefined,
    },
    transformAssetUrls: options.transformAssetUrls,
  }
}
exports.getTemplateCompilerOptions = getTemplateCompilerOptions
