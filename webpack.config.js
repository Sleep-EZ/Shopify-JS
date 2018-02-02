module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
        library: 'ShopifyJS',
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: 'ts-loader'},
        ]
    }
};