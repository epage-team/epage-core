const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpackBaseConfig = require('./webpack.base.js')
const pkg = require('../package.json')

const banner = `epage-core v${pkg.version}
(c) 2020-present Chengzi
Released under the MIT License.`

const webpackConfig = merge(webpackBaseConfig, {
  mode: 'production',
  entry: {
    'epage-core': './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '',
    filename: '[name].min.js',
    library: 'EpageCore',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    vuex: {
      root: 'Vuex',
      commonjs: 'vuex',
      commonjs2: 'vuex',
      amd: 'vuex'
    },
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    },
    sortablejs: {
      root: 'Sortable',
      commonjs: 'sortablejs',
      commonjs2: 'sortablejs',
      amd: 'sortablejs'
    },
    vuedraggable: {
      root: 'vuedraggable',
      commonjs: 'vuedraggable',
      commonjs2: 'vuedraggable',
      amd: 'vuedraggable'
    }
  },
  // devtool: 'source-map',
  optimization: {
    minimizer: [new UglifyJsPlugin({
      parallel: true,
      sourceMap: false,
      uglifyOptions: {
        ecma: 8,
        warnings: false
      }
    })]
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: path.resolve(__dirname, '../dist')
    }),
    new webpack.BannerPlugin(banner),
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
})

if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
