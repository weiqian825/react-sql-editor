---
nav:
  title: Components
  path: /components
---

## SqlEditor

Simple SQL Editor Demo:

```tsx
import React, { useState } from 'react';
import {
  SqlEditor,
  READ_VALIDATORS,
  copyToClipboard,
  formatSql,
} from 'react-sql-editor';

export default () => {
  const [displaySql, setDisplaySql] = useState('');
  const [copyTips, setCopyTips] = useState('');
  return (
    <SqlEditor
      defaultValue={displaySql}
      title="Sql Editor"
      width="auto"
      height="300px"
      onChange={data => {
        console.log('onChange', data);
        setDisplaySql(data.value);
      }}
      onClickFormat={() => {
        formatSql({
          value: displaySql,
          callback: formatData => {
            setDisplaySql(formatData.value);
          },
        });
      }}
      onClickDelete={() => {
        setDisplaySql('');
      }}
      onClickCopy={() => {
        copyToClipboard({
          value: displaySql,
          callback: setCopyTips,
        });
      }}
      validatorConfig={{
        maxSqlNum: 1,
        // validators: READ_VALIDATORS,
      }}
    />
  );
};
```
