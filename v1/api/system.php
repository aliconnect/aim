<?php
class system {
    function fbs(){
        global $aim,$get,$location,$cookie;
        auth();
        $properties=json_decode(fetch_object(query("SELECT config FROM om.class WHERE class='system'"))->config)->fields;
        //err($properties);

        $aim->getrows=true;
        //$get->select=$get->select?:'masterID,srcID,files,title,Description,BodyHTML,Performance,PowerKVA';
        $get->select=$get->select?:'idx,masterID,srcID,files,title,Description,BodyHTML,Performance,PowerKVA,PowerFuse,PowerConnection,Air,AirConnection,Dewpoint,Water,WaterConnection,Length,Width,Height,InstallLength,InstallWidth,InstallHeight';
        //$aim->src=true;
        $data->src=(object)array();
        $rows=item::get();
        //err($rows);
        $items=$rows->system;
        //usort($items, function($a, $b){ return $a->idx < $b->idx; });

        foreach ($items as $id=>$item){$item->children=array();$item->derived=array();$item->properties=$properties;}
        foreach ($items as $id=>$item){
            if($item->masterID && $item->srcID!=$item->masterID && ($item->master=$items->{$item->masterID}) ) array_push($item->master->children,$item);
            if($item->srcID) $item->source=$items->{$item->srcID};

            //if($item->srcID && ($item->source=$items->{$item->srcID}) && $item->srcID!=$item->masterID){
            //    //array_push($item->source->derived,$item);
            //    $data->src->{$item->srcID}=$items->{$item->srcID};
            //}
        }
        function itemcontent($item,$level){
            global $aim,$get,$location,$cookie;
            //echo "<li>$item->title</li>";
            $html.="<a id='$item->id' name='$item->id'></a><h$level>$item->title</h$level>";
            if($item->source && $item->srcID!=$item->masterID && $item->source->masterID!=$item->source->hostID){
                array_push($item->source->derived,$item);
                $aim->src->{$item->srcID}=$item->source;
            }
            if ($item->srcID==$item->masterID && $source=$item) while ($source=$source->source) { 
                foreach($source->values as $key=>$value)$item->values->$key=$item->values->$key?:$value;
                if ($i++>5) break;
            }
            if($item->children){
                usort($item->children, function($a, $b){ return $a->idx == $b->idx ? 0 : ($a->idx < $b->idx ? -1 : 1); });
                foreach($item->children as $subitem){
                    $subhtml.=itemcontent($subitem,$level+1);
                    //$item->values->PowerKVA=123;
                    if ($subitem->masterID!=$subitem->srcID) $item->values->PowerKVA_children+=$subitem->values->PowerKVA_children+$subitem->values->PowerKVA;
                }
            }
            $html.="<table class='properties'>";
            $html.="<tr><th>Title</th><td>$item->title</td></tr>";
            //$html.="<tr><th>System NR</th><td>$item->id</td></tr>";

            if ($item->masterID!=$item->srcID){
                //$html.="<div>$item->masterID $item->srcID</div>";
                if($item->source) $html.="<tr><th>Product</th><td><a href='#$item->srcID'>".$item->source->title."</a></td></tr>";
                if($item->master) $html.="<tr><th>Part of</th><td><a href='#$item->masterID'>".$item->master->title."</a></td></tr>";

            }
            foreach ($item->files as $file) {
                //&& $fname=$item->files[0] && ($fname->type[0]==i || in_array($fname->ext,array(jpg,png,bmp))))
                if($file->type[0]==i || in_array($file->ext,array(jpg,png,bmp))) {
                    $src=$file->src;
                    $src=($src[0]==h?'':'https://aliconnect.nl').$src;
                    //$src=$_SERVER['DOCUMENT_ROOT']."/".$src;
                    if ($location->extension==doc) {
                        //$isize=
                        //err($location);
                        $sizesrc=str_replace($location->hostname==localhost?'':'https://aliconnect.nl',$_SERVER['DOCUMENT_ROOT'],$src);
                        list($width, $height) = getimagesize($sizesrc);
                        //echo "$sizesrc:";
                        //echo "$src:$sizesrc:$width,$height;";
                        $maxwidth = 500;
                        if($width>$maxwidth){
                            //$ratio = $width / $maxwidth;
                            $height = round( $height / ($width / $maxwidth));
                            $width = $maxwidth;
                        }
                    }
                    $html.="<tr><th>Details</th><td><img width='$width' height='$height' style='max-width:500px;' src='$src'></td></tr>";
                }
                //if($file->type[0]==i || in_array($file->ext,array(jpg,png,bmp))) {
                //    $src=($file->src[0]==h?'':'https://aliconnect.nl').$file->src;
                //    //$newwidth = 50;
                //    //list($originalwidth, $originalheight) = getimagesize($logourl);
                //    //$ratio = $originalwidth / $newwidth;
                //    //$newheight = $originalheight / $ratio;
                //    ////echo '<img class="cobrandedlogo" src="' . $logourl . '" height="50" width="' . $newwidth . '" />
                    
                //    $html.="<tr><th>Details</th><td><img width=50 height=$newheight src='$src'></td></tr>";
                //}
            }

            $item->values->PowerConnection=$item->values->PowerConnection?:$item->source->values->PowerConnection;

            foreach($item->properties as $fieldname=>$prop){
                if($value=$item->values->$fieldname){
                    $html.="<tr class=$fieldname><th>$prop->placeholder</th><td>$value $prop->unit</td></tr>";
                }
            }
            if ($item->masterID!=$item->srcID) {
                if($item->values->PowerKVA_children)$html.="<tr><th>Power equipment</th><td>".$item->values->PowerKVA_children." kVA</td>";
                if($item->values->PowerConnection){
                    $item->values->PowerKVA=$item->values->PowerKVA?:$item->source->values->PowerKVA;
                    $item->values->PowerKVA_connection=$item->values->PowerKVA_children+$item->values->PowerKVA;
                    $html.="<tr><th>Power total</th><td>".$item->values->PowerKVA_connection." kVA</td></tr>";
                    $item->values->PowerKVA_children=$item->values->PowerKVA=0;
                }
            }

            if($item->derived){
                $html.="<tr><th>Location</th><td><ol>";
                foreach($item->derived as $id=>$subitem){
                    $html.="<li><a href='#$subitem->id'>".$subitem->master->title." $subitem->title</a></li>";
                }
                $html.="</ol></td></tr>";
            }
            if($item->children){
                $html.="<tr><th>Consists of</th><td><ol>";
                foreach($item->children as $subitem){
                    $html.="<li><a href='#$subitem->id'>".$subitem->master->title." $subitem->title</a></li>";
                }
                $html.="</ol></td></tr>";
            }
            return $html."</table>".$subhtml;
        }


        $sbs=itemcontent($items->{$get->id},1);

        $html.="<h1>Products</h1>";
        $html.="<p class='MsoNormal'>The complete system consists of the following products:</p>";
        $html.="<table class='properties'>";
        $html.="<tr><th>Products</h><td><ol>";
        foreach ($aim->src as $id=>$subitem){
            $html.="<li><a href='#$subitem->id'>".$subitem->master->title." $subitem->title</a></li>";
            $subhtml.=itemcontent($subitem,2);
        }
        $html.="</ol></td></tr></table>".$subhtml;
        $title=$items->{$get->id}->title;
        $subject="Power Water Air";


        $html="<div class='document headers'>
            <link href='https://aliconnect.nl/lib/css/document.css' rel='stylesheet' />
            <link href='https://aliconnect.nl/lib/css/theme/aliconnect.css' rel='stylesheet' />
            <bg1></bg1><bg2></bg2>".utf8_encode($html.$sbs)."</div>";

        if ($location->extension==doc) die(html_doc(utf8_encode($html),$title,$subject));

        $logo="<img src='/sites/$cookie->host/img/logo.png'>";

        die("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
            </head><body><table class='border'>
                <thead><tr><th><div></div>$logo</th></tr></thead>
                <tbody><tr><td>$html</td></tr></tbody>
                <tfoot><tr><th><div><span style='float:right;'><label>Title</label>$title $subject <label>Printed</label> ".date('d-m-Y')."</span></div></th></tr></tfoot>
            </table></body></html>");
    }
}
?>