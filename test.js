const rp = require('request-promise')
const rateLimit = require('function-rate-limit')
const parseString = require('xml2js').parseString
const fs = require('graceful-fs')

const urlBase = 'https://www.boardgamegeek.com/xmlapi2/thing?type=boardgame&stats=1&id='
const ids = '1'
const idString = `${ids}`
const timeInterval = 5000

const allGames = []

const getBoardGames = rateLimit(1, timeInterval, ids => {
	rp(`${urlBase}${ids}`)
		.then(response => {
			let games = undefined
			parseString(response, { attrkey: '' }, (error, result) => {
				games = result.items.item
			})
			if(games) {
				games.forEach(element => {
					console.log(JSON.stringify(element))
					if(element.id) {
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
					}
				})
			}
			else {
				console.log('No games found!')
			}
		})
		.catch(error => {
			console.log(error)
		})
		.finally(() => {
			console.log(allGames)
		})
})

getBoardGames(ids)
