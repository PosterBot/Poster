var schedule = require('node-schedule'),
	requestManagerBuilder = require('./requestManager'),
	fileManager = require('./fileManager'),
	dataParser = require('./dataParser'),
	winston = require('winston'),
	colors = require('colors'),
	provider = require('./firebaseProvider');

function parseTimeToCron(timeString, periodic){
	var time = timeString.split(':');
	return '12 ' + time[1] + ' ' + time[0] + ' * * ' + periodic
}

module.exports = function(){
		var vkReuqestManager,// = new requestManagerBuilder.getManager('VkManager', settings.vkontakte),
			telegramRequestManager,// = new requestManagerBuilder.getManager('TelegramManager', settings.telegram),
			jobs = [];
			provider.apiKey(provider.API.vk, function(config) {
				vkReuqestManager = new requestManagerBuilder.getManager('VkManager', config)
			});

			provider.apiKey(provider.API.telegram, function(config) {
				telegramRequestManager = new requestManagerBuilder.getManager('TelegramManager', config)
			});

	return {
		setPostTimer: function(publicsSettings){
			for( key in publicsSettings){
				var settings = channelsList[key],
						times = settings.times;
				log('info', "Start timer for vkontakte channel - " + colors.green(key))

				this.cancelJobs(key);
				var post = this.getPostFunction(key, false);

				settings.times.forEach(function(time) {
					appendJob(key, time, post);
				});
			}
		},
		setContentGrabberTimer: function(settings){
			if(settings.times && settings.link){
				var process = function(){
						var request = vkReuqestManager.getTitleLinks(settings.link);
						request.then(function(data){
							var oldTitles = fileManager.getOldTitlesFromFile(settings.resultFile);
							var newPosts = dataParser.parseTitles(data, oldTitles);
							fileManager.addNewArrayDataFile(newPosts, settings.resultFile);
							if(newPosts.length){
								var contetnRequest = vkReuqestManager.getNewContent(newPosts);
								contetnRequest.then(function(data){
									var resultData = [];
									for(var i = 0; i < data.length; i++){
										var result = dataParser.parseNewContent(data[i]);
										resultData = resultData.concat(result);
									}
									if(!Array.isArray(settings.filePath)){
										settings.filePath = [settings.filePath];
									}
									for(var i = 0; i < settings.filePath.length; i++){
										if(i > 0){
											resultData = dataParser.shuffleArray(resultData);
										}
										fileManager.addNewArrayDataFile(resultData, settings.filePath[i])
									}

								}, function(error){
									log('error', error);
								})
							}
						}, function(error){
							log('error', error);
						}
						)
					}
				var task = schedule.scheduleJob(settings.times, process);
				jobs.push(task)
			}

		},
		getPostFunction: function(key, type){
			log('data', 'Create method for ' + colors.green(key) + ' with type - ' + colors.green(type))
			var post = function(){
				provider.getPublication(provider.API.telegram, key ,function(publication) {
					log('data', 'Get publication for ' + colors.green(key) + ' with type - ' + colors.green(type))
					log('data', "Publication: \"" + colors.gray(publication.val()) +"\"")

					var callback = function() {
						// Callback method
						provider.removePublication(provider.API.telegram, key, publication.key)
					}

					if (publication.val()){
						if (type) {
							telegramRequestManager.postData(key, publication.val(), type, callback)
						} else {
							vkReuqestManager.postData(key, publication.val(), callback);
						}
					}
				});
			}
			return post;
		},
		setTelegramPostTimer: function(channelsList){
			for (key in channelsList){
				var settings = channelsList[key],
					times = settings.times;
				log('info', "Start timer for telegram channel - " + colors.green(key))

				var post = this.getPostFunction(key, settings.type);

				this.cancelJobs(key);
				settings.times.forEach(function(time) {
					appendJob(key, time, post);
				});
			}

		},
		listJobsCount: function(){
			log('info', 'Tasks amount ' + jobs.length)
		},
		cancelJobs: function (key) {
			var currentJobs = jobs[key];
			if (currentJobs) {
				log('info', currentJobs.length + ' jobs of ' + colors.green(key) + ' to cancel')
				while (currentJobs.length > 0) {
					currentJobs.pop().cancel();
				}
			} else {
				jobs[key] = [];
			}
		},
		appendJob: function (key, time, task) {
			var cron = parseTimeToCron(time, '0-6');
			log('data', "Cron time " + colors.cyan(time) + ' → ' + colors.gray(cron));
			var job = schedule.scheduleJob(cron, task);
			jobs[key].push(job);
		}
	}

}



function log(level, message) {
  // TODO: Need to create a global method with a enum of message groups
  winston.log(level, colors.yellow("Scheduler"), message)
}
