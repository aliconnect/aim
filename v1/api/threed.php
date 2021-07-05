<?php
class threed {
    function post(){
        global $aim,$get,$location,$cookie;
        unlink($fname=$_SERVER['DOCUMENT_ROOT']."/shared/threed/sites/$cookie->hostID/shapes.json");
        file_put_contents($fname,$aim->data);
        die('DONE');
    }
    function get(){
        global $aim,$get,$location,$cookie,$o;
        $o=(object)array(scale=>10,shape=>(object)array(),geo=>(object)array());
        $obj=fetch_object(query("SELECT files FROM om.items WHERE id=$get->id;"));
        $files=json_decode($obj->files);
        $o->floorplan->src=$files[0]->src;
        $res=db(aim)->query("EXEC api.systemTree3dModel @id=$get->id;");
        while($row = db(aim)->fetch_object($res)) {
            $row->children=$row->children?json_decode($row->children):array();
            foreach ($row as $key=>$value) if ($value==='') unset($row->$key); else if (is_numeric($value)) $row->$key=(float)$value;
            $items->{$row->id}=$row;
            //if (!$root) $root=$items->{$row->id};
            if ($row->masterID && $items->{$row->masterID}) array_push($items->{$row->masterID}->children,$items->{$row->id});
        }
        $o->geo=json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT']."/shared/threed/sites/$cookie->hostID/geo.json"));
        $o->shape=json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT']."/shared/threed/sites/$cookie->hostID/shape.json"));
        foreach ($o->shape as $obj) foreach ($obj->vectors as $i=>$value) $obj->vectors[$i]=round($obj->vectors[$i]*1000/39.370);

        //we bouwen nu recursive een boom op van het top object en alle kinderen
        function build(&$b) {
            global $o;
            if (!$b->children) unset($b->children);
            if ($b->geo) $b=(object)array_merge((array)$o->geo->{$b->geo},(array)$b);
            foreach ($b->children as $i => $c) $b->children[$i]=build($c);
            return $b;
        }
        $o->object=build($items->{$get->id});
        die(json_encode($o));
    }
}
?>