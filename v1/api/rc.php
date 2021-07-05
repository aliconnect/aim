<?php
	//err($aim);
	$html = file_get_contents($_SERVER[DOCUMENT_ROOT]."/sites/rc/app/v1/index.htm");
	
	die(str_replace("</head","<script>client_id='$aim->filename';</script></head",$html));
?>
