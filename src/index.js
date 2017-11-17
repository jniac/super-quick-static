#!/usr/bin/env node

require('colors')

const path = require('path')
const fs = require('fs')
const express = require('express')



// - - -



const args = process.argv.slice(2).reduce((acc, arg) => {

	let [k, v] = arg.split('=')
	acc[k] = v === undefined ? true : /true|false/.test(v) ? v === 'true' : /\d+/.test(v) ? Number(v) : v
	return acc

}, {})

let [port = 8000] = process.argv.slice(2).filter(v => /\d+/.test(v)).map(parseFloat)
let [rootdir = '.'] = process.argv.slice(2).filter(v => /\.|\//.test(v))

rootdir = path.resolve(process.cwd(), rootdir)

if (!fs.existsSync(rootdir)) {

	console.log(`${rootdir.red} is not a valid folder`)
	process.exit()

}



// - - -



let app = express()


Object.assign(app, {

	port,
	rootdir,

})

module.exports = app

app.use(express.static(rootdir, {

	dotFiles: 'allow',

	setHeaders: function (res, path, stat) {

		if(/\.pug$/.test(path)) {

			res.set('Content-Type', 'text/plain')
			res.removeHeader('Content-Disposition')

		}
	
	},

}))

app.use(require('./router.js').router)

function tryServer() {

	app.listen(port, () => {

		let localhost = `http://localhost:${port}`

		console.log(`    serving ${rootdir.blue}`)
		console.log(`    over ${localhost.red}`)

	}).on('error', e => {

		if (e.code === 'EADDRINUSE') {

			if (args.auto) {
				
				console.log(`    (auto) the port ${port} is already used...`)
				
				port++

				if (port < 65536)
					tryServer()

			} else {

				console.log(`    oups! the port ${port} is already in use!`.red)

			}

		} else {

			console.log(e)

		}

	})
	
}

tryServer()


