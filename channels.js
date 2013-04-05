

var channels={};
var size=0;

module.exports={
	createChannel: function (name){
		var tempchan=this.channelExist(name);
		if(tempchan)
			return tempchan;
		else{
			var Chan=require("./chan").Chan;
			var chan=new Chan({name:name});
			channels[name]=chan;
			size++;
			return chan;
		}
	},
	channelExist: function (vkey){
		if(vkey==null || vkey==undefined)
			return null;
		
		for (var i in channels) {
		    var chan = channels[i];
		    if (chan && chan.name === vkey) return chan;
		}
		return null;
	}
	
}


