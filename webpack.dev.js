const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { description } = require('./package.json');

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',

    devServer: {
        open: true,
        compress: true,
        watchContentBase: true
    },

    entry: {
        main: "./src/main.ts"
    },
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            {
                test: /\.(tsx?)|(js)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            { // For shaders
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            }
        ]
    },

    optimization: {
        moduleIds: 'named'
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "./index.html",
            title: description,
            options: {
                publicURL: "/"
            }
        }),
        new webpack.DefinePlugin({
            inject: 'body',
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        })
    ]
};