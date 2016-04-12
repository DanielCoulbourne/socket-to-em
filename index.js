var io = require('socket.io-client')
var needle = require('needle')
var argv = require('yargs').argv;

if ( !argv.socket ) {
	console.log('Provide a websocket with --socket=XXXXXXXX');
}

if ( !argv.hook ) {
	console.log('Provide you application endpoint with --socket=XXXXXXXX');
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
	        console.log(body);
		}
	);
}
var respond = function( eventJSON ){
	postToApplication( argv.hook , eventJSON);
	if ( argv.slack ) {
		postToSlack(eventJSON);
	}
}


socket.on('location:updated', function(eventJSON) {
	respond(eventJSON);
});

socket.on('ignition:on', function(eventJSON) {
	respond(eventJSON);
});

socket.on('ignition:off', function(eventJSON) {
	respond(eventJSON);
});

socket.on('trip:finished', function(eventJSON) {
	respond(eventJSON);
});

socket.on('error', function(eventJSON) {
	respond(eventJSON);
});

