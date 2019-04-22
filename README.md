# version-control.js

A super tiny npm module to manipulate version control system including Git & SVN.

## Getting start
``` js

const VersionControl = require('YOUR_CODE_PATH/version-control.js');
const codePath = 'YOUR_CODE_PATH';

// view changed
const status = VersionControl.status(codePath);
console.log('status');

// update code
VersionControl.update(codePath);

// commit code
const commitMsg = 'YOUR_COMMIT_MESSAGE';
VersionControl.commit(codePath, commitMsg);

// version revert
const version = 'THE_VERSION_YOU_WANT_TO_GO_BACK';
const message = 'revert message'; // for svn only.
VersionControl.revert(codePath, version, message);
```

## Document

> todo

## TODO
1. Auto release npm module with travis-ci.
2. Git support. - finished on 2019-04-22
3. Windows support.

## Dev Note
1. 中文处理问题：`process.env.LANG = 'zh_CN.UTF-8'`;
2. svn add all takes to long: `svn add --force * --auto-props --parents --depth infinity -q` => add one by one;

[More develop detail can be finded here.](https://blog.csdn.net/code_for_free/article/details/88929160)
