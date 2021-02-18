import { SnowpackConfig, PluginLoadOptions } from 'snowpack';
import * as path from 'path';
import * as fs from 'fs';
import main from '../src';
import { Options } from '../src/interface';

describe('test src/index.ts', () => {
  const snowpackConfig = {} as SnowpackConfig;
  const options: Options = {};

  it('plugin config', () => {
    const plugin = main(snowpackConfig, options);

    expect(plugin.name).toEqual('snowpack-plugin-less');
    expect(plugin.resolve).toEqual({
      input: ['.less'],
      output: ['.css'],
    });
    expect(typeof plugin.load === 'function').toBeTruthy();
  });

  it('plugin.load()', async () => {
    const filepath = path.join(__dirname, './fixtures/a.less');
    const plugin = main(snowpackConfig, options);
    const loadOptions: PluginLoadOptions = {
      filePath: filepath,
      fileExt: path.extname(filepath),
      isDev: false,
      isHmrEnabled: false,
      isSSR: false,
    };
    const css = fs.readFileSync(filepath, 'utf-8') + '\n';
    const loadResult = await plugin.load(loadOptions);

    expect(loadResult).toStrictEqual({
      '.css': {
        code: css,
      },
    });
  });

  it('plugin.load(): file not exists', async () => {
    const spyConsole = jest.spyOn(console, 'error').mockImplementation(() => {});

    const filepath = path.join(__dirname, './fixtures/b.less');
    const plugin = main(snowpackConfig, options);
    const loadOptions: PluginLoadOptions = {
      filePath: filepath,
      fileExt: path.extname(filepath),
      isDev: false,
      isHmrEnabled: false,
      isSSR: false,
    };

    expect(spyConsole).not.toBeCalled();

    const loadResult = await plugin.load(loadOptions);

    expect(loadResult).toStrictEqual(undefined);
    expect(spyConsole).toBeCalledTimes(1);

    spyConsole.mockReset();
  });
});
