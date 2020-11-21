import { TransformPluginContext } from 'rollup'
import { Options } from '.'
import { StyleBlockQuery } from './utils/query'
export declare function transformStyle(
  code: string,
  request: string,
  options: Options,
  query: StyleBlockQuery,
  isProduction: boolean,
  pluginContext: TransformPluginContext
): Promise<{
  code: string
  map: any
} | null>
