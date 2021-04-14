---
nav:
  title: Components
  path: /components
---

## SqlEditor

Simple SQL Editor Demo:

```tsx
import React from 'react';
import SqlEditor, { READ_VALIDATORS } from 'react-sql-editor';

export default () => (
  <SqlEditor
    title="Sql Editor"
    width="auto"
    height="300px"
    isShowHeader={true}
    handleChange={data => {
      console.log(data);
    }}
    validatorConfig={{
      maxSqlNum: 1,
      validators: READ_VALIDATORS,
    }}
  />
);
```
