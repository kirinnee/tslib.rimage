// Init
import {Core, Kore} from "@kirinnee/core";
import {config} from "./rimage.config";

let core: Core = new Kore();
core.ExtendPrimitives();

import sop from "./assets/test/sop.png";
import sophie from "./assets/test/sophie.png";
import book from "./assets/test/book.png";
import {ImageLoadEvent, Rimager} from "../../src";

let rimager: Rimager = new Rimager(core, config, false);

let images: any = {
	ryne1: sop,
	ryne2: sophie,
	book: book
};

rimager.RegisterImages(images, (ev :ImageLoadEvent)=>{
	console.log(ev);
	if((document as any).attachEvent != null ? document.readyState === "complete" : document.readyState !== "loading"){
		document.getElementById("load-progress")!.innerText = ev.progress.tangential.over;
	}
});

export {
	core,
	rimager,
	images
}