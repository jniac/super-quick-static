
const path = require('path')
const fs = require('fs')
const express = require('express')

const app = require('./index.js')
const render = require('./render.js')

let router = express.Router()

router.get('/reset.css', (req, res) => {

	let filename = path.join(__dirname, 'reset.css')

	res.sendFile(filename)

})

router.get('/favicon.ico', (req, res) => {

	let filename = path.join(__dirname, 'icon.png')

	res.sendFile(filename)

})

router.use('/iconmonstr', express.static(path.join(__dirname, 'iconmonstr')))





function lookForPug(res, filename) {

	if (!/\.(?:pug|html)$/.test(filename))
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

	let out = []

	for (let file of files) {

		if (/^\.DS/.test(file))
			continue

		let stats = fs.statSync(path.join(filename, file))

		out.push({

			name: file + (stats.isDirectory() ? '/' : ''), 
			type: stats.isDirectory() ? 'dir' : 'file',
			ext: ext(file),

		})

		if (/\.pug$/.test(file)) {

			out.push({

				name: file.replace(/\.pug$/, '.html'),
				type: 'super-file',
				ext: 'html',

			})

		}

		if (/\.sass$/.test(file)) {

			out.push({

				name: file.replace(/\.sass$/, '.css'),
				type: 'super-file',
				ext: 'css',

			})

		}

	}

	return out.sort((A, B) => {

		return A.type === 'dir' ? (B.type === 'dir' ? 0 : -1) : (B.type === 'dir' ? 1 : 0)

	})

}

router.use((req, res, next) => {

	let filename = path.join(app.rootdir, req.url)

	if (lookForPug(res, filename))
		return

	let stats = fs.existsSync(filename) && fs.statSync(filename)
	
	// auto-fetch index.html|pug
	// disabled for the moment, shoud be an option
	// if (stats && stats.isDirectory() && lookForPug(res, filename + 'index.html'))
	// 	return

	// assuming that index.html|pug has not been found,
	// we can render a raw index
	if (stats && stats.isDirectory()) {

		let files = getIndexFiles(filename)

		let html = render.renderPugFile(path.join(__dirname, 'index.pug'), { dir: filename, files })

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


