const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');

const env = process.env.NODE_ENV;


const defaultConfig = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js",
    },

    devtool: "source-map",

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { enforce: "pre", test: /\.jsx?$/, loader: 'source-map-loader' },
        ],
    },

    externals: {
        localforage: "localforage",
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new CheckerPlugin(),
    ],
}


module.exports = [
    Object.assign({}, defaultConfig, {
        entry: './src/index.js',

        output: {
            filename: 'shopify-js.browser.js',
            library: 'ShopifyJS',
            libraryTarget: 'window',
            path: path.resolve(__dirname, 'dist'),
        },
    }),

    Object.assign({}, defaultConfig, {
        entry: './src/index.js',

        output: {
            filename: 'shopify-js.umd.js',
            library: 'ShopifyJS',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, 'dist'),
        },
    }),
];