import { CompilerError } from '@vue/compiler-sfc'
import { RollupError } from 'rollup'
export declare function createRollupError(
  id: string,
  error: CompilerError | SyntaxError
): RollupError
