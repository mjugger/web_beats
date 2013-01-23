<?php

	class all_songs {
		
		private $jsonPath = '../json/song_defs/';
		
		public function __construct(){}
		
		public function fetch_songs(){
		
			if ($handle = opendir($this->jsonPath)){
	
				$allSongs = array();
				while(false !== ($entry = readdir($handle))){
					if( preg_match("/.json/i",$entry)){
						$json = json_decode(file_get_contents($this->jsonPath.$entry),false);
						//$allSongs[$json['song']['title']] = $json;
						array_push($allSongs,$json);
					}
				}
				
				return json_encode($allSongs);
				
			}
		
		}
		
	}

?>