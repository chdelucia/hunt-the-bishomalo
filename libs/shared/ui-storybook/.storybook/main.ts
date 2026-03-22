import type { StorybookConfig } from '@storybook/angular';
import { dirname, join } from 'node:path';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [getAbsolutePath('@storybook/addon-essentials')],
  framework: {
    name: getAbsolutePath('@storybook/angular') as '@storybook/angular',
    options: {},
  },
  staticDirs: ['../../../../public'],
};

export default config;

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}
