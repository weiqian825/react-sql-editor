import { AST, Parser } from 'node-sql-parser';
import { ALL_AST_TYPE } from './constant';
import { SqlParseResult } from './type';

const sqlParser = new Parser();

/**
 * 递归遍历 AST 树，抽取出所有 type 符合 filterTypes 的 AST 子树
 * @param extractedAstList
 * @param ast
 * @param filterTypes
 */
function _parseAst({
  ast,
  filterTypes,
  extractedAstList,
}: {
  ast: any;
  filterTypes?: AST['type'][];
  extractedAstList: AST[];
}): void {
  if (!ast) return;
  if (Array.isArray(ast)) {
    for (const subAst of ast) {
      _parseAst({ extractedAstList, ast: subAst, filterTypes });
    }
  } else if (typeof ast === 'object') {
    if ((filterTypes ?? ALL_AST_TYPE).includes(ast.type)) {
      extractedAstList.push(ast as AST);
    }
    for (const key in ast) {
      _parseAst({
        extractedAstList,
        ast: ast[key],
        filterTypes,
      });
    }
  }
}

/**
 * 解析 SQL 语句
 * @param sql
 * @param filterTypes 不处理的 AST 类型
 */
export const parseSql = ({
  sql = '',
  filterTypes,
}: {
  sql: string;
  filterTypes?: AST['type'][];
}): SqlParseResult => {
  const { tableList, columnList, ast } = sqlParser.parse(sql, {
    database: 'MySQL',
  });
  const sqlDataList: {
    ast: AST;
    sql: string;
    extractedAstList: AST[];
    tableList: string[];
    columnList: string[];
  }[] = [];

  if (Array.isArray(ast)) {
    ast.forEach(oneAst => {
      const oneSql = sqlParser.sqlify(oneAst);

      const {
        tableList: oneTableList,
        columnList: oneColumnList,
      } = sqlParser.parse(sql);

      const extractedAstList: AST[] = [];
      _parseAst({
        extractedAstList,
        ast: oneAst,
        filterTypes,
      });
      sqlDataList.push({
        ast: oneAst,
        sql: oneSql,
        extractedAstList,
        tableList: oneTableList,
        columnList: oneColumnList,
      });
    });
  } else {
    const extractedAstList: AST[] = [];
    _parseAst({
      extractedAstList,
      ast,
      filterTypes,
    });
    sqlDataList.push({
      ast,
      sql,
      extractedAstList,
      tableList,
      columnList,
    });
  }

  return {
    fullAst: ast,
    fullTableList: tableList,
    fullColumnList: columnList,
    sqlDataList,
  };
};
