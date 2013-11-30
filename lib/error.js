"use strict";

module.exports = function (msg){
	var error = new Error (msg);
	error.name = "BinaryReaderError";
	return error;
};