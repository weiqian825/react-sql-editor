import { ASTType } from './sql';

export const ALL_AST_TYPE: ASTType[] = [
  'use',
  'select',
  'replace',
  'insert',
  'update',
  'delete',
  'alter',
];
export const VALID_AST_TYPE: ASTType[] = [
  'use',
  'select',
  'replace',
  'insert',
  'update',
  'delete',
]; // 本系统支持的 SQL 语句类型
export const NEED_WHERE_AST_TYPE: ASTType[] = ['update', 'delete']; // 本系统需要带 where 条件的 SQL 语句类型
export const READABLE_AST_TYPE: ASTType[] = ['use', 'select']; // 支持只读权限的 SQL 语句类型
export const WRITABLE_AST_TYPE: ASTType[] = [
  'use',
  'select',
  'replace',
  'insert',
  'update',
  'delete',
]; // 支持可写权限的 SQL 语句类型
export const FORBIDDEN_FUNCTIONS = ['BENCHMARK']; // 本系统禁止的方法

export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
export const isWin = /window/i.test(navigator.userAgent);
