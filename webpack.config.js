const path = require("path");
const Dotenv = require("dotenv-webpack")
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: "./app/js/index.js",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: "./app/index.html", to: "index.html"
        },
        ]),
        new Dotenv({
            path: './.env', 
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true
    },
    node: {
        fs: "empty"
    }
};
