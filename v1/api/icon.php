<link href="../lib/css/icon.css" rel="stylesheet" />
<link href="../lib/css/app.css" rel="stylesheet" />
<style>
    html,body{margin:0;padding:0;font-family:sans-serif;}
    td{padding:10px;}
    span{width:300px;}
</style>
<body>
<?php
//$lnAll=array(nl,fr,du);
$content=file_get_contents(__DIR__."/../lib/css/icon/icon.css");
$icons=json_decode(file_get_contents(__DIR__."/../lib/css/icon/icon.json"));


//$i=57345;$end=58167;//$end=$i+100;
//while ($i<=$end){
//    $icons->{dechex($i)}=(object)array(content=>dechex($i),title=>dechex($i),ln=>(object)array());
//    //die(dechex($i));
//    $i++;
//}


foreach ($icons as $iconName=>$symbol){
    $IconName=ucfirst($iconName);
    $title=$symbol->title=$symbol->title?:$IconName;
    if ($symbol->content) {
        $content.=PHP_EOL.".icn.$iconName::before,.icn.$IconName::before,.abtn.$iconName::before,.ico-$iconName::before {content:\"\\$symbol->content\";}";
        $content.=PHP_EOL.".bar.large .ico-$iconName::after {content:\"$title\";}";
    }
	//foreach($lnAll as $ln) {
	//    $lntitle=$symbol->ln->{$ln}=$symbol->ln->{$ln}?:"";
	//    if (!$lntitle || $lntitle==$title) continue;
	//    if ($symbol->content) $content.=PHP_EOL."[ln=\"$ln\"] .bar.large .ico-$iconName::after,[ln=\"$ln\"] .bar.large .ico-$IconName::after {content:\"$lntitle\";}";
	//    $content.=PHP_EOL."[ln=\"$ln\"] .caption-$iconName::after {content:\"$lntitle\";}";
	//} 
    $btns.="<button class='ico-$iconName'></button>";
}
//die($content);
//file_put_contents(__DIR__."/icon.json",str_replace("}},","}},".PHP_EOL,json_encode($icons)));

echo "<div><div class='row bar large'>$btns</div></div>";
foreach ($lnAll as $ln) {
    echo "<h1>$ln</h1>";
    echo "<div  ln='$ln'><div class='row bar large'>$btns</div></div>";
}
//echo "<div class='row bar bgd large' style='background:black;color:white;'>$btns</div>";
//echo "<div class='row bar'>$btns</div>";
//echo "<div class='row bar bgd' style='background:black;color:white;'>$btns</div>";



file_put_contents(__DIR__."/../lib/css/icon.css",$content);
?>
