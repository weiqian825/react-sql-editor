import React, { useCallback, useRef, useState } from 'react';
import AceEditor, { IAceEditorProps, IEditorProps } from 'react-ace';
import { format } from 'sql-formatter';
import ReactAce from 'react-ace/lib/ace';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/mode-mysql';
import 'ace-builds/src-min-noconflict/snippets/mysql';
import { validateSql } from './sqlUtils/helper';
import { SqlChangedCallbackData, ValidatorConfig } from '../type';
import { READ_VALIDATORS } from './sqlUtils/sql';
import { SqlErrorTypeEnum } from '..';
import styles from './style.css';

export const getValidateSql = ({
  value = '',
  validatorConfig = {
    maxSqlNum: 1,
    validators: READ_VALIDATORS,
  },
  callback = (data: any) => {
    console.log(data);
  },
}): SqlChangedCallbackData => {
  const validateSqlResult = validateSql({
    sql: value,
    validators: validatorConfig.validators,
  });
  const result = {
    value,
    validateSqlResult,
    isSqlValid: validateSqlResult.sqlErrorType === SqlErrorTypeEnum.noError,
  };
  callback(result);
  return result;
};

export const formatSql = ({
  value = '',
  validatorConfig = {
    maxSqlNum: 1,
    validators: READ_VALIDATORS,
  },
  callback = (data: any) => {
    console.log(data);
  },
}) => {
  const formatValue = format(value);
  const validateSqlResult = getValidateSql({
    value: formatValue,
    callback,
    validatorConfig,
  });
  const result = {
    validateSqlResult,
    formatValue,
    value,
  };
  return result;
};

export const copyToClipboard = ({
  value,
  callback,
}: {
  value: string;
  callback: Function;
}) => {
  const el = document.createElement('textarea');
  el.value = value;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  callback('Copied');
  setTimeout(() => {
    callback('');
  }, 2000);
};

export const SqlEditor = ({
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
  onChange = (data: any) => {
    console.log(`onChange: ${JSON.stringify(data)}`);
  },
  onFormat = (data: any) => {
    console.log(`onFormat: ${JSON.stringify(data)}`);
  },
  isShowHeader = false,
  validatorConfig,
  ...props
}: IAceEditorProps & {
  isShowHeader: boolean;
  onChange: (data: any) => void;
  onFormat: (data: any) => void;
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

  const handleChange = async (value: string) => {
    const result = getValidateSql({
      value,
    });
    setDisplaySql(value);
    onChange(result);
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

  return (
    <div className={className}>
      {isShowHeader ? (
        <div className={styles['sqleditor-menu']}>
          <div className={styles['menu-left']}>
            <div
              title="format"
              className={styles['sqleditor-format']}
              onClick={() => {
                formatSql({
                  value: displaySql,
                  callback: ({ formatValue }) => {
                    setDisplaySql(formatValue);
                  },
                });
              }}
            />
          </div>
          <div className={styles['menu-right']}>
            <div
              title={copyTips || 'copy'}
              onClick={() => {
                copyToClipboard({ value: displaySql, callback: setCopyTips });
              }}
              className={styles['sqleditor-copy']}
            />
            <div
              className={styles['sqleditor-delete']}
              title="delete"
              onClick={() => {
                setDisplaySql('');
              }}
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
        onChange={handleChange}
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
      />
    </div>
  );
};

export default SqlEditor;
