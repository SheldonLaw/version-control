const { exec, execCommand } = require('./util');
``
const SVN_TYPE_MAP = {
  '?': 'add',
  A: 'add',
  '!': 'delete',
  M: 'update',
};
const parseStatus = (data) => {
  const changedList = data.trim().split('\n');
  const result = [];

  changedList.forEach((item) => {
    const [type, path] = item.split('       '); // seven blank
    if (!type || !path) return;
    result.push({
      rawType: type,
      type: SVN_TYPE_MAP[type],
      path,
    });
  });

  return result;
};

const SVN_LOG_REG = /-{12}\n(.*)\|(.*)\|(.*)\|(.*)\n\n(.*)\n-{12}/g;
const parseLog = (data) => {
  const result = [];
  let regResult;
  /* eslint no-cond-assign: "off" */
  while (regResult = SVN_LOG_REG.exec(data)) {
    result.push({
      version: regResult[1].trim(),
      author: regResult[2].trim(),
      date: regResult[3].trim(),
      msg: regResult[5].trim(),
    });
  }
  return result;
};

// @TODO 错误处理catch
// @TODO 所有svn命令执行前都需要检查svn upgrade的问题
class SVN {
  static async status(codePath) {
    const command = 'svn status';
    let statusData = [];
    await exec(command, codePath)
      .then((data) => {
        statusData = parseStatus(data);
      })
      .catch(async (error) => {
        const { message } = error;
        // 处理svn upgrade提示：在svn根目录(Working Copy Root Path)执行svn upgrade
        // @NOTE 错误提示
        // svn: E155036: Please see the 'svn upgrade' command
        // svn: E155036: The working copy at 'xxx'
        if (message.indexOf('svn upgrade') !== -1) {
          const SVN_ROOT_REG = /The working copy at '(.*)'/;
          const svnRoot = SVN_ROOT_REG.exec(message)['1'];
          await this.upgrade(svnRoot);
          statusData = await this.status(codePath);
        }
      });
    return statusData;
  }

  static async upgrade(codePath) {
    const command = 'svn upgrade';
    const result = { error: false, msg: '' };
    await exec(command, codePath)
      .then((data) => {
        result.msg = data;
      })
      .catch(async (error) => {
        const { message } = error;
        // 处理svn upgrade报错，通过报错找到真正的svn root
        if (message.indexOf("Can't upgrade") !== -1) {
          const SVN_ROOT_REG = /the root is '(.*)'/;
          const svnRoot = SVN_ROOT_REG.exec(message)['1'];
          await this.upgrade(svnRoot);
        }
      });
    return result;
  }

  static async update(codePath) {
    const command = 'svn update';
    return await execCommand(command, codePath);
  }

  static async addAll(codePath) {
    const statusData = await this.status(codePath);
    for (let i = 0; i < statusData.length; i += 1) {
      const { rawType, path } = statusData[i];
      /* eslint default-case: "off" */
      /* eslint no-await-in-loop: "off" */
      switch (rawType) {
        case '?':
          // svn add xxx
          await this.add(codePath, path);
          break;
        case '!':
          // svn delete xxx
          await this.delete(codePath, path);
          break;
      }
    }
  }

  static async add(codePath, targetPath) {
    const command = `svn add ${targetPath}`;
    await exec(command, codePath);
  }

  static async delete(codePath, targetPath) {
    const command = `svn delete ${targetPath}`;
    await exec(command, codePath);
  }

  static async commit(codePath, commitMsg) {
    const command = `svn commit -m '${commitMsg}'`;
    await this.addAll(codePath);
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

  // @TODO 支持查询位置
  static async log(codePath) {
    const countLimit = 10;
    const command = `svn log -l ${countLimit}`;
    let logData = [];
    await exec(command, codePath)
      .then((data) => {
        logData = parseLog(data);
      });
    return logData;
  }

  static async revert(codePath, version, commitMsg) {
    // @NOTE 回滚 = 先回退，再commit
    // https://stackoverflow.com/questions/13330011/how-do-i-revert-an-svn-commit
    const logs = await this.log(codePath);
    const [currentVersion, rollbackVersion] = logs;
    const command = `svn merge -r ${currentVersion.version}:${version || rollbackVersion.version} .`;
    const result = { error: false, msg: '' };
    await exec(command, codePath)
      .then((data) => {
        result.msg = data;
      })
      .catch((error) => {
        result.error = true;
        result.msg = error;
      });
    if (result.error) return result;
    return this.commit(codePath, commitMsg);
  }
}

module.exports = SVN;
