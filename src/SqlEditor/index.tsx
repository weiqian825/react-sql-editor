import React, { useCallback, useRef, useState } from 'react';
import AceEditor, { IAceEditorProps, IEditorProps } from 'react-ace';
import { format } from 'sql-formatter';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-min-noconflict/mode-mysql';
import 'ace-builds/src-min-noconflict/snippets/mysql';
import styles from './style.css';
import { SqlTypeEnum } from './sqlUtils/Validator';
import { validateSqlWithUI } from './sqlUtils/helper';
import { ValidateSqlType } from './sqlUtils/sql';
import ReactAce from 'react-ace/lib/ace';

export default ({
  inputSql = '',
  placeholder = 'please input sql here',
  mode = 'mysql',
  theme = 'tomorrow',
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
  onSqlValidate = (data: unknown) => {
    window.alert(data);
  },
}: IAceEditorProps & {
  inputSql: string;
  onSqlValidate: (data: unknown) => void;
}) => {
  const [displaySql, setDisplaySql] = useState<string>(inputSql);
  const [copyTips, setCopyTips] = useState<string>('');
  const [annotations, setAnnotations] = useState<
    IAceEditorProps['annotations']
  >([]);

  const aceEditorRef = useRef<ReactAce>(null);

  const onLoad = useCallback((editor: IEditorProps) => {
    editor.getSelection().on('changeSelection', () => {});
  }, []);

  const onChange = (val: string) => {
    setDisplaySql(val);
    validateSqlWithUI({
      onValidate: (text: string | string[]) => {
        if (text === 'success') {
          setAnnotations([]);
        } else {
          setAnnotations([
            {
              row: 0,
              column: 1,
              text: String(text),
              type: 'error',
            },
          ]);
        }
      },
      sql: val,
      validateType: ValidateSqlType.read,
    });
  };

  const isSqlValidate = (val = '') => {
    const curVal = val || displaySql;
    const validateResult = validateSqlWithUI({
      onValidate: (res: unknown) => {
        onSqlValidate(res);
      },
      sql: curVal,
      validateType: ValidateSqlType.read,
    });
    return validateResult.type === SqlTypeEnum.noError;
  };

  const formatSql = (val = '') => {
    const curVal = val || displaySql;
    const isSqlValid = isSqlValidate(curVal);

    if (isSqlValid) {
      const formatResult = format(curVal);
      setDisplaySql(formatResult);
      return;
    }
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
    <div className={styles['sqleditor']}>
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
            title="compelete"
            className={styles['sqleditor-compelete']}
            onClick={() => {
              isSqlValidate();
            }}
          />
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
      <AceEditor
        ref={aceEditorRef}
        annotations={annotations}
        mode={mode}
        theme={theme}
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
