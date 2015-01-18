var contextForm = require("sdk/context-menu");
var menuItemForm = contextForm.Item({
	label: "Fill Form", 
	context: contextForm.SelectorContext("form, *[role=form]"),
	contentScriptFile: ['./wordGeneration.js','./randomFill.js','./fillForm.js'],
	accessKey: "f"
});
var contextItem = require("sdk/context-menu");
var menuItemItem = contextItem.Item({
	label: "Fill Item", 
	context: contextItem.SelectorContext("input, textarea, select"),
	contentScriptFile: ['./wordGeneration.js','./randomFill.js','./fillItem.js'],
	accessKey: "i"
});
