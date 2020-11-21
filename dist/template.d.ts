import { SFCDescriptor, SFCTemplateCompileOptions } from '@vue/compiler-sfc'
import { TransformPluginContext } from 'rollup'
import { Options } from '.'
import { TemplateBlockQuery } from './utils/query'
export declare function transformTemplate(
  code: string,
  request: string,
  options: Options,
  query: TemplateBlockQuery,
  pluginContext: TransformPluginContext
): {
  code: string
  map: any
} | null
export declare function getTemplateCompilerOptions(
  options: Options,
  descriptor: SFCDescriptor,
  scopeId: string
): Omit<SFCTemplateCompileOptions, 'source'> | undefined
