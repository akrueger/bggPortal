const fs = require('graceful-fs');

fs.readFile('gameKeys.json', (error, data) => {
	if(error) throw error
	const keys = JSON.parse(data).sort((a, b) => a - b)
	console.log(keys.length);
	fs.writeFile('gamesKeysSorted.json', keys, error => {
			if(error) throw error
			console.log('Data saved!')	
	})
})



