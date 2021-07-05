<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
ini_set('memory_limit',-1);
ini_set('upload_max_filesize','20M');
ini_set('post_max_size','20M');
ini_set('default_charset', 'UTF-8');
ini_set('mssql.textlimit', '2147483647');
ini_set('mssql.textsize', '2147483647');
//namespace connect;
class host {
	public function get(){
		extract((array)$GLOBALS[aim]->access);
		$get=(object)$_GET;
		$row=fetch_object(query("SELECT id,uid,userID,secret FROM api.items WHERE hostID=1 AND classID=1002 AND keyname='$get->name'"));
		if($row->id && !$row->secret) $row=fetch_object(query("UPDATE om.items SET value=newid() WHERE id=$row->id;SELECT id,uid,ownerID,lower(value) secret FROM api.items WHERE id=$row->id"));
		if($row->userID!=$user->id) $row->secret='**************';
		return $row;
	}
}

class client {
	public function post(){
		global $aim;
		extract((array)$GLOBALS[aim]->access);
		//err($GLOBALS[aim]->access,$host);
		return fetch_object(query("INSERT om.items(hostID,classID,secret)VALUES($host->id,1015,newid());SELECT id,uid,secret FROM api.items WHERE id=scope_identity();"));
	}
	//public function client(){
	//    return fetch_object(query("INSERT om.items()VALUES();SELECT * FROM api.items WHERE id=scope_identity();"));
	//}
	//public function getClient(){
	//    return fetch_object(query("INSERT om.items()VALUES();SELECT * FROM api.items WHERE id=scope_identity();"));
	//}
}

class settings {
    public function post() {
        global $aim;
        setcookie(settings,json_encode($aim->settings=object_merge($aim->settings,$_POST)),$cookieLifetime=time()+1*24*60*60,"/");
		connect::set_device();
        return $aim->settings;
    }
}

class connect {
	private function base64_encode($obj){
		return str_replace(['+', '/','='], ['-','_',''], base64_encode($obj));
	}
	public function set_device($uid=null) {
		global $aim;
		if($uid) setcookie(deviceId,$aim->deviceId=base64_encode(json_encode(fetch_object(query("SELECT id,uid FROM api.items WHERE uid='$uid';")))),$cookieLifetime=time()+356*24*60*60,"/");
        else if(!$aim->deviceId) setcookie(deviceId,$aim->deviceId=base64_encode(json_encode(fetch_object(query("INSERT om.items(hostID,classID)VALUES(1,1008);SELECT id,uid FROM api.items WHERE id=scope_identity();")))),$cookieLifetime=time()+356*24*60*60,"/");
	}
	public function jwt_encode($payload,$secret=null,$alg="sha256"){
		$payload=is_string($payload)?json_decode($payload):(object)$payload;
	    $secret=$payload->secret?:$secret;
	    unset($payload->secret);
		if ($secret!==false && !$secret) {// && !$payload->token_id) {
			$q.="DECLARE @secret UNIQUEIDENTIFIER,@id INT";
			if ($payload->token_id)$q.=";IF EXISTS(SELECT 0 FROM auth.token WHERE id=$payload->token_id) BEGIN;SELECT id,secret FROM auth.token WHERE id=$payload->token_id;RETURN;END;ELSE SET @id=$payload->token_id";
			else $q.=";INSERT om.items(hostID,class)VALUES(1,1020);SET @id=scope_identity()";
			$q.=";SET @secret=newid();INSERT auth.token(id,secret)VALUES(@id,@secret);SELECT @id AS id,@secret AS secret";
			$row=fetch_object(query($q));
			$secret=$row->secret;
			$payload->token_id=$row->id;
			//$secret=fetch_object(query("DECLARE @secret UNIQUEIDENTIFIER; SET @secret=newid(); INSERT auth.token(id,secret)VALUES(1,1020,newid());SELECT uid,secret FROM api.items WHERE id=scope_identity()"));
			//$token=fetch_object(query("DECLARE @id UNIQUEIDENTIFIER,@secret UNIQUEIDENTIFIER; SET @id=newid();SET @secret=newid();INSERT auth.token.items(hostID,class,secret)VALUES(1,1020,newid());SELECT uid,secret FROM api.items WHERE id=scope_identity()"));
			//$secret=$token->secret;
		}
	    $payload=json_encode($payload);
	    $jwt = implode(".",[$base64UrlHeader = self::base64_encode(json_encode([typ=>"JWT", alg=>$alg])),$base64UrlPayload = self::base64_encode($payload),$base64UrlSignature = self::base64_encode(hash_hmac($alg, $base64UrlHeader . "." . $base64UrlPayload, $secret, true))]);
	    return $jwt;
	}
	public function jwt_decode($jwt,$secret='',$alg="sha256") {
	    $jwt=explode(".",$jwt);
	    $resp->header=json_decode(base64_decode($base64UrlHeader=array_shift($jwt)));
	    $payload=$resp->payload=json_decode(base64_decode($base64UrlPayload=array_shift($jwt)));
	    $signature=array_shift($jwt);
		if ($secret!==false && $payload->token_id) $secret=fetch_object(query("SELECT secret FROM auth.token WHERE id='$payload->token_id'"))->secret;
	    $resp->valid=$signature==self::base64_encode(hash_hmac($alg, $base64UrlHeader . "." . $base64UrlPayload, $secret, true));
	    return $resp;
	}
	private function get_domain_name() {
		global $aim;
		$aim->httpHost=$_SERVER[HTTP_HOST];
		$REQUEST_URI=explode("?",$_SERVER[REQUEST_URI]);
		$folders=explode("/",array_shift($REQUEST_URI));
		if ($folders[1] && $folders[1]!=aim) {
			$domain=$folders[1];
		}
		else {
			$path=explode('/',array_pop(explode('//',array_shift(explode("?",$_SERVER[HTTP_REFERER]?:$_SERVER[URI])))));
			$HTTP_REFERER_HOST=array_shift($path);
			if (substr_count($HTTP_REFERER_HOST,".")==3){ // $HTTP_REFERER_HOST is een ip adres, host is volgende folder
				$domain=array_shift($path);
			}
			else if (substr_count($HTTP_REFERER_HOST,".")==2){ // $HTTP_REFERER_HOST is een subdomain
				$HTTP_REFERER_DOMAIN_ARRAY=explode(".",$HTTP_REFERER_HOST);
				if ($HTTP_REFERER_DOMAIN_ARRAY[1]=="aliconnect" && in_array($HTTP_REFERER_DOMAIN_ARRAY[2],["nl","localhost"]))
					// als subdomain onder aliconnect.nl dan hast=subdomain
					$domain=$HTTP_REFERER_DOMAIN_ARRAY[0];
				else
					// als subdomain onder andere domain dan host=naam domain
					$domain=$HTTP_REFERER_DOMAIN_ARRAY[1];
			}
			else if (substr_count($HTTP_REFERER_HOST,".")==1){ // $HTTP_REFERER_HOST is een domain
				if ($HTTP_REFERER_HOST=="aliconnect.nl")
					$domain=array_shift($path);
				else {
					$HTTP_REFERER_DOMAIN_ARRAY=explode(".",$HTTP_REFERER_HOST);
					$domain=array_shift($HTTP_REFERER_DOMAIN_ARRAY);
				}
			}
			else if (substr_count($HTTP_REFERER_HOST,".")==0){ // $HTTP_REFERER_HOST is een server naam of localhost
				$domain=array_shift($path);
			}
		}
		if (in_array($domain,array(aim,app,api,auth)))$domain=aliconnect;
		if (!$domain)$domain=aliconnect;
		return $domain;
	}
	public function authorization(){
		global $aim;
		$aim->domain_name=self::get_domain_name();
		if (!$aim->access_token) {
			$headers=getallheaders();
			foreach($headers as $key=>$value)$headers[strtolower($key)]=$value;
			if($authorization=$headers[authorization]) {
				$authorization=explode(" ",$authorization);
				$authentication=array_shift($authorization);
				if ($authentication==Basic) { // SOAP, wordt pas in deze functie uitgevoerd
					$authorization=explode(":",base64_decode(array_shift($authorization)));
					$client_id=array_shift($authorization);
					$aim->access_token=array_shift($authorization);
				}
				else if ($authentication==Bearer) {
					$aim->access_token=array_shift($authorization);
				}
			}
		}
		if ($aim->access_token) {
			$access=connect::jwt_decode($aim->access_token);
			if($access->valid===true) return $aim->client=$access->payload;
		}
		$device=$aim->deviceId?json_decode(base64_decode($aim->deviceId)):(object)[];
		if (!$aim->client || $access->valid===false) {
			$client=fetch_object(query("SELECT id,uid,keyname name FROM api.items WHERE hostID=1 AND classID=1002 AND keyname>'' AND keyname='$aim->domain_name'"));
			$client->id=$client->id?:1;
			$client->name=$client->name?:aliconnect;
			$aim->access_token=connect::jwt_encode($aim->client=object_merge($config->client,[
				client=>$client,
				domain=>$client,
				host=>$client,
				application=>fetch_object(query("SELECT id,uid,name FROM api.items WHERE classID=1012 AND uid='$aim->application_id'")),
				user=>(object)[],
				account=>(object)[],
				device=>$device
			]),false);
		}
		if($aim->userId && !$aim->client->user->id) {
			$user_jwt=connect::jwt_decode($aim->userId);
			if($user_jwt->payload->id != $aim->client->user->id) {
				if($user_jwt->valid===true) {
					$aim->client->user=$user_jwt->payload;
					extract((array)$aim->client);
					$account=fetch_object(query($q="
						SELECT AC.id,AC.uid,ACS.value userscope,TS.value AS teamscope
						FROM api.items AC
						INNER JOIN api.attributes ACT ON ACT.id=AC.id AND ACT.fieldID=3 AND AC.classID=1004 AND AC.hostID=$domain->id AND AC.toID=$user->id
						LEFT OUTER JOIN api.attributes ACS ON ACS.id=AC.id AND ACS.fieldID=1994
						INNER JOIN api.items T ON T.id = ACT.itemID
						LEFT OUTER JOIN api.attributes TS ON TS.id=T.id AND TS.fieldID=1994
					"));
					if($account->id){
						$aim->client->account->id=$account->id;
						$aim->client->account->uid=$account->uid;
						$aim->client->user->scope=[Account=>[FirstName=>r,LastName=>r]];
						$aim->client->host->scope=[Contact=>crud,System=>crud];
					}
					$aim->access_token=connect::jwt_encode($aim->client,false);
				}
			}
		}
	}
}

function object_merge($obj1,$obj2,$obj3=[],$obj4=[]){ return $obj1=(object)array_merge((array)$obj1,(array)$obj2,(array)$obj3,(array)$obj4);}
function getId($payload,$secret=null,$alg="sha256"){
    if (is_numeric($payload))$payload=fetch_object(query("SELECT class[schema],id,uid FROM api.citems WHERE id=$payload"));
    global $aim;
            //$item->Id=auth::jwt_encode($payload,$row->uid);
            //$item->IdDecode=auth::jwt_decode($item->Id);
            //$item->IdCheck=auth::jwt_verify($item->Id,$row->uid);
    //$payload=base64_encode(json_encode(array_merge([hostID=>$aim->hostID,server=>'db1.aliconnect.nl',db=>'aim',schema=>"",id=>0,uid=>""],(array)$payload)));
    $payload=base64_encode(json_encode($payload));
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], $payload);
    if(!$secret)return $base64UrlPayload;
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode([typ=>"JWT", alg=>$alg])));
    $signature = hash_hmac($alg, $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}
function error($err,$msg=null,$data=null){
    global $aim;
    //die($err);
    $errorCodes = array(
        200 => 'Redirected',
        400 => 'Bad HTTP request',
        401 => 'Unauthorized - Iinvalid password',
        403 => 'File Forbidden',
        404 => 'File Not Found '.$_SERVER[URI],
        500 => 'Internal Server Error',
        503 => 'Internal Server Error 503',
        508 => 'Internal Server Error 508',
        511 => 'Internal Server Error 511',
        1001 => 'Api call not available',
    );
    $error->errorNumber=$err;


    $error->error=$msg?:$errorCodes[$err];



    //die(is_numeric($err));
    if(!is_object($err) && is_numeric($err) && $error->error) query("INSERT his.error (errorNumber,error,data)VALUES($err,'".json_encode($error->error)."','".dbvalue(json_encode($aim,JSON_PRETTY_PRINT))."')");
    //die(err.$error->error);


    //if($_SERVER[HTTP_REFERER]) die(json_encode(array(error=>$errorCodes[$err[0]],code=>$err[0],target=>$err[1])));
    //if($_SERVER[HTTP_REFERER])
    die(json_encode($error,JSON_PRETTY_PRINT));
    die("<p>".json_encode($error)."</p>");

    die("<p>ErrorNumber:".$err.":".$errorCodes[$err]."</p>");
    die();
}
function err($err=null,$data=null){error($err,$data);}
function arrayToObject( $array ){
  foreach( $array as $key => $value ){
    if( is_array( $value ) ) $array[ $key ] = arrayToObject( $value );
  }
  return (object) $array;
}
function raw_json_encode($input, $flags = 0) {
    $fails = implode('|', array_filter(array(
        '\\\\',
        $flags & JSON_HEX_TAG ? 'u003[CE]' : '',
        $flags & JSON_HEX_AMP ? 'u0026' : '',
        $flags & JSON_HEX_APOS ? 'u0027' : '',
        $flags & JSON_HEX_QUOT ? 'u0022' : '',
    )));
    $pattern = "/\\\\(?:(?:$fails)(*SKIP)(*FAIL)|u([0-9a-fA-F]{4}))/";
    $callback = function ($m) {
        return html_entity_decode("&#x$m[1];", ENT_QUOTES, 'UTF-8');
    };
    return preg_replace_callback($pattern, $callback, json_encode($input, $flags));
}
function getPassword(){
	$signs="_";
	for ($x = 0; $x < 4; $x++) $s.=chr(mt_rand(65,90)).chr(mt_rand(97,122)).chr(mt_rand(48,57)).$signs[mt_rand(0,strlen($signs)-1)];
	$s=str_split($s);
	shuffle($s);
	$s=implode("",$s);
	return $s;
}
function isnull($val,$valifnull) {return is_null($val)?$valifnull:$val;}
function makeuid($s,$make) {if ($make) return substr_replace(substr_replace(substr_replace(substr_replace($s,'-',20,0),'-',16,0),'-',12,0),'-',8,0); else return str_replace('-','',$s);}
function ic($value) {return $value;}
function ic1($value) {return iconv("CP1252", "UTF-8", urldecode($value));}
function c2u($value) {return iconv("CP1252", "UTF-8", urldecode($value));}
function u2c($value) {return iconv("UTF-8", "CP1252", urldecode($value));}
function h2u($value) {return mb_convert_encoding($value, "HTML-ENTITIES", "UTF-8");}
function toUtf8($value) {return iconv("CP1252", "UTF-8", urldecode($value));}
function icd($value) {return iconv("UTF-8", "CP1252", urldecode($value));}
function icp($v) {return mb_convert_encoding($v, "HTML-ENTITIES", "UTF-8");}
function dbvalue($value){return str_replace("'","''",trim($value));}
function parvalue($value) {$value=trim($value); return substr($value,0,3)!='fn.' && substr($value,-2)!='()' && $value[0]!='@'?(in_array($value,array('undefined','','null','[]','{}'))?"NULL":"'".dbvalue($value)."'"):$value; }
//function parvalue($value) {$value=trim($value); return substr($value,0,3)!='fn.' && substr($value,-2)!='()' && $value[0]!='@'?(in_array($value,array('undefined','null'))?"NULL":"'".dbvalue($value)."'"):$value; }
function params($par) {
    if (!$par) $par=$_POST;
    $params=array();
    foreach ($par as $key => $value) { array_push ($params,"@$key=".parvalue($value));}
    return implode(",",$params);
}
function paramfields($par) {
    $params=array();
    if (!isset($par)) $par=$_POST;
    foreach ($par as $key => $value) {
		$value=$value->value?:$value;
        $key=str_replace("/_"," ",$key);
        array_push ($params,"[$key]=".parvalue($value));
    }
    return implode(",",$params);
}
function preparesql($query,$params){
    $a=explode(';',$query);
    $a=explode('?',$a[0]);
    foreach ($params as $i => $value) $a[$i].= parvalue($value);
    return implode('',$a).";";
}
function prepareexec($sp,$params){
    $exec_params=array();
    foreach ($params as $key => $value) { array_push($exec_params,"@$key=".parvalue($value));}
    return ";EXEC $sp ".implode(',',$exec_params).";";
}

function fieldids($properties){
    $iflds=array();
    $res=query("SELECT id FROM om.field WHERE name IN ('".implode("','",explode(",",$properties))."')");
    while($row=fetch_object($res)) array_push($iflds,$row->id);
    return implode(',',$iflds);
}
function properties($properties){
    return "(SELECT id fieldItemID,name,value FROM om.fields WHERE fieldID IN (".fieldids($properties)."))X PIVOT(MAX(value)FOR name IN ($properties))";
}
function fieldquery($properties,$sql){
    return str_replace('@F',"(SELECT id,name,value FROM om.fields WHERE fieldID IN (".fieldids($properties)."))X PIVOT(MAX(value)FOR name IN ($properties))",$sql);
}
function query($q,$nopre=null){return $GLOBALS[dbaim]->query($q,$nopre);}
function querysql($sql){
	$arr=explode("\nGO",str_replace(";",";\r\n",$sql));
	foreach($arr as $sql) query($sql,true);
}

//function query($q){return query("SET NOCOUNT ON;SET TEXTSIZE 2147483647;".$q);}
function sql($q){return $GLOBALS[dbaim]->query($q);}
function fetch_object($res){return $GLOBALS[dbaim]->fetch_object($res);}
function fetch_array($res){return $GLOBALS[dbaim]->fetch_array($res);}
function dbexec($q,$post){return $GLOBALS[dbaim]->exec($q,$post);}
function dbclose(){return $GLOBALS[dbaim]->close();}
function next_result(&$res){
	while($row=fetch_object($res));
	return $GLOBALS[dbaim]->next_result($res);
}
function num_rows($res){return $GLOBALS[dbaim]->num_rows($res);}

function dbvalueget($value,$result,$i) {
    if ($value===NULL) return null;
    if (in_array(odbc_field_type($result,$i),array(date,datetime))) return str_replace(' ','T',$value);
    if (in_array(odbc_field_type($result,$i),array(int,bit,tinyint,smallint))) return intval($value);
    if (in_array(odbc_field_type($result,$i),array(decimal,real,float,smallmoney,money,numeric))) return floatval($value);
    return iconv("CP1252", "UTF-8", trim($value));
    //return iconv("UTF-8", "CP1252", trim($value));
    //return utf8_encode(trim($value));
    //return utf8_encode(trim($value));
    //return utf8_encode(trim($value));
}
function cleanrow($row){
	foreach($row as $key=>$value){
		if ($value==="")unset($row->$key);
		else if (is_array($value) && count($value)==0)unset($row->$key);
		else if (is_numeric($value))$row->$key=floatval($value);
	}
	return $row;
}

class Db {
    function __construct($db) {
			foreach($db as $key=>$value)$this->{$key}=$value;
				//$this->server = $db->server;
				//$this->UID = $db->UID;
				//$this->PWD = $db->PWD;
				//$this->dbname = $db->dbname;
				//$this->cs = $db->cs;
				//if ($db->cs) {
				//    foreach($this as $key => $value) $db->cs=str_replace('$'.$key,$value,$db->cs);
				//    $this->cs = $db->cs;
				//}
        $this->connect();
    }
}
class DbSqlsrv extends Db {
    public function connect() {
        $this->conn = sqlsrv_connect ( $this->server, array(Database=>$this->dbname,UID=>$this->UID,PWD=>$this->PWD,ReturnDatesAsStrings=>true,"CharacterSet" => "UTF-8"));
        sqlsrv_configure('ClientBufferMaxKBSize', 180240);
    }
    public function close() {
        sqlsrv_close ( $this->conn);
    }
    public function errors() { return sqlsrv_errors(); }
    //public function query($query, $nopre=null, $conn=null, $params=null) {
    public function query($query, $nopre=null) {
        $this->result=$result = sqlsrv_query ( $this->conn, ($nopre?"":"SET TEXTSIZE -1;SET NOCOUNT ON;").$query , $params, array("Scrollable"=>"buffered"));            //,"CharacterSet" => "UTF-8"
        if( $result === false && (($errors = sqlsrv_errors() ) != null)) foreach( $errors as $error ) {
            if ($error->code==1205) return $this->query($query);
            die($error[message].PHP_EOL.str_replace(";",";\r\n",$query));
            $error[query]=$query;
            die(json_encode(array(errors=>$error)));
        }
        return $result;
    }
    public function exec ($sp,$params=null) { return $this->query(prepareexec($sp,$params)); }
    public function execsql ($query,$params=null) { return $this->query(preparesql($query,$params)); }
    public function fetch_array( $result ) { return sqlsrv_fetch_array ( ($result)?$result:$this->result , SQLSRV_FETCH_ASSOC ); }
    public function fetch_object( $result ) {
        $row = sqlsrv_fetch_object(($result)?$result:$this->result);
        //foreach ($row as $key => $value) $row->$key = trim($value);
        //foreach ($row as $key => $value) $row->$key = trim($value);//utf8_encode(iconv("UTF-8", "CP1252", trim($value)));//trim($value);
        return $row;
    }
    public function num_fields( $result ) {return sqlsrv_num_fields ( $result );}
    public function num_rows ( $result ) {return sqlsrv_num_rows ( $result );}
    public function field_name( $result ) {return "functie bestaat niet";}
    public function next_result ( &$result ) {return sqlsrv_next_result($result)?true:false; }
    public function getParam($name, $defaultValue="") {
        if(isset($_POST[$name])){
            $value=$_POST[$name];
        } else {
            if(isset($_GET[$name])) {
                $value=$_GET[$name];
            } else {
                $value=0;
            }
        }
        return $value;
    }
}

function db($name) {
    global $db;
    if (!$db[$name]->conn) {
        if ($db[$name]->driver=='mssql') {
            if (function_exists ( "sqlsrv_connect" )) $db[$name] = new DbSqlsrv($db[$name]);
            else if (function_exists ( "mssql_connect" )) $db[$name] = new DbMssql($db[$name]);
            else {
                $db[$name]->cs='Driver=FreeTDS;Server=$server;Database=$dbname;';
                $db[$name] = new DbOdbc($db[$name]);
            }
        }
        else if ($db[$name]->driver=='odbc') $db[$name] = new DbOdbc($db[$name]);
    }
    return $db[$name];
}

$GLOBALS[config]=json_decode(file_get_contents(__DIR__.'/../config.json'));

$aim=object_merge($_COOKIE,$_GET);

$aim->settings=$aim->settings?json_decode($aim->settings):(object)[];
$config->wss->url=$config->wss->protocol."://".$config->wss->hostname.":".$config->wss->port;
$aim->config=[wss=>$config->wss,ws=>$config->ws];
//$aim->domainname=$config->ws->domain;
//err($aim);
$MAIL=$config->mail;
$MSE=$config->mse;
$DB=$config->dbs;
$DB->dbname=$DB->database;
$db[dbaim] = $DB;

foreach ($db as $dbname=>$dbconfig){
	$dbconfig=(object)$dbconfig;
	if(function_exists("sqlsrv_connect")){
		$DB->UID=$DB->user;
		$DB->PWD=$DB->password;
		$GLOBALS[$dbname]=new DbSqlsrv($dbconfig);
	}
	else {
		$DB->UID=$DB->user;
		$DB->PWD=$DB->password;
		$dbconfig->cs="Driver=FreeTDS;Server=$dbconfig->server;Database=$dbconfig->dbname;";
		$GLOBALS[$dbname]=new DbOdbc($dbconfig);
	}
}

if($_GET[test]==db){
	$config->dbs->query=fetch_object(query("SELECT value FROM om.attributes WHERE aid=17876480"));
	die($config->dbs->query->value);
	//$config->dbs->res=query("SELECT 1 AS c");
	die(json_encode($config));
}
?>
