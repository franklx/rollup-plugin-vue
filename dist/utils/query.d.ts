export interface ScriptBlockQuery {
  filename: string
  vue: true
  type: 'script'
  src?: true
}
export interface TemplateBlockQuery {
  filename: string
  vue: true
  type: 'template'
  id: string
  src?: true
}
export interface StyleBlockQuery {
  filename: string
  vue: true
  type: 'style'
  index: number
  id: string
  scoped?: boolean
  module?: string | boolean
  src?: true
}
export interface CustomBlockQuery {
  filename: string
  vue: true
  type: 'custom'
  index: number
  src?: true
}
export interface NonVueQuery {
  filename: string
  vue: false
}
export declare type Query =
  | NonVueQuery
  | ScriptBlockQuery
  | TemplateBlockQuery
  | StyleBlockQuery
  | CustomBlockQuery
export declare function parseVuePartRequest(id: string): Query
