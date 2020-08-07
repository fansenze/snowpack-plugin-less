const compiler = require('less');
const fs = require('fs');

const pkg = require('./package.json');

const render = async (filepath) => {
  return new Promise((resovle, reject) => {
    fs.readFile(filepath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        compiler.render(data, { filename: filepath }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resovle(result);
          }
        });
      }
    });
  });
}

module.exports = function plugin(snowpackConfig) {
  return {
    name: pkg.name,
    resolve: {
      input: ['.less'],
      output: ['.css'],
    },
    async load({ filePath }) {
      try {
        const result = await render(filePath);
        return {
          '.css': result.css,
        };
      } catch (err) {
        console.error(err);
      }
    },
  };
}