// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: false,
        node: true,
        es6: true
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/recommended'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    'rules': {
        // indent: ['warn', 4, {
        //     'SwitchCase': 1
        // }],
        // 'space-before-function-paren': ['error', 'never'],
        // 'vue/html-indent': ['warn', 4],
        // 'vue/max-attributes-per-line': [
        //     2,
        //     {
        //         singleline: 1,
        //         multiline: {
        //             max: 1,
        //             allowFirstLine: true
        //         }
        //     }
        // ],
        // // allow debugger during development
        // 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
    },
    globals: {
        wx: true
    }
}
