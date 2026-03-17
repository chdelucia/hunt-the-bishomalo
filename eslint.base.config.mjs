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
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:shell', 'type:api', 'type:data-access', 'type:model', 'type:util', 'type:ui'],
            },
            {
              sourceTag: 'type:shell',
              onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:api', 'type:data-access', 'type:model', 'type:util'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:ui', 'type:data-access', 'type:api', 'type:model', 'type:util'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:model', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:api', 'type:model', 'type:util', 'type:data-access'],
            },
            {
              sourceTag: 'type:api',
              onlyDependOnLibsWithTags: ['type:model', 'type:util', 'type:data-access'],
            },
            {
              sourceTag: 'type:model',
              onlyDependOnLibsWithTags: ['type:model', 'type:util'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:core',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'scope:achievements',
              onlyDependOnLibsWithTags: ['scope:achievements', 'scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:boss',
              onlyDependOnLibsWithTags: ['scope:boss', 'scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:chars',
              onlyDependOnLibsWithTags: ['scope:chars', 'scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:config',
              onlyDependOnLibsWithTags: ['scope:config', 'scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:credits',
              onlyDependOnLibsWithTags: ['scope:credits', 'scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:game',
              onlyDependOnLibsWithTags: ['scope:game', 'scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:gamestats',
              onlyDependOnLibsWithTags: ['scope:gamestats', 'scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:instructions',
              onlyDependOnLibsWithTags: ['scope:instructions', 'scope:shared', 'scope:core'],
            },
            {
              sourceTag: 'scope:shop',
              onlyDependOnLibsWithTags: ['scope:shop', 'scope:shared', 'scope:core', 'scope:game'],
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
