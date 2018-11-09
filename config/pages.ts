import {IPage} from "./Helper";
import {polyfill} from "./webpack.polyfill";

let pages :IPage = {
	chunks: [
		["polyfill", polyfill],
		["index","./test/e2e/main.ts"],
		["init","./test/e2e/init.ts"],
		
	],
	pages: [
		{
			template: "index.html",
			output: "hohoho.html",
			chunks: ['index','polyfill'],
			title: 'Index'
		}
	],
};

export {pages};