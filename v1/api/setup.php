<?php
	require_once (__DIR__.'/connect.php');
	$dbs=$config->dbs;
	if($_SERVER[SERVER_NAME]=="aliconnect.nl" || $dbs->server=="aliconnect.nl")die("ON SERVER aliconnect.nl NOT ALLOWED");
	$sql=file_get_contents("sql/aimCREATE.sql");
	die($sql);
?>
