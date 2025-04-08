import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve as _resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const mode = process.argv.includes('--mode=production') ? 'production' : 'development';
const libraryName = process.env.npm_package_name;

export default {
  mode: mode,
  resolve: {
    alias: {
      '@components': _resolve(__dirname, 'src/scripts/components'),
      '@context': _resolve(__dirname, 'src/scripts/context'),
      '@h5phelpers': _resolve(__dirname, 'src/scripts/h5phelpers'),
      '@styles': _resolve(__dirname, 'src/styles'),
      '@types': _resolve(__dirname, 'src/scripts/types'),
      '@utils': _resolve(__dirname, 'src/scripts/utils'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${libraryName}.css`,
    }),
  ],
  entry: {
    dist: './src/scripts/app.js',
  },
  output: {
    filename: `${libraryName}.js`,
    path: _resolve(__dirname, 'dist'),
    clean: true,
  },
  target: ['browserslist'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(s[ac]ss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.svg|\.jpg|\.png$/,
        include: join(__dirname, 'src/images'),
        type: 'asset/resource',
      },
      {
        test: /\.woff$/,
        include: join(__dirname, 'src/fonts'),
        type: 'asset/resource',
      },
    ],
  },
  stats: {
    colors: true,
  },
  ...(mode !== 'production' && { devtool: 'eval-cheap-module-source-map' }),
};
