
// rendering SASS & PUG
// TODO: cached results using pug.compile instead of pug.render

const { dirname, join } = require('path')
const pug = require('pug')
const sass = require('sass')

const { log, now, solveRgba, safeLoad, sassInfo } = require('./render.utils.js')



let pugFilter = {

	sass: data => {

		let dt = -now() * 1e3

		data = solveRgba(data)

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

	let data = safeLoad(filename)

	let dir = dirname(filename)

	data = data
		.replace(/@import '(.*)'/g, (_, path) => safeLoad(join(dir, path)) + '\n')

	let preDt = now() * 1e3 + dt

	let result = sass.renderSync({
		data,
		indentedSyntax: true,
		outputStyle : 'expanded',
		indentType: 'tab',
		indentWidth: 1,
	})

	dt += now() * 1e3

	log(`${'sass'.blue} ${filename.replace(process.cwd(), '.')} ${(dt.toFixed(3) + 'ms').red} (${preDt.toFixed(3)}ms)`)

	return result.css.toString()

}


module.exports = {

	renderPugFile,
	renderSassFile,

}
