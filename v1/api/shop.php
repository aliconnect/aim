<?php
array_push($aim->loaded,__FILE__);
class shop {
    function bag(){
        if ($post->a==get) {
            $res = dbexec("api.$exec",$_POST);
            $items=array();
            while($row = fetch_object($res)) {
                array_push($items,utf8_encode($row->obj));
                $bag[$row->id]=array(quant=>$row->quant,extra=>$row->extra);
            }
            next_result($res);
            while($row = fetch_object($res)) if ($row->value) $custart[$row->id]=$row->value;
            exit('{"items":['.implode(',',$items).'],"custart":'.json_encode($custart).',"bag":'.json_encode($bag).'}');
        }
        if ($post->a==purchaseorder) {
            require_once (__DIR__.'/doc.php');
            $res = query("SET NOCOUNT ON;EXEC shop.getPurchaseOrders @clientID=$post->ClientID,@hostID=$post->hostID;");
            $comp = fetch_object($res);
            next_result($res);
            while($row = fetch_object($res)) { 
                $row->hdr=array(
                    array(Opdrachtnemer=>implode('<br>',array($row->CompanyName,"$row->BusinessAddressStreet $row->BusinessAddressNumber $row->BusinessAddressAdd","$row->BusinessAddressPostalCode $row->BusinessAddressCity","$row->BusinessAddressTown $row->BusinessAddressState $row->BusinessAddressCountry",$row->CompanyEmail)),Postadres=>implode('<br>',array($row->CompanyName,"$row->OtherAddressStreet $row->OtherAddressNumber $row->OtherAddressAdd","$row->OtherAddressPostalCode $row->OtherAddressCity","$row->OtherAddressTown $row->OtherAddressState $row->OtherAddressCountry",$row->CompanyEmailInvoice))),
                    array(Opdrachtnummer=>$comp->id,Datum=>date("d-m-Y")),
                    array(Verzendinformatie=>implode('<br>',array($comp->CompanyName,"$comp->BusinessAddressStreet $comp->BusinessAddressNumber $comp->BusinessAddressAdd","$comp->BusinessAddressPostalCode $comp->BusinessAddressCity","$comp->BusinessAddressTown $comp->BusinessAddressState $comp->BusinessAddressCountry",$comp->CompanyEmail)),Postadres=>implode('<br>',array($comp->CompanyName,"$comp->OtherAddressStreet $comp->OtherAddressNumber $comp->OtherAddressAdd","$comp->OtherAddressPostalCode $comp->OtherAddressCity","$comp->OtherAddressTown $comp->OtherAddressState $comp->OtherAddressCountry",$comp->CompanyEmailInvoice))),
                    array(Verzendmethode=>'Transport',Betaalmethode=>'Op rekening')
                );
                $row->rows=array(); 
                $levs[$row->id]=$row; 
            }
            next_result($res);
            while($row = fetch_object($res)) {
                $obj=json_decode($row->obj);
                foreach ($row as $key => $value) $obj->$key=$value;
                array_push($levs[$row->LevId]->rows,$obj);
            }
            require_once (__DIR__.'/bon.php');
            foreach ($levs as $levId => $lev) {
                $mailcontent=mailboncontent($lev);
                $lev->CompanyEmailPurchase='max@alicon.nl;christiaan.schnurer@alicon.nl';
                $emailadresses=explode(';',$lev->CompanyEmailPurchase);
                $receivers=array();
                foreach ($emailadresses as $mailaddress) array_push($receivers,array('to',$mailaddress));
                $mailmsg=array(
                    mail=>1,
                    Hostname=>strtolower($bon->Bedrijf),
                    FromEmail=>'aliconnect@alicon.nl',
                    Receivers=>$receivers,
                    Subject => "Leveropdracht van $comp->CompanyName aan $lev->CompanyName",
                    Summary => 'Hierbij opdracht tot leveren van de vermelde producten, materialen en/of diensten.',
                    //msgs=>array(array(content=>$msg->content))
                    msgs => array(
                        array(content=>"Aan $lev->CompanyName,"),
                        array(content=>"Hierbij geven wij opdracht tot het leveren van onderstaande producten, materialen en/of diensten. Wij horen graag wanneer deze opdracht wordt uitgevoerd en/of geleverd."),
                        array(content=>$mailcontent),
                    )
                );
                $q="INSERT mail.queue (msg) VALUES ('".dbvalue(json_encode($mailmsg))."')";
                query($q);
            }
            exit();
        }
        if ($post->a==createorder) {
            require_once (__DIR__.'/doc.php');
            $res = query("SET NOCOUNT ON;UPDATE om.orderrow SET rowobj=obj FROM om.items I WHERE I.id = om.orderrow.itemID AND om.orderrow.userID=$post->ClientID AND om.orderrow.orderId IS NULL;
                EXEC api.getItemPivot @where='id=$post->ClientID',@cols='EmailInvoice,ContactName';
                SELECT quant,extra,rowobj FROM om.orderrow WHERE userID=$post->ClientID AND orderId IS NULL;
                UPDATE om.items SET om.items.quant=ISNULL(om.items.quant,0)-T.quant FROM om.orderrow T WHERE T.userID=$post->ClientID AND T.orderId IS NULL AND om.items.id = T.itemID;
                UPDATE om.orderrow SET orderId=1,orderedDt=GETDATE() WHERE userID=$post->ClientID AND orderId IS NULL
                ");
            $mailcontent.="<style>.artlist td {padding:5px;}.val{text-align:right;vertical-align:top;white-space:nowrap;}.hdr{background:#eee;color:#666;}</style><table class='artlist' style='border-collapse:collapse;'><tr class=hdr><td style='width:100%;'>Overzicht artikelen</td><td class=val>Prijs</td><td class=val>Aantal</td><td class=val>Subtotaal</td></tr>";
            
            $client = fetch_object($res);
            next_result($res);
            while($row = fetch_object($res)) {
                $obj=json_decode($row->rowobj);
                $tot+=$obj->price*$row->quant;
                $mailcontent.="<tr style='border-bottom:solid 1px #ccc;'><td>".implodeval('<br>',array($obj->name,$obj->subject,$obj->summmary,$row->extra))."</td><td class=val>€ ".$obj->price."</td><td class=val>$row->quant</td><td class=val>€ ".number_format($obj->price*$row->quant,2)."</td></tr>";
            }
            $mailcontent.="<tr class=hdr><td>Totaal</td><td></td><td></td><td class='val' style='color:black;'><b>€ ".number_format($tot,2)."</b></td></tr>";
            $mailcontent.="<table>";
            $msg=(object)array(
                mail=>1,
                FromEmail=>"mailer@aliconnect.nl", FromName=>'Proving.nl',
                ReplyToEmail=>'max@alicon.nl', ReplyToName=>'Max', 
                Basecolor=>"#fafafa",
                Domain=>$post->host,
                Hostname=>$post->host,
                to => array($client->EmailInvoice),
                bcc => array('max.van.kampen@alicon.nl'),
                Subject => 'Bedankt voor je bestelling',
                Summary => 'We gaan direct voor je aan de slag.',
                mailbody => array(
                    array(content=>"Beste $client->ContactName $client->EmailInvoice,"),
                    array(content=>"Bedankt voor uw bestelling. Zodra uw bestelling is gepakt laten we dit weten via een email."),
                    array(content=>utf8_encode($mailcontent)),
                )
            );
            mailsend($msg);
            exit();
        }
        else exit (json_encode(rows(prepareexec("api.$exec",$_POST))));
        exit();
    }
}
?>