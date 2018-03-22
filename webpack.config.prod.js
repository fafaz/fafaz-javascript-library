const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ClosureCompilerPlugin = require('webpack-closure-compiler');
const autoprefixer = require("autoprefixer");
const cssFilename = "build/Modal.min.css";
const extractTextPluginOptions = { publicPath: Array(cssFilename.split("/").length).join("../") };

module.exports = {
    entry: {
        'Modal.min': './src/js/Modal.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build/'),
        library: ['fafaz', 'Modal'],
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src/')],
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: require.resolve("style-loader"),
                            use: [
                                {
                                    loader: require.resolve("css-loader"),
                                    options: {
                                        importLoaders: 1,
                                        minimize: true,
                                        sourceMap: true
                                    }
                                },
                                {
                                    loader: require.resolve("postcss-loader"),
                                    options: {
                                        ident: "postcss",
                                        plugins: () => [
                                            require("postcss-flexbugs-fixes"),
                                            autoprefixer({
                                                browsers: [
                                                    ">1%",
                                                    "last 4 versions",
                                                    "Firefox ESR",
                                                    "not ie < 9"
                                                ],
                                                flexbox: "no-2009"
                                            })
                                        ]
                                    }
                                }
                            ]
                        },
                        extractTextPluginOptions
                    )
                )
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: require.resolve("style-loader"),
                            use: [
                                {
                                    loader: require.resolve("css-loader"),
                                    options: {
                                        importLoaders: 1,
                                        minimize: true,
                                        sourceMap: true,
                                    }
                                },
                                {
                                    loader: require.resolve("postcss-loader"),
                                    options: {
                                        ident: "postcss",
                                        plugins: () => [
                                            require("postcss-flexbugs-fixes"),
                                            autoprefixer({
                                                browsers: [
                                                    ">1%",
                                                    "last 4 versions",
                                                    "Firefox ESR",
                                                    "not ie < 9"
                                                ],
                                                flexbox: "no-2009"
                                            })
                                        ]
                                    }
                                },
                                {
                                    loader: require.resolve("sass-loader")
                                }
                            ]
                        },
                        extractTextPluginOptions
                    )
                )
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("./Modal.min.css"),
        new ClosureCompilerPlugin({
            compiler: {
                language_in: 'ECMASCRIPT5_STRICT',
                compilation_level: 'SIMPLE',
                create_source_map: false
            }
        }),
    ]
};
