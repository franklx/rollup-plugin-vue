'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
try {
  require.resolve('@vue/compiler-sfc')
} catch (e) {
  throw new Error(
    'rollup-plugin-vue requires @vue/compiler-sfc to be present in the dependency ' +
      'tree.'
  )
}
const fs_1 = __importDefault(require('fs'))
const debug_1 = __importDefault(require('debug'))
const rollup_pluginutils_1 = require('rollup-pluginutils')
const sfc_1 = require('./sfc')
const template_1 = require('./template')
const style_1 = require('./style')
const customBlockFilter_1 = require('./utils/customBlockFilter')
const descriptorCache_1 = require('./utils/descriptorCache')
const query_1 = require('./utils/query')
const sourceMap_1 = require('./utils/sourceMap')
const script_1 = require('./script')
const debug = debug_1.default('rollup-plugin-vue')
const defaultOptions = {
  include: /\.vue$/,
  exclude: [],
  target: 'browser',
  exposeFilename: false,
  processStyleTags: false,
  customBlocks: [],
}
function PluginVue(userOptions = {}) {
  const options = {
    ...defaultOptions,
    ...userOptions,
  }
  const isServer = options.target === 'node'
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.BUILD === 'production'
  const rootContext = process.cwd()
  const filter = rollup_pluginutils_1.createFilter(
    options.include,
    options.exclude
  )
  const filterCustomBlock = customBlockFilter_1.createCustomBlockFilter(
    options.customBlocks
  )
  return {
    name: 'vue',
    async resolveId(id, importer) {
      const query = query_1.parseVuePartRequest(id)
      if (query.vue) {
        if (query.src) {
          const resolved = await this.resolve(query.filename, importer, {
            skipSelf: true,
          })
          if (resolved) {
            descriptorCache_1.setDescriptor(
              resolved.id,
              descriptorCache_1.getDescriptor(importer)
            )
            const [, originalQuery] = id.split('?', 2)
            resolved.id += `?${originalQuery}`
            return resolved
          }
        } else if (!filter(query.filename)) {
          return null
        }
        debug(`resolveId(${id})`)
        return id
      }
      return null
    },
    load(id) {
      const query = query_1.parseVuePartRequest(id)
      if (query.vue) {
        if (query.src) {
          return fs_1.default.readFileSync(query.filename, 'utf-8')
        }
        const descriptor = descriptorCache_1.getDescriptor(query.filename)
        if (descriptor) {
          const block =
            query.type === 'template'
              ? descriptor.template
              : query.type === 'script'
              ? script_1.getResolvedScript(descriptor, isServer)
              : query.type === 'style'
              ? descriptor.styles[query.index]
              : typeof query.index === 'number'
              ? descriptor.customBlocks[query.index]
              : null
          if (block) {
            return {
              code: block.content,
              map: sourceMap_1.normalizeSourceMap(block.map, id),
            }
          }
        }
      }
      return null
    },
    async transform(code, id) {
      const query = query_1.parseVuePartRequest(id)
      // *.vue file
      // generate an entry module that imports the actual blocks of the SFC
      if (!query.vue && filter(id)) {
        debug(`transform SFC entry (${id})`)
        const output = sfc_1.transformSFCEntry(
          code,
          id,
          options,
          rootContext,
          isProduction,
          isServer,
          filterCustomBlock,
          this
        )
        if (output) {
          debug('SFC entry code:', '\n' + output.code + '\n')
        }
        return output
      }
      // sub request for blocks
      if (query.vue) {
        if (!query.src && !filter(query.filename)) {
          return null
        }
        if (query.src) {
          this.addWatchFile(query.filename)
        }
        if (query.type === 'template') {
          debug(`transform template (${id})`)
          return template_1.transformTemplate(code, id, options, query, this)
        } else if (options.processStyleTags && query.type === 'style') {
          debug(`transform style (${id})`)
          return style_1.transformStyle(
            code,
            id,
            options,
            query,
            isProduction,
            this
          )
        }
      }
      return null
    },
  }
}
exports.default = PluginVue
// overwrite for cjs require('rollup-plugin-vue')() usage
module.exports = PluginVue
