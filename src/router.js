
const Path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const app = require('./index.js')
const render = require('./render.js')

let router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

router.use(bodyParser.json())

router.use(express.static(Path.join(__dirname, 'static')))

router.get('/favicon.ico', (req, res) => {

	let filename = Path.join(__dirname, 'images', 'icon.png')

	res.sendFile(filename)

})

router.use('/fonts', express.static(Path.join(__dirname, 'fonts')))



let userJsonFilename = Path.resolve(__dirname, '..', 'user.json')

// save directory's display options into user.json

let options = fs.existsSync(userJsonFilename) ? JSON.parse(fs.readFileSync(userJsonFilename)) : { directories: {} }

router.post('/dir-options', (req, res) => {

	options.directories[req.body.filename] = req.body.filter

	fs.writeFileSync(userJsonFilename, JSON.stringify(options, null, '\t'))

	res.send('ok')

})









function lookForPug(filename, res) {

	if (!/\.(pug|html)$/.test(filename))
		return false

	filename = filename.replace(/\.html.*/, '.pug')

	if (fs.existsSync(filename)) {

		let html = render.renderPugFile(filename)

		res.type('html').send(html)

		return true

	}

	return false

}

function ext(filename) {

	let a = filename.match(/\.\w+$/)

	return a ? a[0].slice(1) : ''

}

// https://stackoverflow.com/questions/2802341/javascript-natural-sort-of-alphanumerical-strings/38641281
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator
const collator = new Intl.Collator(undefined, { numeric:true, sensitivity:'base' })

function getIndexFiles(filename) {

	let files = fs.readdirSync(filename)

	let array = []

	for (let file of files) {

		if (/^\.DS/.test(file))
			continue

		let stats = fs.statSync(Path.join(filename, file))

		array.push({

			name: file + (stats.isDirectory() ? '/' : ''),
			type: stats.isDirectory() ? 'dir' : 'file',
			ext: ext(file),

		})

		if (/\.pug$/.test(file)) {

			array.push({

				name: file.replace(/\.pug$/, '.html'),
				type: 'file',
				'superFile': true,
				ext: 'html',

			})

		}

		if (/\.sass$/.test(file)) {

			array.push({

				name: file.replace(/\.sass$/, '.css'),
				type: 'file',
				'superFile': true,
				ext: 'css',

			})

		}

		if (/\.md$/.test(file)) {

			array.push({

				name: file.replace(/\.md/, '.html'),
				type: 'file',
				'superFile': true,
				ext: 'html',

			})

		}

	}

	for (let file of array) {

		// { name: '.git/', type: 'dir', ext: 'git' }
		// { name: 'package.json', type: 'file', ext: 'json' }

		let { name, type, superFile } = file

		name = type === 'folder' ? name : name.replace(/\.\w{1,4}$/, '')

		file.sortKey = `${type}-${name.toLowerCase()}-${superFile ? 'superFile' : ''}`
	}

	// return array.sort((A, B) => A.sortKey > B.sortKey ? 1 : -1)
	return array.sort((A, B) => collator.compare(A.sortKey, B.sortKey))
}

const lookForHtml = (filename, res) => {

	if (fs.existsSync(filename)) {

		let html = fs.readFileSync(filename, 'utf8')

		res.type('html').send(html)

		return true

	}

	return false

}

const lookForMarkdown = (filename, res) => {

	filename = filename.replace(/\.\w+/, '.md')

	if (fs.existsSync(filename)) {

		let html = render.renderMarkdownFile(filename)

		res.type('html').send(html)

		return true

	}

	return false

}

router.use((req, res, next) => {

	let filename = Path.join(app.rootdir, req.path)
	let ext = req.path.slice(-5)

	if (req.path.slice(-5) === '.html') {

		if (lookForHtml(filename, res))
			return

		if (lookForMarkdown(filename, res))
			return

		if (lookForPug(filename, res))
			return

	}

	let stats = fs.existsSync(filename) && fs.statSync(filename)

	// auto-fetch index.html|pug
	// disabled for the moment, shoud be an option
	// if (stats && stats.isDirectory() && lookForPug(res, filename + 'index.html'))
	// 	return

	// assuming that index.html|pug has not been found,
	// we can render a raw index
	if (stats && stats.isDirectory()) {

		let files = getIndexFiles(filename)

		let html = render.renderPugFile(Path.join(__dirname, 'index.pug'), {

			files,
			dir: filename,
			filter: options.directories[filename],

		})

		res.type('html').send(html)

		return

	}

	if (filename.slice(-4) === '.css') {

		filename = filename.slice(0, -4) + '.sass'

		if (fs.existsSync(filename)) {

			let css = render.renderSassFile(filename)

			res.type('css')
			res.send(css)

		}

	}

	next()

})

module.exports = {

	router,

}
