module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: true, // type-check stories during Storybook build
    reactDocgen: false, // Disable for now https://github.com/styleguidist/react-docgen-typescript/issues/356
  },
  babel: async options => ({
    ...options,
    presets: [
        ["@babel/preset-env", { shippedProposals: true }],
        "@babel/preset-typescript",
        ["@babel/preset-react", { runtime: "automatic" }],
    ],
    plugins: ["@babel/plugin-transform-typescript", ...options.plugins],
})
};
