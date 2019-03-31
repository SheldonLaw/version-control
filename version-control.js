/**
 * VersionControl
 * @TODO 实现Git状态管理
 */
class VersionControl {
  constructor(versionControlSystemType) {
    if (versionControlSystemType && !['svn', 'git'].contains(versionControlSystemType)) throw new Error('Only git or svn can be pass in.');
    this.type = versionControlSystemType || 'svn';
    // vsc = versionControlSystem
    /* eslint global-require: "off" */
    this.vcs = this.type === 'svn' ? require('./svn') : require('./git');
  }

  status(codePath) {
    return this.vcs.status(codePath);
  }

  update(codePath) {
    return this.vcs.update(codePath);
  }

  commit(codePath, commitMsg) {
    return this.vcs.commit(codePath, commitMsg);
  }

  log(codePath) {
    return this.vcs.log(codePath);
  }

  revert(codePath, commitMsg, version) {
    return this.vcs.revert(codePath, commitMsg, version);
  }
}

module.exports = VersionControl;
