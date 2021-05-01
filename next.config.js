const { withPlugins, optional } = require('next-compose-plugins')
const transpile = require('next-transpile-modules')(['three'])
const images = require('next-images')
const path = require('path')
const svg = require('next-react-svg')

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "./varibles.scss";`,
  },
  env: {
    IMAGE_URL: '/_next/static/images/',
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          esModule: false,
          limit: 100000,
          name: '[name].[ext]',
          publicPath: '/_next/static/images',
          outputPath: 'static/images',
        },
      },
    })
    config.module.rules.push({
      test: /\.frag$|\.vert$|\.glsl$/,
      use: 'raw-loader',
    })
    config.resolve.alias = {
      ...config.resolve.alias,
      src: path.join(__dirname, './'),
    }

    return config
  },
}

module.exports = withPlugins(
  [
    transpile,
    [
      images,
      {
        exclude: path.resolve(__dirname, './assets/svg'),
      },
    ],
    [
      svg,
      {
        include: path.resolve(__dirname, './assets/svg'),
      },
    ],
  ],
  nextConfig,
)
