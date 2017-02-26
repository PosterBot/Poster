var schedule = require('node-schedule'),
	requestManagerBuilder = require('./requestManager'),
	fileManager = require('./fileManager'),
	dataParser = require('./dataParser');

function parseTimeToCron(timeString, periodic){
	var time = timeString.split(':');
	return '12 ' + time[1] + ' ' + time[0] + ' * * ' + periodic
}

module.exports = function(settings){
		var vkReuqestManager = new requestManagerBuilder.getManager('VkManager', settings.vkSettings),
			telegramRequestManager = new requestManagerBuilder.getManager('TelegramManager', settings.telegramSettings),
			jobs = [];
		
	return {
		setPostTimer: function(publicsSettings){
		
			for( publicItem in publicsSettings){
				var settings = publicsSettings[publicItem];
				console.log(settings.publicId);
				for(var i = 0; i < settings.times.length; i++){
					var time = parseTimeToCron(settings.times[i], '1-7');
					console.log('---', settings.times[i])
					var task = schedule.scheduleJob(time, function(){
							var postData = fileManager.readStringFromFile(settings.filePath),
								requestData;
							if(postData){
								requestData = dataParser.parsePostString(postData, settings.type);
								if(requestData){
									vkReuqestManager.postData(requestData, settings.publicId);
								}
							}
							
						})
					jobs.push(task)
				}
			
			}
		},
		setContentStealerTimer: function(settings){
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
									console.error(error);
								})
							}
						}, function(error){
							console.error(error);
						}
						)
					}
				var task = schedule.scheduleJob(settings.times, process);
				jobs.push(task)
			}
					
		},
		setTelegramPostTimer: function(channelsList){
			for (key in channelsList){
				var settings = channelsList[key],
					times = settings.times;
				console.log(key)

				function getPostFunction(key, settings){
					var post = function(){
						var data = fileManager.readStringFromFile(settings.filePath);
						console.log(data)
						
						if (data){
							
							var newData = dataParser.parsePostString(data, settings.type);
							var request = telegramRequestManager.postData(key, newData, settings.type)
						}
						
					}
					return post
				}
				var post = getPostFunction(key, settings);
				for(var i = 0; i < times.length; i++){
					var time = parseTimeToCron(settings.times[i], '0-7');
					console.log('---', settings.times[i])
					var task = schedule.scheduleJob(time, post);
					jobs.push(task);
				}
			}

		},
		listJobsCount: function(){
			console.log('Tsks count: ', jobs.length)
		}
	}

}