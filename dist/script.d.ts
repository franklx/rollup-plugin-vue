import { SFCDescriptor, SFCScriptBlock } from '@vue/compiler-sfc'
import { TransformPluginContext } from 'rollup'
import { Options } from '.'
export declare function getResolvedScript(
  descriptor: SFCDescriptor,
  isServer: boolean
): SFCScriptBlock | null | undefined
export declare function resolveScript(
  descriptor: SFCDescriptor,
  scopeId: string,
  isProd: boolean,
  isServer: boolean,
  options: Options,
  pluginContext: TransformPluginContext
): SFCScriptBlock | null
