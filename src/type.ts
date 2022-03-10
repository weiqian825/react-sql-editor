import { AST } from 'node-sql-parser';
import { SqlErrorTypeEnum } from './SqlEditor/sqlUtils/enum';
export interface ValidateResult {
  validatorName: string;
  level: Level;
  result: boolean;
  message: string;
}
export interface ValidateSqlResult {
  message: string;
  uiMessages: string | string[];
  sqlErrorType: SqlErrorTypeEnum;
  sqlParseResult: SqlParseResult | null;
  validateResults: ValidateResult[];
}
export interface SqlChangedCallbackData {
  value: string;
  isSqlValid: boolean;
  validateSqlResult: ValidateSqlResult;
}

export interface SqlFormatData {
  formatValue: string;
  value: string;
  validateSqlResult: SqlChangedCallbackData;
}
export interface ValidateAstParams extends ValidatorFuncProps {
  validators: ValidatorConfig[];
}
export interface ValidatorFuncProps {
  extractedAstList?: AST[];
  originTableList?: string[];
  invalidMessage?: string;
}
export type Level = 'warn' | 'error' | 'pass';

export type ValidatorFunc = ({
  extractedAstList,
  invalidMessage,
}: ValidatorFuncProps) => { validateResult: boolean; invalidMessage: string }; // Return: false(warn or error)； true(pass)
export interface ValidatorConfig {
  validate: ValidatorFunc;
  level?: Level; // default: warn
  invalidMessage?: string;
}

export interface SqlParseResult {
  fullAst: AST | AST[];
  fullTableList: string[];
  fullColumnList: string[];
  sqlDataList: {
    ast: Object;
    sql: string;
    extractedAstList: AST[];
    tableList: string[];
    columnList: string[];
  }[];
}

export interface ValidatorFuncProps {
  extractedAstList?: AST[];
  originTableList?: string[];
}
export interface ValidatorConfig {
  validate: ValidatorFunc;
  level?: Level; // default: warn
}
