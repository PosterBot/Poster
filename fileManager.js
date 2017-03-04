 var fs = require("fs"),
	_ = require('lodash'),
	winston = require('winston');

module.exports = {
	readDataFromFile: function(path){
		var content = null;
		try{
			var content = fs.readFileSync(path, 'utf8');
		} catch (error){
      winston.log('error', error)
		}
		return content
	},
	readDataFromJson: function(path){
		var content = this.readDataFromFile(path);

		try{
			content = JSON.parse(content);
		} catch (error){
      winston.log('error', error)
		}
		return content
	},
	readStringFromFile: function(filePath){
		var result = this.readDataFromFile(filePath);
		if(result){
			var lines = result.split('\r\n'),
				result = lines.splice(0,1)[0];
			fs.writeFileSync(filePath, lines.join('\r\n'));
		}

		return result;

	},
	getOldTitlesFromFile: function(filePath){
		var result = this.readDataFromFile(filePath),
			lines = [];
		if(result){
			lines = result.split('\r\n');
		}
		return lines
	},
	addNewArrayDataFile: function(newData, filePath){
			var result = this.readDataFromFile(filePath);
			if(result){
				var lines = result.split('\r\n');
					lines = newData.concat(lines);
				fs.writeFileSync(filePath, lines.join('\r\n'));
			}
	}

}
