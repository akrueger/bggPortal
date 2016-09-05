const bgg = require('bgg')
const fs = require('graceful-fs')

const games = [99]

bgg('thing items', {id: games, type: 'boardgame', stats: 1}).then(results => {
	const allItems = JSON.stringify(results.items)

	fs.writeFile('singleGames.json', allItems, error => {
		if(error) throw error
		console.log('Data saved!')
	})
})