const compiler = require('less');
const fs = require('fs');

const pkg = require('./package.json');

const render = async (filepath, options) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        compiler.render(data, { ...options, filename: filepath }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }
    });
  });
};

module.exports = function plugin(snowpackConfig, options = {}) {
  /** A map of imported paths to the files that imported them. */
  const importedByMap = new Map();

  function addImportsToMap(filePath, importedPath) {
    const importedBy = importedByMap.get(importedPath);
    if (importedBy) {
      importedBy.add(filePath);
    } else {
      importedByMap.set(importedPath, new Set([filePath]));
    }
  }

  return {
    name: pkg.name,
    resolve: {
      input: ['.less'],
      output: ['.css'],
    },
    onChange({ filePath }) {
      if (importedByMap.has(filePath)) {
        const importedBy = importedByMap.get(filePath);
        importedByMap.delete(filePath);
        for (const importerFilePath of importedBy) {
          this.markChanged(importerFilePath);
        }
      }
    },
    async load({ filePath, isDev }) {
      try {
        const result = await render(filePath, options);
        if (isDev) {
          result.imports.forEach(importedPath => addImportsToMap(filePath, importedPath));
        }
        return {
          '.css': result.css,
        };
      } catch (err) {
        console.error(err);
      }
    },
  };
};
