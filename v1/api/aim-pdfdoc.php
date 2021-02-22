<?php
class pdfdoc
{
    public $sendaccount = "aliconnect.nl@gmail.com";
    public $output;

    function make ($html) {

    //if (file_exists($filename) && !$_GET[create]) {
    //    $output=file_get_contents($filename);
    //}
    //else 
        //$html = str_replace("<body","<link rel='stylesheet' type='text/css' href='pdf.css'><body",$html);

        ob_start();
        Eval('?>'.$html.'<?');
        $html = ob_get_contents();
        //ob_clean();
        ob_end_clean();
        //ob_end_flush();

        require_once ($_SERVER['DOCUMENT_ROOT']."/inc/php/dompdf/dompdf_config.inc.php");
        $dompdf = new DOMPDF();
        $dompdf->load_html($html);
        $dompdf->set_paper("a4");
        $dompdf->render();
        $this->output = $dompdf->output();

    }
    function save($outputfile) {
        $this->outputfile=$outputfile;
        unlink($this->outputfile);
        file_put_contents($this->outputfile, $this->output);
    }

    function send($to,$cc,$bcc) {
        //echo getcwd();//."<br>".$_GET["file"];
        if ($this->mailfilename) $body = file_get_contents($this->mailfilename);
        include_once "aim-mail.php"; 
        sendfrom($this->sendaccount,"Alicon <info@alicon.nl>",$this->subject,$body,$to,$cc,$bcc,$this->outputfile);
        //echo $this->outputfile;
    } 

    function write() {
        header("Content-Type: application/pdf");
        header("Content-Disposition: inline; filename='".$this->name.".pdf'");
        print $this->output;
    }
}
/*
file_put_contents("/inetpub/vhosts/alicon.nl/www.alicon.nl/aim/dompdf/temp/page.html",$body);
header('Location: http://localhost/www.alicon.nl/aim/dompdf/dompdf.php?base_path=temp/&options[Attachment]=0&input_file=page.html&id=123&view=FitH&statusbar=0&messages=0&navpanes=0');
*/
?>