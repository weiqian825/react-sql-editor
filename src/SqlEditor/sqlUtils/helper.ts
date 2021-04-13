import { parseSql } from './parser';
import SqlValidator, { SqlTypeEnum, ValidateResult } from './Validator';
import {
  READABLE_QUERY_VALIDATORS,
  ValidateSqlType,
  WRITABLE_QUERY_VALIDATORS,
} from './sql';

export const validateSql = (
  sql: string,
  validateType: ValidateSqlType = ValidateSqlType.read,
) => {
  if (!sql) {
    return {
      type: SqlTypeEnum.emptySql,
      message: 'Query cannot be empty.',
      validateResults: [],
    };
  }

  try {
    const { sqlDataList, fullAst, fullTableList } = parseSql(sql);
    if (Array.isArray(fullAst) && fullAst.length > 1) {
      return {
        type: SqlTypeEnum.multiSql,
        message:
          'System only supports single query, please edit your query and retry.',
        validateResults: [],
      };
    }
    const validateResults = SqlValidator.validateAst({
      extractedAstList: sqlDataList[0].extractedAstList,
      originTableList: fullTableList,
      validators:
        validateType === ValidateSqlType.read
          ? READABLE_QUERY_VALIDATORS
          : WRITABLE_QUERY_VALIDATORS,
    });

    if (validateResults.length) {
      return {
        type: SqlTypeEnum.validateError,
        validateResults,
        message: 'Invalid query.',
      };
    }

    return {
      type: SqlTypeEnum.noError,
      validateResults: [],
      message: 'success',
    };
  } catch (error) {
    return {
      type: SqlTypeEnum.syntaxError,
      message: String(error.toString()),
      validateResults: [],
    };
  }
};

export function validateSqlWithUI({
  sql,
  validateType,
  onValidate,
}: {
  sql: string;
  validateType: ValidateSqlType;
  onValidate: (data: string | string[]) => void;
}) {
  const validateResult = validateSql(sql, validateType);
  let errorValidateResults: ValidateResult[] = [];
  let warnValidateResults: ValidateResult[] = [];

  if (validateResult.type === SqlTypeEnum.syntaxError) {
    onValidate('Grammer error, please edit and retry.');
  } else if (validateResult.type === SqlTypeEnum.multiSql) {
    onValidate(validateResult.message);
  } else if (validateResult.type === SqlTypeEnum.validateError) {
    errorValidateResults = validateResult.validateResults.filter(
      result => result.level === 'error',
    );
    warnValidateResults = validateResult.validateResults.filter(
      result => result.level === 'warn',
    );
    if (errorValidateResults.length) {
      const messages = errorValidateResults.map(result => result.message);
      onValidate(messages);
    } else if (warnValidateResults.length) {
      const messages = warnValidateResults.map(result => result.message);
      onValidate(messages);
    } else {
      onValidate(validateResult.message);
    }
  } else {
    onValidate(validateResult.message);
  }

  return {
    ...validateResult,
    errorValidateResults,
  };
}
