import {Core} from "@kirinnee/core";
import {Rimage} from "./Rimage";
import {ISortType} from "@kirinnee/core/types/SortType";

type ReadyListener = ()=> void;
type ImageLoadListener = (ev: ImageLoadEvent) => void;
type ImageRepository = { [s: string]: string | ImageRepository };

class Rimager {
	
	private readonly modifier: (s:string)=>string;
	private readonly sizes: Map<string,number>;
	private core: Core;
	private SortType: ISortType;
	
	constructor(core: Core, rimage: Rimage, SortType: ISortType, dev: boolean) {
		this.core = core;
		core.AssertExtend();
		this.SortType = SortType;
		//SETUP SIZES
		this.sizes = new Map([]);
		let key = rimage.key;
		let def = rimage.width;
		for(let key in rimage.sizes){
			if(rimage.sizes.hasOwnProperty(key)){
				let value:number = rimage.sizes[key];
				if (!core.IsString(key)) this.t("key must not be empty");
				if (!key.IsAlphanumeric()) this.t("key must be alphanumeric");
				if (!core.IsNumber(value, false)) this.t("value must be number");
				this.sizes.set(key, value);
			}
		}
		if (this.sizes.size === 0) this.t("size must not be empty");
		if (!this.sizes.HasKey(key)) this.t("size must have default key");
		
		
		//Use sizes to set the modifier
		if(dev){
			this.modifier = s => s;
		}else{
			let pd: number = window.devicePixelRatio || 1;
			if (pd === 0) pd = 1;
			let w: number = window.innerWidth * pd;
			let under:number = this.sizes.get(key)!;
			let truncated: Map<string,number> = this.sizes.MapValue(v => v/under*def);
			let sorted: Map<string,number> =truncated.Where((k,v)=> v >= w);
			let rKey: string = sorted.size === 0 ? truncated
				.SortByValue(this.SortType.Descending)
				.Keys().Take()! : sorted.SortByValue(this.SortType.Ascending).Keys().Take()!;
			
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
			let success: boolean = await rimage.ri(e);
			if (success) {
				pass++;
			} else {
				fail++;
			}
			let event: ImageLoadEvent = this.ce(total, pass, fail);
			firedEvent(event);
			resolve();
		}));
		return imageRepo.AsObject() as ImageRepository;
	}
	
	private t(error: string): void {
		throw new Error(error);
	}
	
	ExtendPrimitives(): void {
		let r = this;
		String.prototype.Rimage = function (): string {
			return r.modifier(this);
		}
	}
	
	/**
	 * Events to fire when DOM is ready
	 * @param listener event to fire
	 */
	private rr(listener: ReadyListener) {
		if ((document as any).attachEvent != null ? document.readyState === "complete" : document.readyState !== "loading") {
			listener();
		} else {
			document.addEventListener('DOMContentLoaded', () => {
				listener();
			});
		}
	}
	
	/**
	 * Constructs event object based on the number of current progress
	 * @param rimage - the
	 * @param total
	 * @param pass
	 * @param fail
	 */
	private ce(total: number, pass: number, fail: number): ImageLoadEvent {
		let completed: number = pass + fail;
		let over: string = `${completed}/${total}`;
		//Convert to %
		let p = (pro: number) => `${pro.toFixed(2)}%`;
		let tangent = this.tp(completed, total, 5);
		let percent = completed / total;
		return {
			failed: fail,
			succeeded: pass,
			total: total,
			progress: {
				linear: {
					percentage: p(percent),
					over: over,
					value: percent
				},
				tangential: {
					percentage: p(tangent),
					over: over,
					value: tangent
				}
				
			}
		}
	}
	
	/**
	 * Tangential Progress. Calculates the Tangential progress
	 * @param over the numerator
	 * @param under the denominator
	 * @param curvature how curve the graph will be
	 */
	private tp(over: number, under: number, curvature: number) {
		return Math.tan(over*(Math.atan(curvature))/under)/curvature;
	}
	
	/**
	 * Register images
	 * @param src the source to register
	 */
	private ri(src: string): Promise<boolean> {
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
			r.rr(() => {
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