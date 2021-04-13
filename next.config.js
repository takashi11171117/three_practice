const withTM = require('next-transpile-modules')(['three'])
const path = require('path')

module.exports = withTM({
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "./varibles.scss";`,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.frag$|\.vert$/,
      use: 'raw-loader',
    })
    config.resolve.alias = {
      ...config.resolve.alias,
      src: path.join(__dirname, './'),
    }

    return config
  },
})
