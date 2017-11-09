
const path = require('path')
const fs = require('fs')
const express = require('express')

const app = require('./index.js')
const render = require('./render.js')

let router = express.Router()

router.get('/reset.css', (req, res) => {

	let filename = path.join(process.cwd(), 'src/reset.css')

	res.sendFile(filename)

})

router.use((req, res, next) => {

	let filename = path.join(app.rootdir, req.url)

	// auto-fetch index.html
	let stats = fs.existsSync(filename) && fs.statSync(filename)
	if (stats && stats.isDirectory())
		filename += 'index.html'

	if (filename.slice(-5) === '.html') {

		filename = filename.slice(0, -5) + '.pug'

		if (fs.existsSync(filename)) {

			let html = render.renderPugFile(filename)
			res.type('html')
			res.send(html)

		}

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


