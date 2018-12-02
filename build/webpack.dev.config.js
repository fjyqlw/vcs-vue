const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function (err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) { });
});

module.exports = merge(webpackBaseConfig, {
    devServer: {
        port: 8000,
        proxy: {
            '/api': {   //这里写的是想要跨域的请求的位置，一般写在当前项目封装的请求文件夹里
                target: 'http://127.0.0.1:9000',   //webpack把您的当前的localhost也好其他地址也好，代理成和您指定的target同源
                changeOrigin: true,   //原文说：Set the option `changeOrigin` to `true` for name-based virtual hosted sites，类似把您的地址和要请求的地址一起托管，这样您就能跨域访问了
            }
        }
    },
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: '版本管理系统 ' + package.version,
            filename: '../index.html',
            inject: false
        })
    ]
});