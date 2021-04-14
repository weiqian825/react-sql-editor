import { Parser } from 'node-sql-parser';
import { parseSql } from './parser';

const sqlParser = new Parser();

describe('utils/sqlUtils/parser', () => {
  test('parseSql', () => {
    [
      {
        sql: `SELECT * FROM app_tab LIMIT 10`,
        expected: {
          sqlDataListLength: 1,
          firstExtractedAstLength: 1,
        },
      },
      {
        sql: `SELECT BENCHMARK(1000000,ENCODE('hello','goodbye'))`,
        expected: {
          sqlDataListLength: 1,
          firstExtractedAstLength: 1,
        },
      },
      {
        sql: `SELECT * FROM app_tab LIMIT 10;SELECT * FROM app_tab LIMIT 10;`,
        expected: {
          sqlDataListLength: 2,
          firstExtractedAstLength: 1,
        },
      },
      {
        sql: `UPDATE log SET k1=2 WHERE id IN (SELECT id FROM (SELECT case WHEN id=2 THEN 3 ELSE 3 END AS uid FROM log) TEMP);`,
        expected: {
          sqlDataListLength: 1,
          firstExtractedAstLength: 3,
        },
      },
      {
        sql: `SELECT * FROM (SELECT * FROM table2);`,
        expected: {
          sqlDataListLength: 1,
          firstExtractedAstLength: 2,
        },
      },
      {
        sql: `insert into app (name, description)
        values ('test i2', 'test i2');
        insert into app (name, description)
        values ('test i', 'test i');`,
        expected: {
          sqlDataListLength: 2,
          firstExtractedAstLength: 1,
        },
      },
      {
        sql: `desc app_tab`,
        expected: {
          sqlDataListLength: 1,
          firstExtractedAstLength: 1,
        },
      },
      {
        sql: `show create table app_tab`,
        expected: {
          sqlDataListLength: 1,
          firstExtractedAstLength: 1,
        },
      },
      {
        sql: `explain select * from app_tab`,
        expected: {
          sqlDataListLength: 1,
          firstExtractedAstLength: 1,
        },
      },
    ].forEach(testData => {
      const {
        sql,
        expected: {
          sqlDataListLength: expectedSqlDataListLength,
          firstExtractedAstLength: expectedFirstExtractedAstLength,
        },
      } = testData as {
        sql: string;
        expected: {
          sqlDataListLength: number;
          firstExtractedAstLength: number;
        };
      };
      const { fullAst, fullTableList, sqlDataList } = parseSql({ sql });

      const expectedFullAst = sqlParser.astify(sql);
      const expectedFullTableList = sqlParser.tableList(sql);
      expect(fullAst).toMatchObject(expectedFullAst);
      expect(fullTableList).toMatchObject(expectedFullTableList);
      expect(sqlDataList.length).toBe(expectedSqlDataListLength);

      sqlDataList.forEach((sqlData, index) => {
        const { ast, sql, tableList } = sqlData;
        const expectedAst = Array.isArray(expectedFullAst)
          ? expectedFullAst[index]
          : expectedFullAst;
        const expectedSql = sqlParser.sqlify(expectedAst);
        const expectedTableList = sqlParser.tableList(sql);

        expect(ast).toMatchObject(expectedAst);
        expect(sqlParser.sqlify(sqlParser.astify(sql))).toBe(expectedSql);
        expect(tableList).toMatchObject(expectedTableList);
      });
      expect(sqlDataList[0].extractedAstList.length).toBeGreaterThanOrEqual(
        expectedFirstExtractedAstLength,
      );
    });
  });
});
