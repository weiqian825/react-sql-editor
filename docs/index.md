---
hero:
  title: react-sql-editor
  desc: react-sql-editor site example
  actions:
    - text: Getting Started
      link: /components
features:
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png
    title: SQL
    desc: Identify SQL keywords
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png
    title: Format
    desc: Format the SQL
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
    title: validator
    desc: Verify SQL Input

SqlEditorter: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

# Hello react-sql-editor!

This is the main component of React-Ace. It creates an instance of the SQL Ace Editor.

## Install

```
npm i react-sql-editor
```

## Demo

https://github.com/weiqian93/react-sql-editor/blob/master/src/SqlEditor/index.md

## Example Code

```javascript
import React from 'react';
import SqlEditor from 'react-sql-editor';

export default () => (
  <SqlEditor
    title="Sql Editor"
    width="auto"
    height="300px"
    handleChange={data => {
      console.log(data);
    }}
  />
);
```

## Primary Available Props

| Prop            | Default           | Type     | Description             |
| --------------- | ----------------- | -------- | ----------------------- |
| handleChange    | console.log(data) | Function | handleChange            |
| isShowHeader    | false             | Boolean  | Show SQL Editor Header  |
| validatorConfig |                   | Object   | SQL Validator rule Conf |

## validatorConfig Options

| Key        | Default                                                                                              | Type     | Description           |
| ---------- | ---------------------------------------------------------------------------------------------------- | -------- | --------------------- |
| maxSqlNum  | 1                                                                                                    | Number   | support sql query num |
| validators | [sqlValidatorRule](https://github.com/weiqian93/react-sql-editor/blob/master/src/SqlEditor/index.md) | Array< > | sql validator conf    |

## Other Available Props(ACE)

| Prop                      | Default                 | Type     | Description                                                                                                                                                                                                                                                                         |
| ------------------------- | ----------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                      | 'sql editor'            | String   | Unique Id to be used for the editor                                                                                                                                                                                                                                                 |
| placeholder               | 'please input sql here' | String   | Placeholder text to be displayed when editor is empty                                                                                                                                                                                                                               |
| mode                      | 'mysql'                 | String   | Language for parsing and code highlighting                                                                                                                                                                                                                                          |
| theme                     | ''                      | String   | theme to use                                                                                                                                                                                                                                                                        |
| value                     | ''                      | String   | value you want to populate in the code highlighter                                                                                                                                                                                                                                  |
| defaultValue              | ''                      | String   | Default value of the editor                                                                                                                                                                                                                                                         |
| height                    | '500px'                 | String   | CSS value for height                                                                                                                                                                                                                                                                |
| width                     | '500px'                 | String   | CSS value for width                                                                                                                                                                                                                                                                 |
| className                 |                         | String   | custom className                                                                                                                                                                                                                                                                    |
| fontSize                  | 16                      | Number   | pixel value for font-size                                                                                                                                                                                                                                                           |
| showGutter                | true                    | Boolean  | show gutter                                                                                                                                                                                                                                                                         |
| showPrintMargin           | true                    | Boolean  | show print margin                                                                                                                                                                                                                                                                   |
| highlightActiveLine       | true                    | Boolean  | highlight active line                                                                                                                                                                                                                                                               |
| focus                     | false                   | Boolean  | whether to focus                                                                                                                                                                                                                                                                    |
| cursorStart               | 1                       | Number   | the location of the cursor                                                                                                                                                                                                                                                          |
| wrapEnabled               | false                   | Boolean  | Wrapping lines                                                                                                                                                                                                                                                                      |
| readOnly                  | false                   | Boolean  | make the editor read only                                                                                                                                                                                                                                                           |
| minLines                  |                         | Number   | Minimum number of lines to be displayed                                                                                                                                                                                                                                             |
| maxLines                  |                         | Number   | Maximum number of lines to be displayed                                                                                                                                                                                                                                             |
| enableBasicAutocompletion | false                   | Boolean  | Enable basic autocompletion                                                                                                                                                                                                                                                         |
| enableLiveAutocompletion  | false                   | Boolean  | Enable live autocompletion                                                                                                                                                                                                                                                          |
| enableSnippets            | false                   | Boolean  | Enable snippets                                                                                                                                                                                                                                                                     |
| tabSize                   | 4                       | Number   | tabSize                                                                                                                                                                                                                                                                             |
| debounceChangePeriod      | null                    | Number   | A debounce delay period for the onChange event                                                                                                                                                                                                                                      |
| onLoad                    |                         | Function | called on editor load. The first argument is the instance of the editor                                                                                                                                                                                                             |
| onBeforeLoad              |                         | Function | called before editor load. the first argument is an instance of `ace`                                                                                                                                                                                                               |
| onChange                  |                         | Function | occurs on document change it has 2 arguments the value and the event.                                                                                                                                                                                                               |
| onCopy                    |                         | Function | triggered by editor `copy` event, and passes text as argument                                                                                                                                                                                                                       |
| onPaste                   |                         | Function | Triggered by editor `paste` event, and passes text as argument                                                                                                                                                                                                                      |
| onSelectionChange         |                         | Function | triggered by editor `selectionChange` event, and passes a [Selection](https://ace.c9.io/#nav=api&api=selection) as it's first argument and the event as the second                                                                                                                  |
| onCursorChange            |                         | Function | triggered by editor `changeCursor` event, and passes a [Selection](https://ace.c9.io/#nav=api&api=selection) as it's first argument and the event as the second                                                                                                                     |
| onFocus                   |                         | Function | triggered by editor `focus` event                                                                                                                                                                                                                                                   |
| onBlur                    |                         | Function | triggered by editor `blur` event.It has two arguments event and editor                                                                                                                                                                                                              |
| onInput                   |                         | Function | triggered by editor `input` event                                                                                                                                                                                                                                                   |
| onScroll                  |                         | Function | triggered by editor `scroll` event                                                                                                                                                                                                                                                  |
| onValidate                |                         | Function | triggered, when annotations are changed                                                                                                                                                                                                                                             |
| editorProps               |                         | Object   | properties to apply directly to the Ace editor instance                                                                                                                                                                                                                             |
| setOptions                |                         | Object   | [options](https://github.com/ajaxorg/ace/wiki/Configuring-Ace) to apply directly to the Ace editor instance                                                                                                                                                                         |
| keyboardHandler           |                         | String   | corresponding to the keybinding mode to set (such as vim or emacs)                                                                                                                                                                                                                  |
| commands                  |                         | Array    | new commands to add to the editor                                                                                                                                                                                                                                                   |
| annotations               |                         | Array    | annotations to show in the editor i.e. `[{ row: 0, column: 2, type: 'error', text: 'Some error.'}]`, displayed in the gutter                                                                                                                                                        |
| markers                   |                         | Array    | [markers](https://ace.c9.io/#nav=api&api=edit_session) to show in the editor, i.e. `[{ startRow: 0, startCol: 2, endRow: 1, endCol: 20, className: 'error-marker', type: 'background' }]`. Make sure to define the class (eg. ".error-marker") and set `position: absolute` for it. |
| style                     |                         | Object   | camelCased properties                                                                                                                                                                                                                                                               |
