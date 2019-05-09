const exec = require('./exec');

// @BUG 新的没有改动可提交的时候会报错？

const GIT_TYPE_MAP = {
  '??': 'add',
  D: 'delete',
  M: 'update',
};
const parseStatus = (data) => {
  const result = [];
  data.split('\n').forEach((changedItem) => {
    const [type, path] = changedItem.trim().split(' ');
    if (!type || !path) return;
    result.push({
      rawType: type,
      type: GIT_TYPE_MAP[type],
      path,
    });
  });
  return result;
};

const LOG_SEPERATOR = '<seperator>';
const parseLog = (data) => {
  const result = [];
  data.split('\n').forEach((commit) => {
    const [version, author, date, message] = commit.split(LOG_SEPERATOR);
    result.push({
      version,
      author,
      date: date.slice(0, 19), // 2019-03-31 13:36:28 +0800 => 2019-03-31 13:36:28
      msg: message,
    });
  });
  return result;
};

class Git {
  static async status(codePath) {
    // -s means short: show git status message in short-format
    const command = 'git status -s';
    let statusData = [];
    await exec(command, codePath)
      .then((data) => {
        statusData = parseStatus(data);
      })
      .catch(() => {
        statusData = false;
      });
    return statusData;
  }

  // @TODO 支持查询位置
  static async log(codePath) {
    const countLimit = 10;
    const command = `git log -n ${countLimit} --pretty=format:'%h${LOG_SEPERATOR}%an${LOG_SEPERATOR}%ai${LOG_SEPERATOR}%s'`;
    let logData = [];
    await exec(command, codePath)
      .then((data) => {
        logData = parseLog(data);
      })
      .catch((error) => {
        if (!error.message.includes('does not have any commits yet')) console.log(error);
        return [];
      });
    return logData;
  }

  static async update(codePath) {
    const command = 'git pull --rebase';
    const result = { error: false, msg: '' };
    await exec(command, codePath)
      .then((data) => {
        result.msg = data;
      })
      .catch((error) => {
        result.error = true;
        result.msg = error;
      });
    return result;
  }

  static async addAll(codePath) {
    const result = { error: false, msg: '' };
    const command = 'git add --all';
    await exec(command, codePath)
      .then((data) => {
        result.msg = data;
      })
      .catch((error) => {
        result.error = true;
        result.msg = error;
      });
    return result;
  }

  static async commit(codePath, commitMsg) {
    const command = `git commit -m '${commitMsg}'`;
    await this.addAll(codePath);
    const result = { error: false, msg: '' };
    await exec(command, codePath)
      .then((data) => {
        result.msg = data;
      })
      .catch((error) => {
        // @BUG 新的没有改动可提交的时候会报错？
        result.error = true;
        result.msg = error;
      });
    return result;
  }

  static async revert(codePath, version) {
    const result = { error: false, msg: '' };
    const command = `git reset ${version} --hard`;
    if (!version) {
      result.error = true;
      result.msg = 'version is required!';
      return result;
    }
    await exec(command, codePath)
      .then((data) => {
        result.msg = data;
      })
      .catch((error) => {
        result.error = true;
        result.msg = error;
      });
    return result;
  }
}

module.exports = Git;
