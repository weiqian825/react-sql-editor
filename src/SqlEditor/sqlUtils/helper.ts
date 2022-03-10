import { parseSql } from './parser';
import SqlValidator from './Validator';
import { SqlErrorTypeEnum } from './enum';
import { ValidateResult, ValidateSqlResult, ValidatorConfig } from '../../type';

const __validateSql = ({
  sql = '',
  validators = [],
  maxSqlNum = 1,
}: {
  sql: string;
  validators: ValidatorConfig[];
  maxSqlNum?: number;
}): ValidateSqlResult => {
  if (!sql) {
    return {
      sqlParseResult: null,
      sqlErrorType: SqlErrorTypeEnum.emptySql,
      message: 'Query cannot be empty.',
      uiMessages: 'Query cannot be empty.',
      validateResults: [],
    };
  }
  try {
    const { sqlDataList, fullAst, fullTableList, fullColumnList } = parseSql({
      sql,
    });

    if (Array.isArray(fullAst) && fullAst.length > maxSqlNum) {
      return {
        sqlParseResult: {
          fullAst,
          fullTableList,
          fullColumnList,
          sqlDataList,
        },
        sqlErrorType: SqlErrorTypeEnum.multiSql,
        uiMessages: `System only supports maxSqlNum query is ${maxSqlNum}, please edit your query and retry.`,
        message: `System only supports maxSqlNum query is ${maxSqlNum}, please edit your query and retry.`,
        validateResults: [],
      };
    }

    const validateResults = SqlValidator.validateAst({
      extractedAstList: sqlDataList[0].extractedAstList,
      originTableList: fullTableList,
      validators,
    });

    if (validateResults.length) {
      return {
        sqlParseResult: {
          fullAst,
          sqlDataList,
          fullTableList,
          fullColumnList,
        },
        sqlErrorType: SqlErrorTypeEnum.validateError,
        validateResults,
        message: 'Invalid query.',
        uiMessages: 'Invalid query.',
      };
    }

    return {
      sqlParseResult: {
        fullAst,
        sqlDataList,
        fullTableList,
        fullColumnList,
      },
      sqlErrorType: SqlErrorTypeEnum.noError,
      validateResults: [],
      message: 'success',
      uiMessages: 'success',
    };
  } catch (error) {
    return {
      sqlParseResult: null,
      sqlErrorType: SqlErrorTypeEnum.syntaxError,
      message: String(error),
      validateResults: [],
      uiMessages: String(error),
    };
  }
};

export const validateSql = ({
  sql = '',
  validators = [],
  maxSqlNum = 1,
}: {
  sql: string;
  validators: ValidatorConfig[];
  maxSqlNum?: number;
}) => {
  const validateResult = __validateSql({ sql, validators, maxSqlNum });
  let errorValidateResults: ValidateResult[] = [];
  let warnValidateResults: ValidateResult[] = [];
  let uiMessages: string | string[];

  if (validateResult.sqlErrorType === SqlErrorTypeEnum.syntaxError) {
    uiMessages = 'Grammer error, please edit and retry.';
  } else if (validateResult.sqlErrorType === SqlErrorTypeEnum.multiSql) {
    uiMessages = validateResult.message;
  } else if (validateResult.sqlErrorType === SqlErrorTypeEnum.validateError) {
    errorValidateResults = validateResult.validateResults.filter(
      result => result.level === 'error',
    );
    warnValidateResults = validateResult.validateResults.filter(
      result => result.level === 'warn',
    );
    if (errorValidateResults.length) {
      const messages = errorValidateResults.map(result => result.message);
      uiMessages = messages;
    } else if (warnValidateResults.length) {
      const messages = warnValidateResults.map(result => result.message);
      uiMessages = messages;
    } else {
      uiMessages = validateResult.message;
    }
  } else {
    uiMessages = validateResult.message;
  }

  return {
    ...validateResult,
    errorValidateResults,
    uiMessages,
  };
};
