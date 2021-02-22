<?php
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Origin: '.$_SERVER[HTTP_ORIGIN]);
require_once (__DIR__.'/../connect.php');
query("UPDATE auth.userMsg SET readDT=GETUTCDATE() WHERE aid = ".$_GET[aid]);

    
?>