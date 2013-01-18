var webBeats = (function(){
	
	// holds all the default settings for the player.
	var defaults = {
		view:'', //Sets the initial view.
		skin:'metro' //Sets the initial skin classes.
	}
	
	// A level of abstraction used for tween libraries.
	// Saves me hassle of having to find/replace tightly coupled library methods
	// when i want to change libraries.
	var tween = {}
	
	//assigns user specified settings. 
	function config(settings){
		for(var key in settings){
			if(defaults[key] !== undefined){
				defaults[key] = settings[key];
			}
			
		}
		
	}
	
	// performs all operations pertaining to server-side development.
	//command:
	function serverOps(command,callback,toServer){
		var call = new XMLHttpRequest();
		
	}
	
	return {
	
		// creates an instance of the "Web Beats" player
		//and assigns user defined settings if any.
		create:function(settings){
			if(settings instanceof Object){
				config(settings);
			}else{
				return;
			}
		},
		
		test:null
	}
})();