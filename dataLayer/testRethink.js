const bluebird = require('bluebird')
const r = require('rethinkdbdash')({
	servers: [{
		host: 'localhost', 
		port: 59201
	}]
})

bluebird.coroutine(function * () {
	try {
		console.log(yield r.db('bgg').table('games').get('1').run())
		yield r.getPoolMaster().drain()
	}
	catch(error) {
		console.log(`Error: ${error}`)
	}
})()