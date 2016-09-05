const rateLimit = require('function-rate-limit'),
			fs = require('graceful-fs'),
			moment = require('moment'),
			chunk = require('lodash.chunk')

let endpointsStart = 1,
		endpointsEnd = 200001, // 200001
		endpointsBatch = 400, // 400
		endpointsInterval = (endpointsEnd - endpointsStart) / endpointsBatch,
		endpointsCurrentInterval = 0,
		timeInterval = 3000, // 3000
		batch = 0

const setup = () => {
	// Setup work
	console.log('Removing gameKeys.json')
	fs.openSync('./json/gameKeys.json', 'w')
	fs.appendFileSync('./json/gameKeys.json', '[')
	console.log('Starting process...')

	// Create ID list for API call
	const masterArray = []
	for(let i = endpointsStart; i < endpointsEnd; i += 1) {
		masterArray.push(i)
	}
	// Form Endpoints List array chunked by the batch value
	const chunkList = chunk(masterArray, endpointsBatch)
	// Execute API call for each chunk in the Endpoints List
	chunkList.map(batch => bggAPICall(batch))
}

// Execute API call
const bggAPICall = rateLimit(1, timeInterval, chunkList => {
	bgg('thing items', {id: chunkList, type: 'boardgame', stats: 1}).then(response => {
		const inputGames = response.items.item
		if(inputGames) {
			// Check if chunk is alone (object) rather than an array
			if(Object.prototype.toString.call(inputGames) === '[object Object]') {
				// Put object inside array so forEach can process it
				inputGames = [inputGames]
			}
			inputGamesSize = inputGames.length
			// Build data structure
			inputGames.forEach((element, index, array) => {
				// Check for missing IDs
				if(!element.id) {
					return console.log('Missing ID: ' + element.name)
				}
				if(index === inputGamesSize - 1 && batch >= endpointsInterval - 1) {
					fs.appendFile('./json/gameKeys.json', `${element.id}`, error => {
						if(error) throw error
					})
				}
				else {
					fs.appendFile('./json/gameKeys.json', `${element.id},`, error => {
						if(error) throw error
					})
				}
			})
		}
		else {
			console.log('Endpoint data failure')
		}
		// Update intervals processed
		batch += 1
		console.log(`Batch ${batch} processed`)
		// Log
		utilityLog.reportProgress()
		// Process finished, append ] to array
		if(batch >= Math.ceil(endpointsInterval)) {
			arrayBracketClose()
		}
	})
})

const arrayBracketClose = () => {
	fs.appendFile('./json/gameKeys.json', ']', error => {
		if(error) throw error
		sortGameKeys()
	})
}

const sortGameKeys = () => {
	fs.readFile('./json/gameKeys.json', (error, data) => {
		if(error) throw error
		const keys = JSON.parse(data).sort((a, b) => a - b)
		console.log(`Keys: ${keys.length}`);
		fs.writeFile('./json/gameKeys.json', JSON.stringify(keys), error => {
			if(error) throw error
			console.log('Keys sorted')	
		})
	})
}

// Log utilities
const utilityLog = {
	reportProgress() {
		console.log(`${utilityLog.currentTime()} - Intervals: ${batch} - Game sets: ${batch * endpointsBatch} - Progress: ${utilityLog.percentComplete()}% complete - Time remaining: ${utilityLog.timeRemaining()} minutes`)
	},
	currentTime() {
		return moment().format('MM-DD-YYYY HH:mm:ss')
	},
	percentComplete() {
		if((batch / endpointsInterval * 100) >= 100) {
			return 100
		}
		else {
			return (batch / endpointsInterval * 100).toFixed(1)
		}	
	},
	timeRemaining() {
		return ((endpointsInterval - batch) * (timeInterval / 1000) / 60).toFixed(1)
	}
}

// Start process
setup()
