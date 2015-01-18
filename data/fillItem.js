self.on('click', function (node, data) {
	var inputs = [node];
	var list = processInputs(inputs);
	fillInputs(list);
	self.postMessage(node);
});