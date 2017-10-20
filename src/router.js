
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const express = require('express')

const app = require('./index.js')
const render = require('./render.js')

let router = express.Router()



router.use((req, res, next) => {

	let filename = path.join(app.rootdir, req.url)

	if (req.url.slice(-5) === '.html') {

		filename = filename.slice(0, -5) + '.pug'

		if (fs.existsSync(filename)) {

			let html = render.renderPugFile(filename)
			res.send(html)

		}

	}

	if (req.url.slice(-4) === '.css') {

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


