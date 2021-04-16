import { AST, Delete, Select, Update } from 'node-sql-parser';
import {
  VALID_AST_TYPE,
  NEED_WHERE_AST_TYPE,
  FORBIDDEN_FUNCTIONS,
  READABLE_AST_TYPE,
  WRITABLE_AST_TYPE,
} from './constant';
import {
  ValidateAstParams,
  ValidateResult,
  ValidatorFunc,
  ValidatorFuncProps,
} from '../../type';

/**
 * 不允许使用 ORDER BY
 * @param extractedAstList
 */
const notOrderBy: ValidatorFunc = ({
  extractedAstList,
  invalidMessage = 'Your query have ORDER BY clause.',
}) => {
  const validateResult = !extractedAstList?.some(ast => {
    if (ast.type === 'select') {
      return Boolean(ast.orderby);
    }
    return false;
  });
  return {
    validateResult,
    invalidMessage: invalidMessage,
  };
};

/**
 * 不允许使用 GROUP BY
 * @param extractedAstList
 */
const notGroupBy: ValidatorFunc = ({
  extractedAstList,
  invalidMessage = 'Your query have GROUP BY clause.',
}) => {
  const validateResult = !extractedAstList?.some(ast => {
    if (ast.type === 'select') {
      return Boolean(ast.groupby);
    }
    return false;
  });
  return {
    validateResult,
    invalidMessage,
  };
};

/**
 * 不允许使用 HAVING
 * @param extractedAstList
 */
const notHaving: ValidatorFunc = ({
  extractedAstList,
  invalidMessage = 'Your query have HAVING clause.',
}) => {
  const validateResult = !extractedAstList?.some(ast => {
    if (ast.type === 'select') {
      return Boolean(ast.having);
    }
    return false;
  });
  return {
    validateResult,
    invalidMessage,
  };
};

/**
 * 所有的 SELECT 查询都要加上 LIMIT 限制
 * @param extractedAstList
 */
const limitForAllSelectQuery: ValidatorFunc = ({
  extractedAstList,
  invalidMessage = 'Your query should have LIMIT clause.',
}) => {
  const validateResult = !!extractedAstList?.every(ast => {
    if (ast.type === 'select') {
      return Boolean(ast.limit);
    } else {
      return true;
    }
  });
  return {
    validateResult,
    invalidMessage,
  };
};

/**
 * 所有的 SELECT 查询的 LIMIT 语句都要限制在 100 以内(包括100)
 * @param extractedAstList
 */
const limitNumForAllSelectQuery: ValidatorFunc = ({
  extractedAstList,
  invalidMessage = 'Your select query should have a LIMIT no more than 100.',
}) => {
  const validateResult = !!extractedAstList?.every(ast => {
    if (ast.type === 'select') {
      if (!ast.limit) return false;
      const limitAmount =
        ast.limit.seperator === ','
          ? ast.limit.value[1].value
          : ast.limit?.value[0].value ?? 0;
      return limitAmount <= 100;
    } else {
      return true;
    }
  });
  return {
    validateResult,
    invalidMessage,
  };
};

/**
 * 需要加上 WHERE 字段的 SQL 语句都要加上 WHERE 字段
 * @param extractedAstList
 */
const hasWhereForTypesInNeed: ValidatorFunc = ({
  extractedAstList,
  invalidMessage = 'Your query should have WHERE clause.',
}) => {
  const validateResult = !!extractedAstList?.every(ast => {
    if (NEED_WHERE_AST_TYPE.includes(ast.type)) {
      return Boolean((ast as Select | Delete | Update).where);
    } else {
      return true;
    }
  });
  return {
    validateResult,
    invalidMessage: invalidMessage,
  };
};

/**
 * 不能有被禁止的方法
 * @param extractedAstList
 */
const notForbiddenFunc: ValidatorFunc = ({
  extractedAstList,
  invalidMessage = 'Your query should not contain BENCHMARK.',
}) => {
  const validateResult = !!extractedAstList?.every(ast => {
    const { columns } = ast as Select;
    if (Array.isArray(columns)) {
      for (const col of columns) {
        if (
          col.expr &&
          col.expr.type === 'function' &&
          FORBIDDEN_FUNCTIONS.includes(col.expr.name)
        ) {
          return false;
        }
      }
    }
    return true;
  });
  return {
    validateResult,
    invalidMessage,
  };
};

const __isTypes = (
  { extractedAstList, originTableList }: ValidatorFuncProps,
  types: AST['type'][],
) => {
  const isTableListValid = !!originTableList
    ?.map(tableElement => tableElement.split('::')[0].toLowerCase())
    .every(tableType => types.includes(tableType as AST['type']));

  const isExtractedAstListValid = !!extractedAstList?.every(ast => {
    return types.includes(ast.type);
  });

  return isTableListValid && isExtractedAstListValid;
};

/**
 * SQL 语句是当前版本支持的
 * @param extractedAstList
 * @param originTableList
 */
const isSystemSupportType: ValidatorFunc = ({
  extractedAstList,
  originTableList,
  invalidMessage = 'This SQL query type is not yet supported.',
}) => {
  return {
    validateResult: __isTypes(
      { extractedAstList, originTableList },
      VALID_AST_TYPE,
    ),
    invalidMessage,
  };
};

/**
 * SQL 语句是只读权限支持的类型
 * @param extractedAstList
 * @param originTableList
 */
const isReadableSqlType: ValidatorFunc = ({
  extractedAstList,
  originTableList,
  invalidMessage = 'This is not a readonly SQL query type.',
}) => {
  return {
    validateResult: __isTypes(
      { extractedAstList, originTableList },
      READABLE_AST_TYPE,
    ),
    invalidMessage,
  };
};

/**
 * SQL 语句是可写权限支持的类型
 * @param extractedAstList
 * @param originTableList
 */
const isWritableSqlType: ValidatorFunc = ({
  extractedAstList,
  originTableList,
  invalidMessage = 'This is not a writable SQL query type.',
}) => {
  return {
    validateResult: __isTypes(
      { extractedAstList, originTableList },
      WRITABLE_AST_TYPE,
    ),
    invalidMessage,
  };
};

const validateAst = ({
  validators,
  extractedAstList,
  originTableList,
}: ValidateAstParams) => {
  const validateResults: ValidateResult[] = [];

  validators.forEach(validator => {
    const validateResult = validator.validate({
      extractedAstList,
      originTableList,
      invalidMessage: validator.invalidMessage,
    });
    const isValid = validateResult.validateResult;

    if (!isValid) {
      validateResults.push({
        validatorName: validator.validate.name,
        level: validator.level ?? 'warn',
        result: isValid,
        message: validateResult.invalidMessage,
      });
    }
  });

  return validateResults;
};

export default {
  validators: {
    notOrderBy,
    notGroupBy,
    notHaving,
    limitForAllSelectQuery,
    notForbiddenFunc,
    limitNumForAllSelectQuery,
    hasWhereForTypesInNeed,
    isSystemSupportType,
    isReadableSqlType,
    isWritableSqlType,
  },
  validateAst,
};
