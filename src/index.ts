import * as fs from 'fs';
import { SnowpackPluginFactory } from 'snowpack';
import { Options } from './interface';
import { render } from './render';

const pkg = require('../package.json');

const plugin: SnowpackPluginFactory<Options> = (snowpackConfig, options = {}) => {
  /** A map of imported paths to the files that imported them. */
  const importedByMap = new Map();

  function addImportsToMap(filePath: string, importedPath: string) {
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
        if (this.markChanged) {
          for (const importerFilePath of importedBy) {
            this.markChanged(importerFilePath);
          }
        }
      }
    },
    async load({ filePath, isDev }) {
      try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const result = await render(content, {
          ...options,
          filename: filePath,
        });
        if (isDev) {
          result.imports.forEach((importedPath) => addImportsToMap(filePath, importedPath));
        }
        return {
          '.css': {
            code: result.css,
          },
        };
      } catch (err) {
        console.error(err);
      }
    },
  };
};

export = plugin;
