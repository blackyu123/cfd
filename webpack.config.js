const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, "build");
const APP_DIR = path.resolve(__dirname, "src");

module.exports = env => {
    let apiUrl = JSON.stringify("http://localhost:9105/v1");
    switch (env) {
        case "dev":
            apiUrl = JSON.stringify("http://52.220.150.236:9105/v1");
            break;
        case "prod":
            apiUrl = JSON.stringify("http://www.payhome.site:9105/v1");
            break;
    }

    return {
        entry: {
            main: APP_DIR + "/index.js",
        },
        output: {
            path: BUILD_DIR,
            filename: "js/main.[hash:6].js",
            publicPath: "/",
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-react",
                            "@babel/preset-env", {
                                "include": [
                                    "@babel/plugin-proposal-object-rest-spread",
                                    "@babel/plugin-proposal-class-properties"

                                ]
                            }
                        ]
                    },
                },
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                        "css-loader", "sass-loader"],
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    use: "file-loader?name=images/img-[hash:6].[ext]&publicPath=/",
                    exclude: /node_modules/,
                },
                {
                    test: /\.mp3$/,
                    use: "file-loader?name=images/img-[hash:6].[ext]&publicPath=/",
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: [".js", ".json", ".jsx"],
        },
        plugins: [
            new HtmlWebPackPlugin({
                template: "public/index.html",
                filename: "index.html",
                chunksSortMode: 'none',
                // favicon: "./assets/icons/favicon.png"
            }),
            new MiniCssExtractPlugin({
                filename: "css/[name].[hash:6].css",
                chunkFilename: "css/[id].[hash:6].css",
            }),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|cn/),
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                "process.env": {
                    API_HOST: apiUrl,
                    ENV: JSON.stringify(env)
                },
            }),
        ],
    };
};
