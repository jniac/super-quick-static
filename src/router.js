
const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const app = require('./index.js')
const render = require('./render.js')

let router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))

router.use(bodyParser.json())

router.use(express.static(path.join(__dirname, 'static')))

router.get('/favicon.ico', (req, res) => {

	let filename = path.join(__dirname, 'images', 'icon.png')

	res.sendFile(filename)

})

router.use('/fonts', express.static(path.join(__dirname, 'fonts')))



let userJsonFilename = path.resolve(__dirname, '..', 'user.json')

// save directory's display options into user.json

let options = fs.existsSync(userJsonFilename) ? JSON.parse(fs.readFileSync(userJsonFilename)) : { directories: {} }

router.post('/dir-options', (req, res) => {

	options.directories[req.body.filename] = req.body.filter

	fs.writeFileSync(userJsonFilename, JSON.stringify(options, null, '\t'))

	res.send('ok')

})









function lookForPug(res, filename) {

	if (!/\.(pug|html)$/.test(filename))
		return false

	filename = filename.replace(/\.html$/, '.pug')

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

function getIndexFiles(filename) {

	let files = fs.readdirSync(filename)

	let array = []

	for (let file of files) {

		if (/^\.DS/.test(file))
			continue

		let stats = fs.statSync(path.join(filename, file))

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

	return array.sort((A, B) => A.sortKey > B.sortKey ? 1 : -1)

}

const lookForHtml = (filename, res) => {

	if (fs.existsSync(filename)) {

		let html = fs.readFileSync(filename, 'utf8')

		res.type('html').send(html)

		return true

	}

	return false

}

const lookForMarkdown = (filename, ext, res) => {

	filename = filename.slice(0, -ext.length) + '.md'

	if (fs.existsSync(filename)) {

		let html = render.renderMarkdownFile(filename)

		res.type('html').send(html)

		return true

	}

	return false

}

router.use((req, res, next) => {

	let filename = path.join(app.rootdir, req.url)
	let ext = path.extname(req.url)

	if (ext === '.html') {

		if (lookForHtml(filename, res))
			return

		if (lookForMarkdown(filename, ext, res))
			return

		if (lookForPug(res, filename))
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

		let html = render.renderPugFile(path.join(__dirname, 'index.pug'), {

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
