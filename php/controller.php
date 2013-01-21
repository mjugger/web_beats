<?php

	class controller {

		public function __construct($post){
			$json = json_decode($post,true);
			$this->router($json);
		}

		private function router($json){
			//if($json[''])
		}
	}
	
	
	new controller(file_get_contents('php://input'))
?>