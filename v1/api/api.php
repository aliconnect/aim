<?php
/**
	* @file api calls
	* @author Max van Kampen (max.van.kampen@alicon.nl)
	* @todo 100% odata 4.0 compliant
	* @todo 100% odata 3.0 compliant
	* @todo 100% odata 2.0 compliant
	*/
array_push($aim->loaded,__FILE__);
//if ($aim->properties)$aim->select=$aim->properties;
$GLOBALS[selectbasic]="uid,typical,detailID,idx,srcID,userID,ownerID,hostID,title,subject,summary,state,startDT,endDT,finishDT,files,modifiedDT,modifiedByID,lastvisitDT,geolocatie,www,hasChildren,selected,inherit,inheritedID";
$GLOBALS[selectlist]=$GLOBALS[selectbasic].",filterfields";
$GLOBALS[selectall]=$GLOBALS[selectbasic].",toID,fromID,keyID,keyname,tag,tagname,name,createdDT,msgCnt,filterfields";
$GLOBALS[itemselect]=$GLOBALS[selectall].",level,schema,id,classID,masterID,uid";

$GLOBALS[itemattributes]=explode(",",$GLOBALS[itemselect].",clone,users,properties,values,rel,readOnly,lastvisitDT,geolocatie,level,ID");

require_once(__dir__."/lib.php");

//function getID($item=null){
//    global $aim,$aim,$location,$cookie;
//    return strtoupper(implode('-',array(dechex($item->id),dechex($item->classID),dechex($item->hostID?:$cookie->hostID),dechex($cookie->clientaccountID),$item->uid)));
//}
function post($row,$add){
	global $aim;
	$q="DECLARE @id INT,@masterID INT,@classID INT,@idx INT";
	//err(asddfsd,$row);
	unset($row->sessionID);
	//err($row);
	$row->class=$row->class?:$row->schema;

	//die($id=!$row->id && !$row->keyname && !$row->keyID?$aim->id:null);

	if ($id=$row->id?:(!$row->keyname && !$row->keyID?$aim->id:null)){
	//if ($id=$row->id?:(!$row->keyname && !$row->keyID?$aim->id:null)){
		$q.=";SET @id=$id";
	}
	else if (!$add && ($row->keyname || $row->keyID)) {
		$row->class=$row->class?:$row->classID;
		$q.=";EXEC api.getItemLink @hostID=$cookie->hostID,@class='".($row->class?:$aim->schema)."',".($row->keyname?"@key='".dbvalue($row->keyname)."'":"@keyID=$row->keyID").",@id=@id OUTPUT";
		unset($row->keyname,$row->keyID);
	}
	else if ($row->class||$row->schema||$row->classID) {
		$q.=$row->classID?";SET @classID=$row->classID":";SELECT @classID=id FROM om.class WHERE class='$row->class'";
		$q.=";EXEC api.addItem @id=@id OUTPUT,@classID=@classID,@hostID=$cookie->hostID,@userID=$cookie->userID,@accountID=$cookie->clientaccountID,".params(array(name=>$row->name?:'Nieuw',masterID=>$row->masterID,srcID=>$row->srcID,'clone'=>$row->clone,detailID=>$row->detailID,idx=>$row->idx,www=>$row->www));
			//@id=@id OUTPUT,@classID=@classID,@hostID=$cookie->hostID --INSERT om.items(hostID,classID)VALUES($cookie->hostID,@classID);SET @id=scope_identity()";
	}
	else return (object)array();
	//die($q);

	unset($row->id,$row->schema,$row->class,$row->classID,$row->filter);
	$itemfields=null;
	if (isset($row->userlist)) {
		$q.=";UPDATE om.itemFav SET updateDT=NULL WHERE id=@id";
		foreach ($row->userlist as $name => $itemID) $q.=";EXEC api.addItemFav @id=@id,@accountID=$itemID";
		$q.=";DELETE om.itemFav WHERE id=@id AND updateDT IS NULL";
	}
	unset ($row->userlist);
	//err($row);
	foreach ($row as $attributeName => $field) {
		if(in_array($attributeName,$GLOBALS[itemattributes])) $itemfields->$attributeName=$field->value?:$field;
		//if(in_array($attributeName,$GLOBALS[itemattributes])) {$itemfields->$attributeName=$field->value?:$field;continue;}
		if (!is_object($field))$field=(object)array(value=>$field);
		unset($field->oldvalue);
		$field->name=$attributeName;
		$field->hostID=$cookie->hostID;
		$field->modUserId=$cookie->userID;
		//err($attributeName,$field);
		$q.=";EXEC api.setAttribute @id=@id,".params($field);
	}

	if (property_exists($itemfields,masterID))$q.=";SELECT @masterID=masterID,@idx=idx FROM om.items WHERE id=@id";
	if ($itemfields)$q.=";UPDATE om.items SET ".paramfields($itemfields)." WHERE id=@id";
	if (property_exists($itemfields,masterID))$q.=";IF @masterID<>$itemfields->masterID EXEC api.setItemChildIdx @masterID";
	if (property_exists($itemfields,idx))$q.=
	";SELECT @masterID=masterID FROM om.items WHERE id=@id
		UPDATE om.items SET om.items.idx=I.idx from (SELECT id,ROW_NUMBER() OVER(ORDER BY idx)-1 AS idx FROM api.items WHERE masterID=@masterID AND id<>@id) I WHERE om.items.id=I.id AND om.items.idx<>I.idx AND I.idx<=$itemfields->idx
		UPDATE om.items SET om.items.idx=I.idx from (SELECT id,ROW_NUMBER() OVER(ORDER BY idx) AS idx FROM api.items WHERE masterID=@masterID AND id<>@id) I WHERE om.items.id=I.id AND om.items.idx<>I.idx AND I.idx>$itemfields->idx
		UPDATE om.items SET hasChildren=1 WHERE id=@masterID    ";
	$q.=
	";SELECT [".implode("],[",explode(",",$GLOBALS[itemselect]))."],config FROM api.citems I WHERE id=@id;EXEC api.getItemAttributes @id=@id";
	//SELECT I.id,I.files,C.config,C.class[schema],I.classID,I.state,I.endDT,I.startDT,I.finishDT FROM api.citems I INNER JOIN om.class C ON C.id=I.classID AND I.id=@id;
	// $q=str_replace(";",";\r\n",$q);
    // echo $q;
	//die($q);
	//die(str_replace(";","\r\n;",$q));
	$item=fetch_object($res=query($q));//)die();
	//die(str_replace(";","\r\n;",$q));
	//err($item);
	//err($item);
	if(!$item)die();
	//die($q);
	$config=json_decode($item->config);
	unset($item->config,$item->filterfields,$item->name,$item->subject,$item->summary);

	//$item=(object)array_merge((array)$item,(array)$itemfields);
	$item->files=json_decode($item->files);
	$item->properties=$properties=$config->properties=$config->properties?:$config->fields;
	if(next_result($res))while($prop=fetch_object($res))if($prop->name){
		$item->fields->{$prop->name}=$prop;
		$item->values->{$prop->name}=$prop->value;
	}
	foreach ($properties as $attributeName=>$prop) {
        if($prop->idname){
            $classID=array_shift(explode(";",$prop->classID));
            if ($item->{$prop->idname})
                $qprop.=";EXEC api.setAttribute @id=$item->id,@hostID=$cookie->hostID,@modUserID=$cookie->userID,@name='$attributeName'".($classID?",@classID=$classID,@itemID=".$item->{$prop->idname}:",@value='".dbvalue($item->{$prop->idname})."'");
            //if ($prop->idname==ownerID && !$item->$attributeName)
            //    $qprop.="
            //        ;EXEC api.setAttribute @id=$item->id,@name='$attributeName',@classID=$classID,@itemID=$cookie->userID";
        }
        if (property_exists($item,$attributeName)||property_exists($item->values,$attributeName)) {
            //echo $attributeName.$prop->kop.";";
            $value=$item->values->$attributeName?:$item->$attributeName;
            if($prop->filter)$item->filterfields->$attributeName=$value;
            if($prop->kop===0)$item->name.="$value ";
            if($prop->kop===1)$item->subject.="$value ";
            if($prop->kop===2)$item->summary.="$value ";
        }
    }
        //err($item);

    //err(fdgsd,$item);
    if (class_exists($class=$item->schema) && method_exists($class,onpost)) $class::onpost($item);
    //err($item);

    $item->files=$item->files?:array();
    $item->title=$item->name;
    foreach(array(name,subject,summary,files,filterfields)as $key)if($item->$key)$item->obj->$key=$item->$key;
    unset($item->properties,$item->fields);
    $par=(object)(array)$item;
    foreach(array(values,obj,filterfields,files)as $key)$par->$key=json_encode($par->$key?:(object)array());

	$modifiedDT=$par->modifiedDT?"'$par->modifiedDT'":"GETUTCDATE()";
    unset($par->schema,$par->id,$par->classID,$par->modifiedByID,$par->modifiedDT);
    //die($qprop);
    $q="$qprop;UPDATE om.items SET modifiedDT=$modifiedDT,modifiedByID=$cookie->userID,".paramfields($par)." WHERE id=$item->id";
    if ($par->masterID || $par->finishDT) $q.="
        DECLARE @T TABLE (id INT,cnt INT,finishDT DATETIME)
        INSERT @T
        SELECT M.id,C.cnt,C.finishDT
        FROM om.itemMasters($item->id)M
        LEFT OUTER JOIN (
        SELECT masterID,SUM(CASE WHEN finishDT IS NULL THEN 1 ELSE 0 END)cnt,MAX(finishDT)finishDT FROM api.items GROUP BY masterID
        )C ON C.masterID=M.id
        UPDATE om.items SET finishDT=T.finishDT FROM @T T WHERE om.items.id=T.id AND cnt=0
        UPDATE om.items SET activeCnt=cnt,finishDT=NULL FROM @T T WHERE om.items.id=T.id AND cnt>0    ";
    $q.=";DELETE om.fields WHERE id=$item->id AND value IS NULL AND itemID IS NULL AND typeID IS NULL";
    $q.=";UPDATE om.items SET msgCnt=M.cnt FROM (SELECT COUNT(0)cnt FROM om.msg WHERE itemID=$item->id) M WHERE om.items.id=$item->id";

    //$q.=";EXEC api.addItemUserVisit @id=$item->id,@userID=$cookie->userID";
    //err(array($par,$item));
    //echo $q;
    //die();
    //die(str_replace(';',PHP_EOL.';',$q));
      //  die($q);

    //die(str_replace(";","\r\n;",$q));
    query($q);
    ts($q);
    //die($q);
    //$item->id=$aim->id;
    //if ($item->schema==contact) die(CONTACT);
    //err($item);
    return itemrow($item);
}
function isword($word){	return !is_numeric($word) && strlen(trim($word))>2 && !in_array($word,array(de,het,een,op,in,van,voor,bij,dit,dathttps,html,geen));}
//function words($str){
//    $temp = array_filter(array_unique(preg_split("/ /", preg_replace('/\[|\]|\(|\)|\+|\-|:|;|\.|,|\'|~|\/|_|=|\?|#/',' ',strtolower($str)), -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY)),'isword');
//    return array_values($temp);
//    //$spaces = array();
//    //return array_reduce( $temp, function( &$result, $item) use ( &$spaces) {
//    //    if( strlen( trim( $item)) === 0) {$spaces[] = strlen( $item);} else {$result[] = $item;}
//    //    return $result;
//    //}, array());
//}
function item($item) {
    global $aim;
    //$item->{'@data.id'}="https://aliconnect.nl/api/v2/".getID($item);
    $item->title=$item->title?:$item->name;
		$item->files=array(value=>$item->files?json_decode($item->files):array());
    return clean($item);
}
function value($value) {
    unset($value->id);
    unset($value->name);
    //return clean($value);
    return !$value->itemID?$value->title:clean($value);
}
function fieldrow($row){return $row->itemID?array(value=>$row->value,itemID=>$row->itemID):$row->value;}

//die($_SERVER[REQUEST_METHOD]);
//array_push($aim->loaded,__FILE__);
function dieform($html){
    die(str_replace("<content />",$html,file_get_contents(__DIR__."/../app/auth/index.html")));
}


//class test {
//  public function getMessage($par="")
//  {
//    return "";
//    //$_SESSION["cookie"] = $_COOKIE;
//    //$_SESSION["par"] = $par;
//    //$_SESSION["headers2"] = getallheaders();;
//    //return json_encode($_SESSION);
//  }
//}
//class item1 {
//    //public function ReportChanges( $params ) {
//    //    //require_once ($_SERVER['DOCUMENT_ROOT']."/aim/v1/api/connect.php");
//    //    //query("INSERT acsm.dbo.wsdlLog(params)VALUES('".json_encode($params)."')");
//    //    //file_put_contents("ReportChanges.json",json_encode($params));
//    //$_SESSION["par"] = $params;
//    //$_SESSION["cookie"] = $_COOKIE;
//    //$_SESSION["headers2"] = getallheaders();;
//    //return json_encode($_SESSION);
//    //    return "JA";// json_encode($params);
//    //}

//    //public function Security( $header ){
//    //    $_SESSION["security"] = $header ;

//    //    $this->Authenticated = true; // This should be the result of an authenticating method
//    //    $this->Username = $header->UsernameToken->Username;
//    //    $this->Password = $header->UsernameToken->Password;
//    //}
//    function get($par=''){
//        global $payload,$aim;
//        return $aim;
//    }
//  //public function getMessage($par="")
//  //{
//  //  global $aim;
//  //  return $aim;
//  //  //$_SESSION["cookie"] = $_COOKIE;
//  //  //$_SESSION["par"] = $par;
//  //  //$_SESSION["headers2"] = getallheaders();;
//  //  //return json_encode($_SESSION);
//  //}

//  //public function addNumbers($num1,$num2)
//  //{
//  //  return;// $a=555;//$num1+$num2;
//  //}
//}

class his {
	function get(){
	    extract($GLOBALS);
	    $q="SELECT TOP 1000 id,lastvisitDT FROM om.itemuservisit WHERE userID=".$aim->client->user->id." ORDER BY lastvisitDT DESC";
	    $res=query($q);
	    while($row=fetch_object($res))$rows->{$row->id}=$row->lastvisitDT;
	    die(json_encode($rows));
	}
}


/** @class soap */
class soap {
	function post(){
		global $aim;
		ini_set( "soap.wsdl_cache_enabled", 0 );
		ini_set( 'soap.wsdl_cache_ttl', 0 );
		//session_start();
		$options= array('uri'=>'http://localhost/aim/v1/api/soap');
		$server=new SoapServer(NULL,$options);
		$server->setClass(api);
		//$server->setClass(item1);
		$server->handle();
		//die();
	}
	function item(){
		die(soapitem);
	}
}

/** @class auth */
class auth {
	/** @method login
		* Nodig voor aanmelden
		*/
	function login(){
		global $aim;
		$post=(object)$_POST;
		$row=fetch_object(query($q="EXEC auth.getAccount @hostID='$aim->hostID',@email='$post->email',@select=1;"));
		die(json_encode([userID=>$row->userID,userUID=>$row->userUID,userName=>$row->userName,email=>$row->email]));
	}
	function getpassword(){
		global $aim;
		$post=(object)$_POST;
		$row=fetch_object(query($q="EXEC auth.getAccount @hostID='$aim->hostID',@userID='$post->userID',@password='$post->password',@select=1;"));
		if ($row->pwdcompare==1) {
			setcookie(userId,$userId=connect::jwt_encode([id=>$row->userID,uid=>$row->userUID,name=>$row->userName,token_id=>$row->userID]),time()+365*24*60*60,"/");
			connect::set_device();
		}
		die(json_encode([pwdcompare=>$row->pwdcompare]));
	}
	function logout(){
		global $aim;
		setcookie(userId,null,time()+365*24*60*60,"/");
		die(header("Refresh:0; url='/auth/?redirect_uri=$aim->redirect_uri'"));
	}


    // function set1(){
    //     setcookie(a2,a2,($cookieLifetime=time()+365*24*60*60),"/");
    //     setcookie(userID,265090,($cookieLifetime=time()+365*24*60*60),"/");
    //     setcookie(userUID,"4EC074C5-0A13-4250-9B21-565B809ABAE5",($cookieLifetime=time()+365*24*60*60),"/");
    //     setcookie(userName,"Max test",($cookieLifetime=time()+365*24*60*60),"/");
    // }
	function get(){
		//header('Access-Control-Allow-Origin: '.$_SERVER[HTTP_ORIGIN]);
        global $aim;
		err(auth_get,$aim);
		//err($GLOBALS[aim]);
        //die('ddd');
        //global $aim,$aim,$location,$cookie;
		//err($_COOKIE);
        //die($_COOKIE[client]);
        //err($aim);
        //die(json_encode($_COOKIE));
        //
		// $aim->client=json_decode($_COOKIE[client]?:"{}");
		// if(!$_COOKIE[userID]){
        //     $aim->client->user=$aim->client->host=$aim->client->account=$aim->client->group=(object)array();
        //     setcookie(client,json_encode($aim->client),($cookieLifetime=time()+365*24*60*60),"/");
        // }
		die(json_encode($aim));
	}
	function post(){
		global $aim;
		$device=$aim->client->device;
		//err($aim);
		//err(auth,$aim);
		//$data->msg="Email adres niet bekend";
		if ($aim->signinCode) {
			$row=fetch_object(query("SELECT U.id userID,CONVERT(VARCHAR(50),U.uid)userUID,I.name AS userName,U.signinCode FROM auth.users U INNER JOIN auth.email E ON U.id=E.id AND E.email='$aim->username' INNER JOIN api.items I ON I.id=U.id;"));

			if ($aim->password != $aim->password2) $row->msg="De wachtwoorden komen niet overeen.";
			else if (strtolower(trim($row->signinCode)) != strtolower(trim($aim->signinCode))) $row->msg="Uw beveiligingscode is incorrect of verlopen. Vraag een nieuwe code aan.";
			else {
				query("UPDATE om.items SET userID=$row->userID,startDT=GETUTCDATE(),endDT=NULL WHERE id=$device->id;UPDATE aim.auth.users SET password=pwdencrypt('$aim->password'),signInCode=NULL,signinRequest=null WHERE id=$row->userID");
				foreach (array(userID,userUID,userName)as$key) setcookie($key,$cookie->{$key}=$row->{$key},time()+($cookieLifetime=365*24*60*60),'/');
				$row->pwOK=1;
			}
		}
		else if ($aim->username) {
			//err($aim);
			//$row=fetch_object(query("SELECT CASE WHEN U.password IS NULL THEN -1 ELSE pwdcompare('$aim->password',password) END AS pwOK,U.id userID,CONVERT(VARCHAR(200),U.uid)userUID,I.name AS userName FROM auth.users U INNER JOIN api.items I ON I.id=U.id INNER JOIN auth.email E ON U.id=E.id AND E.email='$aim->username';"));
			$row=fetch_object(query($q="EXEC api.getAccount @hostId='$aim->hostID',@email='$aim->username',@password='$aim->password',@select=1;"));
			$row->q=$q;
			$aim->pwOK=$row->pwOk;
			if (!$row->userId) $row->msg="Dit E-mail adres is niet bekend. Probeer een ander email adres of vraag een account aan bij de beheerder van het domein.";
			else if ($aim->pwOK==1){
                //setcookie(user,json_encode(array(id=>$row->userId,uid=>$row->userUid,name=>$row->userName)),time()+365*24*60*60,"/");

                setcookie(userId,getId([id=>$row->userId,uid=>$row->userUid,name=>$row->userName]),time()+365*24*60*60,"/");

                // $row->{$cookieKey}=$row->{$key},($cookieLifetime=time()+365*24*60*60),"/");
                //
				// query("UPDATE om.items SET userID=$row->userId,startDT=GETUTCDATE(),endDT=NULL WHERE id=$device->id;");
				// foreach (array(userId,userUid,userName) as $key) {
				// 	$cookieKey=str_replace(array("Id","id"),"ID",$key);
                //     setcookie($cookieKey,$row->{$cookieKey}=$row->{$key},($cookieLifetime=time()+365*24*60*60),"/");
                //     setcookie($cookieKey."1",$row->{$cookieKey}=$row->{$key},($cookieLifetime=time()+365*24*60*60),"/");
				// 	//setcookie(client,null,$cookieLifetime,"/");
				// }
			}
			else if ($aim->pwOK==-1) auth::np($row);
			else if (!$aim->password);
			else if ($aim->pwOK==0) $row->msg="Wachtwoord incorrect";
		}
					//$row->pwOK=1;
		if($aim->redirect_uri)die(header("Refresh:0; url='$aim->redirect_uri'"));
		die(json_encode($row));
	}
	function keys1(){
		$post=(object)$_POST;$dbs=$GLOBALS[config]->dbs;
		$conn = sqlsrv_connect ( $dbs->server, array(Database=>admin,UID=>$post->username,PWD=>$post->password,ReturnDatesAsStrings=>true,"CharacterSet" => "UTF-8"));

		if($post->keyUsername && $post->keyPassword){
			sqlsrv_query ( $conn, $q="
				DECLARE @id INT
				SELECT @id=id FROM keys WHERE keyname='$post->key'
				IF @id IS NULL BEGIN INSERT keys(keyname)VALUES('$post->key') SET @id=@@IDENTITY END
				UPDATE keys SET username='$post->keyUsername',password='$post->keyPassword',url='$post->keyUrl' WHERE id=@id
			", null, array("Scrollable"=>"buffered"));
			//echo "$q";
		}
		$res = sqlsrv_query ( $conn, "SET TEXTSIZE -1;SET NOCOUNT ON;SELECT * FROM keys WHERE keyname LIKE '%$post->q%'", null, array("Scrollable"=>"buffered"));
		$rows=array();
		while ($row=sqlsrv_fetch_object($res)) array_push($rows,$row);
		die(json_encode($rows));
	}
	function account(){
		global $aim;
		die(json_encode(array(loggedIn=>$cookie->hostID && $cookie->groupID && $cookie->accountID && $cookie->userID)));
	}
	function app(){
		global $aim;
		//die(json_encode(array(userID=>$cookie->userID)));
		if($cookie->userID)die(json_encode(array(userID=>$cookie->userID)));
		dieform("<form method=POST><label>Email</label><input name=username autocomplete=username type=email required><label>Password</label><input name=password type=password required=true><button name=login value=user>Verder</button></form>");
	}
	function np($data){
		global $aim;
			//err($cookie);
		$row=fetch_object(query("DECLARE @signinCode CHAR(8);SET @signinCode=LEFT(newid(),8);UPDATE auth.users SET signInCode=@signinCode,signinRequest=GETUTCDATE() FROM auth.email E WHERE E.email='$aim->username' AND auth.users.id=E.id; SELECT @signinCode as signinCode"));
		require_once(__DIR__.'/mail.php');
		//$mail=new AIMMailer(true);
		mail::send($msg=array(
			  //FromName=>"Team Aliconnect",
			  Subject=>"Uw beveiligingscode voor het instellen van uw wachtwoord.",
			  //write=>1,
			  host=>"$cookie->host.aliconnect.nl",
			  //attachements=>array(
			  //    (object)array(name=>$doc->name.".pdf",html=>$html)
			  //),
			  to=>"$aim->username",
			  cc=>'support@alicon.nl',
			  //bcc=>$doc->emailaddressbcc,
			  //msgs=>array(array(content=>"Beste eigenaar van $aim->username, Hierbij sturen wij u een beveiligingscode voor het instellen van uw wachtwoord. Beveiligingscode:  $row->signinCode ")),
			  msgs=>array(array(content=>"Beste eigenaar van $aim->username,</p><p>Hierbij sturen wij u een beveiligingscode voor het instellen van uw wachtwoord.</p><p>Beveiligingscode: <b>$row->signinCode</b>")),
		));
			//err($msg);
		die(json_encode());
	}
	function json(){
		global $aim;
		die(json_encode(array(userID=>$cookie->userID)));
		//die("<form method=POST><label>Email</label><input name=username autocomplete=username type=email required><button name=login value=user>Verder</button></form>");
	}
	function remove(){
		global $aim;
		dbexec("auth.delAccount",array(userID=>$cookie->userID));
		auth::logout();
		//die(header("Refresh:0; url='".($aim->redirect_uri?:"/")."'"));
	}
	function keyloggin(){
		//inloggen met sleutelcode
		//pas op heel gevaarlijk, kan iedereen gebruiken om in te loggen. Hoe omgaan met beveiliging. Nog uit te zoeken
		global $aim;//$post=(object)$_POST;
		$row=fetch_object(query("SELECT id,name FROM api.items WHERE id IN (SELECT id FROM omv.itemvalues WHERE classID=1000 AND name='keycode' AND value='$aim->id')"));
		exit(json_encode($row));
	}
    //function run(){
    //    global $aim,$aim,$location,$cookie;
    //    //err($aim);
    //    //if($cookie->userID) die(header("Refresh:0; url='/app'"));
    //}
    //function run1(){
    //    if ($_POST[action]==logout) auth::logout();
    //    global $aim,$aim,$location,$cookie;$post=(object)$_POST;
    //    $aim->redirect_uri=$aim->redirect_uri?:$aim->ref;
    //    //if (!$cookie->userID) {
    //    //    if ($post->password) {
    //    //        $user=fetch_object(query("SELECT pwdcompare('$post->password',password)AS pwOK,U.id,CONVERT(VARCHAR(200),U.uid)userUID FROM auth.users U INNER JOIN auth.email E ON U.id=E.id AND E.email='$post->username';"));
    //    //        if ($user->pwOK==1){
    //    //            query("UPDATE auth.device SET userID=$user->id,loginDT=GETDATE(),logoutDT=NULL WHERE deviceUID='$aim->deviceUID';");
    //    //            setcookie(userID,$cookie->userID=$user->id,time()+($cookieLifetime=365*24*60*60),'/');
    //    //            setcookie(userUID,$cookie->userUID=$user->userUID,time()+($cookieLifetime=365*24*60*60),'/');
    //    //            //header("Refresh:0; url='".($aim->redirect_uri?:"/auth")."'");
    //    //            die($aim->redirect_uri);
    //    //        }
    //    //        else echo"Wrong password";
    //    //    }
    //    //    else if ($post->username) {
    //    //        $user=fetch_object(query("SELECT id FROM auth.email WHERE email='$post->username';"));
    //    //        //setcookie(userID,$user->id,time()+($cookieLifetime=365*24*60*60),'/');
    //    //        if ($user->id) die("<form method=POST><input style='display:none' name=username autocomplete=username readonly required value='$post->username'><label>Password</label><input name=password type=password required=true><button action=login>Login</button></form>");
    //    //    }
    //    //}
    //    if ($aim->key && $aim->response_type==code){
    //        if (!$redirect=fetch_object(query("SELECT * FROM auth.appRedirect WHERE appID=$aim->appID AND redirect_uri='$aim->redirect_uri';"))) die("Wrong redirect_uri $aim->redirect_uri ".json_encode($redirect));
    //        if (!$cookie->hostID) die('No app.hostID');
    //        if ($cookie->userID) {
    //            if ($_POST[action]==allow){
    //                fetch_object(query("
    //                    IF NOT EXISTS(SELECT 0 FROM auth.code WHERE appID=$aim->appID AND userID=$aim->deviceUserID AND ref='$aim->redirect_uri') INSERT auth.code(appID,userID,ref,allowDT)SELECT $aim->appID,$aim->deviceUserID,'$aim->redirect_uri',GETDATE();
    //                "));
    //            }
    //            if (isset($_POST[action])) header("Location: $aim->redirect_uri?state=$aim->state");
    //            else dieform("<form method=POST>Applicatie $cookie->appName wil toegang tot uw account<button name=action value=deny>Weiger</button><button name=action value=allow>Akkoord</button><button name=action value=logout>Logout</button></form>");
    //        }
    //    }
    //    dieform($cookie->userID?"<form method=POST><button name=action value=logout value=1>Logout</button></form>":"<form method=POST><label>Email</label><input name=username autocomplete=username type=email required autofocus><button name=login value=user>Verder</button></form>");
    //}
	function authenticator() {
		$html = file_get_contents("../app/authenticator/index.html");
		$data = [get=>$_GET,qr=>[text=>"https://aliconnect.nl/?id=312312"]];
		echo str_replace("</head","<script src='data:text/javascript;base64,".$dataBase64=base64_encode("data=".json_encode($data))."'></script></head",$html);
		die();
	}
	function test(){
			error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING & ~E_STRICT & ~E_DEPRECATED);
			ini_set('display_errors',1);
			ini_set('display_startup_errors',1);
			$payload=array(
				userId=>"b08f86af-35da-48f2-8fab-cef3904660bd",
				iss=>"the issuer",
				sub=>"the subject",
				exp=>"the expiration time",
			);

			$secret='abC123!';
			//die(auth::jwt_encode($payload,$secret));
			err(auth::jwt_encode($payload,$secret),auth::jwt_decode("eyJ0eXAiOiJKV1QiLCJhbGciOiJzaGEyNTYifQ.eyJ1c2VySWQiOiJiMDhmODZhZi0zNWRhLTQ4ZjItOGZhYi1jZWYzOTA0NjYwYmQiLCJpc3MiOiJ0aGUgaXNzdWVyIiwic3ViIjoidGhlIHN1YmplY3QiLCJleHAiOiJ0aGUgZXhwaXJhdGlvbiB0aW1lIn0.kitsXlTvQRpPYjnbWz8blRZ12PbM1IsqfN-eHLYUmFg",$secret));


			$code="OAQABAAIAAAAP0wLlqdLVToOpA4kwzSnxhxqiodgs-9sPaYyXo3rUsvBdl8xR6ze2gFWC6S19UGEwFofmJqL9yVtjrRDAWSw7_Q1pZ6fDwdQLRovwouHYhI5Fpa4b6LjZsOiGUXlzuHv0D19IBohBZ4uuemzUbERhHHAHm73w2X4PVW7uTFkmXxcoJVPe8Nqf2_8mvLBTXtWdiXm-zyav5l0MhVBQMK42kjAnM5dBulh27_wW_hFC7VnVsoTSJYLwAkqZj0NCXDK_rBYfMb9EMoBD-gloQ6ERo-Zb1VmuMFPD0UhiowHRBlo5Y4oIl7S7NJgH-pj3mtGAgRu0hF_vMY25u6la809cI6s5hMDC4XRW9t2OItDTVWBchOhmdeyd9bbCpxNNAGRpvFAXfeMmS3QTlZhnYQU3d2tqfZj0ArQ76zgWpynys2_Hwa0O6BrCuUeUqPdjgrKTJwkY-omY2jlrg7-e-jwowK2D-AGCDBpI0pvol4E1sNiqA43IrRfTR-vyaZhmCWFabKUGCYNQ7koYp_yrohXT8Liv4EKRRkq9IiVnHplsKLlJpbmJaAibryvQH8wZtsrJ3UuB4QpJCCbH1a9v6QmfeIft9upripFnmSxI16lLHkvyBiS1E4G1Kel_khD7wL_-MyxQfhH_OkIZVvsu5au4LI1VBsTYaMe6UHV-oGQSj0PLPn01OQz8tmmD7mNvuZt-AsMGtM6_uP2KrslTqCMi_lh5tU1YnDwOnGFLRfkS_7Um2Uovu8BoczAcMUiWUgQgAA";
			$a=$d->code=explode('-',$code);

			//$d->c=base64_decode("OAQABAAIAAAAP0wLlqdLVToOpA4kwzSnxhxqiodgs");
			//$d->c=base64_decode("9sPaYyXo3rUsvBdl8xR6ze2gFWC6S19UGEwFofmJqL9yVtjrRDAWSw7_Q1pZ6fDwdQLRovwouHYhI5Fpa4b6LjZsOiGUXlzuHv0D19IBohBZ4uuemzUbERhHHAHm73w2X4PVW7uTFkmXxcoJVPe8Nqf2_8mvLBTXtWdiXm");
			//$d->c=base64_decode("9sPaYyXo3rUsvBdl8xR6ze2gFWC6S19UGEwFofmJqL9yVtjrRDAWSw7");
			//$d->c=base64_decode("Q1pZ6fDwdQLRovwouHYhI5Fpa4b6LjZsOiGUXlzuHv0D19IBohBZ4uuemzUbERhHHAHm73w2X4PVW7uTFkmXxcoJVPe8Nqf2");
			//$d->c=base64_decode("9sPaYyXo3rUsvBdl8xR6ze2gFWC6S19UGEwFofmJqL9yVtjrRDAWSw7_Q1pZ6fDwdQLRovwouHYhI5Fpa4b6LjZsOiGUXlzuHv0D19IBohBZ4uuemzUbERhHHAHm73w2X4PVW7uTFkmXxcoJVPe8Nqf2_8mvLBTXtWdiXm");
			//$d->c=base64_decode("9sPaYyXo3rUsvBdl8xR6ze2gFWC6S19UGEwFofmJqL9yVtjrRDAWSw7_Q1pZ6fDwdQLRovwouHYhI5Fpa4b6LjZsOiGUXlzuHv0D19IBohBZ4uuemzUbERhHHAHm73w2X4PVW7uTFkmXxcoJVPe8Nqf2_8mvLBTXtWdiXm");
			//$d->c=base64_decode("zyav5l0MhVBQMK42kjAnM5dBulh27_wW_hFC7VnVsoTSJYLwAkqZj0NCXDK_rBYfMb9EMoBD");
			//$d->c=base64_decode("gloQ6ERo");
			//$d->c=base64_decode("Zb1VmuMFPD0UhiowHRBlo5Y4oIl7S7NJgH");
			//$d->c=base64_decode("pj3mtGAgRu0hF_vMY25u6la809cI6s5hMDC4XRW9t2OItDTVWBchOhmdeyd9bbCpxNNAGRpvFAXfeMmS3QTlZhnYQU3d2tqfZj0ArQ76zgWpynys2_Hwa0O6BrCuUeUqPdjgrKTJwkY");
			//$d->c=base64_decode("omY2jlrg7");
			//$d->c=base64_decode("jwowK2D");
			//$d->c=base64_decode("AGCDBpI0pvol4E1sNiqA43IrRfTR");
			//$d->c=base64_decode("vyaZhmCWFabKUGCYNQ7koYp_yrohXT8Liv4EKRRkq9IiVnHplsKLlJpbmJaAibryvQH8wZtsrJ3UuB4QpJCCbH1a9v6QmfeIft9upripFnmSxI16lLHkvyBiS1E4G1Kel_khD7wL_");
			//$d->c=base64_decode("MyxQfhH_OkIZVvsu5au4LI1VBsTYaMe6UHV");
			//$d->c=base64_decode("oGQSj0PLPn01OQz8tmmD7mNvuZt");
			//$d->c=base64_decode("AsMGtM6_uP2KrslTqCMi");
			//$d->c=base64_decode("AsMGtM6_uP2KrslTqCMi_lh5tU1YnDwOnGFLRfkS_7Um2Uovu8BoczAcMUiWUgQgAA");
			//$d->c=base64_decode("AsMGtM6_uP2KrslTqCMi_lh5tU1YnDwOnGFLRfkS_7Um2Uovu8BoczAcMUiWUgQgAA");
			//foreach($a as $i=>$s) {
			//    try {
			//        $d->code1->{$i}=base64_decode($s);
			//    }
			//    catch (exception $e) {
			//    }
			//}






			$str='eyJ0eXAiOiJKV1QiLCJub25jZSI6ImlZSlhyVXJoVTdqRmFtakFyQWp0OTMyRkdqUE5lSGpXX1NmdFNNWW1kd1kiLCJhbGciOiJSUzI1NiIsIng1dCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSIsImtpZCI6InU0T2ZORlBId0VCb3NIanRyYXVPYlY4NExuWSJ9.eyJhdWQiOiJodHRwczovL291dGxvb2sub2ZmaWNlLmNvbSIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzA5Nzg2Njk2LWYyMjctNDE5OS05MWEwLTQ1NzgzZjZjNjYwYi8iLCJpYXQiOjE1NjQ1MTE0NzIsIm5iZiI6MTU2NDUxMTQ3MiwiZXhwIjoxNTY0NTE1MzcyLCJhY2N0IjowLCJhY3IiOiIxIiwiYWlvIjoiQVRRQXkvOE1BQUFBaGpEdkljQlVJczRlNk0rZHdXN1B0a0VEVS9NajYzajNsVUhYaWM0bHJMRXE3MEZ2VW1QcVJYY0JvZHVTbGJ5diIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiQWxpY29ubmVjdCIsImFwcGlkIjoiMjQ2MjI2MTEtMjMxMS00NzkxLTk0N2MtNWMxZDFiMDg2ZDZjIiwiYXBwaWRhY3IiOiIxIiwiZW5mcG9saWRzIjpbXSwiZmFtaWx5X25hbWUiOiJ2YW4gS2FtcGVuIiwiZ2l2ZW5fbmFtZSI6Ik1heCIsImlwYWRkciI6Ijg2Ljg2LjE3MC4xNiIsIm5hbWUiOiJNYXggdmFuIEthbXBlbiIsIm9pZCI6ImY0MGY4NDYyLWRhN2YtNDU3Yy1iZDhjLWQ5ZTU2MzlkMjk3NSIsInB1aWQiOiIxMDAzMDAwMDg4MjE2NDkxIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDb250YWN0cy5SZWFkIENvbnRhY3RzLlJlYWRXcml0ZSBNYWlsLlJlYWQgTWFpbC5SZWFkV3JpdGUgUGVvcGxlLlJlYWQiLCJzaWQiOiIzMTVmYjdjNi1kODNmLTQyNDgtYTA0ZS1jYTkzYmZjNTU5OTAiLCJzdWIiOiIzbUZYYXU1VmlrakJ5TndnRGNBYVdmUmtLUzlickotQ3NCVnNhSzd4M2tRIiwidGlkIjoiMDk3ODY2OTYtZjIyNy00MTk5LTkxYTAtNDU3ODNmNmM2NjBiIiwidW5pcXVlX25hbWUiOiJtYXgudmFuLmthbXBlbkBhbGljb24ubmwiLCJ1cG4iOiJtYXgudmFuLmthbXBlbkBhbGljb24ubmwiLCJ1dGkiOiJLQjB6MlludGJrZU41c09seGo0Z0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyI2MmU5MDM5NC02OWY1LTQyMzctOTE5MC0wMTIxNzcxNDVlMTAiXX0.kXqZYefpMNicAA_HY72sc8b6F7IONgIfU8bIyPg-debakr8cWyWXsasV66tSh2nHAjYeDhGrtjWmpodzmiWYg9hpEOVBYZgAw4et5ct9lNJz7b4fzFn6_FXJulBVogj6K_WVlTT8m8NmTlFLVjz3Em0629a75UXr5w-spxDSI7it_nl7eQ8I7nU9pYWEB9rSRoUYFZbcQSRSp-9Z7kpgEea0CD-_qsUZQWugizRR9tyN7ToM5c0EaAksyv7c3LqkczT_ZiTNiHMllOTaZNhECwOj8-h2puzZYZszomOJGyZgtt32ROOgDGYhszr5E-kaaNWbV8tV6ARgRJg7SOx7gw';
			$d->a=$str=explode('-',$str);
						//$d->a0=base64_decode("debakr8cWyWXsasV66tSh2nHAjYeDhGrtjWmpodzmiWYg9hpEOVBYZgAw4et5ct9lNJz7b4fzFn6_FXJulBVogj6K_WVlTT8m8NmTlFLVjz3Em0629a75UXr5w");
			//$d->a0=base64_decode("_qsUZQWugizRR9tyN7ToM5c0EaAksyv7c3LqkczT_ZiTNiHMllOTaZNhECwOj8");
			//$d->a0=base64_decode("_qsUZQWugizRR9tyN7ToM5c0EaAksyv7c3LqkczT_ZiTNiHMllOTaZNhECwOj8");
			//$d->a0=base64_decode("h2puzZYZszomOJGyZgtt32ROOgDGYhszr5E");
			//$d->a0=base64_decode("kaaNWbV8tV6ARgRJg7SOx7gw");

			//foreach($str as $i=>$s) $d->c->{$i}=base64_decode($s);
			//die();
			$o=array_shift(explode("$",base64_decode($str[0])));
			$d->md0=md5($d->b->{0});
			$d->md1=md5($o);
			$a=preg_split('/({|}{|})/',$o,-1, PREG_SPLIT_NO_EMPTY);
			foreach($a as $i => $o)$d->b->{$i}=json_decode("{".$o."}");
			err($d);
			die(array_shift(explode("$",base64_decode($str[0]))));
			die();
	}
	function token(){
		global $aim;
		$post=(object)$_POST;
		//$aim=(object)$_GET;
		if($post->grant_type == authorization_code) {
			//err($aim);
			//$user = fetch_object(query("SELECT * FROM api.items WHERE id=$aim->userID"));

			//$code=auth::jwt_decode($post->code,$alg="sha256");

			$jwt=explode(".",$post->code);
			$code->header=json_decode(base64_decode($code->base64UrlHeader=$base64UrlHeader=array_shift($jwt)));
			$payload=$code->payload=json_decode(base64_decode($code->base64UrlPayload=$base64UrlPayload=array_shift($jwt)));
			$code->signature=array_shift($jwt);

			//err($code);

			//$payload=$code->payload;
			//return $payload;

			$secretId = $code->secretId = strtolower(fetch_object(query("SELECT value FROM api.attributes WHERE aid=$payload->said"))->value);
			if($post->client_secret){
				//$secretId = $code->secretId = strtolower(fetch_object(query("SELECT value FROM api.attributes WHERE aid=$payload->said"))->value);
				if($secretId != ($post->client_secret=strtolower($post->client_secret)))
					return [err => "Invalid client_secret"];
				if ($code->signature != str_replace(['+', '/', '='], ['-', '_', ''], base64_encode( hash_hmac($code->header->alg, $code->base64UrlHeader . "." . $code->base64UrlPayload, $secretId, true))))
					return [err => "Invalid signature"];
					//err("Invalid signature");
			}

			//$secretId = $code->secretId = "111";
			//$code->client_secret=strtolower($post->client_secret);

			//$code->signature2 = $signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode( hash_hmac($alg, $code->base64UrlHeader . "." . $code->base64UrlPayload, $code->secret, true)));


			//$code->verify = $signature==$code->signature;

			//$code->encode=auth::jwt_encode($payload,$secretId);
			//err($code);


			$client = fetch_object(query("SELECT id,uid,title FROM api.items WHERE id='$payload->cid'"));
			if ($client->uid != $post->client_id)
				return [err => "Invalid client_id"];


			//err($post);
			$post->redirect_uri=stripslashes($post->redirect_uri);
			//if(!$client->id)err(111,"Parameter client_id not found");
			//$secret = fetch_object(query("SELECT id,uid FROM api.items WHERE uid='$aim->secret_id'"));
			$redirect=fetch_object(query($q="SELECT aid FROM api.attributes WHERE id=$client->id AND name='redirectUri' AND CONVERT(VARCHAR(MAX),value)='$post->redirect_uri'"));
			if(!$redirect->aid) err(111,"Invalid redirect_uri ".$post->redirect_uri);

			//$account = fetch_object(query("SELECT id,uid,hostID,classID FROM api.items WHERE id=$payload->aid"));//hostID=$client->id AND classID=1004 AND uid='$payload->aid'"));
			//if(!$account->id)
			//    err(111,"Invalid account");
			//$response=array(expires_in=>3600,access_token=>"RsT5OjbzRn430zqMLgV3Ia");
			//$accessToken=md5('Dit is een test');
			//$str = 'VGhpcyBpcyBhbiBlbmNvZGVkIHN0cmluZw==';
			//$accessToken=md5($account->id).md5($account->modifiedDT).base64_encode(213412341).'-'.base64_encode(213412341).'-'.base64_decode($str);
			$token=fetch_object(query("DECLARE @uid VARCHAR(50),@aid INT;SET @uid=newid();EXEC api.setAttribute @aid=@aid OUTPUT,@id=".$payload->client->user->id.",@name='token',@value=@uid,@hostID=".$payload->cid.";SELECT @uid AS uid,@aid AS aid;"));


			$expire_time=3600;
			$data=array(
				aud => "https://aliconnect.nl",
				exp => time()+$expire_time*1000,
				tid => $token->aid,
				//aid=>$account->id,
				//cid=>$client->id,
				app_displayname => $client->title,
				//appid=>$post->client_id,
				//family_name=> "van Kampen",
				//given_name=> "Max",
				//ipaddr=> "86.86.170.16",
				//name=> $payload->client,//"Max van Kampen",
				//unique_name=> "max.van.kampen@alicon.nl",
				//upn=> "max.van.kampen@alicon.nl",
				//scp=> "Calendars.Read Calendars.ReadWrite Contacts.Read Contacts.ReadWrite Mail.Read Mail.ReadWrite People.Read",
				//sid=> "315fb7c6-d83f-4248-a04e-ca93bfc55990",
				//sub=> "3mFXau5VikjByNwgDcAaWfRkKS9brJ-CsBVsaK7x3kQ",
				//taid=>$token->aid,
				//tid=> "09786696-f227-4199-91a0-45783f6c660b",
				//uti=> "KB0z2YntbkeN5sOlxj4gAA",
				//ver=> "1.0",
			);
			$data+=(array)$payload;


			$accessToken=implode("-",[base64_encode(json_encode($data)) , md5(strtolower($token->uid))]);

			//$accessToken=md5(a);
			die(json_encode(array(
				token_type=>"Bearer",
				//scope=>"",
				expires_in=>$expire_time,
				//ext_expires_in=>3600,
				access_token=>$accessToken,
				//uniqid(),//"RsT5OjbzRn430zqMLgV3Ia",
				//refresh_token=>"RsT5OjbzRn430zqMLgV3Ia",
				//id_token=>"RsT5OjbzRn430zqMLgV3Ia",
			)));
		}
		die();
	}
	function authorize(){
		//die(json_encode($_SERVER));
		//echo json_encode($_POST);
		global $aim;
		//$aim=(object)$_GET;
		//err($_POST);
		if($_SERVER[REQUEST_METHOD]==POST){
			if(isset($_POST[allow])){
				//maak contact aan, koppel account aan contact en neem gegevens over van account bij contact, alleen waar toestemming voor is gegeven,
				//maak velden aan en koppel velden van contact aan account velden
				//iets van techniek zodat velden zichtbaar worden voor client app id
				//$user = fetch_object(query("SELECT id,name,uid FROM api.items WHERE id=$aim->userID"));
				$client = fetch_object(query("SELECT id,uid FROM api.items WHERE uid='$aim->client_id'"));
				//$account = fetch_object(query("SELECT id,uid,name FROM api.items WHERE hostID=$client->id AND classID=1004 AND toID=$aim->userID"));
				//if (!$account) $account = fetch_object(query("INSERT om.items (hostID,classID,toID)VALUES($client->id,1004,$aim->userID);SET NOCOUNT OFF:SELECT id,uid FROM api.items WHERE id=scope_identity();"));
				$secret = fetch_object(query("SELECT aid,value FROM api.attributes WHERE id=$client->id AND name='secret'"));
				if (!$secret) return [err => "No secret_id"];
				$secretId = strtolower($secret->value);
				//$secretId=111;
				//$payload=array(aid=>$account->id,auid=>$account->uid,uid=>$aim->userID,cid=>$client->id,cuid=>$client->uid,said=>$secret->aid,client=>$aim->client);
				$payload=array(
					//aid=>$account->id,
					//auid=>$account->uid,
					//uid=>$aim->userID,
					cid=>$client->id,
					cuid=>$client->uid,
					said=>$secret->aid,
					client=>$aim->client
				);
				//$payload=array(max=>aaa);
				$code=auth::jwt_encode($payload,$secretId);

				//die("$aim->redirect_uri?code=$code&state=$aim->state");
				//$code=aaa;
				//err(array($payload,$secretId,$code));

				//$code=base64_encode(json_encode(array(aid=>$account->uid,uid=>$aim->userID)));


				//err($account);
				//die();
				die(header("Location: $aim->redirect_uri?code=$code&state=$aim->state"));
			}
			if(isset($_POST[deny])) {
				header("Location: $aim->redirect_uri?state=$aim->state");
			}
			die();
		}
		if ($_GET[method]){
			die(aaa);
		}
		$client=fetch_object(query("SELECT id,uid FROM api.items WHERE uid='$aim->client_id'"));
		if(!$client->id)err(111,"Parameter client_id not found");
		$redirect=fetch_object(query($q="SELECT aid FROM api.attributes WHERE id=$client->id AND name='redirectUri' AND CONVERT(VARCHAR(MAX),value)='$aim->redirect_uri'"));
		if(!$redirect->aid)err(111,"Parameter redirect_uri not found $client->id:$aim->redirect_uri");
		//die($q);
		//err($redirect);
		//err(getallheaders());
		die();
	}
	function keys() {
		$keys=json_decode(file_get_contents($_SERVER[DOCUMENT_ROOT]."/../keys.json"));
		echo '<style>body{font-family:"Segoe UI Light", "Segoe WP", sans-serif, Tahoma, Arial;}</style>';
		if ($_POST[password] && $_POST[password]==$keys->password) $_COOKIE[keyspassword]=$_POST[password];
		setcookie(keyspassword, $_COOKIE[keyspassword], time() + (86400 * 30), "/"); // 86400 = 1 day
		if ($_COOKIE[keyspassword]!=$keys->password)die("<form method=post>Password <input name=password type=password /></form>");
		echo "<form method=post>Search <input name=search autofocus value='".($_POST[search])."'/></form>";
		//die(stripos(aindows,$search)?"ja":"nee");
		echo "<table>";
		foreach (array_filter((array)$keys->keys,function($row,$key){return stripos($key.json_encode($row),$_POST[search])!==false;},ARRAY_FILTER_USE_BOTH) as $key => $row) {
			echo "<tr><td colspan=2><b>$key</b></td></tr>";
			//unset($row->title);
			foreach ($row as $key => $value) echo "<tr><td>$key</td><td>$value</td></tr>";
		}
		echo "</table>";
		die();
	}
}
//die(ssss);
class js{
	function get(){
	    //global $aim,$itemHost,$itemUser,$account;
		extract($GLOBALS);
		extract((array)$aim->client);



		header('Content-Type: application/javascript');

		$a=explode(",",$_SERVER[HTTP_ACCEPT_LANGUAGE]);
		foreach($a as $v){preg_match('/[a-z]*/',$v,$ln);$aim->ln[$ln[0]]=$v;}
		$aim->ln=array_keys($aim->ln);

		array_push($aim->theme,$aim->host);
		//$aim->_SERVER=$_SERVER;
		$scriptURL=explode(':',$_SERVER[URI]);
		$aim->origin = property_exists($aim,local) && $_SERVER[SERVER_NAME]==localhost ? 'http://localhost' : array_shift($scriptURL)."://".$_SERVER[HTTP_HOST];//'https://aliconnect.nl';

		//$aim->origin = 'http://ashare.nl';

		if(isset($_GET[host])){
			//$aim->jaaaa=1111;
			if (is_file($_SERVER['DOCUMENT_ROOT'].($f="/sites/$host->name/app/$aim->version/css/$host->name.css"))) $aim->head->css=array($aim->origin.$f);
			else if (is_file($_SERVER['DOCUMENT_ROOT'].($f="/sites/$host->name/app/v1/css/$host->name.css"))) $aim->head->css=array($aim->origin.$f);
			else if (is_file($_SERVER['DOCUMENT_ROOT'].($f="/sites/$host->name/app/css/$host->name.css"))) $aim->head->css=array($aim->origin.$f);
			if (is_file($_SERVER['DOCUMENT_ROOT'].($f="/sites/$host->name/app/$aim->version/js/$host->name.js"))) $aim->head->js=array($aim->origin.$f);
			else if (is_file($_SERVER['DOCUMENT_ROOT'].($f="/sites/$host->name/app/v1/js/$host->name.js"))) $aim->head->js=array($aim->origin.$f);
			else if (is_file($_SERVER['DOCUMENT_ROOT'].($f="/sites/$host->name/app/js/$host->name.js"))) $aim->head->js=array($aim->origin.$f);

			//if (is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/app/$aim->version/config.json")
			//    || is_file($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/app/v1/config.json"))
			//{
			//    $hostconfig=json_decode(file_get_contents($fname));
			//    //$aim->config->client=$hostconfig->client;
			//}
		}
		//err(js_get,$aim);
		//if (in_array(aliconnector,$aim->libraries) && $aim->cookie->appScript && file_exists($_SERVER['DOCUMENT_ROOT'].($f="/".$aim->cookie->appScript))) $aim->js->appScript=$aim->origin.$f;
		//$row=fetch_object($res=query($e=prepareexec("auth.getHostUser",array(hostID=>$aim->hostID,userID=>$aim->userID,accountID=>$aim->client->acccount->id,deviceID=>$aim->device->id))));
		//err($aim);
		//die($e);
		$files=json_decode($row->files);
		$aim->favicon=$files[0]?$files[0]->src:'';
		foreach(array(deviceUID,appKey,userKey,key)as $key)if($value=$aim->$key)setcookie($key,$value,$cookieLifetime,'/');
		foreach(array(app,settings)as $key)if($value=$aim->$key)setcookie($key,$value,$cookieLifetime,"/$aim->host/$aim->app/");
		//err($aim);
		//unset($aim->app);

		//$aim->host1=$aim->host;
		//$aim=array();
		//$aim->host5='MAX';
    $hostname = strtok($_SERVER['SERVER_NAME'],'.');
    $appconfig = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT']."/sites/$hostname/app/v1/config.json"));

		//$itemAccount=fetch_object(query("SELECT hostID,id,[schema],uid FROM api.citems WHERE class='Company' AND hostID=1 AND UniqueKey='$aim->host'"));
    // die(strtok($_SERVER['SERVER_NAME'],'.'));

		//err(api_js,$aim);
		die("Aim=".stripslashes(json_encode(array_merge($_GET,[
			title=>$aim->title,
			access_token=>$aim->access_token,
			deviceId=>$aim->deviceId,
			version=>$aim->version,
			settings=>$aim->settings,
			userId=>$aim->userId,
			client=>$aim->client,
      appconfig=>$appconfig->client,
			//account=>[Email=>$account,Name=>$account->userName],
			//hostName=>ucfirst($aim->host),
			origin=>$aim->origin,
			//host=>$aim->host,
			//hostID=>$itemHost->id,
			//hostId=>$aim->hostId,
			head=>$aim->head,
			//hostID=>$aim->hostID,
			//hostID1=>$itemHost->id,
			//client=>[user=>$itemUser,host=>$itemHost],
			location=>[ip=>$_SERVER[REMOTE_ADDR]],
			//userId=>$aim->userId,
			//accountId=>$aim->accountId,
			//groupId=>$aim->groupId,
		],(array)$aim->config))).";".file_get_contents(__DIR__."/../lib/js/main.js"));
	}
}
// class Website {
//     function get($id=null) {
//         die($id);
//     }
// }
class server {
	function scanpath($path,$name,$recursive=1){
        $data->path=$path;
        $data->name=$name;
        $path="$path$name/";
        $data->size=0;
        //$data->path=$path;
		$files=array_diff(scandir($path), array('.', '..'));
		//var_dump($files);
		//die();


		foreach($files as $filename) {
			$file=$path.$filename;
			if (is_dir($file)) { if($recursive) $fileobj=$data->files[$filename]=server::scanpath($path,$filename); }
			else $fileobj=$data->files[$filename]=(object)array(name=>$filename,size=>filesize($file),modified=>date('Y-m-d H:i:s',filemtime($file)),created=>date('Y-m-d H:i:s',filectime($file)));
			$data->size+=$fileobj->size;
		}
        $data->files=array_values($data->files);
		return $data;
	}
	function state(){
		global $aim;
		//die(json_encode(server::scanpath($_SERVER[DOCUMENT_ROOT]."/shared/","2347355")));
        if (isset($_GET[version])){
            $data->server->phpversion=phpversion();
        }
		if (isset($_GET[server])){
			$res=query($q="
				exec sp_spaceused
			");
			$data->server=fetch_object($res);
			$data->server->diskSpaceFree=disk_free_space(__DIR__);
			next_result($res);
			$row=fetch_object($res);
			foreach($row as $key=>$value)$data->server->$key=$value;

		}
		if (isset($_GET[host])){
			$data->host->diskSpaceUsed=server::scanpath($_SERVER[DOCUMENT_ROOT]."/shared/",$aim->hostID)->size;
			$res=query($q="

			");
		}
		if (isset($_GET[classes])){
			$res=query($q="
				--ITEM COUNT PER CLASS
				select I.class className,COUNT(0) itemCount
				from api.citems I
				WHERE I.hostID=$aim->hostID
				GROUP BY I.class
				ORDER BY I.class

				--ATTRIBUTE COUNT PER CLASS
				select I.class className,COUNT(0) attributeCount,SUM(datalength(A.value)) attributeSize
				from api.citems I
				INNER JOIN om.attributes A ON A.id=I.id AND A.value IS NOT NULL
				WHERE I.hostID=$aim->hostID
				GROUP BY I.class
			");
			while($row=fetch_object($res)) $data->host->classes->{$row->className}=$row;
			next_result($res);
			while($row=fetch_object($res)) {
				$data->host->classes->{$row->className}->attributeCount=$row->attributeCount;
				$data->host->classes->{$row->className}->attributeSize=$row->attributeSize;
			}
		}
		if (isset($_GET[account])){
			$res=query($q="
				--ACCOUNTS
				SELECT I.id,I.title,IG.id AS groupID,IG.title AS groupTitle,I.startDT,I.endDT,AM.value as Email
				FROM api.items I
					INNER JOIN om.attributes A ON A.id = I.id AND A.fieldID=1228 AND I.classID=1004 AND I.toID IS NOT NULL
					INNER JOIN api.items IG ON IG.id = A.itemID
					LEFT OUTER JOIN om.attributes AM ON AM.id = I.id AND AM.fieldID=931
				WHERE I.hostID=$aim->hostID

				--ACCOUNTS LOGIN HISTORY
				SELECT A.id,A.value Periode,A.createdDT,A.modifiedDT
				FROM api.items I
				INNER JOIN api.attributes A ON A.id=I.id AND A.fieldID=1952 AND I.classID=1004 AND I.hostID=$aim->hostID
			");
			//ACCOUNTS
			$data->account=array();
			while($row=fetch_object($res)) array_push($data->account,$account->{$row->id}=$row);
			//ACCOUNT HISTORY
			next_result($res);
			while($row=fetch_object($res)) $account->{$row->id}->history->{$row->Periode}=$row;
		}
		if (isset($_GET[devices])){
			$res=query($q="
				--DEVICES

			");
		}



		//while($row=fetch_object($res)) {
		//    item::clean($row);
		//    $items->{$row->id}=$row;
		//    array_push($data->value,$row);
		//}
		//foreach($items as $id=>$row) if($row->schema==attribute && $row->masterID && $items->{$row->masterID}){
		//    $items->{$row->masterID}->values->{$row->name}->id=$row->id;
		//    if($row->detailID)$items->{$row->masterID}->values->{$row->name}->detailID=$row->detailID;
		//}
		//if(next_result($res)) while($row=fetch_object($res)) {
		die(json_encode($data));
	}
	function dir(){
		$data=server::scanpath($_GET[path],$_GET[name],$_GET[tree]);
		die(json_encode($data));
    }
}

class message {
    function put(){
        global $aim;
        $put=dbvalue(file_get_contents('php://input'));
        $q="INSERT om.msg (itemId,hostID,fromId,msg) VALUES ($aim->id,$aim->hostID,$aim->userID,'$put')
			;UPDATE om.items SET msgCnt=M.cnt,modifiedDT=GETUTCDATE() FROM (SELECT COUNT(0)cnt FROM om.msg WHERE itemID=$aim->id) M WHERE om.items.id=$aim->id";
        query($q);
		die();
    }
	function get(){
        global $aim;
        $rows=rows(prepareexec("api.getItemMessage",array(userID=>$aim->userID,accountID=>$aim->clientaccountID,hostID=>$aim->hostID,id=>$aim->id,a=>get)));
        exit(json_encode($rows));
    }
    function delete(){
        global $aim;
        $rows=rows(prepareexec("api.getItemMessage",array(userID=>$aim->userID,accountID=>$aim->clientaccountID,hostID=>$aim->hostID,aid=>$aim->aid,a=>del)));
        exit();
    }
    function check(){
        global $aim;
        $rows=rows($q=prepareexec("api.getItemMessage",array(userID=>$aim->userID,accountID=>$aim->clientaccountID,hostID=>$aim->hostID,a=>check)));
        //die($q);
		exit(json_encode($rows));
    }
}

class model2d {
	function get(){
		global $aim;
		$res=query("SELECT D.*,I.title,I.[schema],I.id,I.typical FROM om.itemChildren2D D INNER JOIN api.citems I ON I.id=D.childID WHERE D.masterID=$aim->masterID;");
		$rows=array();
		while($row = fetch_object($res)) array_push($rows,$row);
		die(json_encode($rows));
	}
	function put(){
		global $aim;
		$put=json_decode(file_get_contents('php://input'));
		query("INSERT om.itemChildren2D (masterID,childID,offsetTop,offsetLeft) VALUES ($aim->id,$put->childID,$put->offsetTop,$put->offsetLeft);");
		die();
		//err($aim);
		//die(a.json_encode($aim));
	}
}

class three {
	function get(){
		global $aim;
		$o=(object)array(scale=>10,shape=>(object)array(),geo=>(object)array());
		//$user=fetch_object(query("SELECT * FROM api.hostAccountGet('$post->host','$post->sessionID');"));
		$obj=fetch_object(query("SELECT files FROM om.items WHERE id=$aim->id;"));
		$files=json_decode($obj->files);
		$o->floorplan->src=$files[0]->src;
		$res=query("EXEC api.getItemModelTree @id=$aim->id;");
		while($row = fetch_object($res)) {
			$row->children=$row->children?json_decode($row->children):array();
			foreach ($row as $key=>$value) if ($value==='') unset($row->$key); else if (is_numeric($value)) $row->$key=(float)$value;
			$items->{$row->id}=$row;
			if (!$root) $root=$items->{$row->id};
			if ($row->masterID && $items->{$row->masterID}) array_push($items->{$row->masterID}->children,$items->{$row->id});
		}
		$o->object=$root;
		$cfg=json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/app/three/json/objects.json"));
		foreach ($cfg as $key=>$value)$o->{$key}=$value;
		$cfg=json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT']."/sites/$aim->host/app/three/json/shapes.json"));
		foreach ($cfg->shape as $shapename=>$shape)$o->shape->{$shapename}=$shape;
		foreach ($o->shape as $obj) foreach ($obj->vectors as $i=>$value) $obj->vectors[$i]=round($obj->vectors[$i]*1000/39.370);
		//we bouwen nu recursive een boom op van het top object en alle kinderen
		function build(&$b) {
			global $o;
			if (!$b->children) unset($b->children);
			if ($b->geo) $b=(object)array_merge((array)$o->geo->{$b->geo},(array)$b);
			foreach ($b->children as $i => $c) $b->children[$i]=build($c);
			return $b;
		}
		$o->object=build($o->object);
		exit(json_encode($o));
	}
	function shapes(){
		//$data=json_decode($_POST[data]);
		//$hostID=$_POST[hostID];
		mkdir($path = $_SERVER['DOCUMENT_ROOT']."/shared/".$_POST[hostID],0777,true);
		file_put_contents("$path/shapes.json",$_POST[data]);
		file_put_contents("$path/shapes.js","Aim.assign({Three:".$_POST[data]."});");
		die($fn);
	}
}

class device1 {
    function put(){
        //die('RESPONSE PUT VAN SITE '.file_get_contents('php://input'));
		global $aim;
		$put=json_decode(file_get_contents('php://input'));
		$ret->value=array();
		foreach ($put->value as $item) {
            if (class_exists($class=$item->schema) && method_exists($class,post)) $class::post($item);
            array_push($ret->value,$item=item::post($item));
            //array_push($ret->value,class_exists($class=$item->schema) && method_exists($class,post) ? $class::post($item) : item::item(item::post($item)) );
        }
		die(json_encode($ret));
	}
    function post(){
        die('RESPONSE POST VAN SITE');
		global $aim;
		$put=json_decode(file_get_contents('php://input'));
		$ret->value=array();
		foreach ($put->value as $item) {
            if (class_exists($class=$item->schema) && method_exists($class,post)) $class::post($item);
            array_push($ret->value,$item=item::post($item));
            //array_push($ret->value,class_exists($class=$item->schema) && method_exists($class,post) ? $class::post($item) : item::item(item::post($item)) );
        }
		die(json_encode($ret));
	}
}

class outlook {
	function Contacts($Id){

		err(outlookContacts,$Id);

	}
}

class api {
	function Users($address){
		global $aim;
		$address=explode("@",$address);
		$aim->urlUserUid=array_shift($address);
		$aim->urlHostUid=array_shift($address);
	}
	function get($par=null){
		extract($GLOBALS);
		extract((array)$aim->client);
		//err($aim);
		//return $par;
		//err(aa);
		//header("Content-type:application/json");

		//return $aim;
		if ($par) $aim=(object)$par;
		//$aim=$aim;
		//return $aim;

        //err($aim);

        $schema=preg_split('/\\(|\\)/', $aim->schema, -1, PREG_SPLIT_NO_EMPTY);
        $aim->schema=$schema[0];
        $function=preg_split('/\\(|\\)/', $aim->function, -1, PREG_SPLIT_NO_EMPTY);
        $aim->function=$function[0]?:get;

        //if(class_exists($class=$aim->schema) && $class!=item && method_exists($class,$method=$aim->function)) (new $class)->$method($param);
		//err($aim);
        if(is_numeric($schema[1]))$aim->id=$aim->id?:$schema[1];
        else if($schema[1]) $aim->tag=str_replace("'","",$schema[1]);

        foreach($_GET as $key=>$value)if($key[0]=="$")$aim->{trim(substr($key,1))}=trim($value);
        if($aim->orderby)$aim->order=$aim->orderby;
        if($aim->search)$aim->q=$aim->search;


        if($aim->function==Children)$aim->child=$function[1]?:1;

        //err(item_get,$aim);

        $root=($_SERVER[HTTPS]==on?https:http)."://".$_SERVER[SERVER_NAME];
		$data=$output=(object)array();


		$headers=getallheaders();

		//$headers=$aim->headers;
//getallheaders();
        foreach($headers as $key=>$value)$headers[strtolower($key)]=$value;
		//$data->headers=$headers;

		//=(object)array(
		//    "@odata.context"=> $root.array_shift(explode("?",$_SERVER[REQUEST_URI]))."\$metadata#People",
		//    "@odata.nextLink"=> $root.$_SERVER[REQUEST_URI]."&%24skiptoken=8",
		//    );


		//if ($headers['odata-version']){
		//    header('Content-Type: application/json; odata.metadata=minimal');
		//    header('OData-Version: 4.0');
		//    $output->{"@odata.context"}= $root.array_shift(explode("?",$_SERVER[REQUEST_URI]))."\$metadata#People";
		//    $output->{"@odata.nextLink"}= $root.$_SERVER[REQUEST_URI]."&%24skiptoken=8";
		//}
		//else {
		//    header('Content-Type: application/json');
		//    header('AData-Version: 1.0');
		//    $output->{"@odata.context"}= $root.array_shift(explode("?",$_SERVER[REQUEST_URI]))."\$metadata#People";
		//    $output->{"@odata.nextLink"}= $root.$_SERVER[REQUEST_URI]."&%24skiptoken=8";
		//}

		//$output->header=getallheaders();

		//return $headers;

		//return $aim;
		$accept==$headers[Accept];
		//return a;
				//return $aim;

		//SOAP TEST
		connect::authorization();
		//*/

		//err($access,$aim);
		//return $aim;

        //
        // $output->server=$_SERVER;
        // $output->aim=$aim;
		//err($aim);

		if(isset($_GET[device])){
		//wordt gebruikt door node connector
			$q="
				DECLARE @T TABLE(level int,id int,detailID int)
				;WITH P (level,id,detailID) AS (
					SELECT 0,$aim->id,0
					UNION ALL
					SELECT level+1,I.id,I.detailID
					FROM P INNER JOIN api.items I ON I.masterID=P.id AND level<50 AND ISNULL(I.selected,1)=1
				)
				INSERT @T SELECT * FROM P
				SELECT P.level,I.* FROM @T P INNER JOIN api.citems I ON I.id IN (P.id,P.detailID) ORDER BY level,I.idx
				--SELECT P.level,I.id,I.detailID,name,title,masterID,srcID FROM @T P INNER JOIN api.citems I ON I.id IN (P.id,P.detailID) ORDER BY level,I.idx

				;WITH P (level,id,srcID) AS (SELECT 0,I.id,I.id FROM @T I UNION ALL SELECT level+1,P.id,ISNULL(I.inheritedID,I.srcID) FROM api.items I INNER JOIN P ON I.id=P.srcID AND level<20)
				SELECT P.id,A.aid,A.id attributeItemID,A.name,A.value,A.itemID,CONVERT(VARCHAR(50),A.modifiedDT,127)modifiedDT,A.userID FROM P INNER JOIN api.attributes A ON A.id=P.srcID AND A.value IS NOT NULL AND P.srcID IS NOT NULL ORDER BY P.level DESC

				--selecteer alle control items met detail link
				--;WITH P ( level, id,detailID,selected)    	AS    (
				--	SELECT 0,I.id,I.detailID,I.selected
				--	FROM   		om.items I
				--	WHERE  I.id = 3563194
				--	UNION ALL
				--	SELECT level+1,I.id,I.detailID,CASE WHEN P.selected=0 THEN CONVERT(BIT,0) ELSE ISNULL(I.selected,1) END
				--	FROM    		P   		INNER JOIN om.items I ON I.masterId = P.id and level<8
				--)
				--SELECT * FROM P
				--WHERE P.detailID IS NOT NULL
			";
			//die(str_replace(";",PHP_EOL.";",$q));
			//die("<plaintext>".str_replace(";",PHP_EOL.";",$q));
			$res=query($q);
			while($row=fetch_object($res)) {
				$items->{$row->id}=cleanrow($row);
				$items->{$row->id}->hasControlObject=false;
			}
			//if(next_result($res)) while($row=fetch_object($res)) if(!$items->{$row->id}->values->{$row->name}){$items->{$row->id}->values->{$row->name}=cleanrow($row);unset($row->id);}


			if(next_result($res)) while($row=fetch_object($res)) {
				//if (!$row->value && $row->value!=="0" && $row->value!=="") err($row);
				$items->{$row->id}->values->{$row->name}=cleanrow($row);
				unset($row->id);
			}

			//foreach ($items as $id=>$value) foreach([Value,CriticalFailure,NonCriticalFailure,Locking,Maintenance,Running,RunningMode,Security,PreWarning_1,PreWarning_2,PreWarning_3,MeasurementErrorFlag] as $key) unset($value->values->{$key});

			//if(next_result($res))
			//    while($row=fetch_object($res))
			//        if($items->{$row->detailID}) {
			//            $items->{$row->detailID}->hasControlObject=true;
			//            $items->{$row->detailID}->hasControlObjectSelected=$row->selected;
			//        }

			$data->value=array_values((array)$items);
			die(json_encode($data));
		}

		if(($schema=$aim->api->definitions->{$aim->schema}) && ($dbname=$aim->api->dbname) && $schema->table){
			$schema->schema=$aim->schema;
			if($put){
				foreach($put->value as $row)query($q="UPDATE $dbname.$schema->table SET ".(paramfields($row->values))." WHERE [$schema->id]='$row->id';");
				die($q);
			}
			$data->value=getRecordset($schema,$aim->api->dbname);
			die(json_encode($data));
		}
		//err(wwww,$aim);

										//err(get,$aim);
		$aim->schema=$aim->schema?:(is_numeric($aim->folder)?item:$aim->folder?:item);
		if(is_numeric($aim->folder))$aim->id=(int)$aim->folder;

		//if(!$aim->id && !$aim->schema) return;


		//if($_GET[schema])$aim->schema=$_GET[schema];

		//err($aim);

		if(property_exists($aim,reindex) && $aim->id)item::reindex($aim->id);
		//$data=(object)$_GET;
		//$data->count=0;

		//$aim->ContentType=$aim->ContentType?:$headers["Content-Type"];



		$filter=str_replace(array('*',' eq ',' ne ',' gt ',' ge ',' lt ',' le '),array('%',' = ',' <> ',' > ',' >= ',' < ',' <= '),str_replace('"',"'",urldecode($_GET[filter]?"AND(".$_GET[filter].")":"")));
		$selectbasic=$GLOBALS[selectbasic];
		$selectlist=$GLOBALS[selectlist];
		$selectall=$GLOBALS[selectall];
		//$userID=$aim->userID?:0;

		//err($aim);

		$q=";DECLARE @R TABLE (fromID INT, toID INT, ref VARCHAR(50),level INT);DECLARE @T TABLE (_id int)";
		if ($aim->id) {
			//die($aim->id);
			$select="[".implode("],[",explode(",",$selectlist))."]";
			//if(!property_exists($aim,child) && !property_exists($aim,link)) $q.="INSERT @T VALUES (NULL,NULL,NULL,0,$aim->id)";
			if($aim->child!=1) $q.="INSERT @T VALUES ($aim->id)";
			if(property_exists($aim,child))$q.="
				;WITH P(level,p_id,p_masterID,p_detailID)AS(
					SELECT 0,id,masterID,detailID
					FROM api.items WHERE id=$aim->id
					UNION ALL
					SELECT level+1,id,masterID,detailID
					FROM P INNER JOIN api.citems I ON masterID=ISNULL(P.p_detailID,P.p_id) $filter AND level<".($aim->child?:10)."
				)INSERT @R SELECT P.p_masterID,P.p_id,'Child',P.level FROM P WHERE level>0
			";
			if(property_exists($aim,tree))$q.="
				;WITH P(level,p_id,p_masterID,p_detailID)AS(
					SELECT 0,id,masterID,detailID
					FROM api.items WHERE id=$aim->id
					UNION ALL
					SELECT level+1,id,masterID,detailID
					FROM P INNER JOIN api.citems I ON masterID=P.p_id $filter AND level<".($aim->tree?:10)."
				)INSERT @R SELECT P.p_masterID,P.p_id,'Child',P.level FROM P
			";
			if(property_exists($aim,master))$q.="
			    ;WITH P(level,id,masterID)AS(
			        SELECT 0,id,masterID
			        FROM api.items WHERE id=$aim->id
			        UNION ALL
			        SELECT level-1,I.id,I.masterID
			        FROM P INNER JOIN api.items I ON I.id=P.masterID AND I.masterID<>I.srcID AND level>-".($aim->master?:10)."
			    )INSERT @R SELECT P.masterID,P.id,'Child',P.level FROM P --WHERE P.level<0
			";
			if(property_exists($aim,src))$q.="
			    ;WITH P(level,id,srcID)AS(
			        SELECT 0,id,srcID
			        FROM api.items I
					--INNER JOIN @R R ON I.id = R.toID
					WHERE id=$aim->id
			        UNION ALL
			        SELECT level-1,I.id,I.srcID
			        FROM P INNER JOIN api.items I ON I.id=P.srcID AND level>-".($aim->master?:10)."
			    )INSERT @R SELECT P.srcID,P.id,'Derivative',P.level FROM P --WHERE P.level<0
			";
			if(property_exists($aim,users))$q.=";
			    INSERT @R SELECT F.userID,F.id,'Subscribers',1
			    FROM @T T
			    INNER JOIN om.itemFav F ON F.id=$aim->id
			";
			if(property_exists($aim,refby)) $q.=";
			    INSERT @R SELECT F.id,F.itemID,'Attribute',1
			    FROM om.fields F WHERE itemID=$aim->id
			";
			if(property_exists($aim,link)) $q.="
			    INSERT @R
				SELECT L.fromID,L.toID,'Link',1
				FROM om.link L WHERE fromID IN (SELECT fromID FROM @R) --=$aim->id
				UNION
				SELECT L.fromID,L.toID,'Link',1
				FROM om.link L WHERE toID IN (SELECT fromID FROM @R) --=$aim->id
			";
			if($aim->select=="*") $q.=";
			    INSERT @R
				SELECT F.id,F.userID,'users',1
				FROM om.itemFav F
				WHERE F.id=$aim->id
			";
			$q.=";
				INSERT @T SELECT
					fromID FROM @R WHERE fromID IS NOT NULL AND fromID != $aim->id --AND fromID NOT IN (SELECT _id FROM @T)
					UNION
					SELECT toID FROM @R WHERE toID IS NOT NULL AND toID != $aim->id --AND toID NOT IN (SELECT _id FROM @T)
			";
			$q.=";
				INSERT @T SELECT I.detailID FROM api.items I INNER JOIN @T T ON T._id=I.id WHERE I.detailID IS NOT NULL AND I.detailID NOT IN (SELECT _id FROM @T)
			";
		}
		else if ($aim->q || $filter || $aim->folder || property_exists($aim,sync)) {
			//err($aim);
			//$aim->schema=$aim->schema?:$aim->folder;
			$onlyhost="(hostID IN($host->id".($aim->clientgroupID?",".$aim->clientgroupID:"").($aim->clientuserID?",".$aim->clientuserID:"").")OR(hostID=1 AND www=1))".(!$aim->authOK && !$account->id?"AND(www=1)":"");
			$q.=";DECLARE @classID INT;".($aim->classID?"SET @classID=$aim->classID":($aim->schema!=item?"SELECT @classID=id FROM om.class WHERE(class='$aim->schema')":""));
			$base=";INSERT @T SELECT id FROM api.citems WHERE($onlyhost)".($aim->schema!=item?"AND(classID=@classID)":"")."$filter";
			if (!$aim->q || $aim->q=='*') $q.=$base;
			else {
				$aim->q=trim(str_replace('*','%',$aim->q));
				if ($aim->search){
					$or=array();
					foreach(explode(",",$aim->search)as $attributeName) {
						$q.="$base AND [$attributeName]LIKE'%".implode("%'AND[$attributeName]LIKE'%",explode(" ",$aim->q))."%' AND id NOT IN (SELECT id FROM @T)";
					}
					//$q.=$base."AND(".implode(')OR(',$or).")";
					//foreach(explode(",",$aim->search)as $attributeName) array_push($or,"[$attributeName]LIKE'%".implode("%'AND[$attributeName]LIKE'%",explode(" ",$aim->q))."%'");
				}
				function explodeq($sep,$aq){
					$aq=explode($sep,$aq);
					foreach ($aq as $i=>$q)$aq[$i]=strpos($q,'%')?$q:"$q";
					return $aq;
				}
				$qword="id IN (SELECT itemID FROM om.itemWord WI INNER JOIN om.word W ON W.id=WI.wordID AND W.word LIKE '";
				$q.="$base AND ($qword".implode("'))AND($qword",explodeq(' ',$aim->q))."'))AND id NOT IN (SELECT id FROM @T)";
			}
			if (property_exists($aim,count)){
				//die($q);
				$data->count=fetch_object($res=query("$q;SELECT count(0)count FROM @T"))->count;
				die(json_encode($data));
			}
			//die($select);
			//$q.=";SET NOCOUNT OFF;SELECT [schema],I.id,$select FROM api.citems I INNER JOIN @T T ON T.id=I.id";
		}
		$q.=";SET NOCOUNT OFF;SET TEXTSIZE -1;";


		$select=!$aim->select || $aim->select=='*'?($aim->id?$selectall:$selectlist):$aim->select;
		$fields=array_diff(explode(',',$select),explode(',',$selectall.',schema,masterID,id,level'));
		$select=implode(',',array_intersect(explode(',',$select),explode(',',($selectall).',level')));
        $top=$_GET[top]?:10000;
		$q.=";SELECT id,[schema],LastModifiedDateTime,CreatedDateTime,ParentFolderId,SourceObjectId,StartDateTime,ChildIndex,UniqueKey,masterID".($select?",$select":"")." \r\nFROM (SELECT DISTINCT TOP $top T._id FROM @T T) T \r\nINNER JOIN api.userItems(0$user->id) I \r\nON I.id=T._id;SELECT * FROM @R";
		//if($aim->select=='*')$q.=";SELECT F.id,F.name,F.value,F.itemID FROM @T T INNER JOIN om.fields F ON F.id=".(property_exists($aim,selectall)?"T._id":$aim->id);
		if($aim->select=='*')$q.=";WITH P (level,id,srcID)AS(SELECT 0,I._id,I._id FROM @T I UNION ALL SELECT level+1,P.id,ISNULL(I.inheritedID,I.srcID) FROM api.items I INNER JOIN P ON I.id=P.srcID AND level<10) SELECT P.id,A.aid,A.id attributeItemID,A.name,A.value,A.itemID,A.modifiedDT,A.userID FROM P INNER JOIN api.attributes A ON A.id=P.srcID AND A.value IS NOT NULL AND P.srcID IS NOT NULL ORDER BY P.level";

        //SELECT S.id,F.id itemID,F.name,F.value,F.itemID FROM @T T INNER JOIN om.itemSrc S ON S.id=".(property_exists($aim,selectall)?"T._id":$aim->id)." INNER JOIN om.fields F ON F.id=S.srcID ORDER BY S.level
		else if($fields)$q.=";SELECT A.id,A.name,A.value,A.itemID,A.modifiedDT,A.userID FROM @T T INNER JOIN api.attributes A ON A.id=T._id AND[fieldID]IN(SELECT[id]FROM[om].[field]WHERE[name]IN('".implode("','",$fields)."'))";
		if($aim->select=='*' && $aim->id && $user->id)$q.=";SET NOCOUNT ON;EXEC api.addItemUserVisit @id=$aim->id,@userID=$user->id";



		//die("<plaintext>".str_replace(";",PHP_EOL.";",$q));


		// http_response_code(204); // set response code 204 No content
		// http_response_code(200); // set response code 200 OK
		//

		/*
			http_response_code(201); // set response code 201 Created
			HEADER=
			HTTP/1.1 201 Created
			Content-Length: 652
			Content-Type: application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8
			ETag: W/'08D1D3800FC572E3'
			Location: https://services.odata.org/V4/(S(34wtn2c0hkuk5ekg0pjr513b))/TripPinServiceRW/People('lewisblack')
			OData-Version: 4.0
		*/

		if ($headers["odata-version"]){
			header('Content-Type: application/json; odata.metadata=minimal');
			header('OData-Version: 4.0');
			$output->{"@odata.context"} = $root.array_shift(explode("?",$_SERVER[REQUEST_URI]))."\$metadata#".$aim->schema;
			if(!$_GET[id]){
				$output->{"@odata.nextLink"}= $root.$_SERVER[REQUEST_URI]."&%24skip=8";
			}
		}
		//$data->schema=$aim->schema;

		//die(json_encode(array(q=>$q)));
		//return [$q];
		//$q="SELECT TOP 1 * FROM api.items";
		$res=query($q);

		//return fetch_object($res);
		//return $aim;

		//err($_GET);
		$getItem = $aim->schema && $aim->id && !$aim->child && !$aim->folder;// && $_GET[id] && !$_GET[child];
		$datavalue = [];
		//err($getItem);
		//if(!$_GET[id])$data->value=array();
		//err($data);

		while($row=fetch_object($res)) {
			//echo $row->id;
		//return $q;

		//  MAKEN   CreatedDateTime,LastModifiedDateTime,ChangeKey,ParentFolderId,SourceId

			$items->{$row->id} = $item = $getItem ? $data : (object)array();

			//$payload=[hostID=>$row->hostID,server=>'db1.aliconnect.nl',db=>'aim',schema=>$row->schema,id=>$row->id,uid=>$row->uid];



			$Id=getId([hostID=>$row->hostID,schema=>$row->schema,id=>$row->id,uid=>$row->uid]);

			array_push($datavalue, $items->{$row->id});
			//err($datavalue);
			//err($row);
			//if($_GET[id])$item=$items->{$row->id}=$data;
			//if ($headers['odata-version']>=1){
			//if ($headers["odata-version"]){
			//err($aim);

			$aim->userUID='4EC074C5-0A13-4250-9B21-565B809ABAE5';
			if ($headers["odata-version"]){
				$item->{"@odata.id"}=$odataId=$root."/$aim->host/api/$aim->version/Users('$aim->userUID@$aim->hostUID')/$row->schema('$Id')";
				$item->{"@odata.etag"}="W/'".base64_encode($row->LastModifiedDateTime)."'";
			}


				//$item->{"@odata.editLink"}=$odataId;
				$item->Id=$Id;
				//header('Content-Type: application/json; odata.metadata=minimal');
				//header('OData-Version: 4.0');
			//}
			//}
			if($row->masterID && !$row->ParentFolderId) query("UPDATE om.items SET ParentFolderId='".($row->ParentFolderId=getId($row->masterID))."' WHERE id=$row->id");
			if($row->srcID && !$row->SourceObjectId) query("UPDATE om.items SET SourceObjectId='".($row->SourceObjectId=getId($row->srcID))."' WHERE id=$row->id");
			//unset($row->schema,$row->id,$row->uid,$row->masterID,$row->srcID,$row->idx,$row->hostID);


			//err($item);

			//item::clean($row);
            //$row->url="https://aliconnect.nl/aim/v1/api/?schema=$aim->schema&id=$row->id&select=*";

			//$item=$aim->id?$data:$items->{$row->id};
            foreach($row as $key=>$value){
    			if(is_null($value)||$value==="") continue;
    			if(is_numeric($value))$value=floatval($value);
    			if(is_string($value) && in_array($value[0],array('{','['))) $value=json_decode($value);
    	        else if(is_string($value)) $value=trim($value);
                $item->{$key}=$value;
    		}
		}
		//if(count($data->value))
		//err($getItem,$datavalue);

		if(!$getItem) $data->value=$datavalue;

		//if(count($datavalue)>1)$data->value=$datavalue;
		//$data->value=$value;
		//err($data);

		foreach($items as $id=>$row) if($row->schema==attribute && $row->masterID && $items->{$row->masterID}){
			$items->{$row->masterID}->values->{$row->name}->id=$row->id;
			if($row->detailID)$items->{$row->masterID}->values->{$row->name}->detailID=$row->detailID;
		}
		if(next_result($res)) while($row=fetch_object($res)) {
			if($row->fromID && $row->toID && $items->{$row->fromID}) {
				$items->{$row->fromID}->linkto->{$row->toID}=$row->ref;
				$a=$items->{$row->fromID}->link->{$row->ref}=$items->{$row->fromID}->link->{$row->ref}?:array();
				array_push($items->{$row->fromID}->link->{$row->ref},$row->toID);
			}
		}
		if(next_result($res)) while($row=fetch_object($res)) if($row->name) {
			//$row->name=ucfirst($row->name);
			if(property_exists($aim,sync) || $headers['odata-version']) $items->{$row->id}->{$row->name}=$row->value;
			else {
				//$items->{$row->id}->values->{$row->name}=$items->{$row->id}->values->{$row->name}?:$row;
				if($row->attributeItemID==$row->id)$items->{$row->id}->values->{$row->name}->aid=$row->aid;
				if($row->attributeItemID!=$row->id && !$items->{$row->id}->values->{$row->name}->valueSource)$items->{$row->id}->values->{$row->name}->valueSource=$row->value;
				if($row->value!="" && !$items->{$row->id}->values->{$row->name}->value)$items->{$row->id}->values->{$row->name}->value=$row->value;
				if($row->itemID && !$items->{$row->id}->values->{$row->name}->itemID)$items->{$row->id}->values->{$row->name}->itemID=$row->itemID;
				if($row->userID && !$items->{$row->id}->values->{$row->name}->userID)$items->{$row->id}->values->{$row->name}->userID=$row->userID;
				if($row->modifiedDT && !$items->{$row->id}->values->{$row->name}->modifiedDT)$items->{$row->id}->values->{$row->name}->modifiedDT=$row->modifiedDT;
				//if ($row->itemID && $row->itemID!=$row->id) $items->{$row->id}->values->{$row->name}->sourceValue=$row->value;
				//if(!$row->itemID)unset($row->itemID);
				//unset($row->id,$row->name);
				//unset($row->name);
			}
		}
		//foreach($items as $id=>$row) $row->values1=$row->values;
		if($aim->type==tbl){
			header("Content-type: text/html");
			echo '<base target="_blank"><link href="/lib/css/tbl.css" rel="stylesheet" /><table>';
			$select=explode(",",$aim->select);
			echo '<tr><td>'.implode("</td><td>",$select)."</td></tr>";
			foreach ($items as $id=>$item){
				echo "<tr>";
				foreach($select as $key) echo"<td>".($item->{$key}?:($item->values&&$item->values->{$key}?$item->values->{$key}->value:""))."</td>";
				echo "</tr>";
			}
			echo "</table>";
			die();
		}

		if(strpos($_GET[contentType], xml) !== false) {
			header("Content-type: text/xml");
			$xml = new SimpleXMLElement('<value></value>');
			foreach ($items as $id=>$item){
				//if(!$item->schema) continue;
				$xmlItem = $xml->addChild($item->schema);
				if ($item->filterfields) {
					$xmlValues=$xmlItem->addChild('filterfields');
					foreach ($item->filterfields as $key => $value) $xmlValues[$key]=$value;
					unset($item->filterfields);
				}
				if ($item->values) {
					$xmlValues=$xmlItem->addChild('values');
					foreach ($item->values as $key => $value) {
						$xmlValue=$xmlValues->addChild($key,$value->value);
						unset($value->value);
						foreach ($value as $attrname => $attr) $xmlValue[$attrname]=$attr;
					}
					unset($item->values);
				}
				foreach ($item as $key => $value) if ($value!="") $xmlItem[$key]=$value;
			}
			die($xml->asXml());
		}
				//die(a);

		$data->count=count($data->value);
		//$data=aaa;
		return $data;
		//die(json_encode($data));
	}
	function put(){
        //echo "put0";
        //die(kkkk);
        //die(json_encode(array(test=>max)));
		global $aim,$put;
		$put=json_decode(file_get_contents('php://input'));
		$ret->value=array();
		foreach ($put->value as $item) {
            if (class_exists($class=$item->schema) && method_exists($class,post)) $class::post($item);
            array_push($ret->value,$item=item::post($item));
            //array_push($ret->value,class_exists($class=$item->schema) && method_exists($class,post) ? $class::post($item) : item::item(item::post($item)) );
        }

        header("Content-Type: application/json");
        header('X-Content-Type-Options: nosniff');
		die(json_encode($ret));
	}
	function post(){
		global $aim;
		$put=$input=json_decode(file_get_contents('php://input'));
		$value=$input->value?:[$input];
		$ret->value=array();
		foreach ($value as $item) {
            if (class_exists($class=$item->schema) && method_exists($class,post)) $class::post($item);
            array_push($ret->value,$item=item::post($item));
        }
        header("Content-Type: application/json");
        header('X-Content-Type-Options: nosniff');
		die(json_encode($ret));
	}
	function delete(){
		global $aim;
		//err($aim);
		$row=fetch_object(dbexec("api.delItem",array(id=>$aim->id,userID=>$cookie->userID,hostID=>$cookie->hostID)));
		//rrmdir($_SERVER['DOCUMENT_ROOT']."/content/$row->path");
		die($row->path);
	}
}
class item {
	function put(){
        //echo "put0";
        //die(kkkk);
        //die(json_encode(array(test=>max)));
		global $aim,$put;
		$put=json_decode(file_get_contents('php://input'));
		$ret->value=array();
		foreach ($put->value as $item) {
            if (class_exists($class=$item->schema) && method_exists($class,post)) $class::post($item);
            array_push($ret->value,$item=item::post($item));
            //array_push($ret->value,class_exists($class=$item->schema) && method_exists($class,post) ? $class::post($item) : item::item(item::post($item)) );
        }

        header("Content-Type: application/json");
        header('X-Content-Type-Options: nosniff');
		die(json_encode($ret));
	}



	function clean($row=null){
		foreach($row as $key=>$value){
			//if(is_null($value)||$value==="")$row->$key=null;
			if(is_null($value)||$value==="")unset($row->$key);
			if(is_numeric($value))$row->$key=floatval($row->$key);
			if(is_string($row->$key) && in_array($value[0],array('{','['))) $row->$key=json_decode($value);
			//if(sizeof(explode("-",$value))==3 && $time=strtotime($value))$row->$key=(int)date('His',$time)?date('Y-m-d\TH:i:s\Z',$time):date('Y-m-d',$time);
	        else if(is_string($row->$key)) $row->$key=trim($value);
			//unset($row->config);
		}
		return $row;

	}
	function patch(){
		self::put();
	}
	function post($put=null){
		//extract($GLOBALS);
		global $aim;
		$put=clone($put);
		//die(aaabbbb.json_encode($put));


		if (class_exists($schema=$put->schema) && method_exists($schema,put)) $schema::put($put);
		unset($put->typical);
		$q="SET NOCOUNT ON;SET DATEFORMAT YMD;DECLARE @id INT,@masterID INT,@classID INT,@idx INT,@config VARCHAR(MAX);";

		if($put->id)$q.=";SET @id=$put->id";
		else {
			unset($put->id);
			$put->hostID=$put->hostID?:$aim->access->host->id;
			$q.=PHP_EOL.";EXEC api.addItem @id=@id OUTPUT,".params($put).";IF @id IS NULL RETURN";
		}
		unset($put->find);
		if(property_exists($put,userlist)) {
			  $q.=PHP_EOL.";UPDATE om.itemFav SET updateDT=NULL WHERE id=@id";
			  foreach ($put->userlist as $name => $itemID) $q.=";EXEC api.addItemFav @id=@id,@accountID=$itemID";
			  $q.=PHP_EOL.";DELETE om.itemFav WHERE id=@id AND updateDT IS NULL";
		}
		if(property_exists($put,masterID) && property_exists($put,idx)){
			$q.=PHP_EOL."
				SELECT @masterID=masterID,@idx=idx FROM om.items WHERE id=@id
				UPDATE om.items SET idx=idx-1 WHERE masterID=@masterID AND idx>@idx
				UPDATE om.items SET idx=idx+1 WHERE masterID=$put->masterID AND idx>=$put->idx
				UPDATE om.items SET idx=$put->idx,masterID=$put->masterID WHERE id=@id
			";
			unset($put->masterID,$put->idx);
		}
		if(property_exists($put,values)){
			foreach($put->values as $attributeName=>$field){

				if(in_array($attributeName,$GLOBALS[itemattributes])){
				    $put->{$attributeName}=$field;
				    //continue;
				}
				if(!is_object($field))$field=(object)array(value=>$field);
				$field->name=$attributeName;
				if($field->classID)$field->classID=array_shift(explode(";",$field->classID));
				$field->moduserID=$user->id=$aim->client->user->id;
				unset($field->post);
				$q.=PHP_EOL.";EXEC api.setAttribute @id=@id,".params($field);
				//if($attributeName==Title) err($q);
			}
		}
		if(property_exists($put,files))$put->files=json_encode($put->files);
		if(property_exists($put,filterfields))$put->filterfields=json_encode($put->filterfields);

		unset($put->values,$put->id,$put->userlist,$put->schema);
		$put->modifiedByID=$cookie->userID;
		$put->modifiedDT=$put->modifiedDT?:'GETUTCDATE()';
		$q.=PHP_EOL.";UPDATE om.items SET ".paramfields($put)." WHERE id=@id";
		if ($put->masterID || $put->finishDT) $q.="
			DECLARE @T TABLE (id INT,cnt INT,finishDT DATETIME)
			INSERT @T
			SELECT M.id,C.cnt,C.finishDT
			FROM om.itemMasters(@id)M
			LEFT OUTER JOIN (
				SELECT masterID,SUM(CASE WHEN finishDT IS NULL THEN 1 ELSE 0 END)cnt,MAX(finishDT)finishDT FROM api.items GROUP BY masterID
			)C ON C.masterID=M.id
			UPDATE om.items SET finishDT=T.finishDT FROM @T T WHERE om.items.id=T.id AND cnt=0
			UPDATE om.items SET activeCnt=cnt,finishDT=NULL FROM @T T WHERE om.items.id=T.id AND cnt>0
		";
		$q.=";SET NOCOUNT OFF;SELECT id,[schema],idx,keyname,keyID,name,title,masterID,srcID,hostID,detailID FROM api.citems WHERE id=@id".PHP_EOL;
		//die('<plaintext>'.$q);
		$res=query($q);
		$item=fetch_object($res);
		if(!$item && next_result($res)){
			$item=fetch_object($res);
		}
		//die("PPP".json_encode($item));
		if(isset($_GET[reindex]) && $item->id)item::reindex($item->id);
		if ($_GET[select]=='*'){
			$res=query("SELECT name,value FROM api.attributes WHERE id=$item->id");
			while($row=fetch_object($res))$item->values->{$row->name}->value=$row->value;
		}
		//err($item);
		//$item=[q=>$q];

		//if($aim->indexPage)item::reindex($item->id);
		return $item;
	}

    function itemMerge(){
        global $aim,$aim,$location,$cookie;
        $res=query("EXEC api.setItemMerge @newID=$aim->id,@oldID=$aim->oldID");
        die();
    }
    function buildids(){
        global $aim,$aim,$location,$cookie;
        //$q.="SELECT top 1 id FROM om.items WHERE deletedDT IS NULL AND classID=2107 AND scanDT IS NULL AND hostID=2347354";
        //$q.="SELECT top 1 id FROM om.items WHERE deletedDT IS NULL AND scanDT IS NULL AND hostID IN (2347321,2347355,2347322,2556879)";
        //$q.="SELECT top 1 id FROM om.items WHERE deletedDT IS NULL AND scanDT IS NULL AND hostID IN (2556879)";
        $q.="SELECT top 1 id FROM om.items WHERE deletedDT IS NULL AND scanDT IS NULL AND id IN (SELECT DISTINCT id FROM om.fields) ORDER BY modifiedDT DESC";
        $row=fetch_object(query($q));
        //echo "ID=".$row->id;
        if(!$row->id)die();
        v1::reindex($row->id);
        die();
    }
	//function buildsearch($id){
	//    global $aim,$aim,$location,$cookie;
	//    $id=$id?:$aim->id;
	//    //echo $id;
	//    $q=";SET NOCOUNT OFF;SELECT id,value,name FROM om.fields WHERE id=$id";
	//    $res=query($q);
	//    while($row=fetch_object($res))if($row->name && $row->value)$item->values->{$row->name}=$row->value;
	//    //err($item);
	//    if(!$item)die('geen item');
	//    //$q='';
	//    //foreach($items as $id=>$item){
	//    //$q=";DELETE om.itemWord WHERE itemID=$id";
	//    $wordcnt=null;
	//    foreach($item->values as $name=>$value){
	//        if($value[0]=='{')continue;
	//        $words=words($value);
	//        foreach ($words as $word)$wordcnt[strtolower($word)]+=1;
	//    }
	//    $q=";UPDATE om.items SET scanDT=GETUTCDATE() WHERE id=$id;DELETE om.itemWord WHERE itemID=$id";
	//    foreach ($wordcnt as $word=>$cnt)$q.=PHP_EOL.";EXEC api.addItemWord '".toUtf8(dbvalue($word))."',$id,$cnt";
	//    //echo $q;
	//    //}
	//    //echo str_replace(";",PHP_EOL.";",$q);
	//    query($q);
	//    //echo $id;
	//    die();
	//}
	function getCredentials(){
		global $aim;
		die(json_encode($aim->cookie));
	}
	function schedule(){
		global $aim,$aim,$location,$cookie;
		$res=query($aim->query="
		WITH P ( id,level,masterId,name)
		AS (
		SELECT ISNULL(I.detailId,I.id),0,I.masterId,I.name
		FROM om.items I
		WHERE I.id = $aim->id
		UNION ALL
		SELECT ISNULL(I.detailId,I.id),level+1,I.masterId,I.name
		FROM  P INNER JOIN om.items I ON I.masterId = P.id and level<20 AND I.finishDT IS NULL
		)
	SELECT I.id,I.masterID,ISNULL(I.name,'Unknown')+ISNULL(' '+R.name,'') title,I.startDT,I.endDT endDT,I.ownerID,R.name resourceName,S.startDT planStartDT,S.endDT planEndDT,S.workHours,I.state
		FROM P
	INNER JOIN api.items I ON I.id=P.id AND I.finishDT IS NULL AND ISNULL(state,'') NOT IN ('done')
		LEFT OUTER JOIN api.items R ON R.id=I.ownerID
	LEFT OUTER JOIN om.scheduledWork S ON S.id=P.id
		ORDER BY level,I.idx
		");
			$data->id=$aim->id;
			$data->value=array();
			while ($row=fetch_object($res))array_push($data->value,clean($row));
		die(json_encode($data));

		while ($row=fetch_object($res)){
			$items->{$row->id}=clean($row);
			$items->{$row->masterID}->children=$items->{$row->masterID}->children?:array();
			array_push($items->{$row->masterID}->children,$row);
		}
		//die(json_encode($items->{$aim->id}));
		function calcwork($item){
			$item->worktot+=$item->workHours?:0;
			//$item->workHoursTot=$item->workHours;
			foreach($item->children as $i=> $subitem) {
				$item->state=$item->state?:$subitem->state;
				$item->worktot+=$workHours=calcwork($subitem)?:0;
				if($subitem->overdate)$item->overdate=true;

				//if (!$workHours) unset($item->children[$i]);
			}
			$item->children=array_values($item->children);
			//if (!$item->workHours)$item->nowork=true;
			if (strtotime($item->endDT)<strtotime($item->planEndDT))$item->overdate=true;

			return $item->worktot;
		}
		calcwork($items->{$aim->id});
		//foreach($items as $id=>$item) if (!$item->workHoursTot) unset($items->{$id});
		die(json_encode($items->{$aim->id}));
	}
	function reschedule(){
		global $aim,$aim,$location,$cookie;
		$res=query($aim->query="
			DELETE om.scheduledWork
			SELECT I.id,I.ownerID,I.startDT,I.endDT,F.value [work]
			FROM om.items I
			INNER JOIN om.fields F ON F.id=I.id AND F.fieldID=1454
			AND I.deletedDT IS NULL
			AND I.ownerID >0
			AND I.hostid=$cookie->hostID
			AND I.finishDT IS NULL
			ORDER BY ownerID,state,endDT
			;
			WITH P ( level,id) AS (
			SELECT 0,2795229
			UNION ALL
			SELECT level+1,I.id
			FROM P INNER JOIN om.items I ON I.masterId = P.id and level<20 AND I.classID<>2102
			)
			UPDATE om.items SET finishDT=ISNULL(finishDT,GETUTCDATE()) WHERE id IN (SELECT id FROM P)
			;
			WITH P ( level,id) AS (
			SELECT level+1,id FROM om.itemchilds(2795229) WHERE classID=2102 AND finishDT IS NULL
			UNION ALL
			SELECT level+1,I.masterID
			FROM P INNER JOIN om.items I ON I.id = P.id and level<20
			)
			UPDATE om.items SET finishDT=NULL WHERE id IN (SELECT id FROM P)
		");
		while ($row=fetch_object($res)){
			$resources[$row->ownerID]=$resources[$row->ownerID]?:(object)array(days=>null,work=>array());
			array_push($resources[$row->ownerID]->work,$row);
		}
		//err($resources);
		$workingDays = array(1, 2, 3, 4, 5); # date format = N (1 = Monday, ...)
		$values=array();
		foreach($resources as $id=>$resource){
			$date = new DateTime(date('Y-m-d'));
			$interval = new DateInterval('P1D');
			foreach ($resource->work as $row){
				$work=$row->work=(float)str_replace(',','.',$row->work);$i=0;
				$row->planStartDT=$date->format('Y-m-d');
				while ($work && $i++<10){
					$daywork=(float)min($work,6-$resource->days->{$date->format('Y-m-d')});
					while (!($daywork=(float)min($work,6-$resource->days->{$date->format('Y-m-d')})) && $i++<20) {
						$date->modify(($date->format('N')==5?'+3':'+1').' day');
					};
					$resource->days->{$date->format('Y-m-d')}+=$daywork;
					$work-=$daywork;
				}
				$row->planEndDT=$date->format('Y-m-d');
				//array_push($values,"($row->id,'$row->endDT','$row->planStartDT','$row->planEndDT',$row->work,$row->ownerID)");
				array_push($values,"($row->id,'$row->planStartDT','$row->planEndDT',$row->work)");
			}
		}
		//err($resources);
		//query("INSERT om.scheduledWork(id,deadlineDT,startDT,endDT,workHours,resourceID)VALUES".implode(',',$values));
		query("INSERT om.scheduledWork(id,startDT,endDT,workHours)VALUES".implode(',',$values));
		//if($aim->id)item::schedule();
		die(done);
	}
	function item($item=null){
		global $aim,$aim,$location,$cookie,$schemas;
			//err($item);
		$item->filterfields=json_decode($item->filterfields);
		if(!$aim->select)clean($item);
		$item->schema=$item->schema?:$aim->classIDschema[$item->classID];

		//$item=$row;
		clean($item);
		if (!in_array($item->userID,array(0,$cookie->hostID,$cookie->groupID,$cookie->userID))) $item->readOnly=true;
		//unset($item->obj);
		foreach($itemfields=$GLOBALS[itemattributes] as $key)if(property_exists($item->values,$key)){$item->$key=$item->$key?:$item->values->$key;unset($item->values->$key);}
		foreach($item as $key=>$value)if(!in_array($key,$itemfields)){$item->values->$key=$item->$key;unset($item->$key);}

		//$item->allOf=array($item->schema);
		//if($item->srcID==$item->masterID)if($item->name)array_push($item->allOf,$item->name);
		//else if($item->typical)array_push($item->allOf,$item->typical);

		clean($item->values,property_exists($aim,sync));


		if(property_exists($item,rel)){
			$item->rel=$item->rel?:(object)array();
			foreach($item->rel as $key=>$rel)$item->rel->$key=array_keys((array)$rel);
			unset($item->rel->users);
		}
		$item->ID=getID($item);
		//unset($item->level);
		$item->title=str_replace(array("\r","\n","\r\n")," ",$item->title);
		if ($aim->ln){
			if(!$schemas->{$item->schema})$schemas->{$item->schema}=json_decode(fetch_object(query("SELECT config FROM om.class WHERE class='$item->schema'"))->config);
			foreach($schemas->{$item->schema}->fields as $attributeName=>$prop){
				if($prop->type==textarea && $item->values->{$attributeName}) $item->values->{$attributeName}=translate($item->values->{$attributeName},$aim->ln);
			}
		}
		//$item->files=trim($item->files)?trim($item->files):array();
		$item->title=$item->title?:$item->name?:$item->keyname;
		return $item;
	}
	function reindex($id=null){
		//die(a);
		//console.log('REINDEX',this.title);
		global $aim;
		if (!$id && isset($_GET[scan])) {
			$row=fetch_object($res=query($q="SELECT TOP 1 id FROM api.items WHERE id>10000 AND indexDT IS NULL ORDER BY id DESC"));
			if(!$row->id)die();
			item::reindex($row->id);
			header("Refresh:1");
			die($row->id);
		}
		if (!$id && $_GET[schemaName]) {
			$aim=(object)$_GET;
			$res=query($q="SELECT TOP 50 id,title,indexDT FROM api.citems WHERE hostID=$aim->hostID AND class='$aim->schemaName' AND indexDT IS NULL ORDER BY indexDT");
			//die($q);
			//$log=array();
			while($row=fetch_object($res)) {
				$log[$row->id]=$row;
				item::reindex($row->id);
			}
			die(json_encode(array_values($log)));
		}
		$id=$id?:$_GET[id];
		$q=";SELECT nr,[schema],keyname,name,title FROM api.citems WHERE id=$id
			;SELECT value FROM api.attributes WHERE id=$id";
		$item=fetch_object($res=query($q));
		$allwords=implode(" ",array_values((array)$item));
		if(next_result($res))while($row=fetch_object($res))$allwords.=" ".strip_tags(preg_replace('/>/','> ',$row->value));

		$allwords = array_values(array_filter(array_unique(preg_split("/ /", preg_replace('/\[|\]|\(|\)|\+|\-|:|;|\.|,|\'|~|\/|_|=|\?|#|>/',' ',strtolower(h2u($allwords))), -1, PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_NO_EMPTY)),'isword'));
		//die(implode(", ",$allwords));
	//return array_values($temp);

		//$allwords=words($allwords);

		//$allwords=words($allwords);

		//die(json_encode($allwords));

		//foreach($item as $key=>$value)foreach(words(strip_tags($value)) as $word)$wordcnt[toUtf8(dbvalue(strtolower($word)))]+=1;
		//if(next_result($res))while($row=fetch_object($res)){
		//    if(!$row->value || $row->value[0]=='{')continue;
		//    foreach (words(strip_tags($row->value)) as $word)$wordcnt[toUtf8(dbvalue(strtolower($word)))]+=1;
		//}
		$q="
			DELETE om.itemWord WHERE itemID=$id
			DECLARE @W TABLE (word VARCHAR(500))
			DELETE om.itemWord WHERE itemID=$id
			INSERT @W VALUES('".implode("'),('",$allwords)."')
			INSERT om.word (word) SELECT word FROM @w WHERE word NOT IN (SELECT word FROM om.word)
			INSERT om.itemWord (itemID,wordID)
			SELECT $id,W.id FROM @W T INNER JOIN om.word W ON W.word=T.word
			UPDATE om.items SET indexDT=GETUTCDATE() WHERE id=$id
			EXEC api.setItem @id=$id
		";
		//foreach ($wordcnt as $word=>$cnt)$q.=";EXEC api.addItemWord '".toUtf8(dbvalue($word))."',$id,$cnt";

		//echo $q;
		//die();
		//die($q);
		query($q);
		//die(a);
	}
	//function reindex($id){
	//    $q=";DELETE om.itemWord WHERE itemID=$id;SELECT nr,[schema],keyname,name,title,config FROM api.citems WHERE id=$id;SELECT name,value FROM om.fields WHERE id=$id";
	//    $item=fetch_object($res=query($q));
	//    $config=json_decode($item->config);
	//    unset($item->config);
	//    foreach($item as $key=>$value)foreach(words($value) as $word)$wordcnt[strtolower($word)]+=1;
	//    $kop=array("","","");
	//    if(next_result($res))while($row=fetch_object($res)){
	//        if(!$row->value || $row->value[0]=='{')continue;
	//        $prop=$config->fields->{$row->name};
	//        $value=dbvalue(property_exists($prop,idname) && $item->{$prop->idname} ? $item->{$prop->idname} : $row->value);
	//        if(property_exists($prop,kop))$kop[$prop->kop].="$value ";
	//        if(property_exists($prop,idname)&& property_exists($value,itemID))$put->{$prop->idname}=$value->itemID;
	//        if(property_exists($prop,filter))$filterfields->{$row->name}=$value;
	//        foreach (words($row->value) as $word)$wordcnt[strtolower($word)]+=1;
	//    }
	//    $put->title=$kop[0];
	//    $put->subject=$kop[1];
	//    $put->summary=$kop[2];
	//    $put->filterfields=json_encode($filterfields);
	//    $q="UPDATE om.items SET ".paramfields($put)." WHERE id=$id";
	//    foreach ($wordcnt as $word=>$cnt)$q.=";EXEC api1.addItemWord '".toUtf8(dbvalue($word))."',$id,$cnt";
	//    query($q);
	//}
	function mailing(){
		global $aim,$aim,$location,$cookie;
		$res=query("select userID from om.itemfav where id=$aim->id;");
		while ($row=fetch_object($res)) $q.="EXEC mail.addItem @AccountID=$row->userID,@name='mailItemUpdate',@ItemID=$aim->id;";
		query($q);
		exit("Mail verzonden aan leden van het onderwerp $q");
	}
	function appendfield(){
		global $aim,$aim,$location,$cookie;
		//$id = $_GET[id]; unset ($_GET[id]);
		if (!is_int($aim->id)) die('Illegal id');
		//$groupname = $_POST[groupname]; unset ($_POST[groupname]);
		$q="SET NCOUNT ON;INSERT om.itemvalues (id,groupname,fieldid) VALUES (?,?,0);SELECT * FROM om.itemvalues WHERE aid = scope_identity();";
		$row=fetch_object(dbexecsql($q,array($aim->id,$aim->groupname)));
		exit(json_encode($row));
	}
	function network(){
		global $aim,$aim,$location,$cookie;

		$color_level=array(0=>'rgb(60,70,90)',1=>'rgba(60,70,90,.9)',2=>'rgba(60,70,90,.8)',3=>'rgba(60,70,90,.7)');
		$data->items=array();
		$data->links=array();
		$res = dbexec("api.getItemNetwork",array(id=>$aim->id));
		while($row = fetch_object($res)) {
			array_push($data->items,$row);
			$classes[$row->classID]=(object)array();
		}
		foreach ($classes as $classID => $row) $row->color ='#' . str_pad(dechex(mT_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);
		foreach ($data->items as $i => $row) { $row->color=$classes[$row->classID]->color;unset($row->classID);}
		next_result($res);
		while($row = fetch_object($res)) {
			array_push($data->links,array(from=>$row->fromID,to=>$row->toID,color=>$color_level[$row->level]));
		}
		exit(json_encode($data));
	}
	function write(){
		global $aim,$aim,$location,$cookie;
		die(file_get_contents($p=$_SERVER['DOCUMENT_ROOT']."/sites/$cookie->host/api/$cookie->host.php"));
	}
	function printbuffer(){
		global $aim,$aim,$location,$cookie;
		$res=query("SELECT aid,documentname FROM aim.auth.appprintqueue WHERE uid='$aim->uid' AND printDT IS NULL ORDER BY createDt;");
		while($row=fetch_object($res))echo "<div>$row->documentname</div>";
		die();
	}
}
class account {
    function start() {
        global $aim,$aim,$location,$cookie;
        $res=query("SELECT DISTINCT classID FROM api.items I INNER JOIN om.itemUserVisit V ON V.id=I.id AND V.userID=$cookie->userID
            AND I.hostID=$cookie->hostID AND DATEDIFF(day,V.lastvisitDT,GETUTCDATE())<30");
        $a=array();
        while ($row=fetch_object($res)){
            array_push($a,"
                SELECT TOP 5 I.class,I.id,I.name,I.title,V.lastvisitDT,DATEDIFF(day,GETUTCDATE(),V.lastvisitDT) d
                FROM api.citems I
                INNER JOIN om.itemUserVisit V ON V.id=I.id AND V.userID=$cookie->userID
                WHERE I.hostID=$cookie->hostID AND I.classID=$row->classID AND DATEDIFF(day,V.lastvisitDT,GETUTCDATE())<30
                ORDER BY V.lastvisitDT DESC,modifiedDT DESC");
        }
        $res=query($q=implode(';',$a));
        for ($i = 0; $i < count($a); $i++) {
            while ($row=fetch_object($res)){
                $data->{$row->class}->{$row->id}=$row;
            }
            next_result($res);
        }
        exit(json_encode($data));
    }
	function get(){
		extract($GLOBALS);
		extract((array)$access);
		$q="
			DECLARE @companyID INT
			SELECT @companyID=itemID FROM api.attributes WHERE name='Company' AND id=$account->id
			SET NOCOUNT OFF
			SELECT U.id,email,I.title FROM auth.users U INNER JOIN api.items I ON I.id=U.id AND U.id=$user->id
			--SELECT name,value,itemID FROM om.fields WHERE id=$id
			--SELECT email FROM auth.email WHERE id=$id
			--SELECT phone FROM auth.phone WHERE id=$id
			SELECT id,title FROM api.items WHERE id=$account->id;
			--SELECT name,value,itemID FROM om.fields WHERE id=$id
			SELECT id,title FROM api.items WHERE id=@companyID;
			SELECT name,value,itemID FROM om.fields WHERE id=@companyID
		";
		$q="
			DECLARE @T TABLE (id INT)
			INSERT @T VALUES (801),(800)
			SELECT id,name,title,subject,summary FROM api.citems WHERE id IN (SELECT id FROM @T)
			SELECT id,name,value FROM api.attributes WHERE id IN (SELECT id FROM @T)
		";
        $res=query($q);
		$value=[];
		while ($row=fetch_object($res))array_push($value,$items->{$row->id}=$row);
		next_result($res);
		while ($row=fetch_object($res)){$items->{$row->id}->values->{$row->name}=$row; unset($row->id);}
        exit(json_encode([value=>$value]));

		die($q);
		$item=$data->user=fetch_object($res=query($q)); next_result($res); while ($row=fetch_object($res))$item->{$row->name}=fieldrow($row);
		$item->alias=array();
		next_result($res); while ($row=fetch_object($res))array_push($item->alias,$row->email);
		$item->phones=array();
		next_result($res); while ($row=fetch_object($res))array_push($item->phones,$row->phone);
		next_result($res); $item=$data->account=fetch_object($res); next_result($res); while ($row=fetch_object($res))$item->{$row->name}=fieldrow($row);
		next_result($res); $item=$data->company=fetch_object($res); next_result($res); while ($row=fetch_object($res))$item->{$row->name}=fieldrow($row);
        exit(json_encode($data));
	}
	function contacts(){
        global $aim;
		$userID=$aim->client->user->id;
		$accountID=$aim->client->account->id;
        $res=query($q="
			SET NOCOUNT OFF
			SELECT H.id hostID,H.title hostName,H.keyname domain,A.id accountID,A.title accountName,C.title companyName,F.value AS groupName
			FROM api.items A
			INNER JOIN api.items H ON H.id=A.hostID AND A.classID=1004 AND A.toID=$userID
			LEFT OUTER JOIN api.items C ON C.classID=1002 AND C.id=A.fromID
			LEFT OUTER JOIN om.fields F ON F.fieldID=1228 AND F.id=A.id
		");
		$data->contacts=array();
		while ($row=fetch_object($res))array_push($data->contacts,$row);
        exit(json_encode($data));
	}
	function devices(){
        global $aim;
		$userID=$aim->client->user->id;
		$accountID=$aim->client->account->id;
        $res=query($q="
			SET NOCOUNT OFF
			SELECT id,uid,startDT,endDT FROM api.items WHERE userID=$userID AND classID=1008
		");
		$data->devices=array();
		while ($row=fetch_object($res))array_push($data->devices,$row);
        exit(json_encode($data));
	}
}


//class contacts {
//    function get() { require_once(__DIR__."/mse.php"); }
//}

//class messages {
//    function get() { require_once(__DIR__."/mse.php"); }
//}
//class events{
//    function get() { require_once(__DIR__."/mse.php"); }
//}
//class calendarview{
//    function get() { require_once(__DIR__."/mse.php"); }
//}


class sms {
	function send($recipients='',$body='',$originator='') {
		$put = json_decode(file_get_contents('php://input'));

		$response = getallheaders();
		die(json_encode($response));



		require_once $_SERVER['DOCUMENT_ROOT'].'/inc/php/sms/autoload.php';
		$messagebird = new MessageBird\Client('jEd7qPurVtPYbXFaq4kCW7SZ4');
		$message = new MessageBird\Objects\Message;
		$message->originator = substr($originator?:$_GET[originator]?:$put->originator?:'Aliconnect',0,11);
		$message->recipients = explode(";",$recipients?:$_GET[recipients]?:$put->recipients);
		$message->body = $body?:$_GET[body]?:$put->body;
		$response = $messagebird->messages->create($message);
		die(json_encode($response));
	}
}

class mobilephone {
	function put() {
        global $aim;
		$put = json_decode(file_get_contents('php://input'));
		if ($put->code){
			$row = fetch_object(query("SELECT code FROM auth.users WHERE id=$aim->userID"));
			if ($row->code!=$put->code) die(json_encode(array(state=>wrongcode)));
			query("UPDATE auth.users SET phonenumber='$put->number' WHERE id=$aim->userID");
			die(json_encode(array(state=>done)));
		}
		$put->code=mt_rand(0,999999);
		query("UPDATE auth.users SET code='$put->code' WHERE id=$aim->userID");
		require_once $_SERVER['DOCUMENT_ROOT'].'/inc/php/sms/autoload.php';
		$messagebird = new MessageBird\Client('jEd7qPurVtPYbXFaq4kCW7SZ4');
		$message = new MessageBird\Objects\Message;
		$message->originator = '+31620068073';
		$message->recipients = array("+$put->number");
		$message->body = "Gebruik $put->code als beveiligingscode voor je Aliconnect-account";
		$response = $messagebird->messages->create($message);

		die(json_encode(array(state=>send)));
		//die(json_encode(array(state=>send,code=>$put->code)));
	}
}

class iot {
    function post() {
        global $aim,$aim,$location,$cookie;
        query("UPDATE auth.app SET clientID='$aim->clientID' WHERE uid='$aim->key'");
        die();
    }
    function get() {
        global $aim,$aim,$location,$cookie;
        $row=fetch_object(query("SELECT clientID FROM auth.app WHERE uid='$aim->key'"));
        die(json_encode($row));
    }
}
class window {
    function blur(){
        global $aim,$aim,$location,$cookie;
        $_GET[deviceUID]=$aim->uid;
        $_GET[ip]=$_SERVER[REMOTE_ADDR];
        exit(json_encode(fetch_object(dbexec("api.setBlur",$_GET))));
    }
    function focus(){
        global $aim,$aim,$location,$cookie;
        $_GET[deviceUID]=$aim->uid;
        $_GET[ip]=$_SERVER[REMOTE_ADDR];
        exit(json_encode(fetch_object(dbexec("api.setFocus",$_GET))));
    }
}
class file {
    function getallheaders() {
        $headers = '';
        foreach ($_SERVER as $name => $value) if (substr($name, 0, 5) == 'HTTP_') $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
        return $headers;
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
	//function save(&$ofile,$content=null,$replace=null) {
	//    global $aim,$aim,$location,$cookie;
	//    //die('ofile='.json_encode($ofile));
	//    $ofile->ext = strtolower(pathinfo($ofile->name ,PATHINFO_EXTENSION));
	//    if(in_array($ofile->ext,array(php,php3))) return;
	//    if (!$ofile->lastModifiedDate) $ofile->lastModifiedDate=date("y-m-d H:i:s");
	//    if ($ofile->id) {
	//        $ofile->src="$ofile->path/$ofile->name";
	//        unlink($_SERVER['DOCUMENT_ROOT'].$ofile->src);
	//        file_put_contents($_SERVER['DOCUMENT_ROOT'].$ofile->src,$content);
	//        query("UPDATE om.files SET lastModifiedDate='$ofile->lastModifiedDate' WHERE id=$ofile->id");
	//    }
	//    else {
	//        //$par = array(sessionID=>$ofile->sessionID,host=>$ofile->host,hostID=>$ofile->hostID,id=>$ofile->id,itemID=>$ofile->itemID,name=>$ofile->name,ext=>$ofile->ext,type=>$ofile->type,src=>$ofile->src,srcs=>$ofile->srcs,size=>$ofile->size,lastModifiedDate=>$ofile->lastModifiedDate);
	//        $par = array(userID=>$cookie->userID,hostID=>$cookie->hostID,id=>$ofile->id,itemID=>$aim->id,name=>$ofile->name,ext=>$ofile->ext,type=>$ofile->type,src=>$ofile->src,srcs=>$ofile->srcs,size=>$ofile->size,lastModifiedDate=>$ofile->lastModifiedDate);
	//        $ofile = fetch_object(dbexec("api.getItemFile",$par));
	//        $source = $_SERVER['DOCUMENT_ROOT'].$ofile->src;
	//        $path = pathinfo($source, PATHINFO_DIRNAME);
	//        mkdir($path,0777,true);
	//        file_put_contents($source,$content);
	//        unset($ofile->token);
	//        if ($token) {
	//            $folder='folder.dfa7a2802322dfb6.DFA7A2802322DFB6!5255';
	//            date_defaulT_timezone_set("Europe/London");
	//            require_once $_SERVER['DOCUMENT_ROOT']."/aim-inc/php/functions.inc.php";
	//            $sd = new skydrive($token);
	//            try {
	//                $response = $sd->puT_file($folder, $source);
	//                $ofile->src=$response[source];
	//                $ofile->fid=$response[id];
	//                unlink($source);
	//            } catch (Exception $e) {
	//                echo "Error: ".$e->getMessage();
	//                exit;
	//            }
	//        }
	//    }
	//    if (in_array($ofile->ext,array("png","jpg","gif"))) {
	//        $im = imagecreatefromstring($content);
	//        $ofile->srcs=file::resizeimg($im, 300, 270, $ofile);
	//        $ofile->src=file::resizeimg($im, 1200, 1080, $ofile);
	//    }
	//    else if (in_array(strtolower($ofile->ext),array("webm","mov"))) {
	//        $root=$_SERVER['DOCUMENT_ROOT'];
	//        $ofile->srcmp4 = str_replace(".".pathinfo($ofile->name ,PATHINFO_EXTENSION),".mp4",$ofile->src);
	//        $s="avconv -i '$root$ofile->src' -crf 10 -b:v 12M '$root$ofile->srcmp4'";
	//        exec($s);
	//        $ofile->s=$s;
	//    }
	//    unset($ofile->uid);
	//    unset($ofile->path);
	//    unset($ofile->host);
	//    return $ofile;
	//}
	//function upload(){
	//    $post=(object)$_REQUEST;
	//    $data=base64_decode($post->data);
	//    unset($post->data);
	//    exit(json_encode(file::save($post,$data)));
	//}
	//function uploadfile(){
	//    $post=(object)$_REQUEST;
	//    $data=base64_decode($post->data);
	//    $post->src=explode('alicon.nl',$post->src);
	//    $post->src=$_SERVER['DOCUMENT_ROOT'].array_pop($post->src);
	//    unlink($post->src);
	//    file_put_contents($post->src,$data);
	//    exit($post->src);
	//}
	//function filesUploadNext(){
	//    $headers = file::getallheaders();
	//    $ofile->host = $_POST[host];
	//    //$ofile->itemID = $headers['X-File-Id'];
	//    //$ofile->sessionID = $headers['X-File-Session'];
	//    $ofile->name = $headers['X-File-Name'];
	//    $ofile->size = $headers['X-File-Size'];
	//    $ofile->type = $headers['X-File-Type'];
	//    $ofile->lastModifiedDate = $headers['X-File-lastModifiedDate'];
	//    file::save($ofile,file_get_contents("php://input"));
	//    exit(json_encode($ofile));
	//}
	//function post(){
	//    ini_set("memory_limit", "-1");
	//    global $aim;
	//    $ext=strtolower(pathinfo($aim->name ,PATHINFO_EXTENSION));
	//    if (!$ofile->id) {
	//        $par = array(userID=>$aim->client->user->id,hostID=>$aim->hostID,itemID=>$aim->itemID,name=>$aim->name,ext=>$ext,type=>$aim->type,size=>$aim->size,lastModifiedDate=>$aim->lastModifiedDate);
	//        $ofile = fetch_object(dbexec("api.getItemFile",$par));
	//        $source = $_SERVER['DOCUMENT_ROOT'].$ofile->src;
	//        $path = pathinfo($source, PATHINFO_DIRNAME);
	//        mkdir($path,0777,true);
	//        file_put_contents($source,$content=file_get_contents('php://input'));
	//        unset($ofile->token);
	//        if ($token) {
	//            $folder='folder.dfa7a2802322dfb6.DFA7A2802322DFB6!5255';
	//            date_defaulT_timezone_set("Europe/London");
	//            require_once $_SERVER['DOCUMENT_ROOT']."/aim-inc/php/functions.inc.php";
	//            $sd = new skydrive($token);
	//            try {
	//                $response = $sd->puT_file($folder, $source);
	//                $ofile->src=$response[source];
	//                $ofile->fid=$response[id];
	//                unlink($source);
	//            } catch (Exception $e) {
	//                echo "Error: ".$e->getMessage();
	//                exit;
	//            }
	//        }
	//    }
	//    //if (in_array($ext,array("png","jpg","gif"))) {
	//    //    $im = imagecreatefromstring($content);
	//    //    $ofile->srcs=file::resizeimg($im, 300, 270, $ofile);
	//    //    $ofile->src=file::resizeimg($im, 1200, 1080, $ofile);
	//    //}
	//    //$ofile->shell_exec=shell_exec('XCOPY C:\aim\www\aim\v1\test.bat t.bat');
	//    //die(json_encode($ofile));
	//    //if (in_array($ext,array("webm","mov"))) {
	//    //    $root=$_SERVER['DOCUMENT_ROOT'];
	//    //    $ofile->srcmp4 = str_replace(".".pathinfo($ofile->name ,PATHINFO_EXTENSION),".mp4",$ofile->src);
	//    //    $s="avconv -i '$root$ofile->src' -crf 10 -b:v 12M '$root$ofile->srcmp4'";
	//    //    $ofile->exec = function_exists('exec') ? true : false;
	//    //    exec('"C:\Program Files (x86)\VideoLAN\VLC\vlc.exe" -vvv "C:\Users\maxva\OneDrive\Afbeeldingen\2019-02\IMG_7840.MOV" --sout=#transcode{vcodec=h264,vb=1024,acodec=mp4a,ab=192,channels=2,deinterlace}:standard{access=file,mux=ts,dst=IMG_7840.mp4} vlc://quit');
	//    //    $ofile->s=$s;
	//    //    $ofile->shell_exec=shell_exec('"C:\Program Files (x86)\VideoLAN\VLC\vlc.exe" -vvv "C:\Users\maxva\OneDrive\Afbeeldingen\2019-02\IMG_7840.MOV" --sout=#transcode{vcodec=h264,vb=1024,acodec=mp4a,ab=192,channels=2,deinterlace}:standard{access=file,mux=ts,dst=IMG_7840.mp4} vlc://quit');
	//    //}
	//    die(json_encode($ofile));
	//}
	function put(){
		global $aim;
		if(!$aim->itemID && !$aim->id)die();
		ini_set("memory_limit", "-1");
		$ext=strtolower(pathinfo($aim->name ,PATHINFO_EXTENSION));
		$content = file_get_contents('php://input');
		if($aim->base64){
			$content = explode(",",$content);
			$content = base64_decode(array_pop($content));
			$aim->type = explode(":",array_shift($content));
			$aim->type = explode(";",array_pop($aim->type));
			$aim->type = array_shift($aim->type);
		}
		//$aim->itemID=3395370;

        $par = array(userID=>$aim->client->user->id,hostID=>$aim->hostID,itemID=>$aim->itemID,name=>$aim->name,ext=>$ext,type=>$aim->type,size=>$aim->size,lastModifiedDate=>$aim->lastModifiedDate);
        $ofile = fetch_object(query($q=prepareexec("api.getItemFile",$par)));
		//die(json_encode($q));
        $source = $_SERVER['DOCUMENT_ROOT'].$ofile->src;
        $path = pathinfo($source, PATHINFO_DIRNAME);
        mkdir($path,0777,true);
        file_put_contents($source,$content);
        unset($ofile->token);

        die(json_encode($ofile));
	}
}
class fc {
    function init() {
        global $aim,$aim,$location,$cookie;
        //err($location,$aim);
        $res=query("EXEC api.getDeviceTree @deviceID='$aim->id',@name='$location->filename'");
        while($row=fetch_object($res)){
            $data->{$row->id}=array_shift(explode(' ',$row->typical)).".".$row->idx;
            //$data->{$typical}=$row->id;
        }
        die(json_encode($data));
    }
}
class link {
	function delete(){
		$aim=(object)$_GET;
		query($q="
			DELETE om.link WHERE (fromID=$aim->fromID AND toID=$aim->id) OR (toID=$aim->fromID AND fromID=$aim->id)
		");
		die($q);
	}
	function put(){
		$put=json_decode(file_get_contents('php://input'));
		query("
			DELETE om.link WHERE (fromID=$put->fromID AND toID=$put->id) OR (toID=$put->fromID AND fromID=$put->id)
			INSERT om.link (fromID,toID) VALUES ($put->fromID,$put->id);
		");
		die();
	}
}
class fav {
	function get(){
	    extract($GLOBALS);
	    //global $access;

		//echo'test';
		//err(getallheaders(),$access);
	    $q="SELECT id FROM om.itemFav WHERE userID=".$aim->client->user->id;
	    $res=query($q);
	    $rows=array();
	    while($row=fetch_object($res))array_push($rows,intval($row->id));
	    die(json_encode($rows));
	}
    function post(){
        global $aim;
		$user=$aim->client->user;
        $q="DELETE om.itemFav WHERE userID = $user->id AND id=$aim->id";
        if ($aim->fav) $q.=";INSERT om.itemFav (userID,id,fav) VALUES ($user->id,$aim->id,1)";
        query($q);
        die();
    }
}
//class items {
//  function get(){
//    global $aim,$aim,$location,$cookie;
//    $items=$where=array();
//    $_POST=$_GET;
//    $post=(object)$_POST;
//    $post->id=$aim->id;
//    $post->ClientID=$post->ClientID?$post->ClientID:0;
//    //$user=fetch_object(query("SELECT * FROM api.hostAccountGet('$post->host','$post->sessionID');"));
//    //$aim=(object)$_GET;
//    //$cookie=(object)$_COOKIE;
//    $user=fetch_object(query("SELECT * FROM api.hostAccountGetByUserID('$cookie->host',$cookie->userID);"));
//    //$user=(object)array(UserID=>$_COOKIE[userID],HostID=>$_COOKIE[hostID],HostName=>$_COOKIE[hostName]);
//    //$q="SET NOCOUNT ON;SET TEXTSIZE 2147483647;";
//    //$where=array();
//    if ($post->classID[0]=='.') {
//        if (file_exists($fname=$_SERVER['DOCUMENT_ROOT']."/sites/$user->HostName/api/index.php")) require_once ($fname);
//        $a=explode('.',$post->classID);
//        array_shift($a);
//        $table=array_shift($a);
//        $table=new $table();
//        $q.=$table->itemItemsGet();
//        //$fname=$_SERVER['DOCUMENT_ROOT']."/sites/$user->HostName/api/index.php";
//        //if (file_exists($fname)) require_once ($fname);
//    }
//    else if ($post->id) $q.="SELECT TOP 50000 D.id,D.idx,D.detailID,D.srcID,D.selected,I.name,I.classID,I.masterID,I.startDT,I.finishDT,I.state,I.obj,I.cp,I.hasChildren,I.activeCnt,I.modifiedDT,CASE WHEN ISNULL(M.detailID,M.id)=D.masterID THEN 'child' ELSE 'derived' END AS reltype FROM api.items D INNER JOIN api.items I ON I.id=ISNULL(D.detailID,D.id) INNER JOIN api.items M ON M.id=$post->id AND D.userID IN (0,0$user->UserID) AND ISNULL(M.detailID,M.id) IN (D.masterID) ORDER BY idx";
//    else if ($post->classID==1060 && $post->keyID==1) $q.="SELECT TOP 50000 I.*,cp,cd,sd,stock FROM api.itemslist I
//        LEFT OUTER JOIN (SELECT id field_id,name,value FROM om.fields F WHERE fieldID IN (892,978,1113)AND userID IN ($cookie->hostID,0$user->UserID,$post->ClientID,0,1)) X PIVOT(MAX(value)FOR name IN (cd,sd,stock)) F ON F.field_id = I.id
//        LEFT OUTER JOIN (SELECT id field_id,name,value FROM om.fields F  WHERE fieldID IN (1066)) X PIVOT(MAX(value)FOR name IN (cp)) F2 ON F2.field_id = I.srcID
//        WHERE I.classID=1060 AND I.hostID=$cookie->hostID ";
//    //else if ($post->classID==1060 && $post->keyID==1) $q.="SELECT TOP 50000 I.*,F.cd,F.sd,F.stock FROM api.itemslist I LEFT OUTER JOIN (SELECT F.id,F.name,F.value FROM om.fields F WHERE F.hostID=$cookie->hostID AND userID IN ($cookie->hostID,0$user->UserID,$post->ClientID,0,1)) X PIVOT(MAX(value)FOR name IN (cd,sd,stock)) F ON F.id=I.id WHERE I.classID=1060 ";
//    else if ($post->classID==1060 && $post->keyID==2) $q.="SELECT TOP 50000 I.*,F.cd,F.sd,F.stock FROM api.itemslist I INNER JOIN (SELECT F.id,F.name,F.value FROM om.fields F WHERE F.hostID=$cookie->hostID AND userID IN ($cookie->hostID,0$user->UserID,$post->ClientID,0,1)) X PIVOT(MAX(value)FOR name IN (cd,sd,stock)) F ON F.id=I.id WHERE I.classID=1060 AND F.sd IS NOT NULL ";
//    else if ($post->classID==1060 && $post->keyID==3) $q.="SELECT TOP 50000 I.*,F.cd,F.sd,F.stock FROM api.itemslist I INNER JOIN (SELECT F.id,F.name,F.value FROM om.fields F WHERE F.hostID=$cookie->hostID AND userID IN ($cookie->hostID,0$user->UserID,$post->ClientID,0,1)) X PIVOT(MAX(value)FOR name IN (cd,sd,stock)) F ON F.id=I.id WHERE I.id IN (SELECT id FROM om.fields where userid=$post->ClientID and name='cd') AND I.classID=1060 AND F.sd IS NOT NULL ";
//    else if ($post->classID=='his') die();//$q.="EXEC api.getUserItems @UserID=0$user->UserID,@HostID=$cookie->hostID ";
//    else if ($post->classID=='mse' && $post->keyID=='contacts') $q.="SELECT TOP 50000 I.id,I.name,I.classID,I.state,I.obj,I.cp,I.hasChildren,I.idx,I.modifiedDT FROM api.items I INNER JOIN mse.contact C ON C.userID=0$user->UserID AND C.ContactID=I.id ";
//    else {
//      $q.="SELECT TOP 50000 I.*,UV.lastvisitDT FROM api.itemslist I LEFT OUTER JOIN om.itemuservisit UV ON UV.id=I.id AND UV.userID=0$user->UserID AND UV.HostID=0$cookie->hostID";
//      if ($post->hostID) $cookie->hostID=$post->hostID;
//      array_push($where,"I.classID IN ($post->classID)");
//      //if ($post->keyID==1) array_push($where,"(I.hostID IN ($cookie->hostID,0) AND I.userID IN ($user->UserID,0)) OR I.www=1");
//      if ($post->keyID==1) array_push($where,"(I.hostID = $cookie->hostID AND (I.hostID=1 OR I.userID IN ($user->UserID,0)))");
//      else array_push($where,"(I.hostID = $cookie->hostID AND I.userID IN ($user->UserID,0))");
//      if ($post->filter) array_push($where,urldecode($post->filter));
//    }
//    if ($post->q && $post->q!='*') {
//        //die($post->q);
//        $post->q=urldecode(trim($post->q));
//        $post->q=str_replace('*','%',$post->q);
//        $qa=explode(" ",$post->q);
//        foreach ($qa AS $qs) {
//            $qsqa=array();
//            $qsa=explode(',',$qs);
//            foreach ($qsa as $qsas) {
//                $qsas=dbvalue(trim($qsas));
//                $qs="I.findtext LIKE '%$qsas%' COLLATE Latin1_general_CI_AI OR I.name LIKE '%$qsas%' COLLATE Latin1_general_CI_AI OR I.subject LIKE '%$qsas%' COLLATE Latin1_general_CI_AI OR I.keyname LIKE '%$qsas%' COLLATE Latin1_general_CI_AI";
//                array_push($qsqa,$qs);//"I.findtext LIKE '%$qsas%' OR I.name LIKE '%$qsas%' OR I.id IN (SELECT DISTINCT id FROM omv.itemvalues WHERE classID IN ($post->classID) AND value LIKE '%$qsas%' )");
//            }
//            array_push($where,"(".implode(" OR ",$qsqa).")");
//        }
//    }
//    $where=implode(')AND(',$where);
//    if ($where) $q.=(strpos( $q, "WHERE I.") !== false?" AND ":" WHERE ")." ($where)";
//    //die($q);
//    $res = query($q);
//    $items=array();
//    while($row=fetch_object($res)){
//        $item=$row->obj?json_decode($row->obj):(object)array();
//        unset($row->obj);
//        foreach ($row as $key=>$value) $item->$key=$value;
//        if (function_exists(dorow)) dorow($item);
//        array_push($items,$item);
//    }
//    close();
//    die(json_encode($items));
//  }
//}
class css {
    function GET(){
        $aim=(object)$_GET;$post=(object)$_POST;
        die(file_get_contents($_SERVER['DOCUMENT_ROOT']."/app/css/$aim->filter"));
    }
}
class fonts {
    function get(){
        global $location;
        //err("STOP API v3",$aim);
        readfile($_SERVER['DOCUMENT_ROOT']."/lib/fonts/".$location->basename);
        die();
    }
}
class msgsrv {
    function init(){
        global $aim,$aim,$location,$cookie;
        //err($aim);
        //if (!$cookie->deviceID) setcookie(deviceID,$cookie->deviceID=fetch_object(query("SELECT id FROM api.items WHERE classID=2107 AND uid='$cookie->deviceUID'"))->id,time()+($cookieLifetime=time()+365*24*60*60),"/");
        //if (!$cookie->deviceID) die();
        $res=query($q="
            DECLARE @id INT
            SELECT @id=id FROM api.items WHERE id=$aim->id AND uid='$aim->uid'

            SELECT D.name typical,D.id,F.name,F.value
            FROM api.items P
            INNER JOIN api.items D ON P.masterID=@id AND D.id=P.detailID
            LEFT OUTER JOIN om.fields F ON F.id = D.id AND F.typeID=0
            ORDER BY P.keyname,D.name,P.idx,F.name
        ");
        //die($q);
        while($row=fetch_object($res)){
            if(!$item->{$row->id}){
                $row->typical=array_shift(explode(" ",$row->typical));
                $item->{$row->id}->id=$row->id;
                $item->{$row->id}->typical=$row->typical;
                $typicals->{$row->typical}=$typicals->{$row->typical}?:array();
                array_push($typicals->{$row->typical},$item->{$row->id});
            }
            $item->{$row->id}->values->{$row->name}=$row->value;
            //$opc->{$row->id}->module=$row->module;
            //$opc->{$row->id}->values->$row->name;
            //=array(value=>$row->value,opcItemID=>$row->ControlUnit.implode('_',array(array_shift(explode(' ',$row->ControlModuleName)),$row->idx,$row->name)));
        }
        //die(json_encode($typicals));
        foreach($typicals as $typical => $arr){
            foreach($arr as $i => $item){
                foreach($item->values as $name => $value){
                    $data->$typical->{$i+1}->id=$item->id;
                    $data->$typical->{$i+1}->values->$name=$value;
                }
            }
        }
        die(json_encode($data));
    }
}
class aliconnector {
    function checksrvdata () {
	    extract($GLOBALS);
		extract((array)$aim->client);
		//err(aaaaaa,$aim->client);
        //$device=$aim->device;
        //err($device);
		//err("EXEC api.checksrvdata @deviceUID='$cookie->deviceUID';");
        $data->device=fetch_object($res=query("EXEC api.getDeviceData @deviceID='".$device->id."';"));
        next_result($res);
        $data->printjob=fetch_object($res);
        if($data->device->srcphp)require_once ($_SERVER['DOCUMENT_ROOT']."/sites/".$data->device->srcphp);
        die(json_encode($data));
    }
    function printjob(){
	    extract($GLOBALS);
        $row=fetch_object($res=query("SELECT html FROM aim.auth.appprintqueue WHERE aid=$aim->id;UPDATE aim.auth.appprintqueue SET printDT=GETDATE() WHERE aid=$aim->id;"));
        die($row->html);
    }
    function opc(){
        global $aim,$aim,$location,$cookie;
        //if (!$cookie->deviceID) setcookie(deviceID,$cookie->deviceID=fetch_object(query("SELECT id FROM api.items WHERE classID=2107 AND uid='$cookie->deviceUID'"))->id,time()+($cookieLifetime=time()+365*24*60*60),"/");
        //if (!$cookie->deviceID) die();
        $opc=fetch_object($res=query($q="
            DECLARE @id INT
            SELECT @id=id FROM api.items WHERE classID=2107 AND uid='$cookie->deviceUID'

            SELECT keyname name FROM om.items WHERE id=@id
            SELECT P.keyname AS ControlUnit,D.name ControlModuleName,R.idx,R.detailID as id,F.name,F.value
            FROM api.items P
            INNER JOIN api.items R ON R.masterID=P.id
            LEFT OUTER JOIN api.items D ON D.id=R.detailID
            LEFT OUTER JOIN om.fields F ON F.id = D.id AND F.typeID=0
            WHERE P.masterID=@id
            ORDER BY P.keyname,D.name,R.idx,F.name
        "));
        //die($q);
        if(next_result($res)) while($row=fetch_object($res)) $opc->system->{$row->id}->values->{$row->name}=array(value=>$row->value,opcItemID=>$row->ControlUnit.implode('_',array(array_shift(explode(' ',$row->ControlModuleName)),$row->idx,$row->name)));
        die(json_encode($opc));
    }
	function post(){
	    //extract($GLOBALS);
		//err($_POST);
		connect::set_device($_POST[deviceUID]);
		//$device=fetch_object(query("SELECT id,uid FROM api.items WHERE uid='".$_POST[deviceUID]."'"));
		//$access->id=$device->id;
		//setcookie(access_token,jwt_encode($access,$device->uid),$cookieLifetime=time()+1*24*60*60,"/");
		die(header("Location : ".$_GET[redirect_uri]));
		//die('ALICONNECTOR POST');
	}
}
class tbl{
    function get(){
        global $aim,$aim,$location,$cookie;
        if ($aim->id) $aim->query=str_replace('"',"'","SELECT * FROM (SELECT $aim->select FROM $aim->basename)P WHERE id=$aim->id;");
        else $aim->qget=str_replace('"',"'","SELECT $aim->select FROM $aim->basename");
    }
}
class exec{
    function userfavset(){die("{}");}
    function webmenu(){die("{}");}
    function msgGet(){die("{}");}
    function shopbag(){die("{}");}
}
class upload{
    function get(){
        global $aim;
		$q="
			DECLARE @sheetID INT
			SELECT @sheetID=id FROM upload.dbo.sheet WHERE hostID=$aim->hostID AND filename='$aim->file' AND sheet='$aim->sheet'
			SET NOCOUNT OFF
			SELECT row,col,value FROM upload.dbo.col WHERE sheetID=@sheetID
		";
		//die($q);
		$res=query($q);
		while ($row=fetch_object($res))$rows->{$row->row}->{$row->col}=$row->value;
		die(json_encode($rows));
	}
    function put(){
        global $aim;
		$put=json_decode(file_get_contents('php://input'));
		$q="
			DECLARE @sheetID INT
			SELECT @sheetID=id FROM upload.dbo.sheet WHERE hostID=$aim->hostID AND filename='$put->filename' AND sheet='$put->sheetname'
			IF @sheetID IS NULL BEGIN INSERT upload.dbo.sheet (hostID,filename,sheet) VALUES ($aim->hostID,'$put->filename','$put->sheetname') SET @sheetID=@@identity END
			ELSE DELETE upload.dbo.col WHERE sheetID=@sheetID
		";
		foreach($put->rows as $rowIdx => $row) {
			foreach($row as $colIdx => $value) if (!is_null($value) && trim($value)!=="") $q.="INSERT upload.dbo.col VALUES (@sheetID,$rowIdx,$colIdx,'".dbvalue($value)."') ";
		}
		query($q);
		die();
    }
}


?>
