<?php
$aim->fileUID=str_split($get->schema,4);
$aim->fileUID=implode('-',array(array_shift($aim->fileUID).array_shift($aim->fileUID),array_shift($aim->fileUID),array_shift($aim->fileUID),array_shift($aim->fileUID),array_shift($aim->fileUID).array_shift($aim->fileUID).array_shift($aim->fileUID)));
$aim->file=fetch_object(query("SELECT type,src FROM om.files WHERE itemID=$get->id AND uid='$aim->fileUID';"));
if (file_exists($src=$_SERVER['DOCUMENT_ROOT'].$aim->file->src)) {
    header('Content-Type: '.$aim->file->type);
    readfile($src);
}
else {
    echo "No access to file";
}
die();
?>