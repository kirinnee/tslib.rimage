interface Rimage {

	readonly width: number;
	readonly key: string;
	readonly sizes:  { [s: string]: number; };
}

export {Rimage};