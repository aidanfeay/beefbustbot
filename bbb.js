var Bot = require('./bot')
  , config = require('./config');

var bot = new Bot(config);

console.log('Beef Bust Bot: Running...');

function coinflip() {
	return Math.random() < 0.5 ? 'BEEF' : 'BUST';
}

var text,
		screen_name,
		id_str
		hashtag = 'BeefOrBust';

setInterval(function() {
  bot.twit.get('search/tweets', { q: '%23' + hashtag + ' since:2011-11-11', count: 1 }, function(err, data, response) {
		if (err) return handleError(err);
		if (id_str == data.statuses[0].id_str) {
			console.log('Sorry, duplicate tweet...');
		} else {
			id_str = data.statuses[0].id_str;
			if (id_str != undefined) {
				text = data.statuses[0].text;
				screen_name = data.statuses[0].user.screen_name;
				console.log('Tweeting! (not really): ' + text);
				var tweet = coinflip() + '! https://twitter.com/' + screen_name + '/status/' + id_str;
				// bot.twit.post('statuses/update', { status: tweet }, function (err, data, response) {
				//   console.log('Posted ' + tweet);
				// })
			}
		}
	})
}, 5000);

function handleError(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}
