const a1 = 1
let a2 = 2
const a3 = [100, 200]

const print = () => {
	console.log('a.js', a1)
	console.log('a.js', a2)
	console.log('a.js', a3)
}

export default {
	a1,
	a2,
	a3,
	print,
}
