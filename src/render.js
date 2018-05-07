const pug = require('pug')
const sass = require('sass')

const now = () => {

	let [s, ns] = process.hrtime()
	return s + ns / 1e9

}


let logPrefix = ' '.repeat(8) + 'render '

function log(msg) {

	console.log(logPrefix + msg)

}

const sassInfo = (str, max = 36) => {

	let info = ` (${str.split('\n').length} lines, ${str.length} chars)`

	str = str.trim().replace(/\s+/g, ' ')

	return (str.length > max ? str.slice(0, max - 3) + '...' : str) + info

}

let pugFilter = {

	sass: data => {

		let dt = -now() * 1e3

		let result = sass.renderSync({
			data,
			indentedSyntax: true,
			outputStyle : 'expanded',
			indentType: 'tab',
			indentWidth: 1,
		})

		dt += now() * 1e3

		log(`${'sass (filter)'.blue} ${sassInfo(data)} ${(dt.toFixed(3) + 'ms').red}`)

		return '\n' + result.css.toString()

	},

	filter: data => {

	},

}

let renderPugFile = function(filename, options = {}) {

	let dt = -now() * 1e3

	let html = pug.renderFile(filename, {

		...options,
		filters: pugFilter,
		pretty: '\t',

	})

	dt += now() * 1e3

	log(`${'pug'.blue} ${filename.replace(process.cwd(), '.')} ${(dt.toFixed(3) + 'ms').red}`)

	return html

}

let renderSassFile = function(filename) {

	let dt = -now() * 1e3

	let result = sass.renderSync({
		file: filename,
		indentedSyntax: true,
		outputStyle : 'expanded',
		indentType: 'tab',
		indentWidth: 1,
	})

	dt += now() * 1e3

	log(`${'sass'.blue} ${filename.replace(process.cwd(), '.')} ${(dt.toFixed(3) + 'ms').red}`)

	return result.css.toString()

}


module.exports = {

	renderPugFile,
	renderSassFile,

}
