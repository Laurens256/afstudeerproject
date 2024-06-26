module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['airbnb-base', 'airbnb-typescript/base'],
	ignorePatterns: ['bin'],
	rules: {
		'no-tabs': 'off',
		'consistent-return': 'off',
		'object-curly-newline': 'off',
		'no-plusplus': 'off',
		'max-len': ['error', { 
			code: 100,
			ignorePattern: '^import\\s.+\\sfrom\\s.+;?$',
			ignoreStrings: true,
			ignoreTemplateLiterals: true,
			ignoreComments: true,
			ignoreUrls: true,
		}],
		'default-case': 'off',

		'import/no-extraneous-dependencies': 'off',
		'import/prefer-default-export': 'off',

		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/consistent-type-exports': 'error'
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts']
		},
		'import/resolver': {
			node: {
				extensions: ['.ts']
			},
			typescript: {
				project: 'apps/server/tsconfig.json'
			}
		}
	},
	parserOptions: {
		project: 'apps/server/tsconfig.json'
	}
};
