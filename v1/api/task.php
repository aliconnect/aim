<?php
array_push($aim->loaded,__FILE__);
class task {
    function log() {
        global $aim,$get,$location,$cookie;
        $rows=array();
        $res=query("
            DECLARE @accountID INT
            SELECT @accountID=id FROM api.items WHERE hostID=$cookie->hostID AND classID=1004 AND toID=$cookie->userID
            SELECT TL.*,ISNULL(M2.name+' / ','')+ISNULL(m.name+' / ','')+T.name taskName,A.name accountName
            FROM (
                SELECT accountID,datepart(year,startDT)year,datepart(week,startDT)week,datepart(DW,startDT)dw,SUM(DATEDIFF(minute,startDT,endDT))minutes,taskID
	            FROM work.tasklog TL
	            WHERE accountID=@accountID and datepart(year,startDT)=$aim->year and datepart(week,startDT)=$aim->week
	            group by accountID,datepart(year,startDT),datepart(week,startDT),datepart(dw,startDT),taskID
            )TL
            INNER JOIN om.items T ON T.id=TL.taskID
            LEFT OUTER JOIN om.items M ON M.id=T.masterID
            LEFT OUTER JOIN om.items M2 ON M2.id=M.masterID
            INNER JOIN om.items A ON A.id=TL.accountID
            ORDER BY M2.name,M.name,T.name
        ");
        while($row=fetch_object($res))$tbl->{$row->year}->{$row->week}->{$row->accountName}->{$row->taskName}->{$row->dw}=$row->minutes;
        $days=array(Ma=>1,Di=>2,Wo=>3,'Do'=>4,Vr=>5,Za=>6,Zo=>0,Tot=>7);
        foreach($tbl as $yearName=>$year){
            foreach($year as $wkName=>$wk){
                foreach($wk as $accountName=>$account){
                    $account->Total=null;
                    echo "<table><tr><td>Year:$yearName</td><td>Week:$wkName</td><td>Account:$accountName</td></tr></table>";
                    echo "<table>";
                    echo "<tr>";
                    echo "<td>Task:</td>";                            
                    foreach($days as $day=>$dayNr) echo "<td>$day</td>";                            
                    echo "</tr>";
                    foreach($account as $taskName=>$task){
                        echo "<tr>";
                        echo "<td>$taskName ".json_encode()."</td>";                            
                        foreach($days as $day=>$dayNr) {
                            echo "<td>".($task->{$dayNr}?date("H:i",mktime(0,$task->{$dayNr})):'')."</td>";   
                            $task->{7}+=$task->{$dayNr};
                            if($dayNr<7)$account->Total->{$dayNr}+=$task->{$dayNr};
                        }                         
                        echo "</tr>";
                    }
                    echo "</table>";
                }
            }
        }

        die();
    }
    
    function activate() {
        global $aim,$get,$location,$cookie;
        $rows=array();
        $res=query("
            DECLARE @taskID INT,@accountID INT,@hostID INT
            SELECT @accountID=id FROM api.items WHERE hostID=$cookie->hostID AND classID=1004 AND toID=$cookie->userID
            SELECT @taskID=ID FROM work.tasklog WHERE AccountID=@AccountID AND EndDT IS NULL
            UPDATE work.tasklog SET EndDT=GETUTCDATE() WHERE ID=@taskID
            INSERT work.tasklog (TaskID,AccountID,StartDT,PrevTaskID) VALUES ($get->id,@accountID,GETDATE(),@taskID)
            UPDATE om.items SET state='doing' WHERE id=$get->id AND state='input'
        ");
        die();
    }
    function todo() {
        global $aim,$get,$location,$cookie;
        $q="
            SELECT ISNULL(T.state,M.state)taskState,M.name masterName,T.name taskName,CONVERT(DATE,ISNULL(T.startDT,M.startDT))startDT,CONVERT(DATE,ISNULL(T.endDT,M.endDT))endDT,T.id taskID,M.id masterID,O.id ownerID,O.name ownerName,P.*--,PM.Deadline--,T.*
            FROM api.items T
            INNER JOIN api.items M ON M.id=T.masterID AND T.finishDT IS NULL AND T.hostID=$cookie->hostID AND T.classID=1162
            LEFT OUTER JOIN om.fields FO ON FO.id=T.id AND FO.fieldID=1406
            LEFT OUTER JOIN api.items O ON O.id=FO.itemID
            LEFT OUTER JOIN (SELECT[id][fieldItemID],[name],[value]FROM[om].[fields])[X]PIVOT(MAX(value)FOR[name]IN(Calc,Work))[P]ON[P].[fieldItemID]=T.[id]AND[P].[Work]>''
            --INNER JOIN (SELECT[id][fieldItemID],[name],[value]FROM[om].[fields])[X]PIVOT(MAX(value)FOR[name]IN(Deadline))[PM]ON[PM].[fieldItemID]=T.masterID
            --WHERE T.hostID=2347355 AND T.classID=1162
            ORDER BY ISNULL(T.state,M.state),ISNULL(T.endDT,M.endDT),ISNULL(T.startDT,M.startDT),M.name,T.name
        ";
        $res=query($q);
        $rows=array();
        while($row=fetch_object($res)){array_push($rows,array(values=>$row));}
        //$rows=itemrows($res);
        //err(rjhgj,$rows);
        die(function_exists($fn=extension_.$aim->extension)?$fn($rows):json_encode($rows)); 

        //die($q);
    }
    function plan() {
        global $aim,$get,$location,$cookie;
        $res=query($q="
            SELECT T.state,T.id,T.name title,T.ownerID,O.name [Owner],P.*,ISNULL(T.startDT,M.startDT)startDT,ISNULL(T.endDT,M.endDT)endDT
            FROM api.items T
            LEFT OUTER JOIN api.items M ON M.id=T.masterID
            LEFT OUTER JOIN api.items O ON O.id=T.ownerID
            LEFT OUTER JOIN (SELECT id fielditemid,name,value FROM om.fields WHERE fieldID IN (1454))X PIVOT(MAX(value)FOR name IN (Work))P ON T.id=P.fielditemid
            WHERE T.classid=1162 AND T.hostID=$cookie->hostID AND T.finishDT IS NULL AND T.state NOT IN ('done')
        ");
        //err($q);
        $rows=array();
        while($row=fetch_object($res))array_push($rows,clean($row));
        $data->task->plan=$rows;
        die(json_encode($data));
        //die($q);
        

        //$rows=itemrows(query($q));
        //err(r,$rows);
        //die(function_exists($fn=extension_.$aim->extension)?$fn($rows):json_encode($rows)); 
    }
    function usertasks() {
        global $aim,$get,$location,$cookie;
        //err($aim);
        $q="
            SELECT T.id,T.uid,T.class[schema],T.obj,T.state,T.classID,T.name,T.title,T.subject,T.summary,T.title,UV.lastvisitDT,ISNULL(T.state,M.state)state,ISNULL(T.startDT,M.startDT)startDT,ISNULL(T.endDT,M.endDT)endDT,M.id masterID,O.id ownerID,O.name ownerName,P.*
            FROM api.citems T
            INNER JOIN api.items M ON M.id=T.masterID AND T.finishDT IS NULL AND T.hostID=$cookie->hostID AND T.classID=1162
            LEFT OUTER JOIN om.fields FO ON FO.id=T.id AND FO.fieldID=1406
            LEFT OUTER JOIN api.items O ON O.id=FO.itemID
            LEFT OUTER JOIN (SELECT[id][fieldItemID],[name],[value]FROM[om].[fields])[X]PIVOT(MAX(value)FOR[name]IN(Calc,Work))[P]ON[P].[fieldItemID]=T.[id]AND[P].[Work]>''
            LEFT OUTER JOIN om.itemuservisit UV ON UV.id=T.id AND UV.userID='$cookie->userID'
            WHERE T.ownerID='$cookie->accountID' AND T.finishDT IS NULL AND T.state IN ('input','doing','hold')
        ";
        //$res=query($q);
        //die($q);
        
        //err($aim);

        $rows=itemrows(query($q));
        //err(r,$rows);
        die(function_exists($fn=extension_.$aim->extension)?$fn($rows):json_encode($rows)); 
    }
}
?>