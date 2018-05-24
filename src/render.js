
// rendering SASS & PUG
// TODO: cached results using pug.compile instead of pug.render

const fs = require('fs')
const { dirname, join } = require('path')
const pug = require('pug')
const sass = require('sass')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

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



const renderPugFile = (filename, options = {}) => {

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

const renderSassFile = filename => {

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

const renderMarkdownFile = filename => {

	let dt = -now() * 1e3

	let str = fs.readFileSync(filename, 'utf8')

	let html =
`<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <title></title>
		<link rel="stylesheet" href="/github-markdown.css">
		<style>
			.markdown-body {
				box-sizing: border-box;
				min-width: 200px;
				max-width: 980px;
				margin: 0 auto;
				padding: 45px;
			}

			@media (max-width: 767px) {
				.markdown-body {
					padding: 15px;
				}
			}
		</style>
    </head>
    <body>
		<article class="markdown-body">
        	${md.render(str)}
		</article>
    </body>
</html>`

	dt += now() * 1e3

	log(`${'markdown'.blue} ${filename.replace(process.cwd(), '.')} ${str.length}chars ${(dt.toFixed(3) + 'ms').red}`)

	return html

}


module.exports = {

	renderPugFile,
	renderSassFile,
	renderMarkdownFile,

}
