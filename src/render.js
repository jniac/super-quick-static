const pug = require('pug')
const sass = require('node-sass')

const time = () => {

	let [s, ns] = process.hrtime()
	return s + ns / 1e9

}


let logPrefix = ' '.repeat(8) + 'render '

function log(msg) {

	console.log(logPrefix + msg)

}

let pugFilter = {

	sass(data) {

		let result = sass.renderSync({ 
			data,
			indentedSyntax: true,
			outputStyle : 'expanded',
			indentType: 'tab',
			indentWidth: 1,
		})

		return '\n' + result.css.toString()

	},

}

let renderPugFile = function(filename) {

	let dt = -time() * 1e3

	let html = pug.renderFile(filename, { 

		filters: pugFilter,
		pretty: '\t',

	})

	dt += time() * 1e3

	log(`${'pug'.blue} ${filename.replace(process.cwd(), '.')} ${(dt.toFixed(3) + 'ms').red}`)

	return html

}

let renderSassFile = function(filename) {

	let dt = -time() * 1e3

	let result = sass.renderSync({
		file: filename,
		indentedSyntax: true,
		outputStyle : 'expanded',
		indentType: 'tab',
		indentWidth: 1,
	})

	dt += time() * 1e3

	log(`${'sass'.blue} ${filename.replace(process.cwd(), '.')} ${(dt.toFixed(3) + 'ms').red}`)

	return result.css.toString()

}


module.exports = {

	renderPugFile,
	renderSassFile,

}