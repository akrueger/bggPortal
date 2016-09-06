const	rateLimit = require('function-rate-limit'),
			fs = require('graceful-fs'),
			moment = require('moment'),
			chunk = require('lodash.chunk')

let keys = JSON.parse(fs.readFileSync('./backupJSON/gameKeys.json')),
		batch = 0,
		chunkSize = 10,
		chunksList = chunk(keys, chunkSize),
		intervals = chunksList.length,
		timeInterval = 5000,
		allGames = []

// Execute API call
const bggFetch = rateLimit(1, timeInterval, chunk => {
	bgg('thing items', {id: chunk, type: 'boardgame', stats: 1})
		.then(results => {
			let inputGames = results.items.item
			if(inputGames) {
				// Check if chunk is alone (object) rather than an array
				if(Object.prototype.toString.call(inputGames) === '[object Object]') {
					// Put object inside array so forEach can process it
					inputGames = [inputGames]
				}
				// Build data structure
				inputGames.forEach(element => {
					// Clean up names
					if(Array.isArray(element.name)) {
						element.name = element.name[0].value
					}
					else {
						element.name = element.name.value
					}
					console.log(`${element.id} - ${element.name}`)
					allGames.push({
						'_id': element.id.toString(),
						'date': moment().format('YYYY-DD-MM'),
						'name': element.name,
						'thumbnail': element.thumbnail,
						'yearPublished': element.yearpublished.value,
						'minMaxPlayers': {
							'minPlayers': element.minplayers.value,
							'maxPlayers': element.maxplayers.value
						},
						'recommendedNumberPlayers': {
							'totalVotes': element.poll[0].totalvotes,
							'results': element.poll[0].results
						},
						'playingTime': {
							playTime: element.playingtime.value,
							minPlayTime: element.minplaytime.value,
							maxPlayTime: element.maxplaytime.value
						},
						'categories': element.link,
						'owned': element.statistics.ratings.owned.value,
						'statistics': {
							'rating': {
								'votes': element.statistics.ratings.usersrated.value,
								'strictAverage': element.statistics.ratings.average.value,
								'bayesAverage': element.statistics.ratings.bayesaverage.value,
								'stdDeviation': element.statistics.ratings.stddev.value
							},
							'weight': {
								'totalVotes': element.statistics.ratings.numweights.value,
								'averageWeight': element.statistics.ratings.averageweight.value
							}
						}
					})
				})
			}
			else {
				console.log('Miss!')
			}
		})
		.then(result => {
			console.log(`***** ${allGames.length} - ${keys.length} - Intervals: ${intervals} - ${(allGames.length / keys.length * 100).toFixed(1)}%`)
			batch += 1
			console.log(`Batch ${batch} processed`)
			if(batch === Math.ceil((keys.length / chunkSize))) {
				console.log('Writing file...')
				writeFile()
			}
		})
})

const writeFile = () => {
	allGames = JSON.stringify(allGames)
	fs.writeFile('games.json', allGames, error => {
		if(error) {
			throw error
		}
		console.log('Data saved') 
	})
}

// Start process
chunksList.forEach(chunk => {
	bggFetch(chunk)
})
