<?php
function rows($q) {
    global $json;
    $json->q=$q;
    $hasdata=($res = query($q));
    $i=0;
    $json->set[$i]=array();
    while ($hasdata) {
        while($row = fetch_object($res)) array_push($json->set[$i],$row);
        if (next_result ( $res )) { $i++; $json->set[$i]=array(); }
        else $hasdata=false;
    }
    return $json;
}
function usermsg($user){
    global $aim,$get,$location,$cookie;
    //err(MSG,$user);
    $img="<img style='position:absolute;display:none;' width=1 height=1 src=https://aliconnect.nl/api/v3/img/?aid=";
    $aid=array();
    $user->mailcontent=array();

    if($msg=$user->msg->newcontact){array_push($aid,$msg->aid); array_push($user->mailcontent,array(
        name=>"$img$msg->aid>Uw contactgegevens geregistreerd.",
        content=>"
            Ik wil u hierbij laten weten dat ik u heb toegevoegd als contact persoon bij $user->companyName binnen de Aliconnect omgeving van $user->hostName. 
            Uw email adres evenals uw overige contactgegevens staan opgeslagen in dit systeem.
        "));}

    if($msg=$user->msg->newaccount){array_push($aid,$msg->aid); array_push($user->mailcontent,array(
        name=>"$img$msg->aid>Uw eigen account op het domein van $user->hostName.",
        content=>"
            Om uw persoonlijke gegevens te beheren heb ik een account aangemaakt op de Aliconnect omgeving van $msg->hostName. 
            U kunt zich op dit domein aanmelden en samenwerken binnen projecten met teamleden. 
            ".$website="</p><p>De website is te bekijken op <a href='https://$msg->host.aliconnect.nl'>https://$msg->host.aliconnect.nl</a>, 
            de applicatie opstarten kan via <a href='https://aliconnect.nl/$msg->host/app'>https://aliconnect.nl/$msg->host/app</a> 
            of u kunt op uw mobiel de webapp installeren via <a href='https://aliconnect.nl/$msg->host/mobile'>https://aliconnect.nl/$msg->host/mobile</a>.
        "));}

    if($msg=$user->msg->newuser){array_push($aid,$msg->aid); array_push($user->mailcontent,array(
        name=>"$img$msg->aid>Een eigen account op Aliconnect.",
        content=>"
            Omdat uw email adres nog niet bekent was binnen Aliconnect bent u toegevoegd als gebruiker binnen het Aliconnect platform. 
            Aliconnect is een B2B platform voor bedrijven om samen te werken en gegevens delen. Een deel van deze gegevens betreft Privacy gegevens die vallen onder de AVG/GDPR wet. 
            Wij stellen uw privacy voorop en dat houdt in dat u eigenaar bent en blijft van uw privacy gegevens. U kunt deze dan ook zelf beheren.</p>
            <p>Daarom is er voor u een persoonlijk account aangemaakt op <a href='https://aliconnect.nl'>https://aliconnect.nl</a>. 
            U kunt zich aanmelden op <a href='https://aliconnect.nl/auth'>https://aliconnect.nl/auth</a>. 
            U ontvangt tijdens het aanmelden een beveiligingscode waarmee u uw persoonlijke wachtwoord kunt instellen.
        "));}

    if($msg=$user->msg->newpubliccontact){array_push($aid,$msg->aid); array_push($user->mailcontent,array(
        name=>"$img$msg->aid>Een contactpersoon toegevoegd aan uw persoonlijke profiel.",
        content=>"
            Omdat u nog niet bekend was als contactpersoon bij $user->companyName is deze functie toegevoegd aan uw persoonlijke profiel. 
            U kunt deze contactgegevens zelf beheren op <a href='https://aliconnect.nl'>https://aliconnect.nl</a>.
        "));}

    if($msg=$user->msg->newowner){array_push($aid,$msg->aid); array_push($user->mailcontent,array(
        name=>"$img$msg->aid>Een eigen domein op Aliconnect.",
        content=>"
            Uw subdomein $user->hostName is ingericht. Dit subdomein is eigendom van de organisatie $user->companyName. 
            $website
            </p><p>Bekijk onze website om te zien hoe u uw eigen domainnaam <a href='$user->domain'>$user->domain</a> kunt gebruiken.
        "));}

    if($msg=$user->msg->nocompanyowner){array_push($aid,$msg->aid); array_push($user->mailcontent,array(
        name=>"$img$msg->aid>Nog geen beheerder van $user->companyName.",
        content=>"
            U bent contactpersoon bij $user->companyName. Voor dit bedrijf is nog geen beheerder ingesteld. 
            U kunt op <a href='https://aliconnect.nl'>https://aliconnect.nl</a> beheerder worden door u op te geven als eigenaar.
            Kies een eigen subdomein en ga ook samenwerken met Aliconnect.
        "));}

    if(!$user->mailcontent)return;
    $user->displayName=$user->displayName?:$user->userName?:"eigenaar van ".$user->email;
    array_unshift($user->mailcontent,array(content=>"Beste $user->displayName,"));
    array_push($user->mailcontent,array(content=>"Met vriendelijke groet,<br><b>$user->byName</b><br>$user->byJobName<br>$user->byCompany"));
    $mailmsg=array(
        FromName=>$user->byName?"$user->byName ($user->byCompany)":"Team Aliconnect",
        Subject=>"Nieuwe informatie over uw contactgegevens bij $user->hostName",
        host=>"$cookie->host.aliconnect.nl",
        to=>$user->email,
        //to=>'max@alicon.nl',
        bcc=>'support@alicon.nl',
        //bcc=>$doc->emailaddressbcc,
        msgs=>$user->mailcontent,
    );
    query("INSERT mail.queue (msg) VALUES ('".dbvalue(json_encode($mailmsg))."');UPDATE auth.userMsg SET sendDT=GETUTCDATE() WHERE aid IN (".implode(",",$aid).")");
    unset($user->mailcontent);
}
function microtime_float() {
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}
function ts($msg){
    global $ts,$ds;
    if (!$ts)$ts=microtime_float();
    $now=microtime_float();
    //echo PHP_EOL.number_format($now-$ts,4).' '.number_format($ds?$now-$ds:0,4).PHP_EOL.str_replace(PHP_EOL,'',$msg);
    $ds=$now;
}
function propval($value){
    global $aim,$get,$location,$cookie;
    $text=formatvalue($value->title?:$value);
    if($value->{'$ref'}){
        $href=(str_replace("#","$aim->root/$cookie->host/api",$ref=$value->{'$ref'})).".htm";
        $text="<a href='$href'>$text</a>";
    }
    return $text;
}
function seo_friendly_url($string){
    $string = str_replace(array('[\', \']'), '', $string);
    $string = preg_replace('/\[.*\]/U', '', $string);
    $string = preg_replace('/&(amp;)?#?[a-z0-9]+;/i', '-', $string);
    $string = htmlentities($string, ENT_COMPAT, 'utf-8');
    $string = preg_replace('/&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);/i', '\\1', $string );
    $string = preg_replace(array('/[^a-z0-9]/i', '/[-]+/') , '-', $string);
    return strtolower(trim($string, '-'));
}
function ref($schema,$id,$caption){global $aim,$get,$location,$cookie;return '#'.implode("/",array($cookie->host,api,$schema,$id,seo_friendly_url($caption)));}
function getSchemaConfig($row){
    //$c = odbc_connect($this->cs, $this->UID, $this->PWD);
    $schema=fetch_object(query("SELECT lower(class)[schema],id,config FROM om.class WHERE ".($row->classID?"id=$row->classID":"class='".($row->class?:$row->schema)."'")));
    $schema->config=json_decode($schema->config);
    err($row);
    return $schema;
}

function itemrow($row){
    global $aim,$get,$location,$cookie,$schemas;
    //clean($row,property_exists($aim,sync));
    $row->filterfields=json_decode($row->filterfields);
    if(!$get->select)clean($row);
    $row->schema=$row->schema?:$get->classIDschema[$row->classID];
    //err($schemas->{$row->schema});

    $item=$row;
    if (!in_array($item->userID,array(0,$cookie->hostID,$cookie->groupID,$cookie->userID))) $item->readOnly=true;

    //if(!$cookie->accountID && !$item->www) return;
    if($row->obj){
        $row->obj=json_decode($row->obj);
        //foreach(array(name=>title)as $key=>$newkey)if(property_exists($row->obj,$key)){$row->obj->$newkey=$row->obj->$key;unset($row->obj->$key);}
        foreach($row->obj as $key=>$value)if(!property_exists($item->values,$key))$item->values->$key=$row->obj->$key;
    }
    //if($item->values->filterfields)$item->values=(object)array_merge((array)$item->values,(array)$item->values->filterfields);
    //if($item->values->files && $item->values->files->value){
    //    $item->files=json_decode($item->values->files->value);
    //    unset($item->values->files);
    //    $att=array();$img=array();
    //    foreach($item->files as $file){
    //        $type=array_shift(explode("/",$file->type));
    //        if($type==image)array_push($img,$file);
    //        else array_push($att,$file);
    //    }
    //    if($img)$item->images=$img;
    //    if($att)$item->attachements=$att;
    //}
    unset($item->obj);

    //foreach($itemfields=array(selected,hasChildren,users,properties,rel,readOnly,geolocatie,level,www,idx,values,id,uid,keyID,hostID,masterID,ownerID,classID,srcID,userID,schema,name,keyname,title,subject,summary,filterfields,files,modifiedDT,modifiedByID) as $key)if(property_exists($item->values,$key)){$item->$key=$item->$key?:$item->values->$key;unset($item->values->$key);}
    foreach($itemfields=$GLOBALS[itemattributes] as $key)if(property_exists($item->values,$key)){$item->$key=$item->$key?:$item->values->$key;unset($item->values->$key);}

    foreach($item as $key=>$value)if(!in_array($key,$itemfields)){$item->values->$key=$item->$key;unset($item->$key);}
    //foreach(array(geolocatie=>location) as $key=>$newkey)if(property_exists($item->values,$key)){if(!$item->values->$newkey)$item->values->$newkey=$item->values->$key;unset($item->values->$key);}
    //err($item);
    //if($item->files)$item->files=array(value=>$item->files[0]=="["?json_decode($item->files):array());

    clean($item->values,property_exists($get,sync));
    //if($item->title)$item->title=ucfirst($item->title?:$item->name?:$item->keyname?:$item->id);
    //if($item->readonly)$item->readonly=array_keys((array)$item->readonly);

    if (property_exists($item,rel)){
        $item->rel=$item->rel?:(object)array();
        foreach($item->rel as $key=>$rel)$item->rel->$key=array_keys((array)$rel);
        if(isset($get->users))$item->users=$item->rel->users?:array();
        unset($item->rel->users);
    }
    //if($item->id==$get->id){
    //}
    
    $item->ID=getID($item);//strtoupper(implode('-',array(dechex($item->id),dechex($item->classID),dechex($item->hostID),$item->uid)));
    //unset($item->id,$item->hostID,$item->classID,$item->uid,$item->schema);
    unset($item->level);
    $item->title=str_replace(array("\r","\n","\r\n")," ",$item->title);
    //if($name=$item->name?:$item->keyname?:$item->title)$item->name=seo_friendly_url($name?:$item->id);
    //foreach($item as $key=>$value)if(is_numeric($value))$row->$key=(float)$value;

    if ($get->ln){
        if(!$schemas->{$item->schema})$schemas->{$item->schema}=json_decode(fetch_object(query("SELECT config FROM om.class WHERE class='$item->schema'"))->config);
        foreach($schemas->{$item->schema}->fields as $attributeName=>$prop){
            if($prop->type==textarea && $item->values->{$attributeName}) $item->values->{$attributeName}=translate($item->values->{$attributeName},$get->ln);
        }
    }

    if($item->files)$item->files=array(value=>$item->files);
    return $item;
}
function itemrows($res,$asvalue){
    global $aim,$get,$location,$cookie;
    $data=$get->data?:$get->id?(object)array('@id'=>$get->id):(object)array();
    $rows=array();
    while($row=fetch_object($res)){
        $items->{$row->id}=$row;
        if($row->relclass){
            //if(!$row->refID)err($row);
            if ($row->id != $items->{$row->refID}->masterID) $items->{$row->refID}->rel->{$row->relclass}->{$row->id}=1;
            if ($row->refID != $items->{$row->id}->masterID) $items->{$row->id}->rel->{$row->relclass}->{$row->refID}=1;
        }
        unset($row->refID,$row->relclass);
    }
    //err(i,$items);
    if(next_result($res))while($row=fetch_object($res)){
        //if ($get->ln)$row->value=translate($row->value);//$get->ln;
        if (!$propname=$row->name)continue;
        if (!in_array($row->userID,array(0,$cookie->hostID,$cookie->groupID,$cookie->userID))) $items->{$row->id}->properties->{$row->name}->readOnly=true;
        //err(property_exists($aim,sync));
        $value=$items->{$row->id}->values->{$propname}=(object)array(aid=>$row->aid,title=>$row->value,moduserID=>$row->moduserID);
        if($row->itemID)$value->itemID=$row->itemID;
        //$items->{$row->id}->values->{$propname}=(!$row->itemID||property_exists($get,sync))?$row->value:(object)array(
        //    title=>$row->value,
        //    id=>(int)$row->itemID,itemID=>(int)$row->itemID,
        //    //'href'=>strtolower("#$row->schema/$row->itemID"),
        //    title=>$row->value
        //);
                //err($items->{$row->id});

    }
		$data->value=array();//array_values((array)$items);
    //foreach($items as $id => $item) $data->{$item->schema?:item}->{$item->id?:$get->id}=itemrow($item);
    foreach($items as $id => $item) array_push($data->value,itemrow($item));
    //if ($get->id) $data->{'@id'}=$get->id;
    //if ($asvalue==1) return $data?:(object)array(); 
    //if ($asvalue==2) return $items?:(object)array(); 

    //foreach($data as $key=>$rows)$data->{$key}=array_values((array)$rows);

    return $data; 
}
function translate($text,$target){
    $ch = curl_init();
    curl_setopt_array($ch, array(
        CURLOPT_URL => $q="https://translation.googleapis.com/language/translate/v2?key=AIzaSyAKNir6jia2uSgmEoLFvrbcMztx-ao_Oys&target=$target&q=".urlencode($text),
        CURLOPT_RETURNTRANSFER => true,
    ));
    //echo $q;
    $result = curl_exec($ch);
    //echo $result;
    //$errors = curl_error($ch);
    //$response = curl_getinfo($ch);

    //$errors = curl_error($ch);
    //$response = curl_getinfo($ch);
    curl_close($ch);

    $result=json_decode($result);
    //var_dump($result);
    //die();
    //die();
    return $result->data->translations[0]->translatedText?:$text;
}
function formatvalue($v){
    if (sizeof(explode("-",$v))==3 && ($n=strtotime($v)))$v=date("d-m-y".(date('H:i:s', $n) != '00:00:00'?" H:i:s":""),$n);
    return $v;
}
function tbl($res){
    echo '<base target="_blank"><link href="/lib/css/tbl.css" rel="stylesheet" />';
    echo "<table>";
    while($row=fetch_object($res)){
        if (!$h) echo $h = "<tr><td>".implode("</td><td>",array_keys((array)$row))."</td></tr>";
        echo "<tr><td>".implode("</td><td>",array_values((array)$row))."</td></tr>";
    } 
    echo "</table>";
}

function res_($res){
    global $aim,$get,$location,$cookie;
    $data=array();
    while ($res){
        $rows=array();
        while($row=fetch_object($res)) array_push($rows,$row);
        array_push($data,$rows);
        $res=next_result($res)?$res:null;
    } 
    die(utf8_encode(json_encode($data)));
}

function res_tbl($res){
    global $aim,$get,$location,$cookie;
    echo '<base target="_blank"><link href="/lib/css/tbl.css" rel="stylesheet" />';
    while ($res){
        $h=null;
        echo "<table>";
        while($row=fetch_object($res)) {
            if (!$h) echo $h="<tr><th>".implode("</th><th>",array_keys((array)$row))."</th></tr>";
            echo "<tr><td>".implode("</td><td>",array_values((array)$row))."</td></tr>";
        }
        echo "</table>";
        $res=next_result($res)?$res:null;
    } 
}

function extension_tbl($res){
    global $aim,$get,$location,$cookie;
    //err($aim);
    $rows=array();
    while($row=fetch_object($res))array_push($rows,$items->{$row->id}=$row);
    if(next_result($res))while($row=fetch_object($res)){$items->{$row->id}->{$row->name}=$row->value;if($get->select=='*')$properties[$row->name]=true;}
    $properties=$properties?array_keys($properties):explode(",",$get->select);
    //err(p,$rows);
    echo '<base target="_blank"><link href="/lib/v1/css/tbl.css" rel="stylesheet" />';
    echo "<table>";
    foreach($rows as $row) {
        $row=(object)$row;
        if($row->classID)$schema=getschema($row->classID);
        if (!$h){
            //foreach($row->values as $key=>$value)if(!isset($schema->properties->$key))$props->$key=(object)array(title=>ucfirst($key));
            if($get->select)foreach($properties as $key)$props->$key=(object)array(title=>array_pop(explode(',',$schema->properties->$key->title?:ucfirst($key))));
            else if ($row->values) foreach($row->values as $key=>$value)$props->$key=(object)array(title=>ucfirst($key));
            else foreach($row as $key=>$value)$props->$key=(object)array(title=>ucfirst($key));
            //err(p,$row);
            $h=1;
            echo "<tr>";
            foreach($props as $propname=>$prop)echo "<th>$prop->title</th>";
            echo "</tr>";
        }
        echo "<tr>";
        foreach($props as $key=>$prop)echo "<td>".propval($row->$key)."</td>";
        echo "</tr>";
    } 
    echo "</table>";
}

function html($rows){
    global $aim,$get,$location,$cookie;
    if (!is_object($rows))return $rows;
    foreach($rows as $row) {
        $aim->title=$aim->title?:$row->title;
        $html.="<h1>".$row->title."</h1>";//<caption>$caption</caption>";
        $html.="<a href='/moba/api/$schema->name/$row->id.htm'>$schema->name/$row->id</a>";//<caption>$caption</caption>";
        $html.="<table>";
        $schema=getschema($row->classID);
        $props=$schema->properties;
        foreach($props as $propname=>$prop){
            $l=explode(",",$prop->title);
            $title=array_pop($l);
            if(($l=array_pop($l))&&$s){$html.="$label$s";$label="<tr><td colspan=2><h2>$l</h2></td></tr>";$s=null;}
            if($value=$row->values->$propname)$s.=PHP_EOL."<tr><td>".($title?:ucfirst($propname))."</td><td>".($value->{'$ref'}?"<a href='".(str_replace("#","/moba/api",$value->{'$ref'})).".htm'>$value->value</a>":formatvalue($value))."</td></tr>";
        }
        $html.=($s?"$label$s":"")."</table>";
        $label=$s=null;
    } 
    return $html;
}

function extension_html($rows){
    //return "<html><head><base target='_blank'><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link href='/lib/default/css/htm.css' rel='stylesheet' /></head><body>".utf8_encode(html($rows))."</body></html>";
    return "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link href='/lib/default/css/htm.css' rel='stylesheet' /></head><body>".utf8_encode(html($rows))."</body></html>";
}
function html_doc($content,$title,$subject){
    global $aim,$get,$location,$cookie;
    $html = file_get_contents($_SERVER['DOCUMENT_ROOT']."/sites/$cookie->host/api/".($aim->template?:template).".mht");
    $replace=array('#Title#'=>$title,'#Subject#'=>$subject);
    if ($replace) $html = str_replace(array_keys($replace),array_values($replace),$html);
    $html = str_replace('##',str_replace('=','=3D',iconv("UTF-8", "CP1252", utf8_decode($content))),$html);

    //err($aim->title);
    header('Content-Type: application/msword');
    header("Content-Disposition: attachment; filename='".("$title $subject"?:$aim->title).".doc'");
    die($html);
}
function extension_doc($rows,$replace){
    global $aim,$get,$location,$cookie;
    html_doc(html($rows));
}
function extension_pdf($rows){
    global $aim,$get,$location,$cookie;
    $html=html($rows);
    require_once ($_SERVER['DOCUMENT_ROOT']."/inc/php/dompdf/dompdf_config.inc.php");
    $dompdf = new DOMPDF();
    //$html=str_replace(array("src='/","src='https://aliconnect.nl/"),"src='".$_SERVER['DOCUMENT_ROOT']."/",$html);
    //$html=str_replace(array("href='/","href='https://aliconnect.nl/"),"href='".$_SERVER['DOCUMENT_ROOT']."/",$html);
    //$html=str_replace("img src='https://aliconnect.nl/","img src='".$_SERVER['DOCUMENT_ROOT']."/",$html);
    $dompdf->load_html($html);
    $dompdf->set_paper("a4");
    $dompdf->render();
    $dompdf->stream("$aim->title.doc.pdf", array("Attachment" => false));
    die();
    return $dompdf;
}

function schemas($schemas,$classIds){
    if(!$schema)return;
    $res=query($q="SELECT id,class,config FROM om.class WHERE ".($schemas?"class IN('".implode("','",array_keys($schemas))."')":"id IN(".implode(",",array_keys($classIds)).")"));
    while($row=fetch_object($res)){
        $_GET[schemas][$row->id]=$row->class;
        $schemas[$row->class]=json_decode($row->config);
        $schemas[$row->class]->properties=$schemas[$row->class]->fields;
        unset($schemas[$row->class]->fields);
        foreach($schemas[$row->class]->properties as $key=>$field){
            if($field->required){$schemas[$row->class]->required=$schemas[$row->class]->required?:array();array_push($schemas[$row->class]->required,$key);}
            if($field->kop===0){$schemas[$row->class]->header[0]=$schemas[$row->class]->header[0]?:array();array_push($schemas[$row->class]->header[0],$key);}
            if($field->kop===1){$schemas[$row->class]->header[1]=$schemas[$row->class]->header[1]?:array();array_push($schemas[$row->class]->header[1],$key);}
            if($field->kop===2){$schemas[$row->class]->header[2]=$schemas[$row->class]->header[2]?:array();array_push($schemas[$row->class]->header[2],$key);}
            foreach(array(kop,required)as$key)unset($field->$key);
        }
    }
    return $schemas;
}
function res_to_json($res,$schema){
    $items=array();
    while($row=fetch_object($res)) {
        $schemas[$schema]=1;
        array_push($items,row_to_json($row));
    }
    return json_encode(array(components=>array(schemas=>schemas($schemas),items=>$items)));
}
function checkmsg($row) {
    global $mailer;
    if ($row->mailmsg) {
        $mailmsg=json_decode($row->mailmsg);
        unset($row->mailmsg);
        $mailmsg->keys=$row;
        foreach ($row as $key=>$value) $mailmsg->$key=$value; 
        array_unshift($mailmsg->msgs,(object)array(content=>"Beste <b>$row->ToName</b>,")); 
        if ($row->FromName) array_push($mailmsg->msgs,(object)array(content=>"Met vriendelijk groet,<br>$row->FromName"));
        $mailmsg->Receivers=array(array('to',$row->ToEmail,$row->ToName),array('bcc','aliconnect@alicon.nl','Aliconnect'));
        $mailer->send($mailmsg);
    }
    foreach ($row as $key => $value) if (!is_array($value)) {
        $row->errmsg=preg_replace("/#$key\b/u", $value, $row->errmsg);
        $row->msg=preg_replace("/#$key\b/u", $value, $row->msg);
    }
}
function rgb_to_array($rgb) {
    $a[0] = ($rgb >> 16) & 0xFF;
    $a[1] = ($rgb >> 8) & 0xFF;
    $a[2] = $rgb & 0xFF;
    return $a;
}
function resizeimg($im,$w,$h,$ofile) {
    $width=imagesx($im);
    $height=imagesy($im);
    if ($width <= $w && $height <= $h) return $ofile->src;
    if ($w/$width < $h/$height) { $nWidth = $w; $nHeight = $height*($w/$width); }
    else { $nWidth = $width*($h/$height); $nHeight = $h; }
    $nWidth = round($nWidth);
    $nHeight = round($nHeight);
    $newImg = imagecreatetruecolor($nWidth, $nHeight);
    imagealphablending($newImg, false);
    imagesavealpha($newImg,true);
    $transparent = imagecolorallocatealpha($newImg, 255, 255, 255, 127);
    imagefilledrectangle($newImg, 0, 0, $width, $height, $transparent);
    imagecopyresampled($newImg, $im, 0, 0, 0, 0, $nWidth, $nHeight, $width, $height);
    $newfilename = str_replace('.'.$ofile->ext,$nWidth."x".$nHeight.".".$ofile->ext,$ofile->src);
    $destfile = $_SERVER['DOCUMENT_ROOT'].str_replace('.'.$ofile->ext,$nWidth."x".$nHeight.".".$ofile->ext,$ofile->src);
    switch ($ofile->ext) {
        case 'gif': imagegif($newImg,$destfile); break;
        case 'jpg': imagejpeg($newImg,$destfile);  break;
        case 'png': imagepng($newImg,$destfile,5); break;
        default:  trigger_error('Failed resize image!', E_USER_WARNING);  break;
    }
    return $newfilename;
}
function rrmdir($dir) {
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); 
                else unlink   ($dir."/".$object);
            }
        }
        reset($objects);
        rmdir($dir);
    }
}
function file_save(&$ofile,$content,$replace) {
    $ofile->ext = strtolower(pathinfo($ofile->name ,PATHINFO_EXTENSION));
    if(in_array($ofile->ext,array(php,php3))) return;
    if (!$ofile->lastModifiedDate) $ofile->lastModifiedDate=date("y-m-d H:i:s");
    if ($ofile->id) {
        $ofile->src="$ofile->path/$ofile->name";
        unlink($_SERVER['DOCUMENT_ROOT'].$ofile->src);
        file_put_contents($_SERVER['DOCUMENT_ROOT'].$ofile->src,$content);
        query("UPDATE om.files SET lastModifiedDate='$ofile->lastModifiedDate' WHERE id=$ofile->id");
    }
    else {
        $par = array(sessionID=>$ofile->sessionID,host=>$ofile->host,id=>$ofile->id,itemID=>$ofile->itemID,name=>$ofile->name,ext=>$ofile->ext,type=>$ofile->type,src=>$ofile->src,srcs=>$ofile->srcs,size=>$ofile->size,lastModifiedDate=>$ofile->lastModifiedDate);
        $ofile = fetch_object(dbexec("api.getItemFile",$par));
        $source = $_SERVER['DOCUMENT_ROOT'].$ofile->src;
        $path = pathinfo($source, PATHINFO_DIRNAME);

        mkdir($path,0777,true);
        file_put_contents($source,$content);
        unset($ofile->token);
        if ($token) {
            $folder='folder.dfa7a2802322dfb6.DFA7A2802322DFB6!5255';
            date_default_timezone_set("Europe/London");
            require_once $_SERVER['DOCUMENT_ROOT']."/aim-inc/php/functions.inc.php";
            $sd = new skydrive($token);
	        try {
		        $response = $sd->put_file($folder, $source);
		        $ofile->src=$response[source];
		        $ofile->fid=$response[id];
                unlink($source);
	        } catch (Exception $e) {
		        echo "Error: ".$e->getMessage();
		        exit;
	        }
        }
    }
    if (in_array($ofile->ext,array("png","jpg","gif"))) {
        $im = imagecreatefromstring($content);
        $ofile->srcs=resizeimg($im, 300, 270, $ofile);
        $ofile->src=resizeimg($im, 1200, 1080, $ofile);
    }
    else if (in_array(strtolower($ofile->ext),array("webm","mov"))) {
        $root=$_SERVER['DOCUMENT_ROOT'];
        $ofile->srcmp4 = str_replace(".".pathinfo($ofile->name ,PATHINFO_EXTENSION),".mp4",$ofile->src);
        $s="avconv -i '$root$ofile->src' -crf 10 -b:v 12M '$root$ofile->srcmp4'";
        exec($s);
        $ofile->s=$s;
    }
    unset($ofile->uid);
    unset($ofile->path);
    unset($ofile->host);
    return $ofile;
}
function implodeval($s,$a) {
    $a1=array();
    foreach ($a as $v) if ($v) array_push($a1,$v);
    return implode($s,$a1);
}
?>