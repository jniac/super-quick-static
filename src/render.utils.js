const fs = require('fs')
const { dirname, join } = require('path')

const logPrefix = ' '.repeat(8) + 'render '

const log = msg => console.log(logPrefix + msg)

const now = () => {

	let [s, ns] = process.hrtime()
	return s + ns / 1e9

}

const trunc = (str, max, { keepTrail = true, ellipsis = '...'} = {}) => {

	if (str.length < max)
		return str

	return keepTrail ? ellipsis + str.slice(str.length - max + ellipsis.length) : str.slice(0, max - ellipsis.length) + ellipsis

}

const rgba = str => {

	if (str[0] === '#')
		str = str.slice(1)

	let r = Number(`0x${str[0]}`) / 0xf * 0xff
	let g = Number(`0x${str[1]}`) / 0xf * 0xff
	let b = Number(`0x${str[2]}`) / 0xf * 0xff
	let a = Number(`0x${str[3]}`) / 0xf

	return `rgba(${r.toFixed()},${g.toFixed()},${b.toFixed()},${a.toFixed(3)})`

}

const rrggbbaa = str => {

	if (str[0] === '#')
		str = str.slice(1)

	let r = Number(`0x${str.slice(0,2)}`)
	let g = Number(`0x${str.slice(2,4)}`)
	let b = Number(`0x${str.slice(4,6)}`)
	let a = Number(`0x${str.slice(6,8)}`) / 0xff

	return `rgba(${r.toFixed()},${g.toFixed()},${b.toFixed()},${a.toFixed(3)})`

}

const solveRgba = str => str
	.replace(/#[0-9a-fA-F]{4}\b/g, rgba)
	.replace(/#[0-9a-fA-F]{8}\b/g, rrggbbaa)

const spaceToTabs = (str, tabLength = 4) => (

	str.replace(/\n( +)(\S)/g, (_, g1, g2) => '\n' + '\t'.repeat(g1.length / tabLength) + g2)

)

const safeLoad = filename => {

	let str = fs.readFileSync(filename, 'utf8')

    str = solveRgba(str)

	let match = str.match(/\n +\S/)

	if (!match)
		return str

	log(`${'warn:'.red} ${trunc(filename, 30).cyan} contains spaces instead of tabs`)

	let tabLength = match[0].length - 2

	return spaceToTabs(str, tabLength)

}

const sassInfo = (str, max = 36) => {

	let info = ` (${str.split('\n').length} lines, ${str.length} chars)`

	str = str.trim().replace(/\s+/g, ' ')

	return (str.length > max ? str.slice(0, max - 3) + '...' : str) + info

}

module.exports = {

    log,
    now,
	trunc,
	rgba,
    rrggbbaa,
    solveRgba,
    spaceToTabs,
    safeLoad,
    sassInfo,

}
