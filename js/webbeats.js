var webBeats = (function(){
	
	// holds all the default settings for the player.
	var defaults = {
		view:'closed', //Sets the initial view.
		skin:'metro', //Sets the initial skin classes.
		song:'', // Set the song the player will start with (url to the songs json).
		visual:null
	}
	
	// A level of abstraction used for tween libraries.
	// Saves me hassle of having to find/replace tightly coupled library methods
	// if i ever want to change libraries.
	var tween = {}

	// used for removing all events.
	var events = []

	// constructs all player html elements.
	function buildPlayer(){
		var docFrag = document.createDocumentFragment();
		var player = document.createElement('div');
		player.id = 'webBeatsPlayer';player.className = defaults.skin;

		var elements = [
			{el:'div',id:'love',classes:' coreEls',evt:'click',fn:test1},
			{el:'div',id:'next',classes:' coreEls',evt:'click',fn:test1},
			{el:'div',id:'previous',classes:' coreEls',evt:'click',fn:test1},
			{el:'div',id:'play',classes:' coreEls',evt:'click',fn:test1}
		];

		var ln = elements.length;

		for (var i = ln - 1; i >= 0; i--) {
			var el = document.createElement(elements[i].el);
			el.id = elements[i].id;el.className = defaults.skin+elements[i].classes;
			el.addEventListener(elements[i].evt,elements[i].fn,true);
			player.appendChild(el);
		};

		docFrag.appendChild(player);
		document.body.appendChild(docFrag);
	}

	function test1(){
		alert('yoyoyoyo');
	}

	//assigns user specified settings. 
	function config(settings){
		for(var key in settings){
			if(defaults[key] !== undefined){
				defaults[key] = settings[key];
			}
			
		}
		
	}
	
	// performs all operations pertaining to server-side development.
	function serverOps(toServer,callback){
		var call = new XMLHttpRequest();
		call.onreadystatechange=function(){

  			if(this.readyState == 4 && this.status == 200){
  				
  				if(callback instanceof Function){
  					callback();
  				}
  				alert( this.responseText);

  			}
 		}
 		console.log(window);
		call.open("POST","php/controller.php",true);
		call.setRequestHeader("Content-type","application/json");
		call.send(JSON.stringify(toServer));
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
		
		// This is used to test any function of this program.
		test:buildPlayer
	}
})();