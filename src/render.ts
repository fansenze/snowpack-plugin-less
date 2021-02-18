import less from 'less';
import { Options } from './interface';

export async function render(content: string, options: Options) {
  return new Promise<Less.RenderOutput | never>((resolve, reject) => {
    less.render(content, options, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result as Less.RenderOutput);
      }
    });
  });
}
