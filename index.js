var io = require('socket.io-client')
var needle = require('needle')
var argv = require('yargs').argv;

if ( !argv.socket ) {
	console.log('Provide a websocket with --socket XXXXXXXX');
}

if ( !argv.hook ) {
	console.log('Provide you application endpoint with --hook XXXXXXXX');
}

if ( !argv.events ) {
	console.log('Provide a list of socket events with --events xxx,yyy,zzz');
}


var socket = io(argv.socket);

var postToSlack = function(payload) {
	body = JSON.stringify(payload, null, 4).replace(/["']/g, "")
	needle.post(argv.slack, { payload: '{ "text": "' + body + '"}'}, 
	    function(err, resp, body){
	        console.log(body);
		}
	);
}

var postToApplication = function(postURL, payload) {
	body = JSON.stringify(payload, null, 4);
	needle.post(postURL, body, 
	    function(err, resp, body){
	        postToSlack(body);
		}
	);
}
var respond = function( eventJSON ){
	postToApplication( argv.hook , eventJSON);
	if ( argv.slack ) {
		postToSlack(eventJSON);
	}
}

if ( argv.events ) {
	var events = argv.events.split(",");
}

argv.events.split(",").forEach(function(event) {
	socket.on(event, function(eventJSON) {
		respond(eventJSON);
	});
});

socket.on('error', function(eventJSON) {
	respond(eventJSON);
});

