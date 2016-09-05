'use strict'

var db = new PouchDB('http://localhost:5984/bgg');

var getAverageRating = function(startKey, endKey) {
	var idSet = [];
	db.query('averageRating', { startkey: startKey, endkey: endKey }).then(function (result) {
  	result.rows.forEach(function(v) {
  		idSet.push(v.id);
  	});
  	return idSet;
	}).catch(function (err) {
  	console.log(err);
	});
};

var getNumberOwned = function(startKey, endKey) {
	var idSet = [];
	db.query('owned', { startkey: startKey, endkey: endKey }).then(function (result) {
  	result.rows.forEach(function(v) {
  		idSet.push(v.id);
  	});
  	//intersect(idSet);
	}).catch(function (err) {
  	console.log(err);
	});
};


var getName = function(game) {
	return game.name.value;
};

var getYearPublished = function(game) {
	return game.yearPublished;
};

var getMechanics = function(game) {
	var mechanics = [];
	game.categories.forEach(function(v) {
		if(v.type === 'boardgamemechanic') {
			mechanics.push(v.value);
		}
	});
	return mechanics;
};

var getDesigners = function(game) {
	var designers = [];
	game.categories.forEach(function(v) {
		if(v.type === 'boardgamedesigner') {
			designers.push(v.value);
		}
	});
	return designers;
};

var getCategories = function(game) {
	var categories = [];
	game.categories.forEach(function(v) {
		if(v.type === 'boardgamecategory') {
			categories.push(v.value);
		}
	});
	return categories;
};

var getMinPlayers = function(game) {
	return game.players.minPlayers;
};

var getMaxPlayers = function(game) {
	return game.players.maxPlayers;
};

var getPlayTime = function(game) {
	return game.playingtime.value;
};

var getMinPlayTime = function(game) {
	return game.minplaytime.value;
};

var getMaxPlayTime = function(game) {
	return game.maxplaytime.value;
};

// var getNumberOwned = function(game) {
// 	return game.owned;
// };

var getUsersRated = function(game) {
	return game.statistics.rating.votes;
};

var getWeightsRated = function(game) {
	return game.statistics.weight.totalVotes;
}

// var getAverageRating = function(game) {
// 	return game.statistics.rating.strictAverage;
// };

var getBayesAverageRating = function(game) {
	return game.statistics.rating.bayesAverage;
};

var getAverageRatingStdDev = function(game) {
	return game.statistics.rating.stdDeviation;
};

var getWeightAverage = function(game) {
	return game.statistics.weight.averageWeight;
};

//TODO Poll information -- number of players recommended, etc

var getMinFilter = function() {
  return minFilter;
};

var getMaxFilter = function() {
  return maxFilter;
};

var numberPlayerFilter = function(element) {
  var minPlayers = element.players.minPlayers,
  		maxPlayers = element.players.maxPlayers,
  		minFilter = getMinFilter(),
  		maxFilter = getMaxFilter();

  return minPlayers > minFilter && maxPlayers < maxFilter;

};
