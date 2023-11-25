
declare global{
	interface PlainObject<T = any> {
		[key: string] : T
	}
}

import fs from 'fs';

export const DefaultOnNullText = function(oldVal = '', key = '', currInp : PlainObject = {}, currKey = '', str = '', inp : PlainObject = {}){
	return oldVal;
}
export const DefaultHandleVars = function(token:string, key:string, initResult: string){
	return initResult;
}

export const DefaultRegExp = /{{(.+?)}}|\(\((.+?)\)\)|<var var="(.+?)"\/>/g

let DefaultOpts = {
	regex: DefaultRegExp,
	nullHandler: DefaultOnNullText,
	variableHandler: DefaultHandleVars,
	encoding: 'utf8',
};

export function createEngine(opts : { 
	regex? : RegExp, 
	nullHandler?, 
	variableHandler?, 
	encoding? : string
} = DefaultOpts){
	let { 
		regex = DefaultRegExp, 
		nullHandler = DefaultOnNullText, 
		variableHandler = DefaultHandleVars, 
		encoding = 'utf8',
	} = opts;

	let engine = (filePath, opts, callback) => { // define the template engine
		fs.promises.readFile(filePath).then((content) => {
			if(!Buffer.isEncoding(encoding)){
				encoding = 'utf8';
			}

			let str = content.toString(encoding as BufferEncoding);

			let rend = renderText(str, opts, regex, nullHandler, variableHandler);
			
			return callback(null, rend)
		}).catch((err)=>{
			if (err) return callback(err);
		})
	}

	return engine;
}


export function render(input : string, data : PlainObject, opts : { 
	regex? : RegExp, 
	nullHandler?, 
	variableHandler?,
} = DefaultOpts){
	let { 
		regex = DefaultRegExp, 
		nullHandler = DefaultOnNullText, 
		variableHandler = DefaultHandleVars,
	} = opts;

	let renderedStr = renderText(input, data, regex, nullHandler, variableHandler);
	return renderedStr;
}
export async function renderFile(filePath : string, data : PlainObject, opts : { 
	regex? : RegExp, 
	nullHandler?, 
	variableHandler?, 
	encoding? : string
} = DefaultOpts, 
	callback = (err, c) => (err ? err : c)
){
	let { 
		regex = DefaultRegExp, 
		nullHandler = DefaultOnNullText, 
		variableHandler = DefaultHandleVars, 
		encoding = 'utf8',
	} = opts;

	return fs.promises.readFile(filePath).then((content) => {
		if(!Buffer.isEncoding(encoding)){
			encoding = 'utf8';
		}

		let str = content.toString(encoding as BufferEncoding);
		let rend = renderText(str, data, regex, nullHandler, variableHandler);
		
		return callback(null, rend);
	}).catch((err)=>{
		if(err) 
		throw callback(err, null);
	})
}

function renderText(
	data : string, 
	vars : PlainObject, 
	reg = DefaultRegExp, 
	nullText : string | ((a?,b?,c?,d?,e?,f?)=>string) = DefaultOnNullText, 
	handleVars = DefaultHandleVars,
){
	let onNullText = DefaultOnNullText;
	if(nullText instanceof Function){
		onNullText = nullText;
	}else if(typeof nullText === 'string'){
		onNullText = () => `${nullText}`;
	}

	let onHandleVars = DefaultHandleVars;
	if(handleVars instanceof Function){
		onHandleVars = handleVars;
	}

	let regexp = new RegExp(reg);
	
	function replaceRegWithVars(str : string, inp : PlainObject, regexp:RegExp){
	
		let newStr = "";
		let parseStr = str;
		let lastIndex = regexp.lastIndex;
		let cache : PlainObject = {};

		function replacer(oldVal : string, key : string) : string{
			if(!key || key===''){
				return onNullText(oldVal, key, inp, key, str,inp) as string;
			}
			if(cache.hasOwnProperty(oldVal)){
				return cache[oldVal] as string;
			}

			key = String(key);

			let keyChain = key.split(".");
			let currInp = inp;
			let currKey = keyChain[0];

			// console.log(`currInp: ${JSON.stringify(currInp)}, currKey: ${currKey}`);

			if(keyChain.length<=0){
				cache[oldVal] = oldVal;
				return oldVal;
			}
			if(keyChain.length>1){
				let k = 0;
				while(k < keyChain.length - 1 && (currInp instanceof Object)){
					currInp = currInp[keyChain[k]];
					currKey = keyChain[k+1];
					k++;
				}
			}else if(keyChain.length==1){
				currInp = inp;
				currKey = keyChain[0];
			}

			let currVal = (currInp[currKey] || onNullText(oldVal,key,currInp,currKey,str,inp)) as any;

			let finalVal : string;

			if((currVal instanceof Function)){
				finalVal = currVal(oldVal, key, currInp, currKey, str, inp);
			}else{
				finalVal = String(currVal);
			}

			cache[oldVal] = finalVal;
			return finalVal;
		}

		// console.log(`newStr: ${newStr} \t parseStr:${parseStr}`);
		let arr : any;
	
		while ((arr = regexp.exec(parseStr)) !== null){
			regexp.lastIndex = 0;
			// regexp.lastIndex = lastIndex;
			let token = arr.shift();
			let key = (()=>{
				while(arr.length){
					let x = arr.pop();
					if(x !== undefined) return String(x);
				}
				return token;
			})();
			let res = replacer(token, key);
			res = onHandleVars(token,key,res);
			// console.log(`token:${token} \t key:${key} \t res:${res}`);
			
			let parseArr = parseStr.split(token);
			// lastIndex = regexp.lastIndex;
			newStr += parseArr.shift() + res;
			parseStr = parseArr.join(token);

			// console.log(`newStr: ${newStr} \t parseStr:${parseStr}`);
			// newStr = newStr.replace(token, res);
			
		}

		newStr += parseStr;

		return newStr;
	}

	let result = replaceRegWithVars(data, vars, regexp);

	return result;

}

