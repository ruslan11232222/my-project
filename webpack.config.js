import path from 'node:path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const src = path.resolve(import.meta.dirname, 'src');

export default (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: { main: './src/js/app.js' },
    output: {
      path: path.resolve(import.meta.dirname, 'dist'),
      filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: { '@': src },
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.s?css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            { loader: 'css-loader', options: { importLoaders: 2 } },
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 4 * 1024 } },
        },
        { test: /\.(woff2?|ttf)$/i, type: 'asset/resource' },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new webpack.DefinePlugin({
        __API_URL__: JSON.stringify(process.env.VITE_API_URL ?? 'http://localhost:3000/api'),
      }),
      ...(isProd
        ? [new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' })]
        : []),
    ],
    optimization: {
      splitChunks: { chunks: 'all' },
      runtimeChunk: 'single',
      minimizer: ['...', new CssMinimizerPlugin()],
    },
    devServer: {
      static: './public',
      port: 8080,
      open: true,
      hot: true,
      historyApiFallback: true,
      proxy: [{ context: ['/api'], target: 'http://localhost:3000' }],
    },
  };
};