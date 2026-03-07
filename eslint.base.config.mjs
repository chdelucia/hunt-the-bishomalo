import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'domain:game',
              onlyDependOnLibsWithTags: ['domain:game', 'domain:shared'],
            },
            {
              sourceTag: 'domain:settings',
              onlyDependOnLibsWithTags: ['domain:settings', 'domain:shared', 'domain:game'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:ui', 'type:util', 'type:api'],
            },
            {
              sourceTag: 'type:api',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util', 'type:api'],
            },
            {
              sourceTag: 'type:shell',
              onlyDependOnLibsWithTags: ['type:feature', 'type:api', 'type:data-access'],
            },
            {
              sourceTag: 'source:app',
              onlyDependOnLibsWithTags: ['type:shell', 'type:api', 'domain:shared', 'type:feature'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
