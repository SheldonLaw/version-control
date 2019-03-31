const child_process = require('child_process');

module.exports = (command, cwd) => new Promise((resolve, reject) => {
  child_process.exec(command, { cwd }, (err, stdout) => {
    if (err) reject(err);
    else resolve(stdout);
  });
});
