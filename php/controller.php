<?php
include "model.php";

	class controller {

		public function __construct($post){
			$json = json_decode($post,true);
			$this->router($json);
		}

		private function router($json){
			$model = new model();
			if($json['all_songs']){
				
				echo $model->fetch_songs();
				
			}else if($json['playlist']){
				
				
				//echo $pl->
				
			}
		}
	}
	
	
	new controller(file_get_contents('php://input'))
?>