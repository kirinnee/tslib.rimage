import * as path from "path";
import webpack, {Entry, Plugin} from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {Kore} from "@kirinnee/core";
import {pages} from "./pages";
import {ConvertToOption, Page} from "./Helper";
import {rules} from "./webpack.rules";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

let core = new Kore();
core.ExtendPrimitives();

let plugins: Plugin[] = pages.pages
	.Map(s => ConvertToOption(s as Page))
	.Map(s => new HtmlWebpackPlugin(s));


//Add polyfill to each chunk if there is polyfill!
let entry: Entry = new Map(pages.chunks)
	.MapValue(v => core.WrapArray(v))
	//.MapValue(v=> polyfill.concat(v as string[]))
	.AsObject() as Entry;


//let count:number = 0;
let config: webpack.Configuration = {
	entry: entry,
	output: {
		path: path.resolve(__dirname, "../test/e2e/target/"),
		filename: "[name].js",
		libraryTarget: "umd",
		globalObject: "(typeof window !== 'undefined' ? window : this)"
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	optimization:{
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					compress: {
						drop_console: true,
						unsafe: true
					},
					output: {comments: false},
				}
			})
		],
		splitChunks: {
			chunks: 'all'
			// cacheGroups: {
			//
			// 	// initialize: {
			// 	// 	test: /init/,
			// 	// 	//priority: -5,
			// 	// 	chunks: 'all'
			// 	// },
			// 	modules: {
			// 		test: /node_modules/,
			// 		chunks: 'all'
			// 	},
			// 	// polyfill:{
			// 	// 	test:/polyfill/,
			// 	// 	name: 'polyfill',
			// 	// 	chunks: 'initial'
			// 	// },
			// }
		}
	},
	plugins: plugins,
	mode: "development",
	//devtool: "source-map",
	module: {rules: rules},
	target: "web"
};

export default config;
