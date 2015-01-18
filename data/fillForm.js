self.on('click', function (node, data) {
	var form = getParentForm(node);
	if(form){
		var inputs = getInputs( form );
		var list = processInputs(inputs);
		fillInputs(list);
	}else{
		console.log('no form');
	}
	self.postMessage(node);
});