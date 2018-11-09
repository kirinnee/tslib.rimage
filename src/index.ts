import {Rimage} from "./classLibrary/Rimage";
import {ProgressFormat, ProgressCalculation, ImageLoadEvent, Rimager} from "./classLibrary/Rimager";

declare global{
	interface String{
		/**
		 * Make the image responsive
		 * @constructor
		 */
		Rimage():string;
	}
}

export {
	Rimager,ImageLoadEvent,ProgressCalculation,ProgressFormat,Rimage
}
