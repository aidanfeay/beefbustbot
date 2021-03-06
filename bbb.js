//Landing
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('BeefBustBot\n');
}).listen(process.env.PORT || 5000);

//Bot
var Bot = require('./bot')
  , config = require('./config');

var bot = new Bot(config);

console.log('Beef Bust Bot: Running...');

function coinflip() {
	return Math.random() < 0.5 ? 'BEEF' : 'BUST';
}

var text,
		screen_name,
		id_str,
		tweets = [],
		hashtag = 'BeefOrBustBot';

setInterval(function() {
  bot.twit.get('search/tweets', { q: '%23' + hashtag + ' since:2011-11-11', count: 1 }, function(err, data, response) {
		if (err) return handleError(err);
		if (data.statuses[0] != undefined){
			if (tweets.indexOf(data.statuses[0].id_str) > -1) {
				console.log('Sorry, duplicate tweet...');
			} else {
				id_str = data.statuses[0].id_str;
				text = data.statuses[0].text;
				screen_name = data.statuses[0].user.screen_name;
				tweets.push(id_str);
				var tweet = coinflip() + '! https://twitter.com/' + screen_name + '/status/' + id_str;
				bot.twit.post('statuses/update', { status: tweet }, function (err, data, response) {
				  console.log('Posted: ' + tweet);
				})
			}
		} else {
			console.log('No tweets tagged with #' + hashtag);
		}
	})
}, 5000);

function handleError(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}
