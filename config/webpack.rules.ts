import {RuleSetRule, RuleSetUseItem} from "webpack";
import * as path from "path";



/*===================
  TS LOADER
 ===================== */

let uses: RuleSetUseItem[] = [
	{loader: 'ts-loader'}
];

let scripts: RuleSetRule = {
	test: /\.tsx?$/,
	exclude: /(node_modules|bower_components)/,
	use: uses
};

/*===========================
		FILE LOADER
 ============================*/

let fileLoader: RuleSetRule = {
	test : /\.(jpeg|png|svg|jpg|gif)$/,
	loader: 'file-loader',
	options: {
		name: '[path][name].[ext]',
		context: path.resolve(__dirname,"../test/e2e/assets"),
		publicPath: "https://s3-ap-southeast-1.amazonaws.com/kirin.static.host/"
	}
};

//rules
let rules: RuleSetRule[] = [
	scripts,
	fileLoader
];

export {rules};
