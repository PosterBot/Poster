var fileManager = require('./fileManager'),
	scheduler,
	winston = require('winston'),
	provider = require('./firebaseProvider');
winston.cli();

var settingFile = './settings/settings.json',
	publicsFile = './settings/vkpublic.json',
	contentGrabberFile = './settings/contentGrabber.json',
	channelsFile = './settings/telegramchannel.json'
	settings = fileManager.readDataFromJson(settingFile),
	publicsList = fileManager.readDataFromJson(publicsFile),
	//grabberSettings, = fileManager.readDataFromJson(contentGrabberFile),
	channelsList = fileManager.readDataFromJson(channelsFile),
	scheduler;

	provider.init(function() {
		scheduler = require('./scheduler')();
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
