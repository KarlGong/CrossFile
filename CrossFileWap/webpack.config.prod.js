const path = require("path");
const srcPath = path.join(__dirname, "src");
const libPath = path.join(__dirname, "node_modules");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [
        "@babel/polyfill",
        path.join(__dirname, "src/index")
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].[chunkhash].js",
        publicPath: "/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.tpl.html",
            inject: "body",
            filename: "index.html"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: [".js", ".jsx"],
        alias: {
            "~": srcPath
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ["babel-loader"],
                include: srcPath
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                include: [srcPath, libPath]
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
                include: [srcPath, libPath]
            },
            {
                test: /\.(jpe?g|png|gif|ico|svg|eot|ttf|woff)$/,
                use: [{
                    loader: "file-loader",
                    query: {
                        name: function (file) {
                            var path = require("path");
                            var dir = path.parse(file).dir.replace(/\\/g, "/").split("/src/")[1];
                            return dir + "/[name].[hash].[ext]";
                        },
                    }
                }],
                include: srcPath
            }
        ]
    }
};