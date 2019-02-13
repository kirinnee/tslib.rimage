# rImage

Typescript Library to handle Responsive Images

# Getting Started

## Installation

Install via NPM 
```bash
$ npm i @kirinnee/rimage
```

or 

Install via Yarn
```bash
$ yarn add @kirinnee/rimage --prefer-offline
```

Using in browser

Attach scripts in `dist/` folder
```html
<script src="./dist/@kirinnee/rimage.min.js"></script>
```

## Configuration
Configure how you want to load your images with a `Rimage` object
```typescript
//import Rimage

let config: Rimage = {
	key: "def",
	width: 2000,
	sizes: {
		def: 80,
		med: 50,
		small: 30
	}
};
```
#### key
The key is the name of the default size ratio. The image with suffix of this key will
 resize base on percentage set on the map
 
 #### width
 This is the screen width where you would want to use your default size, defined by the "key" 
 key in the size map. 
 
 #### size
 This is the size map. It maps the percentage of the default screen to each key. If the screen falls
 below `percentage * def-width` it will use the next lower image's prefix
 
 #### Example of the above
- If the screen width is 1600 (2000*80) and above, it will use images of the "def" key
- If the screen width between 1000 and 1600, it will use images of the "med" key
- If the screen with is smaller than 1000, it will use images of the "small" key

#### How does the key work?
You are responsible for resizing your images. When the image is resized to key of "def", it will use the image
<name_of_file>_def.<extension_of_file>. 

For example, if the file name you imported was "rain.png", and the key used is "med", it will look for 
"rain_med.png"

## Initialization

To use Rimage, you have to create a `Rimager` object using the config. Do note that this depends on 
`@kirinnee/core` library.

```typescript
let rimager: Rimager = new Rimager(core, config, new SortType(), false);
rimager.ExtendPrimitives();
```

`core` is the `@kirinnee/core` instances that already extended primitives. `config` is the `Rimage`
config object. 

## Usage
There are 2 types of usage for rImage. You can either use it to preload and change all images during 
initialization, or use an extended method, `.Rimage()` or the string class to convert the string (url) of
the image to suffix

To preload and prechange all the images during initialization, use `RegisterImages` method. It provides a
callback to allow to hook onto values for the loading progress (number of images loaded and not loaded).

```typescript
//import the images
import sop from "./assets/test/sop.png";
import sophie from "./assets/test/sophie.png";
import book from "./assets/test/book.png";

//Make all the image into a single object
let images: any = {
	ryne: {
		ryne1: sop,
		ryne2: sophie
	},
	book: book
};

//Register the image
 rimager.RegisterImages(images, (ev: ImageLoadEvent) => {
 	//on each image load, print the progress 
	document.getElementById("load-progress")!.innerText = ev.progress.tangential.over;
	
});
 
 //Use the url to set src, or use for vue, react, whichever.
document.getElementById("image1").setAttribute("src", images.ryne);
```
To use it on the run, use the `.Rimage()` extension function on strings to change them.

```typescript
import sop from "./assets/test/sop.png";
sop = sop.Rimage(); //make the link responsive
//or
let url:string = "./assets/sophie.png".Rimage();

//use the url to set src, or use for vue, react, whichever
document.getElementById("image1").setAttribute("src", url);
document.getElementById("image2").setAttribute("src", sop);
```

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.MD) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning 
We use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

## Authors
* [kirinnee](mailto:kirinnee@gmail.com) 

## License
This project is licensed under MIT - see the [LICENSE.md](LICENSE.MD) file for details