var a = ['name','surname'];
var inputTypes = [
{"type":"text",				"fill":"word"},
{"type":"password",			"fill":"word"},
{"type":"checkbox",			"fill":"ticked"},
{"type":"radio",			"fill":"ticked"},
{"type":"button",			"fill":null},
{"type":"submit",			"fill":null},
{"type":"reset",			"fill":null},
{"type":"file",				"fill":null},
{"type":"hidden",			"fill":null},
{"type":"image",			"fill":null},
{"type":"datetime",			"fill":""},
{"type":"datetime-local",	"fill":""},
{"type":"date",				"fill":""},
{"type":"month",			"fill":""},
{"type":"time",				"fill":""},
{"type":"week",				"fill":""},
{"type":"number",			"fill":""},
{"type":"range",			"fill":""},
{"type":"email",			"fill":""},
{"type":"url",				"fill":""},
{"type":"search",			"fill":"text"},
{"type":"tel",				"fill":""},
{"type":"color",			"fill":""}
];
function getParentForm (node) {
	var n=node;
	do{
		if(n.nodeName==='FORM' || n.getAttribute('role')==='form'){
			return n;
		}
		n=n.parentNode;
	}while( n&&n.nodeName!=='BODY' )
	return null;
}
function getInputs (node) {
	var out = [];
	var inputs = node.getElementsByTagName('input');
	var textareas = node.getElementsByTagName('textarea');
	var selects = node.getElementsByTagName('select');
	for(var key in inputs){
		if ( isNormalInteger(key) ) {
			out.push(inputs[key]);
		}
	}
	for(var key in textareas){
		if ( isNormalInteger(key) ) {
			out.push(textareas[key]);
		}
	}
	for(var key in selects){
		if ( isNormalInteger(key) ) {
			out.push(selects[key]);
		}
	}
	return out;
}
function isNormalInteger(str) {
	var n = ~~Number(str);
	return String(n) === str && n >= 0;
}
function processInputs (inputs) {
	var len = inputs.length;
	var out = [];
	for (var i = 0; i < len; i++) {
		var nodeName = inputs[i].nodeName;
		var type = inputs[i].type;
		var classList = inputs[i].classList;
		var placeholder = inputs[i].placeholder;
		var name = inputs[i].name;
		if (nodeName==='INPUT') {
			var fill = getInput(type);
			if(fill!==null &&fill.fill!==null){
				var o = {'node':inputs[i]};
				o.fill = fill.fill;
				out.push( o );
			}
		}else if (nodeName==='TEXTAREA') {
			var o = {'node':inputs[i]};
			var res = getTextareaType( [type,classList,placeholder,name] );
			if(res.dist<4){
				o.fill='word';
			}else{
				o.fill='text';
			}
			out.push( o );
		}else if (nodeName==='SELECT') {
			var o = {'node':inputs[i]};
			o.fill='select';
			o.options=[];
			var options = inputs[i].getElementsByTagName('option');
			for (var j = options.length - 1; j >= 0; j--) {
				o.options.push( options[j].value );
			};
			out.push( o );
		}
	};
	return out;
}
function fillInputs (inputs) {
	var len = inputs.length;
	for (var i = 0; i < len; i++) {
		if(inputs[i].fill==='ticked'){
			inputs[i].node.checked = Math.random()<0.5;
		}else if(inputs[i].fill==='text'){
			var out = '';
			var wordCount = Math.floor(Math.random() * 4) + 10;
			for (var j = 0; j < wordCount; j++) {
				out += getRandomWord();
				if(j!==wordCount-1) out += ' ';
			};
			out = out.charAt(0).toUpperCase() + out.slice(1);
			out[out.length-1]='.';
			inputs[i].node.value = out;
		}else if(inputs[i].fill==='word'){
			var out = getRandomWord();
			out = out.charAt(0).toUpperCase() + out.slice(1);
			inputs[i].node.value = out;
		}else if(inputs[i].fill==='select'){
			inputs[i].node.value = inputs[i].options[ parseInt(Math.random()*inputs[i].options.length-1) ];
		}
	};
}
function getRandomWord (len_min,len_max) {
	var rndtxt = new RandomText();
	return rndtxt.randomWord(len_min,len_max);
}
function getInput (type) {
	var out = null;
	var len = inputTypes.length;
	for (var i = 0; i < len; i++) {
		if(inputTypes[i].type===type){
			out = inputTypes[i];
		}
	}
	return out;
}
function getTextareaType (arg) {
	var minJ = null;
	var minDist = 99999999;
	for (var i = 0; i < a.length; i++) {
		for (var j = 0; j < arg.length; j++) {
			var dist = LevenshteinDistance(a[i],arg[j]);
			if(dist===0){
				return {'i':i,'dist':0};
			}else if(dist<minDist){
				minDist = dist;
				minJ = i;
			}
		}
	}
	return {'i':minJ,'dist':minDist};
}
function LevenshteinDistance(s, t){
	// degenerate cases
	if (s === t) return 0;
	if (s.length == 0) return t.length;
	if (t.length == 0) return s.length;
	// create two work vectors of integer distances
	var v0 = [];
	var v1 = [];
	// initialize v0 (the previous row of distances)
	// this row is A[0][i]: edit distance for an empty s
	// the distance is just the number of characters to delete from t
	for (var i = 0; i < t.length + 1; i++){
		v0[i] = i;
	}
	for (var i = 0; i < s.length; i++){
		// calculate v1 (current row distances) from the previous row v0
		// first element of v1 is A[i+1][0]
		//   edit distance is delete (i+1) chars from s to match empty t
		v1[0] = i + 1;
		// use formula to fill in the rest of the row
		for (var j = 0; j < t.length; j++){
			var cost = (s[i] == t[j]) ? 0 : 1;
			v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
		}
		// copy v1 (current row) to v0 (previous row) for next iteration
		for (var j = 0; j < v0.length; j++){
			v0[j] = v1[j];
		}
	}
	return v1[t.length];
}