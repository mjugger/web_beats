var webBeats = (function(){
	
	// holds all the default settings for the player.
	var defaults = {
		
		view:'closed', //Sets the initial view.
		
		skin:'metro', //Sets the initial skin class.
		
		song:'', // Set the song the player will start with (url to the songs json).
		
		storage:'local', // Dictates how playlists are stored.
		
		childOf:'body', // Sets parent of player.
		
		visual:null
	}
	
	// 
	function init_player(userValues){
		
		//creates htmlAudioElement.
		cache.song = new Audio();
		
		config(userValues);
		
		buildPlayer();
		
		playlist_server({all_songs:true},store_playlists);
	}
	
	// A level of abstraction used for tween libraries.
	// Saves me hassle of having to find/replace tightly coupled library methods
	// if i ever want to change libraries.
	var tween = {}
	
	// Caches all player elements, their events, 
	//and holds values to be used outside a function's scope.
	var cache = {}

	// constructs all player html elements.
	function buildPlayer(){
		var docFrag = document.createDocumentFragment();
		var player = document.createElement('div');
		player.id = 'webBeatsPlayer';player.className = '';
		
		// Contains blueprint like objects that represent the player dom elements.
		//loop reads backwards, add new elements to end of array.
		var elements = [
			{el:'div',id:'love',classes:' coreEls',evt:'click',fn:test1},
			{el:'div',id:'next',classes:' coreEls',evt:'click',fn:test1},
			{el:'div',id:'previous',classes:' coreEls',evt:'click',fn:test1},
			{el:'div',id:'play',classes:' coreEls',evt:'click',fn:test1}
		];

		var ln = elements.length;
		
		// builds elements and assigns events.
		for (var i = ln - 1; i >= 0; i--) {
			var el = document.createElement(elements[i].el);
			el.id = elements[i].id;el.className = defaults.skin+elements[i].classes;
			el.addEventListener(elements[i].evt,elements[i].fn,true);
			
			//Begin cache object construction and population.
			cache[elements[i].id] = el;
			cache[elements[i].id].listener = [];
			cache[elements[i].id].listener.push(elements[i].fn);
			var evt = cache[elements[i].id].events = [];
			evt.push(elements[i].evt);
			//End cache object construction and population.
			
			player.appendChild(el);
		};

		docFrag.appendChild(player);
		
		// Append player to the DOM.
		if(defaults.childOf == 'body'){
			document[defaults.childOf].appendChild(docFrag);
		}else{
			document.getElementById(defaults.childOf).appendChild(docFrag);
		}
	}
	
	function play(){
		
	}

	function test1(e){
		alert(this.id+' '+e.type+'ed');
	}
	
	function cache_playlists(playlist){
		if(playlist.all_songs){
			cache.all_songs = playlist.all_songs;
		}else{
			cache.playlist = playlist;
		}
		
	}
	
	// Removes all events from all player elements(should be called before player is removed from the dom).
	function RmAllEvts(){
		for(var prop in cache){
			var ln = cache[prop].events.length;
			for(var i = ln - 1; i >= 0; i--){
				cache[prop].removeEventListener(cache[prop].events[i], cache[prop].listener[i],true);
			}
			
			//Empties event and listener arrays.
			cache[prop].events = [];
			cache[prop].listener = [];
		}
	}

	//assigns user specified settings. 
	function config(settings){
		for(var key in settings){
			if(defaults[key] !== undefined){
				defaults[key] = settings[key];
			}
			
		}
		
	}
	
	
	
	
	// Plays music.
	function playSong(songUrl){
		cache.audionNode.src = songUrl;
	}
	
	// Stores and retrieves playlists using php.
	function playlist_server(toServer,callback){
		var call = new XMLHttpRequest();
		call.onreadystatechange=function(){

  			if(this.readyState == 4 && this.status == 200){
  				
  				if(callback instanceof Function){
  					callback( JSON.parse(this.responseText) );
  				}

  			}
 		}
		call.open("POST","php/controller.php",true);
		
		call.setRequestHeader("Content-type","application/json");
		
		call.send(JSON.stringify(toServer));
	}
	
	// Stores and retrieves playlists using localStorage.
	function playlist_local(){
	
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
		test1:buildPlayer,
		
		test2:playlist_server
	}
})();