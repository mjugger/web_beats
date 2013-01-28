var webBeats = (function(){
	
	// holds all the default settings for the player.
	var defaults = {
		
		view:'closed', //Sets the initial view.
		
		skin:'metro', //Sets the initial skin class.
		
		song:'2012-Retribution', // Set the song the player will start with (title of the song).
		
		auto:true, // Set to play immediately after first song loads.
		
		storage:'server', // Dictates how playlists are stored.
		
		childOf:'body', // Sets parent of player.
		
		visual:null
	}
	
	// 
	function init_player(userValues){
		
		buildPlayer();
		
		config(userValues);
		
		playlist_server({all_songs:true},init_sound);
	}
	
	// A level of abstraction used for tween libraries.
	// Saves me hassle of having to find/replace tightly coupled library methods
	// if i ever want to change libraries.
	var tween = {}
	
	// Caches all player elements and their events, playlists, 
	//and holds values to be used outside a function's scope.
	var cache = {
		
	}

	// constructs all player html elements.
	function buildPlayer(){
		var docFrag = document.createDocumentFragment();
		var player = document.createElement('div');
		player.id = 'webBeatsPlayer';player.className = '';
		cache.nodes = {};
		// Contains blueprint like objects that represent the player dom elements.
		//loop reads backwards, add new elements to end of array.
		var elements = [
			{el:'div',id:'love',classes:' coreEls',evt:'click',fn:test1},
			{el:'div',id:'next',classes:' coreEls',evt:'click',fn:next_song},
			{el:'div',id:'previous',classes:' coreEls',evt:'click',fn:previous_song},
			{el:'div',id:'play',classes:' coreEls',evt:'click',fn:playback}
		];

		var ln = elements.length;
		
		// builds elements and assigns events.
		for (var i = ln - 1; i >= 0; i--) {
			var el = document.createElement(elements[i].el);
			el.id = elements[i].id;el.className = defaults.skin+elements[i].classes;
			el.addEventListener(elements[i].evt,elements[i].fn,true);
			
			//Begin cache.nodes object construction and population.
			cache.nodes[elements[i].id] = el;
			cache.nodes[elements[i].id].listener = [];
			cache.nodes[elements[i].id].listener.push(elements[i].fn);
			var evt = cache.nodes[elements[i].id].events = [];
			evt.push(elements[i].evt);
			//End cache.nodes object construction and population.
			
			player.appendChild(el);
		};

		docFrag.appendChild(player);
		console.log(cache);
		// Append player to the DOM.
		if(defaults.childOf == 'body'){
			document[defaults.childOf].appendChild(docFrag);
		}else{
			document.getElementById(defaults.childOf).appendChild(docFrag);
		}
	}
	
	/**********Player control functions**********/
	
	function init_sound(){
		cache.nodes.audioNode = new Audio();
		cache.nodes.audioNode.autoplay = defaults.auto;
		cache.nodes.audioNode.preload = 'auto';
		cache.current_track = 0;
		var ln = cache.all_songs.length;
		
		
		//plays the user defined song, else plays the first song from "all_songs".
		for(var i = 0; i < ln; i++){
		
			if(cache.all_songs[i].song.title == defaults.song){
			
				cache.nodes.audioNode.src = cache.all_songs[i].song.url;
			
			}else if(ln-1 == i && cache.all_songs[i].song.title !== defaults.song){
			
				cache.nodes.audioNode.src = cache.all_songs[0].song.url;
			}
		}
	}
	
	
	function playback(){
	
		if(cache.nodes.audioNode.paused){
		
			cache.nodes.audioNode.play();
		}else{
			cache.nodes.audioNode.pause();
		}
		
	}
	
	function play(src){
		if(!cache.nodes.audioNode.src.match(src)){
			cache.nodes.audioNode.src = src;
		}
	}
	
	function previous_song(){
		play(cache.play_from[skip_boundaries(cache.current_track-=1)].song.url);
	}
	
	function next_song(){
		play(cache.play_from[skip_boundaries(cache.current_track+=1)].song.url);
	}
	
	function skip_boundaries(num){
	
		// Allows next_song to loop to beginning  after last song 
		//and previous_song to go to last song when at the beginning.
		cache.current_track = Math.abs(num)%cache.play_from.length;
		
		//prevents going to first song after last song plays and vice versa.
		//cache.current_track = Math.max(0,Math.min(num,cache.play_from.length-1));
		
		return cache.current_track;
	}

	/**********END Player control functions**********/
	
	function test1(e){
		alert(this.id+' '+e.type+'ed');
	}
	
	function cache_playlists(playlist){
		if(playlist.all_songs){
			cache.all_songs = playlist.all_songs;
			cache.play_from = cache.all_songs;
		}else{
			cache.playlist = playlist;
		}
		
		//cache.
	}
	
	// Removes all events from all player elements(should be called before player is removed from the dom).
	function RmAllEvts(){
		for(var prop in cache.nodes){
			var ln = cache.nodes[prop].events.length;
			for(var i = ln - 1; i >= 0; i--){
				cache.nodes[prop].removeEventListener(cache.nodes[prop].events[i], cache.nodes[prop].listener[i],true);
			}
			
			//Empties event and listener arrays.
			cache.nodes[prop].events = [];
			cache.nodes[prop].listener = [];
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
	
	
	// Stores and retrieves playlists using php.
	function playlist_server(toServer,callback){
		var call = new XMLHttpRequest();
		call.onreadystatechange=function(){

  			if(this.readyState == 4 && this.status == 200){
  				
  				var from_server = JSON.parse(this.responseText);
  				
  				if(from_server instanceof Object){
  					cache_playlists(from_server);
  				}else{
  					server_responce(from_server);
  				}
  				
  				if(callback instanceof Function){
  					callback();
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
		test1:init_player,
		
		test2:playlist_server
	}
})();