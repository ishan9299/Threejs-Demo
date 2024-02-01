const path = require("path");

const srcPath = path.resolve(__dirname, "src")
const outPath = path.resolve(__dirname, "dist")

module.exports = {
	entry: "./src/index.ts",
	mode: 'development',
	devtool: "eval-source-map",
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				include: [srcPath],
				exclude: /node_modules/,
			}
		],
	},
	resolve: {
		alias: {
			three: path.resolve("./node_modules/three")
		},
		extensions: [".ts", ".tsx", ".js"]
	},
	output: {
		filename: "index.js",
		path: outPath,
	},
}
