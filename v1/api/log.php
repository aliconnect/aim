<?php
/**
	* @file Database logger
	* @author Max van Kampen <max.van.kampen@alicon.nl>
	*/

require_once ("connect.php");
class log {
	function put($param) {
		$param=(object)$param;
		query("INSERT aimhis.om.event(path,method,step,value,tag)VALUES('".$_SERVER[SCRIPT_NAME]."','$param->method','$param->step','".(is_string($param->data)?$param->data:str_replace("'","''",stripslashes(json_encode($param->data?:''))))."','$param->tag');
			DELETE aimhis.om.event WHERE datediff (day,LogDateTime,getutcdate())>100;");
	}
	function get() {
		$headers = getallheaders();
		$Accept = array_shift(explode(",",$headers[Accept]));

		$res=query($q="SELECT TOP 500 LogDateTime,Path,Method,Step,ItemID,Value FROM aimhis.om.event
		--WHERE Method<>'setAttribute' AND Method LIKE '%server.php%'
		ORDER BY logid DESC");
		$rows=[];
		while($row=fetch_object($res)) {
				//if($row->Value)$row->Value=json_decode($row->Value);
				array_push($rows,$row);
				//err($row);
		}
		if ($Accept=="text/html" || $_GET['Content-Type']==html){
			echo "<style>body{background-color:black;color:white;}table{font-family: monospace;font-size:10pt;}td{white-space:nowrap;padding:0 5px;}</style>";
			//echo "<style>table{font-family: arial;font-size:8pt;}td{white-space:nowrap}</style><table><tr>".preg_replace('/":/',"=",(preg_replace('/{|}|"/',"",implode("</tr><tr>",array_map(function($row){return "<td>".implode("</td><td>",(array)$row)."</td>";},(array)$rows)))))."</tr></table>";
			echo "<table><tr><td>LogDateTime</td></tr>";
			foreach($rows as $row){
				$style="";
				if (strstr($row->Method,'server.php')) $style.="color:orange;";
				else if (strstr($row->Path,'acsm')) $style.="color:lightgreen;";
				else if ($row->Method==setAttribute && !strstr($row->Value,'Value')) $style.="color:yellow;";
				echo"<tr style='$style'><td><small>$row->LogDateTime</small></td><td>$row->Path $row->ItemID $row->Method $row->Step</td><td>".htmlspecialchars($row->Value)."</td></tr>";
			}
			echo "</table>";
			die();
		}
		die(json_encode($rows,JSON_PRETTY_PRINT));
	}
	function delete() {
    query("delete aimhis.om.event");
    die(json_encode('DSM Log deleted'));
	}
}
?>
