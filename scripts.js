function get_tweets(handle) {
	return fetch('https://cors-anywhere.herokuapp.com/https://api.twitter.com/1.1/search/tweets.json?count=100&q=from:'+handle,
			{headers: {'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAAIXDwEAAAAAFvfiGjjw%2FjuTVWe4EMqT%2FYb5beo%3DH9bUPE9mRtMRdpM7FpqKb7d2OBq0pj8rucu2HJXQ3ONBGEYPjt'}})
		.then(response => response.json())
		.then(results => results.statuses.map(tweet => tweet.text)) // Extract tweet text
		.then(tweets => tweets.filter(tweet => !tweet.match(/^RT/))); // Remove retweets
}

var lang = 'en';
function get_wiki_summary(article) {
	return fetch(`https://cors-anywhere.herokuapp.com/https://${lang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${article}`)
		.then(response => response.json())
		.then(result => Object.values(result.query.pages)[0].extract);
}


// Returns a promise that resolves to an Object:
// match => {song: "...", artist: "..."}
function lyric_search(query) {
	query = query.replace(/ https:\/\/t.co\/.*/, '');
	return fetch('https://api.genius.com/search?access_token=BNwqvTnBfSTPD03aV6lXHbj2pcXlgc_G8VJHWH1A2PvuvW4ZToe15npYpcjsai7U&q='+query)
		.then(response => response.json())
		.then((data) => {
			let result = data.response.hits[0].result;
			return {song: result.title, artist: result.primary_artist.name};
		})
		.catch(error => null);
}

function ellipsis(string, max_length) {
	if (string.length < max_length)
		return string;
	else
		return string.substring(0,max_length-1)+'...';
}


function clear_pairs() {
	// Remove all of the shown pairs from the screen.

	document.getElementById("pairs").innerHTML = "";

	// No return value
}

var counters = {};
function inc_counter(match) {
	if (!match) return;
	counters[match.artist]++;
	if (isNaN(counters[match.artist]))
		counters[match.artist] = 1;

}
function clear_counters() {
	counters = {};
}
function get_max_artist() {
	var max = 0;
	var maxArtist;
	for (var artist in counters) {
		if (max == counters[artist]) {
			maxArtist = undefined;
		} else if (max < counters[artist]) {
			maxArtist = artist;
			max = counters[artist];
		}
	}
	return maxArtist;
}

function clear_max() {
	clear_counters();
	document.getElementById("max").innerHTML = '';
}

function show_progress(text) {
	document.getElementById("progress").innerHTML=text;
}

function set_high_contrast(b) {
	const root = document.documentElement;
	if (b) {
		root.style.setProperty('--bgcolor', 'white');
		root.style.setProperty('--borders', 'black');
		document.getElementById('logo').src='imgs/Songbird_logo_black.png'
	} else {
		root.style.setProperty('--bgcolor', 'lightblue');
		root.style.setProperty('--borders', 'blue');
		document.getElementById('logo').src='imgs/Songbird_logo.png'
	}
}

function set_cookie(name,val) {
	document.cookie = `${name}=${val}`;
}

function get_cookie(name) {
	var m = document.cookie.match(`${name}=([^;]*)`);
	return m ? m[1] : null;
}
