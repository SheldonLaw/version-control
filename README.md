# version-control.js

A super tiny npm module to manipulate version control system including Git & SVN.

## Getting start
``` js
npm i version-control --save

const VersionControl = require('version-control');
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
VersionControl.revert(codePath, version);

## Dev Note
1. svn add all takes to long: `svn add --force * --auto-props --parents --depth infinity -q` => add one by one.

```
