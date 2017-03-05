var fileManager = require('./fileManager')
	winston = require('winston'),
	colors = require('colors'),
	provider = require('./firebaseProvider');

winston.cli();

	provider.init(function() {
		var scheduler = require('./scheduler')();
		provider.getChannels(provider.API.telegram, function(list) {
			scheduler.setTelegramPostTimer(list)
		});
	});

	function log(level, message) {
	  // TODO: Need to create a global method with a enum of message groups
	  winston.log(level, colors.magenta("Main"), message)
	}
