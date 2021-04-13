import { AST } from 'node-sql-parser';
import SqlValidator, { ValidatorConfig } from './Validator';

export type ASTType = AST['type'];
export enum QueryTicketType {
  Other = 0,
  InsertOrUpdateOrDelete = 1,
  ViewSensitiveData = 2,
}

export enum QueryTicketStatus {
  Apply = 0,
  Approved = 1,
  Rejected = 2,
  Cancelled = 3,
  Completed = 4,
  PendingExecution = 5,
}

export enum ValidateSqlType {
  read = 0,
  write = 1,
}

export const COMMON_SQL_VALIDATORS: ValidatorConfig[] = [
  {
    validate: SqlValidator.validators.isSystemSupportType,
    level: 'error',
  },
  {
    validate: SqlValidator.validators.hasWhereForTypesInNeed,
    level: 'error',
  },
  {
    validate: SqlValidator.validators.limitForAllSelectQuery,
    level: 'error',
  },
  {
    validate: SqlValidator.validators.limitNumForAllSelectQuery,
    level: 'error',
  },
  {
    validate: SqlValidator.validators.notForbiddenFunc,
    level: 'error',
  },
  {
    validate: SqlValidator.validators.notGroupBy,
  },
  {
    validate: SqlValidator.validators.notHaving,
  },
  {
    validate: SqlValidator.validators.notOrderBy,
  },
];

export const WRITABLE_QUERY_VALIDATORS: ValidatorConfig[] = [
  ...COMMON_SQL_VALIDATORS,
  {
    validate: SqlValidator.validators.isWritableSqlType,
    level: 'error',
  },
];

export const READABLE_QUERY_VALIDATORS: ValidatorConfig[] = [
  ...COMMON_SQL_VALIDATORS,
  {
    validate: SqlValidator.validators.isReadableSqlType,
    level: 'error',
  },
];

export const QUERY_TYPE_MAP_VALIDATORS: {
  [key in QueryTicketType]: ValidatorConfig[];
} = {
  [QueryTicketType.InsertOrUpdateOrDelete]: WRITABLE_QUERY_VALIDATORS,
  [QueryTicketType.ViewSensitiveData]: READABLE_QUERY_VALIDATORS,
  [QueryTicketType.Other]: READABLE_QUERY_VALIDATORS,
};

export enum SqlQueryResultType {
  fail = 0,
  success = 1,
}
