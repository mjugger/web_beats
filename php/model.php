<?php

	class model {
		
		private $jsonPath = '../json/song_defs/';
		private $songsPath = '../songs/';
		private $playlistPath = '../json/playlist/';
		
		public function __construct(){}
		
		public function fetch_songs(){
			$all_songs = $this->read_folder($this->jsonPath);
			//unset($all_songs[0]);
			$export = array();
			return json_encode(array('all_songs' => $all_songs));
			
		
		}
		
		public function fetch_all_playlists(){
			$all_playlist = $this->read_folder($this->playlistPath);
			$new_playlist = array();
			//foreach($all_playlist as $playlist){
			//	$new_playlist[$playlist];
			//}
		}
		
		private function read_folder($dir){
		
			if ($handle = opendir($dir)){
	
				$data = array();
				while(false !== ($entry = readdir($handle))){
					if( preg_match("/.json/i",$entry)){
						$json = json_decode(file_get_contents($this->jsonPath.$entry),true);
						//$allSongs[$json['song']['title']] = $json;
						//$json = file_get_contents($this->jsonPath.$entry);
						array_push($data,$json);
					}
				}
				
				return $data;
				
			}
		}
		
	//End of class code.
	}

?>