<?php
require_once (__DIR__."/../connect.php");
$res=query("USE AIM");
$res=query("


DECLARE @T TABLE (object_id INT,referenced_major_id INT,name VARCHAR(500),ref VARCHAR(500),ot VARCHAR(500),rt VARCHAR(500))
INSERT @T
SELECT DISTINCT P.object_id,referenced_major_id,S1.name+'.'+O1.name AS obj,S2.name+'.'+O2.name AS ref  ,O1.type,O2.type
FROM sys.sql_dependencies P
INNER JOIN sys.objects O1 ON O1.object_id=P.object_id AND O1.name NOT LIKE '[_]%' --AND O1.type='V'
INNER JOIN sys.schemas S1 ON S1.schema_id=O1.schema_id
INNER JOIN sys.objects O2 ON O2.object_id=P.referenced_major_id AND O2.name NOT LIKE '[_]%' --AND O2.type='V'
INNER JOIN sys.schemas S2 ON S2.schema_id=O2.schema_id 
WHERE P.object_id<>P.referenced_major_id

DECLARE @P TABLE(level INT,object_id INT,name VARCHAR(500),ot VARCHAR(500),referenced_major_id INT,ref VARCHAR(500),rt VARCHAR(500))
DECLARE @level INT
SET @level=0

INSERT @P 
SELECT @level,O1.object_id,S1.name+'.'+O1.name AS obj,type,null,null,null
FROM sys.objects O1
INNER JOIN sys.schemas S1 ON S1.schema_id=O1.schema_id
WHERE O1.object_id NOT IN (SELECT object_id FROM @T) AND O1.type NOT IN ('S','D','PK','IT','SQ','UQ') AND O1.name NOT LIKE '[_]%'

WHILE @level<5
BEGIN
	SET @level=@level+1
	INSERT @P
	SELECT DISTINCT @level,T.object_id,T.name,T.ot,T.referenced_major_id,T.ref,T.rt
	FROM @T T WHERE object_id NOT IN (
		SELECT DISTINCT object_id FROM @T WHERE referenced_major_id NOT IN (SELECT object_id FROM @P)
	)
	AND T.object_id NOT IN (SELECT DISTINCT object_id FROM @P)
END

SET NOCOUNT OFF

SELECT S.name schemaname,T.name,api.getDefinitionTable(t.object_id) definition 
FROM sys.tables t
INNER JOIN sys.schemas S ON S.schema_id=T.schema_id
where t.name not like '[_]%' --and o.name='wordAdd'
order by S.name,T.name

SELECT P.level,P.idx,M.object_ID,S.name schemaname,O.name name,O.type,type_desc,M.definition
FROM sys.sql_modules M 
INNER JOIN (
SELECT DISTINCT 
	level,object_id,name,ot,
	CASE ot WHEN 'U' THEN 0 WHEN 'TR' THEN 3 WHEN 'FN' THEN 11 WHEN 'TF' THEN 12 WHEN 'IF' THEN 13 WHEN 'V' THEN 5 WHEN 'P' THEN 31 ELSE 50 END 
	idx
	FROM @P 
) P ON P.object_id = M.object_ID
INNER JOIN sys.objects O ON O.object_id=M.object_id 
INNER JOIN sys.schemas S ON S.schema_id=O.schema_id
WHERE o.name NOT LIKE '[_]%'
ORDER BY P.level,P.idx,S.name,O.name

");

$l="\r\n-- ===============================================\r\n";

$dbname=$_GET[dbname]?:"AIM01";
while($row=fetch_object($res)) {
	$schema->{$row->schemaname}=null;
	$sql.="$l-- TABLE $row->schemaname.$row->name$l".str_replace("\r","\r\n",$row->definition);
}
next_result($res);
while($row=fetch_object($res)) {
	$schema->{$row->schemaname}=null;

	$row->definition=str_replace(array("(","\r\n"),array(" ("," \r\n"),$row->definition);
	$a=explode("CREATE ",$row->definition);
	array_shift($a);
	$row->definition=implode("CREATE ",$a);

	$a=explode(" ",$row->definition);
	$row->definition=array_shift($a);
	array_shift($a);
	$row->definition.=" [$row->schemaname].[$row->name] ".implode(" ",$a);
	$types=array('FN'=>'FUNCTION','TF'=>'FUNCTION','IF'=>'FUNCTION','P'=>'PROCEDURE','TR'=>'TRIGGER','V'=>'VIEW');
	$type=$types[$row->type];
	$sqla.="$l-- $row->type_desc $row->schemaname.$row->name $l"."ALTER $row->definition\r\nGO";
	$sql.="$l-- $row->type_desc $row->schemaname.$row->name $l".
"IF OBJECT_ID('$row->schemaname.$row->name') IS NOT NULL DROP $type $row->schemaname.$row->name;\r\nGO\r\nCREATE $row->definition\r\nGO";
}

foreach($schema as $schemaname=>$val)$sqlschema.="\r\nIF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'$schemaname') EXEC sys.sp_executesql N'CREATE SCHEMA [$schemaname]'\r\nGO";

file_put_contents(__DIR__."/../../sql/aimALTER.sql","USE AIM\r\nGO".$sqla);
$sql=str_replace("TEXT(16)","TEXT",$sql);
file_put_contents(__DIR__."/../../sql/aimCREATE.sql",$sql="SET NOCOUNT ON;IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'$dbname') CREATE DATABASE [$dbname]\r\nGO\r\nUSE $dbname\r\nGO".$sqlschema.$sql);
die ($sql);
?>
