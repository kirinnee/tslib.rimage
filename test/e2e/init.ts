// Init
import {config} from "./rimage.config";
import sop from "./assets/test/sop.png";
import sophie from "./assets/test/sophie.png";
import book from "./assets/test/book.png";
import {ImageLoadEvent, Rimager} from "../../src";
import {Core, Kore, SortType} from "@kirinnee/core";

let core: Core = new Kore();
core.ExtendPrimitives();

let rimager: Rimager = new Rimager(core, config, new SortType(), false);

let images: any = {
	ryne: {
		ryne1: sop,
		ryne2: sophie
	},
	book: book
};

images = rimager.RegisterImages(images, (ev: ImageLoadEvent) => {
	if ((document as any).attachEvent != null ? document.readyState === "complete" : document.readyState !== "loading") {
		document.getElementById("load-progress")!.innerText = ev.progress.tangential.over;
	}
});


export {
	core,
	rimager,
	images
}