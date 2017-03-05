var fileManager = require('./fileManager'),
	scheduler,
	winston = require('winston'),
	colors = require('colors'),
	provider = require('./firebaseProvider');
winston.cli();

var publicsFile = './settings/vkpublic.json',
	contentGrabberFile = './settings/contentGrabber.json',
	channelsFile = './settings/telegramchannel.json',
	publicsList = fileManager.readDataFromJson(publicsFile),
	//grabberSettings, = fileManager.readDataFromJson(contentGrabberFile),
	channelsList = fileManager.readDataFromJson(channelsFile),
	scheduler;

	provider.init(function() {
		scheduler = require('./scheduler')();
		provider.getChannels(provider.API.telegram, function(list) {
			scheduler.setTelegramPostTimer(list)
		});

		provider.getPublication(provider.API.telegram, "testChannelJem" ,function(publication) {
			log('info', "Publication: " + publication)
		});
	});

	/*if(settings && publicsList){
		scheduler = require('./scheduler')(settings);
		scheduler.setPostTimer(publicsList);
	} else {
		winston.log('error', 'error file reading -> exit')
	}*/

	/*if(settings && channelsList){
		if(!scheduler){
			scheduler = require('./scheduler')(settings);
		}
		scheduler.setTelegramPostTimer(channelsList)

	}*/

	/*if(grabberSettings){
		for(prop in grabberSettings){
			scheduler.setContentGrabberTimer(grabberSettings[prop]);
		}
	}*/

	function log(level, message) {
	  // TODO: Need to create a global method with a enum of message groups
	  winston.log(level, colors.magenta("Main"), message)
	}
