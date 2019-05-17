const path = require('path');
const VersionControl = require('../version-control');

const normalPath = path.join(__dirname, '../..');
const gitPath = '/Users/sheldonluo/workspace/test/git';
const svnPath = '/Users/sheldonluo/workspace/slicer';

async function testIsGit() {
  const notGit = await VersionControl.isGit(svnPath);
  const isGit = await VersionControl.isGit(gitPath);
  if (notGit || !isGit) throw new Error('isGit testFailed!');
  console.log('isGit passed.');
}

async function testIsSvn() {
  const notSvn = await VersionControl.isSvn(gitPath);
  const isSvn = await VersionControl.isSvn(svnPath);
  if (notSvn || !isSvn) throw new Error('isSvn testFailed!');
  console.log('isSvn passed.');
}

async function testGit() {
  // test auto detect
  const vc = new VersionControl();
  // 1. status
  const status = await vc.status(gitPath);
  console.log(status);
  // 2. log
  const log = await vc.log(gitPath);
  console.log(log);
  // 3. update
  const update = await vc.update(gitPath);
  console.log(update);
  // 4. commit
  // const commitMsg = 'test commit';
  // const commit = await vc.commit(gitPath, commitMsg)
  // console.log(commit);
  // 5. revert
  const version = log[1].version;
  console.log(version);
  const revert = await vc.revert(gitPath, version)
  console.log(revert);
}

async function test() {
  await testIsGit();
  await testIsSvn();
  await testGit();
}

test();
