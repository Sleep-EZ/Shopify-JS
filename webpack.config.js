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
        loaders: [
            {
                test: /localforage\/dist\/localforage\.js/,
                loader: 'exports?localforage',
                options: { useCache: true }
            }
        ],

        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { enforce: "pre", test: /\.jsx?$/, loader: 'source-map-loader' },
        ],
    },

    plugins: [
        new CheckerPlugin(),
    ],
}


module.exports = [
    Object.assign({}, defaultConfig, {
        entry: './src/entry/browser.ts',

        output: {
            filename: 'browser.js',
            library: 'shopify-js',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, 'dist'),
        },
    }),

    Object.assign({}, defaultConfig, {
        entry: './src/entry/node.ts',

        output: {
            filename: 'node.js',
            library: 'shopify-js',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, 'dist'),
        },
    }),
];