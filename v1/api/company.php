<?php
class company {
    function onpost($item){
        global $aim,$get,$location,$cookie;
        //err($item);
        if(!$item->userID)return;
        //$user=fetch_object($res=dbexec("auth.getcontact",$par=array(publicCompanyID=>$item->id)));
        $user=fetch_object($res=dbexec("auth.accountCreate",$par=array(publicCompanyID=>$item->id,byID=>$cookie->userID)));
        if(next_result($res))while($row=fetch_object($res)){$user->msg->{$row->name}=$row;} 
        //err($user);
        usermsg($user);
        //return
    }


    //function createhost(){
    //    global $aim,$get,$location,$cookie;
    //    $user=fetch_object($res=dbexec("auth.getcontact",$_GET));
    //    if(next_result($res))while($row=fetch_object($res)){$user->msg->{$row->name}=$row;} 
    //    usermsg($user);
    //    die();
    //}
}
?>