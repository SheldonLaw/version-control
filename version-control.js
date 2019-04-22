/**
 * VersionControl
 * 1. Auto detect Git or Svn
 * 2. Manually specify Git or Svn
 */

const exec = require('./exec');

class VersionControl {
  constructor(versionControlSystemType) {
    if (versionControlSystemType && !['svn', 'git'].contains(versionControlSystemType)) throw new Error('Only git or svn can be pass in.');
    this.type = versionControlSystemType;
  }

  async status(codePath) {
    const vcs = await this.getVcs(codePath);
    return vcs.status(codePath);
  }

  async update(codePath) {
    const vcs = await this.getVcs(codePath);
    return vcs.update(codePath);
  }

  async commit(codePath, commitMsg) {
    const vcs = await this.getVcs(codePath);
    return vcs.commit(codePath, commitMsg);
  }

  async log(codePath) {
    const vcs = await this.getVcs(codePath);
    return vcs.log(codePath);
  }

  async revert(codePath, version, commitMsg) {
    const vcs = await this.getVcs(codePath);
    return vcs.revert(codePath, version, commitMsg);
  }

  // 获取实际的版本管理脚本：若有指定，则用指定的，若无，则自动检测
  // vsc = versionControlSystem
  async getVcs(codePath) {
    switch (true) {
      case this.type === 'git' || await VersionControl.isGit(codePath):
        return require('./git');
        break;
      case this.type === 'svn' || await VersionControl.isSvn(codePath):
        return require('./svn');
        break;
      default:
        throw new Error(`Can't detect git or svn.`);
    }
  }

  // from https://stackoverflow.com/questions/2180270/check-if-current-directory-is-a-git-repository
  static async isGit(codePath) {
    let isGit = false;
    await exec('([ -d .git ] && echo .git) || git rev-parse --git-dir 2> /dev/null', codePath)
      .then((data) => {
        isGit = true;
      })
      .catch(() => {});
    return isGit;
  }

  static async isSvn(codePath) {
    let isSvn = false;
    await exec('svn info', codePath)
      .then((data) => {
        isSvn = true;
      })
      .catch(() => {});
    return isSvn;
  }
}

module.exports = VersionControl;
