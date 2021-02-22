<?php
require_once (__DIR__.'/connect.php');
//$db[aim]->dbname='abisingen';
    
//move_uploaded_file($_FILES["file"]["tmp_name"], $_SERVER['DOCUMENT_ROOT'].'/content/bank/tst.csv');

//echo json_encode($_FILES["file"]);
$ext = strtolower(pathinfo($_FILES["file"][name] ,PATHINFO_EXTENSION));
if($ext = strtolower(pathinfo($_FILES["file"][name] ,PATHINFO_EXTENSION)) == "csv") {
	$csv = array_map('str_getcsv', file($_FILES["file"]["tmp_name"]));
	$row=array_shift($csv);
	//$q=array();
	while ($row=array_shift($csv)){
		$datum=$row[0];
		$rec->datum=$row[0]=implode("-",array(substr($datum,0,4),substr($datum,4,2),substr($datum,6,2)));
		$rec->rekening=$row[2];
		$row[6]=str_replace(",",".",$row[6]);
		$rows[$rec->rekening][$rec->datum]=$rows[$rec->rekening][$rec->datum]?:array();
		array_push($rows[$rec->rekening][$rec->datum],$row);
	}
	foreach($rows as $rekening => $days){
		foreach($days as $date => $dayrows){
			//$qval=array();
			foreach($dayrows as $row) {
				foreach ($row as $i=>$val)$row[$i]=dbvalue($val);
				$val=(object)array_combine(array(datum,naam,rekening,Tegenrekening,Code,AfBij,bedrag,MutatieSoort,Mededelingen),$row);
				//array_push($qval,"('".implode("','",array_values($row))."')");
				$q.=PHP_EOL."IF NOT EXISTS(SELECT 0 FROM aliconadmin.dbo.bank WHERE 
					datum='$val->datum' AND
					naam='$val->naam' AND
					rekening='$val->rekening' AND 
					tegenrekening='$val->Tegenrekening' AND 
					code='$val->Code' AND 
					afbij='$val->AfBij' AND 
					afbijbedrag='$val->bedrag' AND 
					mutatiesoort='$val->MutatieSoort' 
					--AND mededelingen='$val->Mededelingen'
					) ".
					"INSERT aliconadmin.dbo.bank (datum,naam,rekening,tegenrekening,code,afbij,afbijbedrag,mutatiesoort,mededelingen) VALUES ('".implode("','",array_values($row))."');";

			}
			//$q.="IF NOT EXISTS(SELECT 0 FROM aliconadmin.dbo.bank WHERE rekening='$rekening' AND datum='$date') BEGIN ".
			//    "INSERT aliconadmin.dbo.bank (datum,naam,rekening,tegenrekening,code,afbij,afbijbedrag,mutatiesoort,mededelingen) VALUES ".implode(",",$qval)." END;";
		}
	}
	//die($q);
	query($q);
	if($_SERVER[HTTP_REFERER])die(header("Location: ".$_SERVER[HTTP_REFERER]));
}


$m = fetch_array(query ("SELECT MAX(BookDt) AS BookDt FROM om.bank"));



    $f=file_get_contents($_FILES["file"]["tmp_name"]);
    $xml = simplexml_load_string($f);
    
    //exit (json_encode($xml));
    //echo $xml->
    $BkToCstmrStmt=$xml->BkToCstmrStmt;
    //$BkToCstmrStmt=$xml->BkToCstmrStmt;
    //exit (json_encode($BkToCstmrStmt[Stmt]));
    //exit(json_encode($BkToCstmrStmt));
//INSERT INTO @T om.bank (IBANc,NtryRef,Amt,CdtDbt,BookDt,ValDt,AccRef,EndToEndId,MndtId,Ustrd,RltdDts,Nm,Ctry,Str,Plc,IBAN2,IBANnm,IBAN,Ccy,BIC) VALUES ";
    
    $Stmt=$BkToCstmrStmt->Stmt;

    foreach ($Stmt->Ntry as $i => $Ntry) {
    //exit (json_encode($Ntry));
        $an=array();
        $av=array();
        $q="
			DECLARE @T TABLE (
				[IBANc] [varchar](100) NULL,
				[NtryRef] [varchar](100) NULL,
				[Amt] [float] NULL,
				[CdtDbt] [char](4) NULL,
				[BookDt] [date] NULL,
				[ValDt] [date] NULL,
				[AccRef] [varchar](250) NULL,
				[EndToEndId] [varchar](250) NULL,
				[MndtId] [varchar](250) NULL,
				[Ustrd] [varchar](250) NULL,
				[RltdDts] [datetime] NULL,
				[Nm] [varchar](250) NULL,
				[Ctry] [varchar](250) NULL,
				[Str] [varchar](250) NULL,
				[Plc] [varchar](250) NULL,
				[IBAN] [varchar](250) NULL,
				[IBANnm] [varchar](250) NULL,
				[IBAN2] [varchar](250) NULL,
				[Ccy] [varchar](250) NULL,
				[BIC] [varchar](250) NULL
			); 
			INSERT INTO @T VALUES ";

            //exit (json_encode($Stmt->Ntry));


        //foreach ($Stmt->Ntry as $i => $Ntry) {
            //exit (json_encode($Ntry));
            if (strtotime($Ntry->BookgDt->Dt)>$m->BookDt)
            if ($Ntry->CdtDbtInd==DBIT) $c=Cdtr; else $c=Dbtr;
            $ar=array(
                //o=>$Ntry,
                IBANc=>(string)$Stmt->Acct->Id->IBAN,
                NtryRef=>(string)$Ntry->NtryRef,
                Amt=>(string)$Ntry->Amt,
                CdtDbt=>(string)$Ntry->CdtDbtInd,
                BookDt=>(string)$Ntry->BookgDt->Dt,
                ValDt=>(string)$Ntry->ValDt->Dt,
                AccRef=>(string)$Ntry->AcctSvcrRef,
                EndToEndId=>(string)$Ntry->NtryDtls->TxDtls->Refs->EndToEndId,
                MndtId=>(string)$Ntry->NtryDtls->TxDtls->Refs->MndtId,
                Ustrd=>dbvalue((string)$Ntry->NtryDtls->TxDtls->RmtInf->Ustrd),
                RltdDts=>(string)$Ntry->NtryDtls->TxDtls->RltdDts->TxDtTm,
                Nm=>(string)$Ntry->NtryDtls->TxDtls->RltdPties->$c->Nm,
                Ctry=>(string)$Ntry->NtryDtls->TxDtls->RltdPties->$c->PstlAdr->Ctry,
                Str=>(string)$Ntry->NtryDtls->TxDtls->RltdPties->$c->PstlAdr->AdrLine[0],
                Plc=>(string)$Ntry->NtryDtls->TxDtls->RltdPties->$c->PstlAdr->AdrLine[1],
                IBAN2=>(string)$Ntry->NtryDtls->TxDtls->RltdPties->$c->Id->OrgId->Othr->Id,
                IBANnm=>(string)$Ntry->NtryDtls->TxDtls->RltdPties->$c->Id->OrgId->Othr->SchmeNm->Cd,
                IBAN=>(string)$Ntry->NtryDtls->TxDtls->RltdPties->{$c.Acct}->Id->IBAN,
                Ccy=>(string)$Ntry->NtryDtls->TxDtls->RltdPties->{$c.Acct}->Ccy,
                BIC=>(string)$Ntry->NtryDtls->TxDtls->RltdAgts->{$c.Agt}->FinInstnId->BIC
            );
            $aw=preg_split('@[\W]+@', $ar[Ustrd]);
            echo "<li>".$ar[Nm]."</li>";
            //exit (json_encode($ar));
            $q1='';
            foreach ($aw as $w) if (is_numeric($w) && $w>10000000 && $w<90000000) $q1.=prepareexec("abisingen.dbo.addbankref",array(NtryRef=>$ar[NtryRef],nr=>$w));
            //exit (json_encode($ar));
            foreach ($ar as $i => $val) $ar[$i]=parvalue($val);
            array_push($av,"(".implode(',',$ar).")");
        //}
        $q=$q.implode(',',$av).";INSERT INTO om.bank SELECT * FROM @T WHERE NtryRef NOT IN (SELECT NtryRef FROM om.bank);".$q1;
        //echo $q;
        query($q);
    }
    //exit();
	if($_SERVER[HTTP_REFERER])die(header("Location: ".$_SERVER[HTTP_REFERER]));
    //$content = file_get_contents($_FILES["file"]["tmp_name"]);
    //$fcsv = explode(PHP_EOL,$content);
    //foreach ($fcsv as $line) {
    //    $r=str_getcsv($line);
    //    $r[9]=date('Y-m-d',strtotime($r[0]));
    //    var_dump($r);
    //}
    //echo $content;
?>
