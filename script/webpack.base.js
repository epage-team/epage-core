const path = require('path')

const scirptPath = [
  path.resolve(__dirname, '../src')
]

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: scirptPath
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': path.resolve(__dirname, '../src')
    }
  },
  stats: { children: false }
}
