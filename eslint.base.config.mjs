import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$', '@hunt-the-bishomalo/story/api'],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:shell', 'type:api', 'type:data-access', 'type:data', 'type:shared', 'type:ui'],
            },
            {
              sourceTag: 'type:shell',
              onlyDependOnLibsWithTags: ['type:feature', 'type:api', 'type:data-access', 'type:data', 'type:shared'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:api', 'type:data-access', 'type:ui', 'type:data', 'type:shared'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:api', 'type:data-access', 'type:data', 'type:shared'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:api', 'type:data', 'type:shared'],
            },
            {
              sourceTag: 'type:api',
              onlyDependOnLibsWithTags: ['type:api', 'type:data-access', 'type:data', 'type:shared'],
            },
            {
              sourceTag: 'type:data',
              onlyDependOnLibsWithTags: ['type:data', 'type:shared'],
            },
            {
              sourceTag: 'type:shared',
              onlyDependOnLibsWithTags: ['type:shared', 'type:data', 'type:api'],
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
    rules: {
      'no-var': 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
