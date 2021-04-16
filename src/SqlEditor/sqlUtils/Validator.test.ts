import { parseSql } from './parser';
import { ValidateResult, ValidatorConfig } from '../../type';
import Validator from './Validator';

describe('utils/sqlUtils/Validator/validators/notForbiddenFunc', () => {
  test('notForbiddenFunc', () => {
    [
      {
        sql: `SELECT BENCHMARK(1000000,ENCODE('hello','goodbye')) LIMIT 1;`,
        expected: false,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.notForbiddenFunc({ extractedAstList });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'Your query should not contain BENCHMARK.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/notOrderBy', () => {
  test('notOrderBy', () => {
    [
      {
        sql: `SELECT * FROM app_tab ORDER BY name`,
        expected: false,
      },
      {
        sql: `SELECT * FROM app_tab`,
        expected: true,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.notOrderBy({ extractedAstList });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'Your query have ORDER BY clause.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/notGroupBy', () => {
  test('notGroupBy', () => {
    [
      {
        sql: `SELECT * FROM app_tab Group By name`,
        expected: false,
      },
      {
        sql: `SELECT * FROM app_tab`,
        expected: true,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.notGroupBy({ extractedAstList });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'Your query have GROUP BY clause.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/notHaving', () => {
  test('notHaving', () => {
    [
      {
        sql: `SELECT * FROM app_tab Group By name Having name is not null`,
        expected: false,
      },
      {
        sql: `SELECT * FROM app_tab`,
        expected: true,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.notHaving({ extractedAstList });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'Your query have HAVING clause.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/limitForAllSelectQuery', () => {
  test('limitForAllSelectQuery', () => {
    [
      {
        sql: `SELECT * FROM app_tab`,
        expected: false,
      },
      {
        sql: `SELECT * FROM app_tab LIMIT 10`,
        expected: true,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.limitForAllSelectQuery({
        extractedAstList,
      });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'Your query should have LIMIT clause.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/limitNumForAllSelectQuery', () => {
  test('limitNumForAllSelectQuery', () => {
    [
      {
        sql: `SELECT * FROM app_tab`,
        expected: false,
      },
      {
        sql: `SELECT * FROM app_tab LIMIT 10`,
        expected: true,
      },
      {
        sql: `SELECT * FROM app_tab LIMIT 100`,
        expected: true,
      },
      {
        sql: `SELECT * FROM app_tab LIMIT 1000`,
        expected: false,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.limitNumForAllSelectQuery({
        extractedAstList,
      });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage:
          'Your select query should have a LIMIT no more than 100.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/hasWhereForTypesInNeed', () => {
  test('hasWhereForTypesInNeed', () => {
    [
      {
        sql: `SELECT * FROM app_tab`,
        expected: true,
      },
      {
        sql: `SELECT * FROM app_tab WHERE id > 10`,
        expected: true,
      },
      {
        sql: `UPDATE log SET k1=1`,
        expected: false,
      },
      {
        sql: `UPDATE log SET k1=1 WHERE id = 1`,
        expected: true,
      },
      {
        sql: `DELETE FROM app_tab`,
        expected: false,
      },
      {
        sql: `DELETE FROM app_tab WHERE id = 1`,
        expected: true,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.hasWhereForTypesInNeed({
        extractedAstList,
      });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'Your query should have WHERE clause.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/isSystemSupportType', () => {
  test('isSystemSupportType', () => {
    [
      {
        sql: `SELECT * FROM app_tab`,
        expected: true,
      },
      {
        sql: `UPDATE log SET k1=1`,
        expected: true,
      },
      {
        sql: `DELETE FROM app_tab`,
        expected: true,
      },
      {
        sql: `insert into app (name, description)
        values ('test i2', 'test i2');
        insert into app (name, description)
        values ('test i', 'test i');`,
        expected: true,
      },
      {
        sql: `USE db_portal_q2_dev`,
        expected: true,
      },
      {
        sql: `DROP TABLE app_tab`,
        expected: false,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList, fullTableList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.isSystemSupportType({
        extractedAstList,
        originTableList: fullTableList,
      });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'This SQL query type is not yet supported.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/isReadableSqlType', () => {
  test('isReadableSqlType', () => {
    [
      {
        sql: `SELECT * FROM app_tab`,
        expected: true,
      },
      {
        sql: `UPDATE log SET k1=1`,
        expected: false,
      },
      {
        sql: `DELETE FROM app_tab`,
        expected: false,
      },
      {
        sql: `insert into app (name, description)
        values ('test i2', 'test i2');
        insert into app (name, description)
        values ('test i', 'test i');`,
        expected: false,
      },
      {
        sql: `USE db_portal_q2_dev`,
        expected: true,
      },
      {
        sql: `DROP TABLE app_tab`,
        expected: false,
      },
      {
        sql: `DESC app_tab`,
        expected: true,
      },
      {
        sql: `SHOW CREATE TABLE app_tab`,
        expected: true,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList, fullTableList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.isReadableSqlType({
        extractedAstList,
        originTableList: fullTableList,
      });

      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'This is not a readonly SQL query type.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/isWritableSqlType', () => {
  test('isWritableSqlType', () => {
    [
      {
        sql: `SELECT * FROM app_tab`,
        expected: true,
      },
      {
        sql: `UPDATE log SET k1=1`,
        expected: true,
      },
      {
        sql: `DELETE FROM app_tab`,
        expected: true,
      },
      {
        sql: `insert into app (name, description)
        values ('test i2', 'test i2');
        insert into app (name, description)
        values ('test i', 'test i');`,
        expected: true,
      },
      {
        sql: `USE db_portal_q2_dev`,
        expected: true,
      },
      {
        sql: `DROP TABLE app_tab`,
        expected: false,
      },
    ].forEach(testData => {
      const { sql, expected } = testData as {
        sql: string;
        expected: boolean;
      };
      const { sqlDataList, fullTableList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validators.isWritableSqlType({
        extractedAstList,
        originTableList: fullTableList,
      });
      expect(value).toMatchObject({
        validateResult: expected,
        invalidMessage: 'This is not a writable SQL query type.',
      });
    });
  });
});

describe('utils/sqlUtils/Validator/validators/validateAst', () => {
  test('validateAst', () => {
    [
      {
        sql: `SELECT * FROM app_tab ORDER BY name`,
        validators: [
          {
            validate: Validator.validators.notOrderBy,
            level: 'warn',
          },
        ],
        expected: [
          {
            validatorName: 'notOrderBy',
            level: 'warn',
            result: false,
            message: 'Your query have ORDER BY clause.',
          },
        ],
      },
      {
        sql: `SELECT * FROM app_tab ORDER BY name`,
        validators: [
          {
            validate: Validator.validators.notOrderBy,
            level: 'error',
          },
        ],
        expected: [
          {
            validatorName: 'notOrderBy',
            level: 'error',
            result: false,
            message: 'Your query have ORDER BY clause.',
          },
        ],
      },
      {
        sql: `SELECT * FROM app_tab ORDER BY name`,
        validators: [
          {
            validate: Validator.validators.notOrderBy,
            level: 'warn',
          },
          {
            validate: Validator.validators.limitForAllSelectQuery,
            level: 'error',
          },
        ],
        expected: [
          {
            validatorName: 'notOrderBy',
            level: 'warn',
            result: false,
            message: 'Your query have ORDER BY clause.',
          },
          {
            validatorName: 'limitForAllSelectQuery',
            level: 'error',
            result: false,
            message: 'Your query should have LIMIT clause.',
          },
        ],
      },
    ].forEach(testData => {
      const { sql, expected, validators } = testData as {
        sql: string;
        validators: ValidatorConfig[];
        expected: ValidateResult[];
      };
      const { sqlDataList, fullTableList } = parseSql({ sql });
      const extractedAstList = sqlDataList[0].extractedAstList;
      const value = Validator.validateAst({
        extractedAstList,
        validators,
        originTableList: fullTableList,
      });
      expect(value).toMatchObject(expected);
    });
  });
});
