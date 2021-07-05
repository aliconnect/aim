<?php
//die(a);
$aim->host=aliconnect;
$urlPath=explode("/",$_SERVER['SCRIPT_NAME']);
$aim->version=$urlPath[2];
//$_SERVER[SERVER_NAME]="alicon.aliconnect.nl";
//$_SERVER[SERVER_NAME]="gevoelinbalans.nl";
$arr=explode(".",$_SERVER[SERVER_NAME]);
array_pop($arr);
if(($aim->host=array_pop($arr)?:$aim->host)==aliconnect)$aim->host=array_pop($arr)?:aliconnect;
$arr=explode("/",array_shift(explode("?",$_SERVER[REQUEST_URI])));
array_shift($arr);
$value=$arr[0];
if($aim->host==aliconnect && $value!=aim)$aim->host=$value;
//if($_GET[id])

if(!$_GET[id] && $uri=trim(substr($_SERVER[REQUEST_URI],1))){
	$arr=explode("/",$uri);
	if(!(is_numeric($arr[0])))$aim->host=array_shift($arr);
	$_GET[id]=array_shift($arr);
}
//die($_GET[id]);
require_once (__DIR__.'/connect.php');

//$page=fetch_object($res=query($q="
//    SELECT TOP 1 H.id AS hostID,S.id siteID,P.id pageID,P.title,P.subject,P.files
//    FROM api.items H
//    LEFT OUTER JOIN api.items S ON S.hostID=H.id AND S.masterID=H.id AND S.classID=1091
//    LEFT OUTER JOIN api.items P ON P.hostID=H.id AND P.www=1 AND P.startDT IS NOT NULL AND ".($_GET[id]?"P.id=".$_GET[id]:"P.masterID=S.id")."
//    WHERE H.hostID=1 AND H.classID=1002 AND H.keyname='$aim->host'
//    ORDER BY S.idx,P.idx
//"));

//err($aim);

$page=fetch_object($res=query($q="
	SELECT TOP 1 H.id AS hostID,S.id siteID,P.id pageID,P.title,P.subject,P.files
	FROM api.items H
	LEFT OUTER JOIN api.items S ON S.hostID=H.id AND S.masterID=H.id AND S.classID=1091
	LEFT OUTER JOIN api.items P ON P.hostID=H.id AND P.www=1 AND P.startDT IS NOT NULL AND ".($_GET[id]?"P.id=".$_GET[id]:"P.masterID=S.id")."
	WHERE H.id=$aim->hostID
	ORDER BY S.idx,P.idx
"));

$html=file_get_contents(__DIR__."/../app/site/index.html");
//die(json_encode($page));

$head1.="
	<link rel='apple-touch-icon' href='/sites/$aim->host/img/logo/logo-60.png' />
	<link rel='apple-touch-icon' sizes='76x76' href='/sites/$aim->host/img/logo/logo-76.png' />
	<link rel='apple-touch-icon' sizes='120x120' href='/sites/$aim->host/img/logo/logo-120.png' />
	<link rel='apple-touch-icon' sizes='152x152' href='/sites/$aim->host/img/logo/logo-152.png' />
	<link rel='apple-touch-startup-image' href='/sites/$aim->host/img/logo/logo-startup.png' />
";

//$qp= $aim->location->folders[1]?"'$aim->root' AND P.keyname='$aim->filename'":"'webpage' AND P.masterID=S.id AND P.idx=0";
if(!$page->pageID){
	$page->title='Page not found';
	$page->subject='This page is not available.';
}
$page->src=json_decode($page->files);
$page->src=$page->src[0]->src;
$page->mobile=$page->mobile?:preg_match("/(android|webos|avantgo|iphone|ipad|ipod|blackberry|iemobile|bolt|boost|cricket|docomo|fone|hiptop|mini|opera mini|kitkat|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
$pageBase64=base64_encode("site=".json_encode($page));
$head.="
	<title>".strip_tags($page->title)."</title>
	<meta property='fb:app_id' content='487201118155493'>
	<meta property='og:url' content='".str_replace("'","",strip_tags($_SERVER[REDIRECT_SCRIPT_URI]))."' />
	<meta property='og:type' content='website'>
	<meta property='og:title' name='og:title' content='".str_replace("'","",strip_tags($page->title))."' />
	<meta property='og:description' name='og:description' content='".str_replace("'","",strip_tags($page->subject))."' />
	<meta property='og:image' name='og:image' content='".str_replace("'","",strip_tags($page->src))."' />
	<meta property='og:image:width' content='450'>
	<meta property='og:image:height' content='300'>
	<script src='data:text/javascript;base64,$pageBase64'></script>
";
echo str_replace("</head>",$head."</head>",$html);
?>
