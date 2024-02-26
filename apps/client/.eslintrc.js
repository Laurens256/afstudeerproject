module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: ['airbnb', 'airbnb-typescript', 'plugin:react-hooks/recommended'],
	rules: {
		'no-tabs': 'off',
		'consistent-return': 'off',
		'object-curly-newline': 'off',
		'no-plusplus': 'off',

		'@typescript-eslint/indent': ['error', 'tab'],
		'@typescript-eslint/consistent-type-imports': 'error',
		'@typescript-eslint/consistent-type-exports': 'error',


		'react/function-component-definition': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
		'react/jsx-indent': ['error', 'tab'],
		'react/jsx-indent-props': ['error', 'tab'],
		'react/require-default-props': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/function-component-definition': [
			2,
			{
				namedComponents: 'arrow-function'
			}
		]
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx']
		},
		'import/resolver': {
			node: {
				extensions: ['.ts', '.tsx']
			},
			typescript: {
				project: 'apps/client/tsconfig.json'
			}
		}
	},
	parserOptions: {
		project: 'apps/client/tsconfig.json'
	}
};
