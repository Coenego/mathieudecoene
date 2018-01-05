'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const NODE_ENV = process.env.NODE_ENV;

var config = {};

/**
 * Webpack configuration
 */

const COMMON = {
    context: path.join(__dirname, './src'),
    output: {
        filename: 'client.bundle.[hash].js',
        path: path.join(__dirname, './build')
    },
    resolve: {
        enforceExtension: false,
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname, './node_modules'),
            path.join(__dirname, './src/js')
        ]
    },
    entry: {
        app: [path.join(__dirname, './src/index.jsx')]
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.svg$/,
                oneOf: [
                    {
                        exclude: path.resolve(__dirname, 'src/img/'),
                        use: 'svg-inline-loader'
                    },
                    {
                        include: path.resolve(__dirname, 'src/img/'),
                        use: 'file-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(NODE_ENV)
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src/img/'),
                to: path.join(__dirname, 'build/')
            }
        ]),
        new ExtractTextPlugin('client.bundle.[hash].css', {
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            'title': 'Mathieu Decoene',
            'template': path.join(__dirname, './src/templates/index.ejs')
        })
    ]
};

switch (NODE_ENV) {

    /* Development build */

    default: {
        config = merge(COMMON, {

            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            use: [
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 1,
                                        localIdentName: '[local]'
                                    }
                                },
                                {
                                    loader: 'sass-loader',
                                    options: {
                                        includePaths: [
                                            path.resolve(__dirname, './src/scss')
                                        ]
                                    }
                                }
                            ]
                        }),
                        exclude: /node_modules/,
                        include: [
                            path.resolve(__dirname, './src/scss'),
                            path.resolve(__dirname, './src/js')
                        ]
                    }
                ]
            },

            /**
             * Development server
             * @see https://webpack.js.org/configuration/dev-server/
             */
            devServer: {
                compress: true, // enable gzip compression
                historyApiFallback: true, // true for index.html upon 404, object for multiple paths
                hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
                https: false, // true for self-signed, object for cert authority
                stats: 'normal'
            },

            /**
             * Webpack plugins
             */
            plugins: [
                new webpack.HotModuleReplacementPlugin(),
                new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
            ]
        });

        break;
    }

    /* Production build */

    case 'production': {

        // Config just for the client with code splitting
        config = merge(COMMON, {

            module: {
                rules: [
                    {
                        test: /\.scss$/,
                        use: ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            use: [
                                {
                                    loader: 'css-loader',
                                    options: {
                                        importLoaders: 1,
                                        localIdentName: '[hash:base64:5]',
                                        minimize: true
                                    }
                                },
                                {
                                    loader: 'postcss-loader'
                                },
                                {
                                    loader: 'sass-loader',
                                    options: {
                                        includePaths: [
                                            path.resolve(__dirname, './src/scss')
                                        ]
                                    }
                                }
                            ]
                        }),
                        exclude: /node_modules/,
                        include: [
                            path.join(__dirname, './src/scss'),
                            path.join(__dirname, './src/js')
                        ]

                    }
                ]
            },

            /**
             * Webpack plugins
             */
            plugins: [
                new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                new ManifestPlugin()
            ]
        });
    }
}

module.exports = config;
