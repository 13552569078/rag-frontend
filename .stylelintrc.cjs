
module.exports = {
  extends: ['stylelint-config-standard'], // 这是官方推荐的方式
  plugins: ["stylelint-order"],
  processors: [],
  rules: {
    // 这里自定义规则
    // 可参考官方：https://stylelint.docschina.org/user-guide/rules/
    "comment-whitespace-inside": "always",
    // "no-eol-whitespace": true,
    "comment-empty-line-before": ["always", {
    }],
    "comment-no-empty": true,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply'],
      },
    ],
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ['theme'],
      },
    ]
  },
}
