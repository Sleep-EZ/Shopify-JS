const path = require('path');
const webpack = require('webpack');
const { CheckerPlugin } = require('awesome-typescript-loader');

const env = process.env.NODE_ENV;

module.exports = {
    entry: {
        browser: "./src/entry/browser.ts",
        node: "./src/entry/node.ts",
    },

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
        ]
    },

    plugins: [
        new CheckerPlugin(),
    ],
}