import { ValidatorConfig } from './type';
import SqlValidator from './Validator';

export const SQL_VALIDATORS: { [key: string]: ValidatorConfig } = {
  isSystemSupportType: {
    validate: SqlValidator.validators.isSystemSupportType,
    level: 'error',
  },
  hasWhereForTypesInNeed: {
    validate: SqlValidator.validators.hasWhereForTypesInNeed,
    level: 'error',
  },
  limitForAllSelectQuery: {
    validate: SqlValidator.validators.limitForAllSelectQuery,
    level: 'error',
  },
  limitNumForAllSelectQuery: {
    validate: SqlValidator.validators.limitNumForAllSelectQuery,
    level: 'error',
  },
  notForbiddenFunc: {
    validate: SqlValidator.validators.notForbiddenFunc,
    level: 'error',
  },
  notGroupBy: {
    validate: SqlValidator.validators.notGroupBy,
  },
  notHaving: {
    validate: SqlValidator.validators.notHaving,
  },
  notOrderBy: {
    validate: SqlValidator.validators.notOrderBy,
  },
  isWritableSqlType: {
    validate: SqlValidator.validators.isWritableSqlType,
    level: 'error',
  },
  isReadableSqlType: {
    validate: SqlValidator.validators.isReadableSqlType,
    level: 'error',
  },
};

export const getValidatorByKey = (keys: string[]) => {
  return keys
    .map(key => {
      return SQL_VALIDATORS[key] ?? null;
    })
    .filter(item => item);
};

export const READ_VALIDATORS = getValidatorByKey([
  'isSystemSupportType',
  'hasWhereForTypesInNeed',
  'limitForAllSelectQuery',
  'limitNumForAllSelectQuery',
  'notForbiddenFunc',
  'notGroupBy',
  'notHaving',
  'notOrderBy',
  'isReadableSqlType',
]);

export const WRITE_VALIDATORS = getValidatorByKey([
  'isSystemSupportType',
  'hasWhereForTypesInNeed',
  'limitForAllSelectQuery',
  'limitNumForAllSelectQuery',
  'notForbiddenFunc',
  'notGroupBy',
  'notHaving',
  'notOrderBy',
  'isWritableSqlType',
]);
