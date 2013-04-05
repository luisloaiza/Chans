/*
Chan is a public Channel 
implementation of long polling http communication protocol

*/

var sys = require("sys"),
EventEmitter = require('events').EventEmitter;

var MESSAGE_BACKLOG = 50,
    SESSION_TIMEOUT = 60 * 1000;


var Chan = exports.Chan = function(options) {
	EventEmitter.call(this);
  	if(!options) options = {};
	this.debug        = options.debug    || false;
	this.name=options.name || "default";
	this.messages=[];
	this.users={}; //callbacks are connected users 
}

Chan.prototype = Object.create(EventEmitter.prototype);

Chan.prototype ={
	getUsers:function (){
		return this.users;
	},	
	destroyUser:function (id_user){
		delete this.users[id_user];
	},
	addUser:function (newuser){
	  this.users[newuser.id+""] = newuser;
	  return true;
	},
  	pollMessages: function (id_user, callback) {//this poll channel is not saving passed messages in memory
  		
  		var matching = [];
    	for (var i = 0; i < this.messages.length; i++) {
      		var message = this.messages[i];
      		
			if(parseInt(message.args.uid_to)==parseInt(id_user)){
				matching.push(message);
				this.messages.splice(i,1);//se va de el array
				i--;
			}
			if( (new Date()).getTime()/1000-message.args.timestamp>SESSION_TIMEOUT ){
				this.messages.splice(i,1);
				i--;
    		}
		}
		
    	if (matching.length > 0){
			callback(matching);//send the messagges in memory
		}
    	else
    		this.addUser({ timestamp: (new Date()).getTime()/1000, callback: callback, id:id_user });
  	},
	appendMessage : function (m) {//append action feed in the system
		var userObj=null;
		var user_id_to=m.args.uid_to+"";
		if(this.users[user_id_to]!=null && this.users[user_id_to]!=undefined)
		{	
			userObj=this.users[user_id_to];
			userObj.callback([m]);
			this.destroyUser(user_id_to);	
		}
		else{
			this.messages.unshift(m);
			console.log("feed allocated");
		}

		while ( this.messages.length > MESSAGE_BACKLOG)//si me paso de la cantidad de mensajes entonces shift
	    	this.messages.pop();
		return m;
	}
}