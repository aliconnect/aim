<?php
require_once(__dir__."/lib.php");

class ana {
    function domain(){
        global $aim,$get,$location,$cookie;
        $res=query("
            select I.name from auth.userLoginLog L inner join om.items I ON I.id=L.userID AND L.hostid=$cookie->hostID where datediff(month,lastlogindt,getdate())=1 and I.id not in (286665)
            select class,count(0)quant from api.citems  where hostid=$cookie->hostID group by class order by count(0) desc
        ");
        die(function_exists($fn=res_.$aim->extension)?$fn($res):'');
    }
}
?>
