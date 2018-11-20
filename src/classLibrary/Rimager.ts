import {Core, SortType} from "@kirinnee/core";
import {Rimage} from "./Rimage";

type ReadyListener = ()=> void;
type ImageLoadListener = (ev: ImageLoadEvent) => void;
type ImageRepository = { [s: string]: string | ImageRepository };

class Rimager {
	

	private readonly modifier: (s:string)=>string;
	private readonly sizes: Map<string,number>;
	private core: Core;
	
	constructor(core:Core ,rimage: Rimage, dev:boolean ) {
		this.core = core;
		core.AssertExtend();
		//SETUP SIZES
		this.sizes = new Map([]);
		let key = rimage.key;
		let def = rimage.width;
		for(let key in rimage.sizes){
			if(rimage.sizes.hasOwnProperty(key)){
				let value:number = rimage.sizes[key];
				if(!core.IsString(key)) throw new Error("size key must be non-empty string");
				if(!key.IsAlphanumeric()) throw new Error("size key must be alphanumeric");
				if(!core.IsNumber(value,false)) throw new Error("size value must be number");
				this.sizes.set(key, value);
			}
		}
		if(this.sizes.size === 0) throw new Error("Sizes cannot be empty!");
		if(!this.sizes.HasKey(key)) throw new Error("No default key in sizes!");
		
		
		//Use sizes to set the modifier
		if(dev){
			this.modifier = s => s;
		}else{
			let w:number = window.innerWidth;
			let under:number = this.sizes.get(key)!;
			let truncated: Map<string,number> = this.sizes.MapValue(v => v/under*def);
			let sorted: Map<string,number> =truncated.Where((k,v)=> v >= w);
			let rKey:string = sorted.size === 0 ? truncated.SortByValue(SortType.Descending).Keys().Take()!: sorted.SortByValue(SortType.Ascending).Keys().Take()!;
			
			//set the modifier
			this.modifier = s => {
				let arr:string[] = s.split(".");
				let ext:string = arr.Last()!.toLowerCase();
				
				if(ext === "jpg" || ext === "png" || ext === "jpeg"){
					return `${arr.Omit(1).join(".")}_${rKey}.${ext}`;
				}else{
					return s;
				}
			};
		}
		
	}
	
	/**
	 * Events to fire when DOM is ready
	 * @param listener event to fire
	 */
	private registerReady(listener: ReadyListener){
		if ((document as any).attachEvent != null ? document.readyState === "complete" : document.readyState !== "loading") {
			listener();
		} else {
			document.addEventListener('DOMContentLoaded', () => {
				listener();
			});
		}
	}
	
	ExtendPrimitives() : void{
		let r = this;
		String.prototype.Rimage = function():string{
			return r.modifier(this);
		}
	}
	
	/**
	 * Converts images
	 * @param images
	 * @param firedEvent
	 * @constructor
	 */
	RegisterImages(images: ImageRepository, firedEvent: ImageLoadListener = () => {}): ImageRepository {
		
		let imageRepo: Map<string, string> = this.core.FlattenObject(images).MapValue(s => this.modifier(s));
		
		let pass:number = 0;
		let fail:number = 0;
		let total: number = imageRepo.size;
		let rimage = this;
		
		imageRepo.Values().Each(e => new Promise<void>(async resolve => {
				let success:boolean = await rimage.RegisterImage(e);
				if(success) pass++;
				else fail ++;
			let event: ImageLoadEvent = this.ConstructEventObject(rimage, total, pass, fail);
				firedEvent(event);
				resolve();
		}));
		return imageRepo.AsObject() as ImageRepository;
	}
	
	private ConstructEventObject(rimage: Rimager, total: number, pass: number, fail: number): ImageLoadEvent {
		let completed: number = pass + fail;
		let over: string = `${completed}/${total}`;
		return {
			failed: fail,
			succeeded: pass,
			total: total,
			progress: {
				linear: {
					percentage: `${(completed / total).toFixed(2)}%`,
					over: over,
					value: completed / total
				},
				tangential: {
					percentage: `${rimage.tangentProgess(completed, total, 5).toFixed(2)}%`,
					over: over,
					value: rimage.tangentProgess(completed, total, 5)
				}
				
			}
		}
	}
	
	private tangentProgess(over:number,under:number, curvature:number){
		return Math.tan(over*(Math.atan(curvature))/under)/curvature;
	}
	
	private RegisterImage(src:string): Promise<boolean>{
		let r = this;
		let image: HTMLImageElement = new Image();
		return new Promise<boolean>((resolve:(i:boolean)=>void)=>{
			image.onload = function(){
				resolve(true);
			};
			image.onerror = function(){
				resolve(false);
			};
			image.src = src;
			image.style.display = 'none';
			image.style.position = 'absolute';
			r.registerReady(()=>{
				document.getElementsByTagName('html')[0].append(image);
			});
		});
		
	}
}

interface ImageLoadEvent{
	succeeded: number;
	total: number;
	failed:number;
	progress: ProgressCalculation;
}

interface ProgressCalculation{
	linear: ProgressFormat;
	tangential: ProgressFormat;
}

interface ProgressFormat{
	/**
	 * String in percentage with 2 decimal place
	 */
	percentage: string;
	
	/**
	 * String formatted as completed over total
	 * x/y
	 */
	over: string;
	
	/**
	 * Raw value in floating point
	 */
	value: number;
}



export {Rimager,ImageLoadEvent,ProgressCalculation,ProgressFormat};