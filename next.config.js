const withTM = require('next-transpile-modules')(['three'])

module.exports = withTM({
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.frag$|\.vert$/,
        use: 'raw-loader'
      }
    )

    return config
  }
})