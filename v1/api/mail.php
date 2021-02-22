<?php
require_once __DIR__.'/connect.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/inc/php/PHPMailer/PHPMailerAutoload.php';
$results_messages = array();

$mail = new PHPMailer(true);
$mail->CharSet = 'utf-8';
ini_set('default_charset', 'UTF-8');
class mailer {
	function __construct() {
	}
	public function add($mailmsg) {
			//$mailmsg=(array)$mailmsg;
			//foreach ($mailmsg as $key=>$value)$mailmsg[$key]=utf8_encode($value);
			$this->q.="INSERT aim.mail.queue (hostname,msg) VALUES ('$hostname','".dbvalue(raw_json_encode($mailmsg))."')";
	}
	public function send($mailmsg) {
			//require_once ($_SERVER['DOCUMENT_ROOT']."/api/v1/mail.php");
			$this->mail=new AIMMailer(true);
			$this->mail->mailsend($mailmsg);
	}
	public function write($mailmsg) {
			//require_once ($_SERVER['DOCUMENT_ROOT']."/api/v1/mail.php");
			$this->mail=new AIMMailer(true);
			$mailmsg[write]=1;
			$mailmsg[mail]=0;
			$this->mail->mailsend($mailmsg);
	}
	public function put($mailmsg) {
			if ($mailmsg) $this->add($mailmsg);
			query($this->q);
			$this->q='';
	}
}
$mailer=new mailer();

function putmail($mailmsg){
		query("INSERT mail.queue (msg) VALUES ('".dbvalue(json_encode($mailmsg))."')");
}

class mail {
	function get(){
			global $aim,$get,$location,$cookie;//$post=(object)$_POST;
			$msg=json_decode($aim->msg);
			//err(msg,$msg);
			//require_once ($_SERVER['DOCUMENT_ROOT']."/api/v3/mail.php");

			//global $mailer,$dompdf;
			//$msg=(object)array(
			//		FromName=>"Max van Kampen (alicon)",
			//		Subject=>"sdfgsdfgsdf",
			//		//write=>1,
			//		host=>"$cookie->host.aliconnect.nl",
			//		//attachements=>array(
			//		//		(object)array(name=>$doc->name.".pdf",html=>$html)
			//		//),
			//		to=>"max.van.kampen@moba.net",
			//		//cc=>$doc->emailaddresscc,
			//		//bcc=>$doc->emailaddressbcc,
			//		msgs=>array(array(content=>"dsfsdg fsdf gsdf")),
			//);
			//echo json_encode($msg);
			//$attachements=array();
			//foreach($msg->attachements as $doc) {
			//		if ($doc->html) {
			//				$doc->filename=$_SERVER['DOCUMENT_ROOT']."/api/v1/doc/pdf/".str_replace(array('/'),"",$doc->name);
			//				unlink($doc->filename);
			//				file_put_contents($doc->filename, docpdf($doc->html)->output());
			//		}
			//}
			$mail=new AIMMailer(true);
			$mail->mailsend($msg);

			//$mailer->send($msg);
			die();
	}
	function send($msg){
			$mail=new AIMMailer(true);
			$mail->mailsend($msg);
	}
	function add($msg){
			query("INSERT mail.queue (msg) VALUES ('".dbvalue(json_encode($msg))."')");
	}
}

class phpmailerAppException extends phpmailerException {}
class AIMMailer extends PHPMailer{
	function __construct() {
			global $aim,$get,$location,$cookie;
			$this->body="";
			$this->messages=array();
			$this->host="$cookie->host.aliconnect.nl";
	}
	public function addbodypar($par) {
			$par=(object)$par;
			//$content=iconv("CP1252", "UTF-8", $content);
			//$par->content=utf8_decode($par->content);
			if ($this->msg->keys) foreach($this->msg->keys as $key=>$value) $par->content=str_replace("[$key]",$value,$par->content);
			if (!$this->Subject) { $this->Subject=strip_tags(iconv("UTF-8","CP1252", $par->content)); }
			else if (strlen($this->Summary)<200) $this->Summary.=str_replace("@"," at ",substr(strip_tags($par->content),0,200))." ";
			//$par->bgcolor = $par->bgcolor ? $par->bgcolor : '#ffffff';

			if ($par->src) {
					$par->src="<img src=\"https://aliconnect.nl/$par->src\" alt=\"$par->name\" border=\"0\" hspace=\"0\" align=\"left\">";
					if ($par->href) $src="<a href='$par->href' target='_blank'>$par->src</a>";
					$par->src="<table border=0 cellspacing=0 cellpadding=0 align=left><tr><td style='PADDING:10px;'>$par->src</td></tr></table><!--[if gte mso 9]></td><td width=290><![endif]-->";
					$par->cwidth='';
					$par->swidth='WIDTH:290px;';
			}
			else {
					$par->cwidth='';
					$par->swidth='WIDTH:100%';
			}
			if ($par->ItemID) $par->href="https://$this->Domain/?id=$par->ItemID";
			if ($par->type==remark) $par->style="background-color:#ddd;";

			$this->body .= $this->chapter($par);
	}
	public function chapter($par) {
			return "<table style='MIN-WIDTH: 320px; BACKGROUND-COLOR: #ffffff; WIDTH: 100%; MAX-WIDTH: 640px; $par->style' class='width640' border=0 cellspacing=0 cellpadding=0 align=center><tr><td>
			<table border=0 cellspacing=0 cellpadding=0 width=640 class=fullwidth align=center><tr><td style='PADDING: 10px;' valign=top >
			$par->src<table style='$par->swidth' class='$par->cwidth' border=0 cellspacing=0 cellpadding=0>".
			($par->name?"<tr><td></td><td style=\"TEXT-ALIGN: left; PADDING: 10px; LINE-HEIGHT: 26px; FONT-FAMILY: 'Trebuchet MS', Helvetica, sans-serif; COLOR: #1c262e; FONT-SIZE: 20px; \" class=fullwidth valign=top><strong>".icp($par->name)."</strong></td><td></td></tr>":"").
			($par->content?"<tr><td></td><td style=\"TEXT-ALIGN: left; PADDING: 10px; LINE-HEIGHT: 20px; FONT-FAMILY: 'Trebuchet MS', Helvetica, sans-serif; COLOR: #737373; FONT-SIZE: 14px; $par->style \" class=fullwidth	valign=top><p>".icp($par->content)."</p></td><td></td></tr>":"").
			($par->href?"<tr><td></td><td style='TEXT-ALIGN: left; PADDING: 10px;' class=fullwidth><table border=0 cellspacing=0 cellpadding=0><tr>
				<td cellpadding=0 style=\"PADDING: 5px 10px; TEXT-ALIGN: center; BACKGROUND-COLOR: $this->Basecolor ; FONT-FAMILY: 'Trebuchet MS', Helvetica, sans-serif; COLOR: #1c262e; FONT-SIZE: 14px\">
					<a style='COLOR: #ffffff; TEXT-DECORATION: none' href='$par->href' target='_blank'><font style='COLOR: #ffffff'><strong>Lees meer</strong></font></a>
				</td></tr></table></td><td></td></tr>":"").
			"</table></td></tr></table></td></tr></table>";
	}
	public function makeHtml() {
		$this->host=str_replace('.aliconnect.nl','',$this->host);
		$this->header=$this->chapter((object)array(content=>"<a href='https://$this->host.aliconnect.nl' target='_blank'><img src='https://$this->host.aliconnect.nl/sites/$this->host/app/v1/img/logo/mail.png' alt='$this->host' title='$this->host' border='0' style='max-width:100%;'></a>"));
		$this->html=str_replace("[body]",$this->body,str_replace(array("[summary]","[header]"), array($this->Summary,$this->header), file_get_contents(__DIR__.'/../html/mail.html')));
		return $this->html;
	}
	//public function init($from,$fromname) {
	//		if ($from) $this->from=$from;
	//		if ($this->from) $resmail = exec("aim.auth.mailAccountSettings",array(from=>$this->from,to=>$this->ToEmail));
	//		else $resmail = exec("aim.auth.mailAccountSettings",array(host=>$this->host,to=>$this->ToEmail));
	//		if ($rowmail = fetch_object($resmail)) {
	//				//echo json_encode($rowmail);

	//				$this->isSMTP();
	//				$this->SMTPSecure	 = 'none';
	//				$this->SMTPAuth		 = true;
	//				$this->Host				 = 'www.aliconnect.nl';
	//				//$this->setFrom($from, $fromname?$fromname:$rowmail->ReplyToName);
	//				//$this->FromName		 = $msg->FromName?$msg->FromName:'Team Aliconnect';
	//				$this->FromName		 = $msg->FromName ? $msg->FromName : 'Team Aliconnect';
	//				//$this->FromName		 = 'Max van Kampen';
	//				$this->Username		 = $this->Sender = $this->From = 'mailer@aliconnect.nl';

	//				//$this->Username		 = 'mailer@aliconnect.nl';
	//				$this->Password		 = 'Al!c0nAdm!n';
	//				$this->WordWrap		 = 78;


	//				//$this->isSMTP();
	//				//$this->SMTPSecure = $rowmail->SMTPSecure;
	//				//$this->SMTPAuth	 = true;
	//				//$this->Host			 = $rowmail->SMTPHost;
	//				//$this->setFrom($from, $fromname?$fromname:$rowmail->ReplyToName);
	//				//$this->Username = $rowmail->Username;
	//				//$this->Password= $rowmail->Password;
	//				//$this->WordWrap = 78;
	//		}
	//		else {
	//				$reply->errors[0]->message="Het domein email account $this->host is niet geconfigureerd";
	//				//echo $reply->errors[0]->message;
	//				return false;
	//		}
	//		return true;
	//}
	public function sendMail($msg) {
		global $aim,$get,$location,$cookie;
		$this->msg=$msg=(object)$msg;
		//if (!$msg->host) $msg->host="$cookie->host.aliconnect.nl";
		//$msg->Hostname=$cookie->host;
		$this->host=$msg->host?:$aim->host;
		$this->isSMTP();
		$this->SMTPSecure 	= $GLOBALS[MAIL]->SMTPSecure;
		$this->Port 		= $GLOBALS[MAIL]->Port;
		$this->SMTPAuth 	= $GLOBALS[MAIL]->SMTPAuth;
		$this->Host 		= $GLOBALS[MAIL]->Host;
		$this->Username 	= $GLOBALS[MAIL]->Username;
		$this->Password 	= $GLOBALS[MAIL]->Password;
		//$this->FromName		 = iconv("UTF-8", "CP1252", $msg->FromName ? $msg->FromName : 'Team Aliconnect' ) ;
		//$this->FromName		 = iconv("UTF-8", "CP1252",$msg->FromName ? $msg->FromName : 'Team Aliconnect') ;
		//$this->FromName		 = iconv("UTF-8", "CP1252",$msg->FromName ? $msg->FromName : 'Team Aliconnect') ;
		//$this->Username		 = $this->Sender = $this->From = 'mailer@aliconnect.nl';
		//$this->FromName = 'Team Aliconnect (Frits van Ingen)';
		$this->WordWrap = 78;
		//$this->setFrom('mailer@alicon.nl');
		//die('FROM:'.json_encode($msg));
		$this->setFrom($msg->fromaddress?:$GLOBALS[MAIL]->Username);
		//$this->setFrom('mailer@alicon.nl');
		//err($this);


		//var_dump($this);
		//if ($msg->SMTPHost) {
		//		$this->isSMTP();
		//		$this->SMTPSecure = $msg->SMTPSecure;
		//		$this->SMTPAuth	 = true;
		//		$this->Host			 = $msg->SMTPHost;
		//		$this->setFrom($msg->Username,utf8_decode($msg->FromName?$msg->FromName:$msg->ReplyToName));
		//		$this->WordWrap = 78;
		//		$this->Username = $msg->Username;
		//		$this->Password= $msg->Password;
		//}
		//else {
		//		//echo "AAAAAAAAAsdfdgs";
		//		//if (!$msg->FromEmail) $msg->FromEmail="$msg->Hostname@alicon.nl";
		//		//if (!$this->init($msg->FromEmail?$msg->FromEmail:"$msg->Hostname@aliconnect.nl",$msg->FromName)) return false;
		//		if (!$this->init("mailer@aliconnect.nl",$msg->FromName)) return false;
		//		//echo json_encode($msg);//"AAAAAAAAAsdfdgs RRRRRRRRRRR";
		//}
		$this->clearAllRecipients();
		foreach (array(to,cc,bcc) as $grp) {
				$mailaddresses=explode(';',$msg->{$grp});
				foreach ($mailaddresses as $email) {
						$email=explode('<',$email);
						$emailaddress=trim(array_shift($email));
						$emailname=trim(str_replace('>','',array_shift($email)));
						$this->addOrEnqueueAnAddress($grp, $emailaddress, $emailname);
				}
		}
		foreach ($msg->Receivers as $rec) $this->addOrEnqueueAnAddress($rec[0], $rec[1], $rec[2]);
		foreach (array(Basecolor,Domain,Hostname,Summary) as $key) $this->$key=$msg->$key;
		$this->Subject = iconv("UTF-8", "CP1252", $msg->Subject);
		//$this->Subject = iconv("CP1252", "UTF-8", $msg->Subject);
		//$this->Subject = iconv("UTF-8", "CP1252", utf8_decode($msg->Subject));
		//$this->Subject = utf8_decode(iconv("UTF-8", "CP1252", $msg->Subject));
		//$this->Subject = utf8_decode($msg->Subject);

		foreach ($msg->mailbody as $row) $this->addbodypar($row);
		//var_dump($msg);

		foreach ($msg->msgs as $row) $this->addbodypar($row);
		if ($this->msg->keys) foreach($this->msg->keys as $key=>$value) $this->Subject=str_replace("[$key]",$value,$this->Subject);

		//$this->Subject = utf8_decode($msg->Subject);


		$this->addbodypar(array(style=>"background-color:#ccc;color:#333;font-size:8pt;", content=>"De informatie opgenomen in dit bericht kan vertrouwelijk zijn en is uitsluitend bestemd voor de geadresseerde. Indien u dit bericht onterecht ontvangt, wordt u verzocht de inhoud niet te gebruiken en de afzender direct te informeren door het bericht te retourneren. Aan de inhoud van dit bericht kunnen geen rechten worden ontleend."));
		//$mail->addbodypar(array(style=>"background-color:#333;color:#eee;font-size:8pt;", content=>"Deze mail is automatisch gegenereerd met behulp van <a href=document.location.protocol+'//aliconnect.nl' style='color:#ccc;'>aliconnect</a>"));
		//echo json_encode($msg->attachements);
		foreach ($msg->attachements as $att) {
				$att=(object)$att;
				$this->addAttachment($att->filename,$att->name);
		}
		//die($this->body);

		$this->makeHtml();
		//die(json_encode($this));
		//die($this->html);
		//$this->html="dsfgsdf";
		//die($this->html);
		$this->msgHTML( $this->html, __DIR__, true);
		if ((isset($msg->mail) && !$msg->mail) || $msg->write) echo $this->html;

		//die(json_encode($this));

		if (!isset($msg->mail) || $msg->mail) {
				$this->aid=$msg->aid;
				if(!$this->Send()) {
						echo "Mailer Error: ".$this->Port.$this->SMTPSecure.$this->ErrorInfo;
				} else {
						//echo "Message sent!".$this->Port.$this->SMTPSecure;
				}
		}
		foreach ($msg->attachements as $att) {
				$att=(object)$att;
				if ($att->temp) unlink($att->filename);
		}
		return true;
	}
	public function sendrow($row) {
			$msg=json_decode($row->msg);
			unset($row->msg);
			foreach ($row as $key=>$value) if (!$msg->$key) $msg->$key=$row->$key;
			//$msg->FromName='MAXJE111';//iconv("UTF-8", "CP1252",utf8_encode(
			//$msg->FromName=iconv("UTF-8", "CP1252",$msg->FromName);
			//$msg->FromName=iconv("CP1252", "UTF-8",$msg->FromName);
			//$msg->FromName=utf8_decode($msg->FromName);

			$succes=$this->sendMail($msg);
			//echo "<li>$row->aid $row->ReplayToName $row->ReplyToEmail to: $row->ToName ($row->ToEmail) </li>$mail->html";
			query("UPDATE mail.queue SET sendDT=GETDATE(),reply=CONVERT(VARCHAR(250),'$succes') WHERE aid=$row->aid;");
	}
}
$mail=new AIMMailer(true);
?>
