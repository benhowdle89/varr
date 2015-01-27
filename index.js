#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var watch = require('watch');

program
	.version('0.0.1')
	.usage('[options] <keywords>')
	.option('-i, --input [input]', 'Input CSS file')
	.option('-o, --output [output]', 'Output filename')
	.parse(process.argv);

var doWatch = program.args;

if (!program.input && !program.output) {
	program.help();
} else if (!program.input || !program.input.length) {
	return console.log('An input file must be specified');
} else {
	initFromCLI();
}

function initFromCLI() {
	if (doWatch.length) {
		runFromWatch();
	}
	start(program.input);
}

function runFromWatch() {
	watch.watchTree('.', {
		filter: function(item) {
			return item == program.input;
		}
	}, function(f, curr, prev) {
		start(program.input);
	});
}

function start(input) {
	readFile(input, function(err, data) {
		if (err) {
			return console.log("File doesn't exist or is unreadable (" + err.path + ")");
		}
		var parsedData = parseData(data);
		if (!parsedData) {
			return console.log("Something went wrong, please check the formatting is correct in your CSS file");
		}
		outputFile(parsedData);
	});
}

function readFile(input, callback) {
	fs.readFile(input, 'utf8', callback);
}

function outputFile(data) {
	var outputPath = program.output || "dist/" + program.input;
	mkdirp(path.dirname(outputPath), function(err) {
		if (err) {
			return console.log(err);
		}
		fs.writeFile(outputPath, data, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Your new file was saved to " + outputPath + " at " + new Date().toString());
			}
		});
	});
}

function parseData(data) {
	var config = {},
		parts = data.split('---');

	if (!parts || !parts.length || !(parts.length > 1)) {
		return null;
	}

	var rawCSS = parts[1].replace(/^\s+|\s+$/g, ''),
		settings = parts[0].split(/\n/).filter(Boolean).forEach(function(line) {
			var splits = line.split(':');
			if (splits.length) {
				var key = splits[0].replace(/\$/, ''),
					value = splits[1].replace(/['";\s]+/g, '');
				config[key] = value;
			}
		});

	if (!rawCSS) {
		return null;
	}

	rawCSS.match(/(\$.+)/g).forEach(function(match) {
		var key = match.replace(/[\$;]/g, '');
		rawCSS = rawCSS.replace(new RegExp("\\$" + key), config[key]);
	});

	return rawCSS;
}