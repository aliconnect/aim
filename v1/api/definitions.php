<?php
array_push($aim->loaded,__FILE__);
class definitions{
    function rewrite(){
        $htaccess=file_get_contents($fname=$_SERVER['DOCUMENT_ROOT'].'/.htaccess');
        //unlink($fname);
        //die($fname);
        echo $fname.PHP_EOL;
        echo $htaccess;
        $htaccess=explode("#apps",$htaccess);
        $res=query("SELECT CONVERT(VARCHAR(50),A.uid)appKey,lower(A.appName)appName,lower(H.name)host FROM auth.app A INNER JOIN auth.host H ON H.id=A.hostID");
        while($row=fetch_object($res))if(file_exists($_SERVER['DOCUMENT_ROOT'].($fname="/shared/app/$row->appKey")))$l.="RewriteRule ^$row->host/$row->appName/(.*) $fname/$1 [NC,L]".PHP_EOL;
        $htaccess[1]=PHP_EOL.$l;
        $htaccess=implode("#apps",$htaccess);
        $f = fopen($_SERVER['DOCUMENT_ROOT']."/".".htaccess", "w");
        //$f = fopen($_SERVER['DOCUMENT_ROOT']."/".".htaccess", "a+");
        fwrite($f, $htaccess);
        fclose($f);
        
        //unlink($fname);
        //file_put_contents($fname,$htaccess);
        //file_put_contents($_SERVER['DOCUMENT_ROOT'].'/.htaccess8',$htaccess);
        die($htaccess);
    }
    function get(){
        global $aim,$get,$location,$cookie;
        //err($aim);
        $q="SELECT config,id classID,lower(class)name FROM om.class WHERE ISNULL(classHostID,1) IN (1,$cookie->hostID)".(($schema=$location->path[3])?" AND class='$schema'":"");
        //err($q);
        $attr=$location->path[4];
        $res=query($q);
        while($row=fetch_object($res)) $attr?$json->definitions->{$row->name}->$attr=schema($row)->$attr:$json->definitions->{$row->name}=schema($row);
        die(json_encode($json));
    }
    function post(){
        global $aim,$get,$location,$cookie;$post=(object)$_POST;
        $post->key=strtoupper($post->key);$post->secret=strtoupper($post->secret);
        if (!$post->key) err("No key.",$post);
        addget("SELECT name appName,CONVERT(VARCHAR(50),secretUID)appSecret FROM auth.app WHERE uid='$post->key'");
        if (!$aim->appSecret) err("Wrong key, no app. ",$post);
        if (!$post->secret) err("No secret.",$post);
        if ($post->secret!=$aim->appSecret) err("Illegal secret.",$post);

        foreach($_POST as $schema=>$val) if ($val=dbvalue($val)) echo fetch_object(query("
            DECLARE @id INT,@classHostID INT;
            SELECT @id=id,@classHostID=classHostID FROM om.class WHERE class='$schema' 
            IF @id IS NULL
            BEGIN
                SELECT @id=MAX(id)+1,@classHostID=$cookie->hostID FROM om.class
				INSERT om.class (id,classHostID,class,name) VALUES (@id,@classHostID,'$schema','$schema')
            END
            IF @classHostID=$cookie->hostID UPDATE om.class SET config='$val' WHERE id=@id
            ELSE SELECT 'NO correct HostID '+CONVERT(VARCHAR(10),@classHostID) AS result;
        "))->result.$schema.$cookie->hostID;
        die($q);
    }
    function update(){
        global $aim,$get,$location,$cookie;
        $path=$location->path;
        while (array_shift($path)!=definitions);
        $get->schema=array_shift($path);
        $q.=";SELECT id classID,class name,config FROM om.class WHERE class='$get->schema'";
        //err($q);
        $schema=schema(fetch_object(query($q)));
        //$class->config=json_decode($class->config);
        //err($class);
        $props=$schema->properties;
        unset($props->state,$props->Title,$props->Subject,$props->files,$props->startDT,$props->endDT,$props->finishDT,$props->createdDT,$props->startDt,$props->endDt,$props->finishDt,$props->createdDt);
        //err($props);
        $props=array_keys((array)$props);
        $fieldname=implode(",F.",$props);
        $iflds=fieldids($props=implode(",",$props));
        $viewname="item.$get->schema";
        query("IF OBJECT_ID('$viewname', 'V') IS NOT NULL DROP VIEW $viewname");
        $q="
            CREATE VIEW $viewname AS SELECT I.*,'$get->schema'[schema],F.$fieldname FROM api.items I 
            LEFT OUTER JOIN (SELECT id fielditemid,name,value FROM om.fields WHERE fieldID IN ($iflds)) X PIVOT(MAX(value)FOR name IN ($props)) F ON I.id=F.fielditemid
            WHERE I.classID=$schema->classID"; 
        sql($q);
        //}
        die($q);
    }
}
?>