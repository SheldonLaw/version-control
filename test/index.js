// 测试三部曲：1. 环境准备；2. 执行代码；3. 验证执行结果
// { prepare, run, verify }
const fs = require('fs-extra');
const path = require('path');
const VersionControl = require('../version-control');

const versionControl = new VersionControl();
const codePath = '/Users/sheldonluo/workspace/cdn_trunk';
const currentTime = (new Date()).toString();
const commitMsg = `test version control commit: ${currentTime} && 测试中文提交`;

const testPassed = (msg) => {
  console.log(`Test Passed: ${msg}`);
};

const testFailed = (msg) => {
  throw new Error(`Test Error: ${msg}`);
};

const test = async () => {
  const testCases = [
    // {
    //   name: 'versionControl.status',
    //   prepare: async () => {
    //     const testFile = path.join(codePath, 'test.json');
    //     const commitContent = new Date();
    //     await fs.writeJson(testFile, { time: commitContent });
    //   },
    //   run: () => versionControl.status(codePath),
    //   verify: (data) => {
    //     const [firstChanged] = data;
    //     return firstChanged && (firstChanged.type === 'add' || firstChanged.type === 'update') && firstChanged.path === 'test.json';
    //   },
    // },
    // {
    //   name: 'versionControl.update',
    //   prepare: () => {},
    //   run: () => versionControl.update(codePath),
    //   verify: data => !data.error && Object.prototype.hasOwnProperty.call(data, 'msg'),
    // },
    {
      name: 'versionControl.commit',
      prepare: () => {},
      run: () => versionControl.commit(codePath, commitMsg),
      verify: data => !data.error && Object.prototype.hasOwnProperty.call(data, 'msg'),
    },
    // @NOTE 需要再update一次才能拿到最新的log数据
    // {
    //   name: 'versionControl.update',
    //   prepare: () => {},
    //   run: () => versionControl.update(codePath),
    //   verify: data => !data.error && Object.prototype.hasOwnProperty.call(data, 'msg'),
    // },
    // {
    //   name: 'versionControl.log',
    //   prepare: () => {},
    //   run: () => versionControl.log(codePath),
    //   verify: (data) => {
    //     const [latestCommit] = data;
    //     return latestCommit.msg === commitMsg;
    //   },
    // },
    // {
    //   name: 'versionControl.revert',
    //   prepare: () => {},
    //   run: () => versionControl.revert(codePath, 'r206678', 'revert'),
    //   // @TODO: 完成校验步骤，1. 提交两次，回滚一次，看内容 2. 提交三次，回滚到指定版本
    //   verify: data => !data.error && Object.prototype.hasOwnProperty.call(data, 'msg'),
    // },
  ];

  for (let i = 0; i < testCases.length; i += 1) {
    /* eslint no-await-in-loop: "off" */
    const testCase = testCases[i];
    const { name } = testCase;
    console.time(name);
    await testCase.prepare();
    const data = await testCase.run();
    console.log(data);
    console.timeEnd(name);
    const verifyCallback = testCase.verify(data) ? testPassed : testFailed;
    verifyCallback(name);
  }
};

test();
