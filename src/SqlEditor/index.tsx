import React, { useCallback, useRef, useState } from 'react';
import AceEditor, { IAceEditorProps, IEditorProps } from 'react-ace';
import { format } from 'sql-formatter';
import ReactAce from 'react-ace/lib/ace';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/mode-mysql';
import 'ace-builds/src-min-noconflict/snippets/mysql';
import { validateSql } from './sqlUtils/helper';
import { ValidateSqlResult, ValidatorConfig } from './sqlUtils/type';
import { SqlErrorTypeEnum } from './sqlUtils/enum';
import styles from './style.css';
import { READ_VALIDATORS } from './sqlUtils/sql';

export default ({
  defaultValue = '',
  className,
  placeholder = 'please input sql here',
  mode = 'mysql',
  name = 'sql editor',
  width = '100%',
  height = '250px',
  fontSize = 16,
  showPrintMargin = true,
  showGutter = true,
  highlightActiveLine = true,
  enableBasicAutocompletion = true,
  enableLiveAutocompletion = true,
  enableSnippets = true,
  setOptions = {
    enableSnippets: true,
    showLineNumbers: true,
    tabSize: 2,
  },
  readOnly = false,
  handleChange = data => {
    console.log(data);
  },
  handleFormat = data => {
    console.log(data);
  },
  isShowHeader = false,
  validatorConfig = {
    maxSqlNum: 1,
    validators: READ_VALIDATORS,
  },
  ...props
}: IAceEditorProps & {
  isShowHeader: boolean;
  handleChange: (data: {
    validateSqlResult: ValidateSqlResult;
    isSqlValid: boolean;
  }) => void;
  handleFormat: (data: {
    validateSqlResult: ValidateSqlResult;
    isSqlValid: boolean;
  }) => void;
  validatorConfig: { maxSqlNum: number; validators: ValidatorConfig[] };
}) => {
  const [displaySql, setDisplaySql] = useState<string>(defaultValue);
  const [copyTips, setCopyTips] = useState<string>('');
  const [annotations, setAnnotations] = useState<
    IAceEditorProps['annotations']
  >([]);

  const aceEditorRef = useRef<ReactAce>(null);

  const onLoad = useCallback((editor: IEditorProps) => {
    editor.getSelection().on('changeSelection', () => {});
  }, []);

  const getValidateSql = (
    val = '',
  ): { validateSqlResult: ValidateSqlResult; isSqlValid: boolean } => {
    const curVal = val || displaySql;
    const validateSqlResult = validateSql({
      sql: curVal,
      validators: validatorConfig.validators,
    });

    return {
      validateSqlResult: validateSqlResult,
      isSqlValid: validateSqlResult.sqlErrorType === SqlErrorTypeEnum.noError,
    };
  };

  const onChange = (val: string) => {
    setDisplaySql(val);
    const result = getValidateSql(val);
    handleChange(result);
    if (result.validateSqlResult.message === 'success') setAnnotations([]);
    else
      setAnnotations([
        {
          row: 0,
          column: 1,
          text: String(result.validateSqlResult.uiMessages),
          type: 'error',
        },
      ]);
    return result;
  };

  const formatSql = (val = '') => {
    const curVal = val || displaySql;
    const result = getValidateSql(curVal);
    if (result.isSqlValid) {
      const formatResult = format(curVal);
      setDisplaySql(formatResult);
    }
    handleFormat(result);
  };

  const onDelete = () => {
    setDisplaySql('');
  };

  const copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = displaySql;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopyTips('Copied');
    setTimeout(() => {
      setCopyTips('');
    }, 2000);
  };

  return (
    <div className={className}>
      {isShowHeader ? (
        <div className={styles['sqleditor-menu']}>
          <div className={styles['menu-left']}>
            <div
              title="format"
              className={styles['sqleditor-format']}
              onClick={() => {
                formatSql();
              }}
            />
          </div>
          <div className={styles['menu-right']}>
            <div
              title={copyTips || 'copy'}
              onClick={copyToClipboard}
              className={styles['sqleditor-copy']}
            />
            <div
              className={styles['sqleditor-delete']}
              title="delete"
              onClick={onDelete}
            />
          </div>
        </div>
      ) : null}

      <AceEditor
        ref={aceEditorRef}
        annotations={annotations}
        mode={mode}
        name={name}
        width={width}
        height={height}
        value={displaySql}
        onLoad={onLoad}
        onChange={onChange}
        readOnly={readOnly}
        fontSize={fontSize}
        showGutter={showGutter}
        setOptions={setOptions}
        placeholder={placeholder}
        showPrintMargin={showPrintMargin}
        enableSnippets={enableSnippets}
        highlightActiveLine={highlightActiveLine}
        enableBasicAutocompletion={enableBasicAutocompletion}
        enableLiveAutocompletion={enableLiveAutocompletion}
        {...props}
        commands={[
          {
            name: 'enterSubmitSql',
            bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
            exec: () => {
              aceEditorRef.current
                ? formatSql(aceEditorRef.current.props.value)
                : formatSql();
            },
          },
        ]}
      />
    </div>
  );
};
