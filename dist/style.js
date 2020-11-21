'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.transformStyle = void 0
const compiler_sfc_1 = require('@vue/compiler-sfc')
const descriptorCache_1 = require('./utils/descriptorCache')
const sourceMap_1 = require('./utils/sourceMap')
async function transformStyle(
  code,
  request,
  options,
  query,
  isProduction,
  pluginContext
) {
  const descriptor = descriptorCache_1.getDescriptor(query.filename)
  const block = descriptor.styles[query.index]
  let preprocessOptions = options.preprocessOptions || {}
  const preprocessLang = options.preprocessStyles ? block.lang : undefined
  if (preprocessLang) {
    preprocessOptions = preprocessOptions[preprocessLang] || preprocessOptions
    // include node_modules for imports by default
    switch (preprocessLang) {
      case 'scss':
      case 'sass':
        preprocessOptions = {
          includePaths: ['node_modules'],
          ...preprocessOptions,
        }
        break
      case 'less':
      case 'stylus':
        preprocessOptions = {
          paths: ['node_modules'],
          ...preprocessOptions,
        }
    }
  } else {
    preprocessOptions = {}
  }
  const result = await compiler_sfc_1.compileStyleAsync({
    filename: query.filename,
    id: `data-v-${query.id}`,
    // @ts-ignore
    isProd: isProduction,
    source: code,
    scoped: block.scoped,
    modules: !!block.module,
    postcssOptions: options.postcssOptions,
    postcssPlugins: options.postcssPlugins,
    modulesOptions: options.cssModulesOptions,
    preprocessLang,
    preprocessCustomRequire: options.preprocessCustomRequire,
    preprocessOptions,
  })
  if (result.errors.length) {
    result.errors.forEach((error) =>
      pluginContext.error({
        id: query.filename,
        message: error.message,
      })
    )
    return null
  }
  if (query.module) {
    return {
      code: `export default ${JSON.stringify(result.modules)}`,
      map: null,
    }
  } else {
    return {
      code: result.code,
      map: sourceMap_1.normalizeSourceMap(result.map, request),
    }
  }
}
exports.transformStyle = transformStyle
