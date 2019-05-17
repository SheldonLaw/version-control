const exec = require('./exec');

const execCommand = async (command, codePath) => {
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

module.exports = {
  exec,
  execCommand
}
