var constants = require('./constants'),
	_ = require('lodash'),
	shuffle = require('lodash.shuffle'),
	winston = require('winston');

var jsdom = require('jsdom').jsdom,
	myWindow = jsdom().defaultView,
	$ = require('jquery')(myWindow);

module.exports = {
	parsePostString: function(postData, postType){
		var dataList,
			result;
		switch(postType){
			case constants.links:
				dataList = postData.split(' ');
				result = {
					link: dataList.splice(0,1)[0],
					message: dataList.join(' ')
				};
				break;
			default:
				result = null;
		}
		return result;
	},
	parseTitles: function(body, titles){
		winston.log('info', $(body).find('.content_left.search-page .post__title_link'));
		var items = $(body).find('.post__title_link');
		items = _.map(items,function(el){return $(el).attr('href')});
		var newPosts = _.difference(items,titles);
		return newPosts;
	},
	parseNewContent: function(body){

	var $body = $(body),
		$a = $body.find('a'),
		arr = [],
		resultArr = [],
		lastEl = $body.find('a[name=intresting]');
    if (!lastEl.length) {
        var links = $body.find('.content a');
        for (var i = 0; i < links.length; i++) {
            if ($(links[i]).text().indexOf('Дайджест за прошлую неделю') > -1) {
                lastEl = $(links[i]);
                break;
            }
        }
    }

    var lastIndex = $a.index(lastEl);
		winston.log('info', lastIndex)
    $body.find('.post__body_full li a').each(function() {
        var elementOffset = $(this);
        if ($a.index(elementOffset) < lastIndex) {
            arr.push({
                link: $(this).attr('href'),
                text: $(this).text()
            })
        }
    });

	for (var i = 0; i < arr.length; i++) {
		resultArr.push(arr[i].link + ' ' + arr[i].text)
	}
	resultArr = this.shuffleArray(resultArr);
	return resultArr;
	},
	shuffleArray: function(data){
		return shuffle(data);
	}
}
