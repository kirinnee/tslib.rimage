import {IPage} from "./Helper";
import {polyfill} from "./webpack.polyfill";

let pages :IPage = {
	chunks: [
		["polyfill", polyfill],
		["init","./test/e2e/init.ts"],
		["index","./test/e2e/main.ts"]
		
	],
	pages: [
		{
			template: "index.html",
			output: "hohoho.html",
			chunks: ['polyfill','index'],
			title: 'Index'
		}
	],
};

export {pages};