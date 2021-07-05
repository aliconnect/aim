<?php
//foreach ($_GET as $key => $value) $_POST[$key]=$value;
//$post=(object)$_POST;
//require_once ($_SERVER['DOCUMENT_ROOT'].'/api/v3/connect.php');
$res = db(aim)->query("EXEC api.getItemTree @id=$get->id");

while($row = db(aim)->fetch_object($res)) {
    $row->items=array();
    $src[$row->id]=$row;
}
db(aim)->next_result ( $res );
while($row = db(aim)->fetch_object($res)) {
    if ($row->value[0]=="{" || $row->value[0]=="[")$row->value=json_decode($row->value);
    $src[$row->id]->{$row->name}=$row->value;
}
db(aim)->next_result ( $res );
while($row = db(aim)->fetch_object($res)) {
    $row->items=array();
    $item[$row->id]=$row;
    array_push($src[$row->srcID]->items,$row);
    array_push($item[$row->masterID]->items,$row);
}
//exit (json_encode($item));

db(aim)->next_result ( $res );
while($row = db(aim)->fetch_object($res)) {
    if ($row->value[0]=="{" || $row->value[0]=="[")$row->value=json_decode($row->value);
    $item[$row->id]->{$row->name}=$row->value;
}
//var_dump($_POST);
if (!$_POST[flds])$_POST[flds]='Brand,Product,Model,Type,Serie,Version,Description,BodyHTML'; 
$_POST[flds]=explode(',',$_POST[flds]);

function files($row) {
    global $post;
    $row=(object)$row;
    if ($row->files) $files=json_decode($row->files);
    if ($row->files) {
        $files=$row->files=json_decode($row->files);
        foreach ($files as $file) {
            $ext=array_pop(explode('.',$file->src));
            if (in_array($ext,array(png,gif,jpg,jpeg,bmp))){
                if (isset($post->pdf) && substr($file->src,0,4)!='http') $file->src=$_SERVER['DOCUMENT_ROOT'].$file->src;
                $img.="<img class='npb' src='$file->src'>";
            }
            else {
                $fname=$file->name?:$fname=array_pop(explode('/',$file->src));
                $doc.="<li class='npb'><a target='doc' href='$file->src'>$fname</a></li>";
            }
        }
    }
    if ($img) $img="<div class='npb'>Details:<br>$img</div>";
    if ($doc) $doc="<div class='npb'>Documents:<br><ol>$doc</ol></div>";
    return "$img$doc";
}

$fbs=array();
foreach ($src as $id=>$row) if ($id) {
    //$body='<table class=attr>'.files($row);
    //foreach (array(Brand,Product,Model,Type,Serie,Version,Description,BodyHTML)as $key) if ($value=$row->$key) $body.="<tr><td>$key</td><td>$value</td></tr>";
    //$body.="<tr><td>Systems</td><td><ol>";
    //foreach ($row->items as $child) {
    //    $body.="<li><a href='#docview$child->id'>$child->name</a>";
    //    if ($child->masterID && ($master=$item[$child->masterID])) $body.=" part of <a href='#docview$master->id'>$master->name</a>";
    //    $body.="</li>";
    //}
    //$body.='</ol></td></tr></table>';
    //array_push($fbs,array(id=>$id,name=>$row->name,body=>$body));

    $body='<div class=attr>'.files($row);
    foreach ($_POST[flds] as $key) if ($value=$row->$key) $body.="<li class='valuecell'><label>$key:</label><span>$value</span></li>";
    $body.="<p class=npb>Derived systems:</p><ol>";
    foreach ($row->items as $child) {
        $body.="<li class=npb><a href='#docview$child->id'>$child->name</a>";
        if ($child->masterID && ($master=$item[$child->masterID])) $body.=" (part of <a href='#docview$master->id'>$master->name</a>)";
        $body.="</li>";
    }
    $body.='</ol></div></div>';
    array_push($fbs,array(id=>$id,name=>$row->name,body=>$body));
}

$sbs=array();
foreach ($item as $id=>$row){
    $body='<div class=attr>'.files($row);
    if ($item[$row->masterID] && $item[$row->masterID]->id) $body.="<li>This unit is a part of: <a href='#docview".$row->masterID."'>".$item[$row->masterID]->name."</a></li>";
    if ($row->srcID) $body.="<li>This unit is derived from: <a href='#docview$row->srcID'>".$src[$row->srcID]->name."</a></li>";
    foreach ($_POST[flds] as $key) if ($value=$row->$key) $body.="<li class='valuecell'><label>$key:</label><span>$value</span></li>";
    //foreach ($row as $key => $value) if ($value=$row->$key) $body.="<tr><td>$key</td><td>$value</td></tr>";
    if ($row->items) {
        $body.="<p>Consist of:</p><ol>";
        foreach ($row->items as $child) $body.="<li><a href='#docview$child->id'>$child->name</a></li>";
        $body.='</ol>';
    }
    $body.='</div>';
    $row->body=$body;
}

$t=array(id=>1,name=>"Systeem Specificatie",body=>"",items=>array(array(id=>11,name=>"Functional Description",body=>"",items=>$fbs),$item[$post->id]  ));


function getbody($row){
    $row=(object)$row;
    $body=$row->body;
    foreach ($row->items as $subrow) $body.=getbody($subrow);
    return $body;
}

if (isset($post->pdf)){
    require_once ($_SERVER['DOCUMENT_ROOT'].'/api/v3/aim-pdfdoc.php');
    $pdf = new pdfdoc();
    $pdf->make(getbody($t));
    $pdf->write();
    exit();
}

exit(json_encode($t));
?>