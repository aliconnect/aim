<?php
header('Access-Control-Allow-Origin: '.$_SERVER[HTTP_ORIGIN]);
//header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET,HEAD,POST,PUT,DELETE,OPTIONS,PATCH');
header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Content-Type, Accept');


//header('Content-Type: text/json');
//header('X-Content-Type-Options: nosniff');
//die(dsss);
//err($_COOKIE);
//die(json_encode($_COOKIE));
//header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
//header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH');
//header('Access-Control-Allow-Credentials: true');
if($_SERVER[SCRIPT_URI]=="https://aliconnect.nl/")die(header("Location: https://alicon.aliconnect.nl\#webpage/3016849"));

if (isset($_POST[settings])){
    $path="/";
    setcookie(settings,null,time()+$cookieLifetime,'/');
    setcookie(settings,$_POST[settings],time()+$cookieLifetime,$path);
    die();
}

function clean($row=null,$sync=null){
    $row=(object)$row;
    foreach($row as $key=>$value){
        //echo $key.is_null($value).$value.'<br>';
        //if(is_null($value))die($key);
        if(is_null($value)||$value===""){unset($row->$key);continue;}
        if(is_string($row->$key) && in_array($value[0],array('{','['))) $row->$key=json_decode($value);
        if($sync)continue;
        //if(is_numeric($value))$row->$key=(float)$value;
        if(sizeof(explode("-",$value))==3 && $time=strtotime($value))$row->$key=(int)date('His',$time)?date('Y-m-d\TH:i:s\Z',$time):date('Y-m-d',$time);
        else if(is_string($row->$key)) { $row->$key=trim($value); }
    }
    return $row;
}
function getRecordset($schema,$dbname){
    $schema=(object)$schema;
    $searchselect=array();
    $select=$_GET[select]?explode(',',$_GET[select]):array();
    if($schema->title)$searchselect=array_merge($searchselect,$schema->title=explode(" ",$schema->title));
    if($schema->subject)$searchselect=array_merge($searchselect,$schema->subject=explode(" ",$schema->subject));
    if($schema->summary)$searchselect=array_merge($searchselect,$schema->summary=explode(" ",$schema->summary));
    function getVal($row,$searchselect){
        $val=array();
        while($searchselect)if($value=$row->{array_shift($searchselect)})array_push($val,$value);
        return implode(" ",$val);
    }
    if($_GET[id]){
        $row=clean(fetch_object(query("SELECT [$schema->id]AS id,* FROM $dbname.$schema->table WHERE $schema->id=".$_GET[id])));
        foreach ($row as $key=>$value)$values->$key=array(value=>$value);
        return array(array(schema=>$schema->schema,id=>$row->id,title=>getVal($row,$schema->title),subject=>getVal($row,$schema->subject),summary=>getVal($row,$schema->summary),values=>$values));
    }
    $filter=array();
    //$_GET[filter]);
    if($_GET[filter])array_push($filter,$_GET[filter]);
    //if($filter=$_GET[filter]){
    //    $filter=$_GET[filter]?"(([".preg_replace_callback( '/[A-Za-z]+[=]+(("(?:[^\\\\"])*")|([A-Za-z\*]+))|(\ )|(\|)|(,)/', function($match) use(&$replace) {
    //        $r=array(" "=>"'))AND(([",","=>"')OR([","|"=>"')OR([");
    //        return $r[$match[0]]?:preg_replace('/"/',"",strpos($match[0],"*")!==false?str_replace(array('*','='),array("%","]LIKE'"),$match[0]):str_replace(array('='),array("]='"),$match[0]));
    //    }, $_GET[filter])."'))":"";
    //}


    //if($_GET[q] && ($search=explode(' ',str_replace('*','%',urldecode($_GET[q]))))){
    //    foreach ($search as $key)$a[$key]="[".implode("]LIKE'%$key%'OR[",$schema->title)."]LIKE'%$key%'";
    //    array_push($filter,array_values($a));
    //    //$filter.=($filter?" AND ":"")."(".implode(")AND(",array_values($a)).")";
    //}

    //err($schema);
    //$select=array_merge($searchselect,explode(',',$schema->selectlist));
    $top=$_GET[top]?"top ".$_GET[top]:"";
    $items=array();
    if($res=query($q="SELECT $top [$schema->id]AS id,".implode(",",array_merge($searchselect,explode(',',$schema->selectlist)))." FROM $dbname.$schema->table ".($filter?"WHERE (".implode(")AND(",$filter).")":"").($_GET[order]?" ORDER BY ".$_GET[order]:"")))while($row=fetch_object($res)){
        //$item=array(schema=>$schema->schema,id=>$row->id,title=>getVal($row,$schema->title),subject=>getVal($row,$schema->subject),summary=>getVal($row,$schema->summary));
        $item=array(schema=>$schema->schema,id=>$row->id,values=>$row);
        //err($select);

        //if(count($select))foreach($select as $key)if($row->$key)$item->values->$key=array(value=>$row->$key);
        array_push($items,$item);
    }
    //die($q);
    return $items;
}
function getQuery($schema,$idName,$q){
    if($filter=$_GET[filter]){
        $filter=$_GET[filter]?" WHERE(([".preg_replace_callback( '/[A-Za-z]+[=]+(("(?:[^\\\\"])*")|([A-Za-z\*]+))|(\ )|(\|)|(,)/', function($match) use(&$replace) {
            $r=array(" "=>"'))AND(([",","=>"')OR([","|"=>"')OR([");
            return $r[$match[0]]?:preg_replace('/"/',"",strpos($match[0],"*")!==false?str_replace(array('*','='),array("%","]LIKE'"),$match[0]):str_replace(array('='),array("]='"),$match[0]));
        }, $_GET[filter])."'))":"";
    }
    $items=array();
    if($res=query($q.$filter))while($row=fetch_object($res)){
        array_push($items,array(schema=>$schema,id=>$row->$idName,values=>clean($row)));
    }
    return $items;
}
function deleteDir($dirPath) {
    if (! is_dir($dirPath)) { throw new InvalidArgumentException("$dirPath must be a directory"); }
    if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') { $dirPath .= '/'; }
    $files = glob($dirPath . '*', GLOB_MARK);
    foreach ($files as $file) { if (is_dir($file)) { deleteDir($file); } else { unlink($file); } }
    rmdir($dirPath);
}
function addget($q,&$obj){
    global $aim,$get,$location,$aim;
    $obj=$obj?:$aim;
    $res=query($q);
    //while($res){
    foreach($row=fetch_object($res)as $key=>$val)if($val)$obj->$key=$val;
    //next_result($res);
    //}
    return $row;
}
function get(){return $GLOBALS[get]=$GLOBALS[get]?:(object)$_REQUEST;}
function dieget($aim){die(json_encode($aim?:get()));}
function getschema($name){
    $json=json();global $aim,$get,$location,$aim;
    if(!$name)return;
    $name=strtolower(array_shift(explode(";",$name)));
    if($aim->class->$name)return$aim->class->$name;
    $schema=is_numeric($name)?schema(fetch_object(query($q="SELECT config,id classID,class name FROM om.class WHERE id=$name"))):
    schema(fetch_object(query($q="SELECT config,id classID,class name FROM om.class WHERE class='$name'")));

    //die(">>".$q.json_encode(query($q)));
    if($schema->auth)auth();
    return $schema;
}
function schema($row,$oas){
    if(!$row)return;
    global $aim,$get,$location,$aim;
    $cfg=json_decode($row->config);
    $classID=$cfg->classID=$row->classID;
    $name=$cfg->name=strtolower($row->schema?:$row->name);
    $aim->class->$name=$aim->class->$classID=$cfg;
    $json->definitions->{$json->ids->{$cfg->id=$cfg->classID}=$cfg->name=strtolower($cfg->name)}=$cfg;
    $cfg->header=array(array(),array(),array());
    $cfg->filter=array();$cfg->required=array();$cfg->view=array();
    if(isset($cfg->btns)){
            $cfg->methods=$cfg->btns;
            if(isset($cfg->methods->printmenu)){$cfg->methods->print=$cfg->methods->printmenu;unset($cfg->methods->printmenu);}
            if(isset($cfg->printmenu)){$cfg->methods->print=$cfg->printmenu;unset($cfg->printmenu);}
            unset($cfg->methods->printmenu);
    }
    foreach(array(className,btns,printmenu,www,hostID,hostID)as$key)unset($cfg->$key);
    if(isset($cfg->files)){$cfg->properties->files=array(type=>object,format=>files);unset($cfg->files);}
    foreach($cfg->fields as $propname=>$prop){
            foreach(array(filter=>filter,view=>view,required=>required)as$key=>$newkey)if($prop->$key){array_push($cfg->$newkey,$propname);unset($prop->$key);}
            foreach(array(type=>format)as$key=>$newkey)if($prop->$key){$prop->$newkey=$prop->$key;unset($prop->$key);}
            if(isset($prop->readonly))$prop->readOnly=true;
            if(isset($prop->kop)){array_push($cfg->header[$prop->kop],$propname);unset($prop->kop);}
            foreach(array(placeholder=>title,addressField=>format)as$key=>$newkey)if(isset($prop->$key)){$prop->$newkey=$prop->$key;unset($prop->$key);}
            if(isset($prop->idname)){$cfg->ids->{$prop->idname}=$propname;unset($prop->idname);}
            if(isset($prop->location)){$cfg->location=$propname;unset($prop->location);unset($prop->geolocatie);}
            if($oas){
            if (isset($prop->options))if( ($a=(array)$prop->options) && is_string(array_shift($a)) ) $prop->enum=$prop->options; //else{$prop->enum=$prop->options;}
            unset($prop->list,$prop->find);
            }
            unset($prop->hostID,$prop->hostID,$prop->www,$prop->user,$prop->rights,$prop->typeID,$prop->prop,$prop->Name,$prop->readonly);
            $cfg->properties->$propname=$prop;
    }
    unset($cfg->fields);
    unset($cfg->id);
    foreach(array(required,filter,view)as $key) if (!$cfg->$key)unset($cfg->$key);
    return $cfg;
}
function json(){
    global $aim,$get,$location,$aim;
    $aim->json=$aim->json?:(object)array(definitions=>(object)array(),ids=>(object)array());
    return $aim->json;
}
function auth(){
    global $aim,$get,$location,$aim;
    //global $aim,$get,$location,$aim;host();
    if($aim->domainIP && in_array($aim->ip,$aim->domainIP)) return;
    if($aim->code)addget("SELECT userID FROM auth.code WHERE code='$aim->code';");
    if(!$aim->userID){
        header("Location: $aim->root/auth?redirect_uri=$aim->url");
        die();
    }
    if(!$aim->accountUserID||$aim->accountUserID!=$aim->userID)
    addget("SELECT TOP 1 F.aid AS accountAID, lower(F.value) groupName,F.id AS accountID,$aim->userID AS accountUserID FROM om.fields F INNER JOIN api.items A ON A.hostID=$aim->hostID AND A.classID=1004 AND A.toID=$aim->userID AND F.id=A.id AND F.fieldID=1228");
    foreach(array(accountUserID,accountAID,groupName)as$key)setcookie($key,$aim->$key,time()+$cookieLifetime=24*60*60,"/$aim->host/");
}
//function locationbyurl(&$res,$url){
//    $res->href=$url;
//    $url=explode("?",str_replace(":/","://",str_replace("//","/",$url)));
//    $res->pathname=array_shift($url);
//    if($search=array_shift($url))$res->search="?".$search;
//    foreach(explode('&',$search) as $g){$g=explode('=',$g);if($key=array_shift($g)) $res->get->{$key}=array_shift($g);}
//    $res->protocol=explode("//",$res->pathname);
//    $res->dirname=explode("/",array_pop($res->protocol));
//    $res->protocol=array_shift($res->protocol);
//    $res->host=$res->hostname=array_shift($res->dirname);
//    $a=explode(".",$res->basename=array_pop($res->dirname));
//    $res->filename=array_shift($a);
//    if($s=array_shift($a))$res->extension=$s;
//    $res->path=$res->pathname=$res->dirname;
//    //if(!$res->extension)
//    $res->dirname=implode('/',$res->dirname);
//    if(!$res->extension && $res->filename)array_push($res->path,$res->filename);
//    $res->origin=implode('//',array($res->protocol,$res->host));
//    $res->pathname="/".implode("/",$res->pathname);

//    //$a=explode('.',$res->host==localhost?'aliconnect.nl':$res->host);
//    $a=explode('.',$res->host==localhost?"$aim->domainname.nl":$res->host);
//    $res->country=array_pop($a);
//    $res->domain=array_pop($a);
//    $res->subdomain=array_pop($a);
//    $res->host=$res->domain!=$aim->domainname?$res->domain:$res->subdomain?:$res->path[0];
//    foreach($res->path as $i=>$val){
//            if (substr_count($val,'-')==7) $res->get->ID=$val;
//    }
//    if($res->get->ID)getuid($res->get->ID,$get);
//    $res->path=array_values($res->path);
//    return $res;
//}
function requirefiles($arr){
    global $aim,$get,$location,$aim;
    foreach($arr as $fname)if(is_file($fname=$_SERVER['DOCUMENT_ROOT']."/$fname"))require_once($fname);
}
function checkAuth($get){
    if ($get->id && $get->uid && $get->classID && $get->hostID && $get->accountID){
        addget($q="SELECT 1 AS authOK FROM api.items WHERE id=$get->id AND hostID=$get->hostID AND classID=$get->classID AND uid='$get->uid'",$aim);
        //die($q);
        if(!$aim->authOK)error(11,"Account cridentials could not be met");
        //TODO: LOG deze actie of stuur een mail
    }
}
function getDomain($url){
    //$url=explode("/",array_pop(explode("//",array_shift(explode("?",$url)))));
    $url=explode("?",$url);
    $url=array_shift($url);
    $url=explode("//",$url);
    $url=array_pop($url);
    $url=explode("/",$url);
    $domain=explode(".",array_shift($url));
    return (object)array(domain=>$domain,ext=>array_pop($domain),host=>array_pop($domain)?:$aim->domainname,subdomain=>array_pop($domain),folders=>$url);
}
function getuid(&$get){
    if (substr_count($get->id,'-')==8) {
        $a=explode('-',array_shift(explode('.',$get->id)));
        unset($get->id);
        $get->uid=implode('-',array_reverse(array(array_pop($a),array_pop($a),array_pop($a),array_pop($a),array_pop($a))));
        $get->id=hexdec(array_shift($a));
        $get->classID=hexdec(array_shift($a));
        $get->hostID=hexdec(array_shift($a));
        $get->accountID=hexdec(array_shift($a));
    }
    return $get;
}

//session_start();
//err(index);
require_once (__DIR__.'/connect.php');
connect::authorization();
extract((array)$aim->client);
//err(index);
//err(index_auth,$aim);


if ($_GET[statusCode])err($_GET[statusCode]);
$aim->query=$_SERVER[QUERY_STRING];
$aim->uri=$_SERVER[URI]=($_SERVER[HTTPS]==on?https:http)."://".$_SERVER[SERVER_NAME].($_SERVER[REQUEST_URI]?:$_SERVER[SCRIPT_URL].$_SERVER[QUERY_STRING]);
foreach(getallheaders() as $key=>$value)$aim->{strtolower($key)}=$value;
$ext=explode("?",$_SERVER[REQUEST_URI]);
$folders=explode("/",array_shift($ext));
$ext=explode(".",array_pop($folders));
array_push($folders,$aim->filename=array_shift($ext));
array_shift($folders);
if($ext=array_shift($ext))$aim->extension=$ext;
//kijk of de URI die wordt opgestart al een host bevat, bv https://$aim->domainname.nl/alicon/api/v... in dat geval deze host aanhouden.
$arrayUri=explode('//',$_SERVER['URI']);
$arrayUri=explode('/',array_pop($arrayUri));
$urlPath=$url=explode("/",$_SERVER['SCRIPT_NAME']);
array_shift($urlPath);
array_shift($urlPath);
$aim->version=array_shift($urlPath);
$aim->root=array_shift($urlPath);

//err($host,$aim);




foreach (array_unique($folders) as $val) {
    if (is_numeric($val)) $aim->id=$val;
    //else if (is_numeric($val) || substr_count($val,'-')==8) $aim->id=$val;
    //else if (is_numeric($val) || substr_count($val,'-')==8) $aim->id=$val;
    //else if ($base64string=base64_decode($val)) $aim->Id=$base64string;
    if (is_file($fname=__DIR__."/$val.php")) require_once($fname);
	//echo $val;

    if (is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$host->name/api/$aim->version/$val.php")) require_once($fname);
    else if (is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$host->name/api/v1/$val.php")) require_once($fname);
    else if (is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$host->name/api/$val.php")) require_once($fname);
    //if (($aim->json=base64_decode($val, true))!==false);

	//afhandelen odata functie call
    if(preg_match('/(.*?)\((.*?)\)/si',$val,$matches)){
        //echo $matches[0];
        //$aim->arguments=trim($matches[2],"'");
		$aim->arguments=$matches[2]?array_filter(array_map(function($x) use ($newValue){ return trim($x,"'"); }, explode(",",$matches[2]))):array_values($_GET)?:array_values($_POST);
		//err($aim->arguments);
        //if (method_exists($class,$method=$matches[1])) die(is_object($ret=call_user_func_array(array($class,$method),$aim->arguments))?json_encode($ret):$ret);
        if (method_exists($class,$method=$matches[1])) die(json_encode(call_user_func_array(array($class,$method),$aim->arguments)));
        else if (function_exists($method)) die(json_encode(call_user_func_array($method,$aim->arguments)));
        else {
            $aim->schema=$class;
			$aim->Id=$matches[2];
        }
    }
    else if (class_exists($val))$aim->class=$class=$val;
    else if ($_GET[schema] && method_exists($aim->class=$class=$_GET[schema],$val))$aim->method=$method=$val;
    else if ($class && method_exists($class,$val))$aim->method=$method=$val;
    else if (in_array($val,array(aim,$host->name,$aim->root,$aim->version,$aim->schema,$aim->function,$aim->Id))) continue;
    //else if (!$aim->host) $aim->host=$val;
    else if (!$aim->root) $aim->root=$val;
    else if (!$aim->version) $aim->version=$val;
    else if (!$aim->schema) $aim->schema=$val;
    //else if (!$aim->function) $aim->function=$val;
    else if (!$aim->Id) $aim->Id=$val;
}

//die(class_exists(pakbon));


//err($aim);


//err(class_exists(soap),$aim);

if($aim->Id) $aim->json=base64_decode($aim->Id, true);
if($aim->json)$aim=object_merge($aim,json_decode($aim->json,true));



$method=$aim->method=$aim->method?:strtolower($_SERVER[REQUEST_METHOD]);

//err($class,$method);


//$aim->class=$class=$class?:$aim->schema;
//err($aim);

//require_once(__DIR__.'/api.php');
//soap::post();
//die();

//err($aim);

//err($aim);


foreach([$aim->folder,$class,api] as $className)if(method_exists($className,$method)){
	if ($result=$className::$method()) die(json_encode($result));
	die();
}




//err($aim);


//err($class,$method);

//die();

//die($class.$method);
//err(a,$aim);





$page=fetch_object($res=query($q="
    SELECT TOP 1 H.id AS hostID,S.id siteID,P.id pageID,P.title,P.subject,P.files
    FROM api.items H
    LEFT OUTER JOIN api.items S ON S.hostID=H.id AND S.masterID=H.id AND S.classID=1091
    LEFT OUTER JOIN api.items P ON P.hostID=H.id AND P.www=1 AND P.startDT IS NOT NULL AND ".($_GET[id]?"P.id=".$_GET[id]:"P.masterID=S.id")."
    WHERE H.id=$host->id
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
die();





err('no-action ',[classname=>$class,methodname=>$method,REQUEST_URI=>$_SERVER[REQUEST_URI],URL=>$_SERVER[URL],QUERY_STRING=>$_SERVER[QUERY_STRING],SCRIPT_FILENAME=>$_SERVER[SCRIPT_FILENAME]]);


//err($aim);

//err($aim);
//err($aim);

//die($aim->schema);

//die("HOST=".$aim->host);
//die($aim->host);


//err($aim);


//MVK
//getuid($aim);

if (is_file($fname=$aim->filename.".php")) require_once($fname);

//err($aim);

//$aim->host1=$aim->host;



if (isset($_POST[deviceUID])){
    $aim->device=fetch_object(query("SELECT id,CONVERT(VARCHAR(50),uid)uid FROM om.items WHERE classID=1008 AND CONVERT(VARCHAR(50),uid)='".$_POST[deviceUID]."';"));
    if($aim->device->id){ setcookie(device,json_encode($aim->device),$cookieLifetime,"/");	}
    //err($aim->device);
    foreach($_POST as $key=>$value)setcookie($key,$value,$cookieLifetime,"/");
    die(header("Location: ".$_GET[redirect_uri]));
}

if($aim->host && !$aim->hostID){
    if($domain)$host=fetch_object(query("SELECT H.id AS hostID,H.name AS hostName,H.keyname AS host,CONVERT(VARCHAR(50),H.uid) AS hostUID FROM api.items H INNER JOIN api.items S ON S.classID=1091 AND S.keyname='$domain' AND H.id=S.hostID"));
    else $host=fetch_object(query("SELECT H.id AS hostID,H.name AS hostName,H.keyname AS host,CONVERT(VARCHAR(50),H.uid) AS hostUID FROM api.items H WHERE hostID=1 AND classID=1002 AND keyname='$aim->host'"));
    //$aim->host1=$host->host;
    //err($host);
    foreach(array(host,hostID,hostName,hostUID) as $key)setcookie($key,$aim->$key=$host->$key,$cookieLifetime, "/$host->host/" );
}
//err($aim);
//$aim->host2=$aim->host;

//err($aim->host,$aim->hostID);


//$aim->client0=$aim->client;
//$aim->client=$aim->client?json_decode($aim->client):null;
$aim->user=$_COOKIE[user]?json_decode($_COOKIE[user]):(object)array();
$aim->userID=$aim->user->id;
$aim->userUID=$aim->user->uid;
$aim->userName=$aim->user->name;
if(!$aim->user->id)$aim->client->user=$aim->client->host=$aim->client->account=$aim->client->group=(object)array();
else if ($aim->user->id != $aim->client->user->id || $aim->user->uid != $aim->client->user->uid || !$aim->client->host->id || !$aim->client->account->id || !$aim->client->group->id ) {
    //die(newuser);
    //die(leeg);
    //err('client',$aim);
    //die($aim->userID);
    //$aim->client->user=$aim->client->host=$aim->client->account=$aim->client->group=null;
    if($aim->root==api){
        $aim->hostID=$aim->hostID?:1;
        $res=query($query="
            DECLARE @accountID INT,@groupID INT
            EXEC api.getAccount @hostID=$aim->hostID,@userID=$aim->userID,@accountID=@accountID OUTPUT,@groupID=@groupID OUTPUT
            SELECT id,uid,keyname name FROM api.items WHERE id=$aim->hostID
            SELECT I.id,I.uid,I.title name,CASE WHEN U.mse_access_token IS NOT NULL THEN 1 END mseAccount FROM api.items I INNER JOIN auth.users U ON U.id = I.id AND I.id=$aim->userID
            SELECT id,uid,title name FROM api.items WHERE id=@accountID
            SELECT id,uid,title name FROM api.items WHERE id=@groupID
        ");
        //die($query);
        foreach(array(host,user,account,group)as $key){
            $aim->client->{$key}=fetch_object($res);
            next_result($res);
        }
        setcookie(client,json_encode($aim->client),$cookieLifetime,"/$aim->host/");
    }
}

//err($_COOKIE);
//err($aim);



//$aim->client=$aim->client?:(object)array(host=>(object)array(),user=>(object)array(),account=>(object)array(),group=>(object)array());


//foreach($aim->client as $name=>$obj)foreach($obj as $key=>$val)$aim->{$name.ucfirst($key)}=$val;




//DEVICE!!!!!!!!!!!!!!!!!
$aim->client->device=$aim->device=$aim->device[0]=="{"?json_decode($aim->device):fetch_object(query("INSERT om.items(hostID,classID)VALUES(1,1008);SELECT id,CONVERT(VARCHAR(50),uid)uid FROM om.items WHERE id=scope_identity();"));
setcookie(device,json_encode($aim->device),$cookieLifetime,"/");


//$aim->client->ip=$aim->IP=$_SERVER[HTTP_X_REAL_IP];
$aim->client->ip=$aim->IP=$_SERVER[REMOTE_ADDR];
//foreach(array(host,user,account,group)as $key)$aim->{'client'.$key.'ID'}=$aim->client->{$key}->id;

$aim->REDIRECT_STATUS=$_SERVER["REDIRECT_STATUS"];

if ($_GET[statusCode])err($_GET[statusCode]);

if($aim->root==api){
    //die(max);
    $aim->schema=$aim->schema?:(is_numeric($aim->folder)?item:$aim->folder?:item);
    $aim->id=is_numeric($aim->folder)?$aim->folder:$aim->id;
    if(is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/app/$aim->host.json"))$aim=(object)array_merge((array)$aim,(array)json_decode(file_get_contents($fname)));

    if (in_array($aim->schema,array(contacts,messages,events,calendarview,people))) require_once(__DIR__."/mse.php");

    //err($aim);
    foreach (array($aim->host,$aim->root,$aim->schema,$aim->source,$aim->filename) as $val)if($val){
        if (is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/api/$aim->version/$val.php")) require_once($fname);
        else if (is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/api/v1/$val.php")) require_once($fname);
        else if (is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/api/$val.php")) require_once($fname);
        if (is_file($fname=__DIR__."/$val.php")) require_once($fname);
    }
    //err($aim);
    //err($aim);

    foreach(array($aim->schema,item) as $class) {

        if($class && class_exists($class)) {
            //echo method_exists(test);

            foreach(array($aim->function,strtolower($_SERVER[REQUEST_METHOD])) as $method)
                if($method && method_exists($class,$method)) {
                    //err(array($class,$method,class_exists($class),$aim->function,$_SERVER[REQUEST_METHOD],method_exists($class,$method)));
                    //die("$class $method");
                    $class = new $class;
                    die(json_encode($class->$method()));
                }
        }
    }
    //die(aaa2);
    //err($aim);
    err(1001);
}
//foreach($fnames=array(
//    //__DIR__."/lib/".substr(str_replace("$aim->host/","",$location->pathname),1).".html",
//    //__DIR__."/lib/$aim->filename.html",
//    //$_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/app/index.html",
//    __DIR__."/../app/site/index.html",
//) as $fname)if(is_file($fname))break;
//$html=file_get_contents($fname);

//$head1.="
//    <link rel='apple-touch-icon' href='/sites/$aim->host/img/logo/logo-60.png' />
//    <link rel='apple-touch-icon' sizes='76x76' href='/sites/$aim->host/img/logo/logo-76.png' />
//    <link rel='apple-touch-icon' sizes='120x120' href='/sites/$aim->host/img/logo/logo-120.png' />
//    <link rel='apple-touch-icon' sizes='152x152' href='/sites/$aim->host/img/logo/logo-152.png' />
//    <link rel='apple-touch-startup-image' href='/sites/$aim->host/img/logo/logo-startup.png' />
//";

////err($aim);
////if(!$aim->root && !$aim->filename)//load welkomst PAGINA
////if($aim->filename)//load pagina met naam
//$qp= $aim->location->folders[1]?"'$aim->root' AND P.keyname='$aim->filename'":"'webpage' AND P.masterID=S.id AND P.idx=0";
//$aim->sql=$q="DECLARE @siteID INT,@pageID INT
//SELECT TOP 1 @siteID=id FROM om.items WHERE hostID=$aim->hostID AND classID=1091 AND deletedDT IS NULL
//SET NOCOUNT OFF;
//SELECT 'website'[schema],id,title FROM om.items WHERE id=@siteID
//SELECT TOP 1 [schema],id,title,subject FROM api.citems WHERE hostID=$aim->hostID AND ".($aim->id ? "id=$aim->id" : ($aim->location->folders[1] ? "[schema]='$aim->root' AND keyname='$aim->filename'" : "classID=1092 AND masterID=@siteID AND idx=0"));
////err($_GET);
//$site=$aim->site=fetch_object($res=query($q));
//if(next_result($res))$page=$aim->page=fetch_object($res);
//if(!$page->id){
//    $page->title='Page not found';
//    $page->subject='This page is not available.';
//}
//$page->src=json_decode($page->files);
//$page->src=$page->src[0]->src;
//$page->mobile=$page->mobile?:preg_match("/(android|webos|avantgo|iphone|ipad|ipod|blackberry|iemobile|bolt|boost|cricket|docomo|fone|hiptop|mini|opera mini|kitkat|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
//$page->host=$aim->host;
//$page->hostID=$aim->hostID;
////err($aim);
////$site->ID=$get->ID;
//$head.="	<title>".strip_tags($page->title)."</title>
//    <meta property='fb:app_id' content='487201118155493'>
//    <meta property='og:url' content='".str_replace("'","",strip_tags($_SERVER[REDIRECT_SCRIPT_URI]))."' />
//    <meta property='og:type' content='website'>
//    <meta property='og:title' name='og:title' content='".str_replace("'","",strip_tags($page->title))."' />
//    <meta property='og:description' name='og:description' content='".str_replace("'","",strip_tags($page->subject))."' />
//    <meta property='og:image' name='og:image' content='".str_replace("'","",strip_tags($page->src))."' />
//    <meta property='og:image:width' content='450'>
//    <meta property='og:image:height' content='300'>
//    <script>itemsite=".json_encode($site).";itempage=".json_encode($page).";</script>
//";
//echo str_replace("</head>",$head."</head>",$html);



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
