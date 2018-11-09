import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";

interface IPage {
	chunks: [string,string|string[]][];
	pages: Page[]
}

interface Page{
	template: string;
	output:string;
	chunks: string[];
	title: string;
}

export function ConvertToOption(p:Page) : HtmlWebpackPlugin.Options{
	let opts: HtmlWebpackPlugin.Options = {
		title: p.title || "Index",
		filename: p.output || "index.html",
		chunks: p.chunks || ["index"],
		//chunksSortMode:"dependency"
	};
	if (p.template) opts.template = path.resolve(__dirname, "../public", p.template);
	return opts;
}

export {IPage, Page};