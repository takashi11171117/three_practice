const withTM = require('next-transpile-modules')(['three'])
const withSass = require('@zeit/next-sass')
const path = require('path')

module.exports = withSass(
  withTM({
    webpack: (config) => {
      config.module.rules.push({
        test: /\.frag$|\.vert$/,
        use: 'raw-loader',
      })
      config.resolve.alias = {
        ...config.resolve.alias,
        src: path.join(__dirname, 'src/'),
      }

      return config
    },
  }),
)
