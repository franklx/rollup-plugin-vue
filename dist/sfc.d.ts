import { Options } from '.'
import { TransformPluginContext } from 'rollup'
export declare function transformSFCEntry(
  code: string,
  filename: string,
  options: Options,
  sourceRoot: string,
  isProduction: boolean,
  isServer: boolean,
  filterCustomBlock: (type: string) => boolean,
  pluginContext: TransformPluginContext
): {
  code: string
  map: {
    mappings: string
  }
} | null
