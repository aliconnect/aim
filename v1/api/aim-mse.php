<?php
//$UID = "aimWrite";$PWD = "Al!c0nWr!te"; $dbname='AIM16';
require_once (__DIR__.'/connect.php');
session_start();
if (!$userId) {
    if (isset($_GET[userId])) $userId = $_GET[userId];
    else $userId = $_COOKIE['loginUserId'];
}

//$userId = 265091;

//$accessToken = $_SESSION['access_token'];
//$userEmail = $_SESSION['mse_user_email'];
//$refreshToken = $_SESSION['mse_refresh_token'];

$redirectUri = "https://aliconnect.nl/aim/v1/api/aim-mse.php";

class mse {

    //https://account.live.com/Consent/Update?ru=https://login.live.com/oauth20_authorize.srf%3flc%3d1043%26lc%3d1043%26response_type%3dcode%26client_id%3d32613fc5-e7ac-4894-ac94-fbc39c9f3e4a%26redirect_uri%3dhttps:%252f%252foauthplay.azurewebsites.net%252f%26scope%3dopenid%2boffline_access%2bhttps:%252f%252foutlook.office.com%252fmail.read%2bhttps:%252f%252foutlook.office.com%252fcalendars.read%2bhttps:%252f%252foutlook.office.com%252fcontacts.read%26state%3dd3aa22b0-1eae-434a-82f7-af33996f8d2d%26login_hint%3dmax.van.kampen%2540hotmail.com%26ui_locales%3dnl-NL%26display%3dpage%26issuer%3dmso%26msproxy%3d1%26flowtoken%3dDdv5SSEAUI5zVaoQlnP4hZLWpQVWMFLKvHSDweRQ*JBZ3EHeVZxgVGeT4SqcDxBrY0C!*1h0195zosj12Gx34v3F3!5xeE1eT3efImCRAt9BbjyXsw6b3ebXR6w8f0eC!ttAYOSKJzypfJd0CPUravNVeZ32rofTORRjQIOOU1QoB54ixV!rOG30L61qileKMB5cKSOQkWkHnSDxdzQiEfU%2524%26uaid%3dae3d6b1cdc064cb885271a2e4c745d51%26pid%3d15216%26mkt%3dNL-NL%26scft%3dDUcXmAtMraLg9uSuhCH3hJOL0p2yqvFBcfDVtQd6lWV2pjENK2yTfJt0NAqqNx8!STQKrT8smxkvI2YfqIDAzTQmH8jooGC6gUA03i!EbpgMvvGh8nDjqUsqr7v747l4Hq4YbhaXMiCX*cPk5!hJvrlEAL20tewT76hwW7ADJOAi&mkt=NL-NL&uiflavor=web&id=292841&client_id=0000000040160CFB&rd=oauthplay.azurewebsites.net&scope=int.idtoken+int.offline_access+mail.read+calendars.read+contacts.read&cscope=

    //https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=32613fc5-e7ac-4894-ac94-fbc39c9f3e4a&redirect_uri=https:%2f%2foauthplay.azurewebsites.net%2f&scope=openid+offline_access+https:%2f%2foutlook.office.com%2fmail.read+https:%2f%2foutlook.office.com%2fcalendars.read+https:%2f%2foutlook.office.com%2fcontacts.read&state=9225575c-0632-4219-8457-a5aadc567a81&prompt=login
    //https://login.live.com/oauth20_authorize.srf?response_type=code&client_id=32613fc5-e7ac-4894-ac94-fbc39c9f3e4a&redirect_uri=https:%2f%2foauthplay.azurewebsites.net%2f&scope=openid+offline_access+https:%2f%2foutlook.office.com%2fmail.read+https:%2f%2foutlook.office.com%2fcalendars.read+https:%2f%2foutlook.office.com%2fcontacts.read&state=b34f4848-9215-459b-84aa-8adcce027b74&prompt=login&login_hint=max.van.kampen%40hotmail.com&ui_locales=nl-NL&display=page&uaid=5545ce6030f8494eb0dffe46063977fb&issuer=mso&msproxy=1

    //https://login.live.com/oauth20_authorize.srf?response_type=code&client_id=dbe33720-2489-470f-941f-e91b58030900&redirect_uri=https:%2F%2Fwww.aliconnect.nl%2Faim%2Faim-mse.php&scope=openid+offline_access+profile+email+https%3A%2F%2Foutlook.office.com%2Fmail.readwrite+https%3A%2F%2Foutlook.office.com%2Fcalendars.readwrite+https%3A%2F%2Foutlook.office.com%2Fcontacts.readwrite+https%3A%2F%2Foutlook.office.com%2Fpeople.read&prompt=login&login_hint=max.van.kampen%40hotmail.com&ui_locales=nl-NL&display=page&uaid=58ebac73b44443a18993a42e9299b21f&issuer=mso&msproxy=1


    private static $clientId = "24622611-2311-4791-947c-5c1d1b086d6c";
    private static $clientSecret = "dYXDz61vOFtGr4O06p42wA4";
    //private static $clientId = "dbe33720-2489-470f-941f-e91b58030900";
    //private static $clientSecret = "mbAUTFn7q8XJEy5KFnxTUe6";
    private static $authority = "https://login.microsoftonline.com";
    private static $authorizeUrl = '/common/oauth2/v2.0/authorize?response_type=code&client_id=%1$s&redirect_uri=%2$s&prompt=login&scope=%3$s';
    private static $tokenUrl = "/common/oauth2/v2.0/token";
    private static $outlookApiUrl = "https://outlook.office.com/api/v2.0";
    //private static $redirectUri = "https://www.aliconnect.nl/aim/api/v0/mse.php";
    // The app uses the following scopes
    private static $scopes = array("openid","offline_access","profile","email","https://outlook.office.com/mail.readwrite","https://outlook.office.com/calendars.readwrite","https://outlook.office.com/contacts.readwrite","https://outlook.office.com/people.read");
    public static function getLoginUrl() {
        // Build scope string. Multiple scopes are separated
        // by a space
        $scopestr = implode(" ", self::$scopes);
        $loginUrl = self::$authority.sprintf(self::$authorizeUrl, self::$clientId, urlencode($GLOBALS[redirectUri]), urlencode($scopestr));
        error_log("Generated login URL: ".$loginUrl);
        return $loginUrl;
    }
    public static function setUserData($json_vals) {
        global $accessToken,$refreshToken,$userEmail,$userId;
        $profile = self::getProfile($json_vals['id_token']);
        $accessToken = $json_vals['access_token'];
        $userEmail = $profile[preferred_username];
        $refreshToken = $json_vals['refresh_token'];
        $_SESSION['access_token'] = $accessToken;
        $_SESSION['mse_refresh_token'] = $refreshToken;
        $_SESSION['mse_user_email'] = $userEmail;
        //$q="UPDATE auth.users SET mse_access_token = '$accessToken',mse_refresh_token = '$refreshToken',mse_name = '".$profile[name]."' ,mse_email = '$userEmail ' WHERE id = $userId";
        $q="UPDATE auth.users SET mse_access_token = '$accessToken',mse_refresh_token = '$refreshToken',mse_name = '".$profile[name]."' ,mse_email = '$userEmail' FROM auth.email E WHERE auth.users.id = E.id AND E.email = '$userEmail'";
        //echo $q;
        query($q);
        //echo '<plaintext>';var_dump($json_vals);
    }
    public static function getTokenFromAuthCode($authCode) {
        global $accessToken,$refreshToken,$userEmail,$userId;
        // Build the form data to post to the OAuth2 token endpoint
        $token_request_data = array(
            "grant_type" => "authorization_code",
            "code" => $authCode,
            "redirect_uri" => $GLOBALS[redirectUri],
            "scope" => implode(" ", self::$scopes),
            "client_id" => self::$clientId,
            "client_secret" => self::$clientSecret
        );
        //echo "asdfas";
        // Calling http_build_query is important to get the data formatted as expected.
        $token_request_body = http_build_query($token_request_data);
        error_log("Request body: ".$token_request_body);
        $curl = curl_init(self::$authority.self::$tokenUrl);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $token_request_body);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($curl);



        //echo $response;
        error_log("curl_exec done.");
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        error_log("Request returned status ".$httpCode);
        if ($httpCode >= 400) {return array('errorNumber' => $httpCode, 'error' => 'Token request returned HTTP error '.$httpCode);}
        // Check error
        $curl_errno = curl_errno($curl);
        $curl_err = curl_error($curl);
        if ($curl_errno) {
            $msg = $curl_errno.": ".$curl_err;
            error_log("CURL returned an error: ".$msg);
            return array('errorNumber' => $curl_errno,'error' => $msg);
        }
        curl_close($curl);
        ///echo "<plaintext>";
        // The response is a JSON payload, so decode it into an array.
        $json_vals = json_decode($response, true);
        error_log("TOKEN RESPONSE:");
        foreach ($json_vals as $key=>$value) {
            error_log("  ".$key.": ".$value);
            //echo "  ".$key.": ".$value.PHP_EOL;
        }
        //var_dump($json_vals);
        if ($json_vals['access_token']) {
            self::setUserData($json_vals);
            // Redirect back to home page
            header("Location: /?account=view");
        }
        return $json_vals;
    }
    public static function getRefreshToken() {
        global $accessToken,$refreshToken,$userEmail,$userId;
        $accessToken=null;
        $token_request_data = array(
            "grant_type" => "refresh_token",
            'refresh_token'=> $refreshToken,
            "redirect_uri" => $GLOBALS[redirectUri],
            //"resource" => "https://www.aliconnect.nl",
            "client_id" => self::$clientId,
            "client_secret" => self::$clientSecret
        );
        //echo '<plaintext>';
        //var_dump($token_request_data);
        // Calling http_build_query is important to get the data formatted as expected.
        $token_request_body = http_build_query($token_request_data);
        error_log("Request body: ".$token_request_body);
        $curl = curl_init(self::$authority.self::$tokenUrl);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $token_request_body);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($curl);
        //var_dump($response);
        error_log("curl_exec done.");
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        error_log("Request returned status ".$httpCode);
        if ($httpCode >= 400) {return array('errorNumber' => $httpCode, 'error' => 'Token request returned HTTP error '.$httpCode);}
        // Check error
        $curl_errno = curl_errno($curl);
        $curl_err = curl_error($curl);
        if ($curl_errno) {
            $msg = $curl_errno.": ".$curl_err;
            error_log("CURL returned an error: ".$msg);
            return array('errorNumber' => $curl_errno,'error' => $msg);
        }
        curl_close($curl);
        // The response is a JSON payload, so decode it into an array.
        $json_vals = json_decode($response, true);
        error_log("TOKEN RESPONSE:");
        foreach ($json_vals as $key=>$value) {
            error_log("  ".$key.": ".$value);
        }
        if ($json_vals['access_token']) {
            self::setUserData($json_vals);
            //header("Location: /?account=view");
        }
        //return $json_vals;
        return $response;
    }
    public static function getProfile($idToken) {
        $token_parts = explode(".", $idToken);
        $token = strtr($token_parts[1], "-_", "+/");
        $jwt = base64_decode($token);
        $json_token = json_decode($jwt, true);
        return $json_token;
    }
    // This function generates a random GUID.
    public static function makeGuid(){
		if (function_exists('com_create_guid')) {
			error_log("Using 'com_create_guid'.");
			return strtolower(trim(com_create_guid(), '{}'));
		}
		else {
			error_log("Using custom GUID code.");
			$charid = strtolower(md5(uniqid(rand(), true)));
			$hyphen = chr(45);
			$uuid = substr($charid, 0, 8).$hyphen.substr($charid, 8, 4).$hyphen.substr($charid, 12, 4).$hyphen.substr($charid, 16, 4).$hyphen.substr($charid, 20, 12);
			return $uuid;
		}
    }
    public static function getUserToken() {
        global $accessToken,$refreshToken,$userEmail,$userId;
        $post=(object)$_POST;
        $q="SET NOCOUNT ON;DECLARE @UserID INT;";
        if ($userId) $q.="SET @UserID=$userId;";
        else $q.="SELECT @UserID=userID FROM api.getHostAccount('$post->host','$post->sessionID');";
        $q.="SELECT @UserID UserID,mse_access_token,mse_email,mse_refresh_token FROM auth.users WHERE id=@UserID";
        //$q="SELECT 'fdsfasdfas' as mse_access_token";
        //echo $q;
        $row = fetch_object(query($q));
        //var_dump($row);
        $accessToken = $row->mse_access_token;
        $userEmail = $row->mse_email;
        $refreshToken = $row->mse_refresh_token;
        $userId = $_POST[UserID] = $row->UserID;
        $_SESSION['access_token'] = $accessToken;
        $_SESSION['mse_refresh_token'] = $userEmail;
        $_SESSION['mse_user_email'] = $refreshToken;
        //echo "$userId : $userEmail\r\n<br>ACCESS: '.$accessToken\r\n<br>REFRESH: $refreshToken\r\n<br>";
    }
    public static function makeApiCall($method, $url, $payload = NULL) {
        global $accessToken,$refreshToken,$userEmail,$userId;
        // Generate the list of headers to always send.
        //echo $accessToken;
        $headers = array(
            "User-Agent: php-tutorial/1.0",                     // Sending a User-Agent header is a best practice.
            "Authorization: Bearer ".$accessToken,        // Always need our auth token!
            "Accept: application/json",                         // Always accept JSON response.
            "client-request-id: ".self::makeGuid(),             // Stamp each new request with a new GUID.
            "return-client-request-id: true",                   // Tell the server to include our request-id GUID in the response.
            "X-AnchorMailbox: ".$userEmail                 // Provider user's email to optimize routing of API call
        );
        //var_dump ($header);
        $curl = curl_init($url);
        switch(strtoupper($method)) {
            case "GET":
                // Nothing to do, GET is the default and needs no
                // extra headers.
                error_log("Doing GET");
                break;
            case "POST":
                error_log("Doing POST");
                // Add a Content-Type header (IMPORTANT!)
                $headers[] = "Content-Type: application/json";
                curl_setopt($curl, CURLOPT_POST, true);
                curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
                break;
            case "PATCH":
                error_log("Doing PATCH");
                // Add a Content-Type header (IMPORTANT!)
                $headers[] = "Content-Type: application/json";
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
                curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
                break;
            case "DELETE":
                error_log("Doing DELETE");
                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
                break;
            default:
                error_log("INVALID METHOD: ".$method);
                exit;
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($curl);
        error_log("curl_exec done.");
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        error_log("Request returned status ".$httpCode);
        if ($httpCode == 401) {
            self::getRefreshToken();
            if ($accessToken) self::makeApiCall($method, $url, $payload);
            return ;
        }
        else if ($httpCode >= 400) { return array('errorNumber' => $httpCode, 'error' => 'Request returned HTTP error '.$httpCode); }
        $curl_errno = curl_errno($curl);
        $curl_err = curl_error($curl);
        if ($curl_errno) {
            $msg = $curl_errno.": ".$curl_err;
            error_log("CURL returned an error: ".$msg);
            curl_close($curl);
            return array('errorNumber' => $curl_errno, 'error' => $msg);
        }
        else {
            error_log("Response: ".$response);
            curl_close($curl);
            return json_decode($response, true);
        }
    }
    public static function getFolder($folder, $Parameters) {
        foreach ($Parameters as $key => $value) if (in_array($key,array(startDateTime,endDateTime))) $getMessagesParameters[$key]=$value; else $getMessagesParameters["\$".$key]=$value;
        //foreach ($Parameters as $key => $value) $getMessagesParameters[$key]=utf8_decode($value);
        $getMessagesUrl = self::$outlookApiUrl."/me/$folder?".http_build_query($getMessagesParameters);
        echo $getMessagesUrl.PHP_EOL;
        return self::makeApiCall("GET", $getMessagesUrl);
    }
    public static function getMsg($folder, $msg) {
        $getMessagesUrl = self::$outlookApiUrl."/me/$msg";
        echo "<PLAINTEXT>".$getMessagesUrl.PHP_EOL;
        return self::makeApiCall("GET", $getMessagesUrl);
    }
    public static function getFolderPeople($Parameters) {
        foreach ($Parameters as $key => $value) $getMessagesParameters["\$".$key]=$value;
        $getMessagesUrl = "https://outlook.office.com/api/beta/me/people?".http_build_query($getMessagesParameters);
        return self::makeApiCall("GET", $getMessagesUrl);
    }
    public static function getObject($folder,$id) {
        $getMessagesUrl = self::$outlookApiUrl."/me/$folder/$id";
        return self::makeApiCall("GET", $getMessagesUrl);
    }
    public static function getAttachement($id,$fileId) {
        $getMessagesUrl = self::$outlookApiUrl."/me/messages/$id/attachments/$fileId";
        return self::makeApiCall("GET", $getMessagesUrl);
    }
    public static function getAttachements($id,$Parameters) {
        foreach ($Parameters as $key => $value) $getMessagesParameters["\$".$key]=$value;
        $getMessagesUrl = self::$outlookApiUrl."/me/messages/$id/attachments?".http_build_query($getMessagesParameters);
        //echo "<PLAINTEXT>".$getMessagesUrl.PHP_EOL;
        return self::makeApiCall("GET", $getMessagesUrl);
    }
    public static function setObject($folder,$id,$json_data) {
        $getMessagesUrl = self::$outlookApiUrl."/me/$folder/$id";
		return self::makeApiCall("PATCH", $getMessagesUrl, json_encode($json_data));
    }
    public static function insertObject($folder,$json_data) {
        $getMessagesUrl = self::$outlookApiUrl."/me/$folder";
        $data = json_encode($json_data);
		return self::makeApiCall("POST", $getMessagesUrl, $data);
    }
    public static function deleteObject($folder,$id) {
        $getMessagesUrl = self::$outlookApiUrl."/me/$folder/$id";
		return self::makeApiCall("DELETE", $getMessagesUrl, $data);//'{"GivenName": "Pavel","Surname": "Bansky","EmailAddresses": [{"Address": "pavelb@a830edad9050849NDA1.onmicrosoft.com","Name": "Pavel Bansky"}],"BusinessPhones": ["+1 732 555 0102"]}');
    }
    public static function subscribe($authCode) {
        global $accessToken,$refreshToken,$userEmail,$userId;
        $data = array(
            "@odata.type"=>"#Microsoft.OutlookServices.PushSubscription",
            "Resource"=>"https://outlook.office.com/api/v2.0/me/events",
            "NotificationURL"=>$GLOBALS[redirectUri],
            "ChangeType"=>"Created",
            "ClientState"=>"c75831bd-fad3-4191-9a66-280a48528679"
        );
        $data_string = json_encode($data);
        // Calling http_build_query is important to get the data formatted as expected.
        //$data_string = json_encode($data);
        $body = http_build_query($data);
        error_log("Request body: ".$body);
        //$curl = curl_init(self::$authority.self::$tokenUrl);
        $curl = curl_init("https://outlook.office.com/api/v2.0/me/subscriptions");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $body);
        curl_setopt($curl , CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string)
            )
        );
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($curl);
        echo $response;
        error_log("curl_exec done.");
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        error_log("Request returned status ".$httpCode);
        if ($httpCode >= 400) {return array('errorNumber' => $httpCode, 'error' => 'Token request returned HTTP error '.$httpCode);}
        // Check error
        $curl_errno = curl_errno($curl);
        $curl_err = curl_error($curl);
        if ($curl_errno) {
            $msg = $curl_errno.": ".$curl_err;
            error_log("CURL returned an error: ".$msg);
            return array('errorNumber' => $curl_errno,'error' => $msg);
        }
        curl_close($curl);
        echo array('errorNumber' => $curl_errno,'error' => $msg);
        echo "KLAAR";
        return $json_vals;
    }
    public static function subscribe1() {
        global $accessToken,$refreshToken,$userEmail,$userId;
        // Build the form data to post to the OAuth2 token endpoint
        $token_request_data = array(
            "@odata.type"=>"#Microsoft.OutlookServices.PushSubscription",
            "Resource"=>"https://outlook.office.com/api/v2.0/me/events",
            "NotificationURL"=>$GLOBALS[redirectUri],
            "ChangeType"=>"Created",
            "ClientState"=>"c75831bd-fad3-4191-9a66-280a48528679"
        );
        $token_request_data = array(
            "grant_type" => "authorization_code",
            "code" => $authCode,
            "redirect_uri" => $GLOBALS[redirectUri],
            "scope" => implode(" ", self::$scopes),
            "client_id" => self::$clientId,
            "client_secret" => self::$clientSecret
        );
        // Calling http_build_query is important to get the data formatted as expected.
        $token_request_body = http_build_query($token_request_data);
        error_log("Request body: ".$token_request_body);
        $curl = curl_init(self::$authority."/api/v2.0/me/subscriptions");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $token_request_body);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($curl);
        echo $response;
        echo "KLAAR";
    }
    public static function validationtoken($token) {
        global $accessToken,$refreshToken,$userEmail,$userId;
        $q="UPDATE om.mse SET mse_validation_token = '$token'";
        query($q);
        // Build the form data to post to the OAuth2 token endpoint
        $token_request_data = array(
            "@odata.context"=>"https://outlook.office.com/api/v2.0/$metadata#Me/Subscriptions/$entity",
            "@odata.type"=>"#Microsoft.OutlookServices.PushSubscription",
            "@odata.id"=>"https://outlook.office.com/api/v2.0/Users('ddfcd489-628b-7d04-b48b-20075df800e5@1717622f-1d94-c0d4-9d74-f907ad6677b4')/Subscriptions('Mjk3QNERDQQ==')",
            "Id"=>"Mjk3QNERDQQ==",
            "Resource"=>"https://outlook.office.com/api/v2.0/me/events",
            "ChangeType"=>"Created, Missed",
            "ClientState"=>"c75831bd-fad3-4191-9a66-280a48528679",
            "NotificationURL"=>$GLOBALS[redirectUri],
            "SubscriptionExpirationDateTime"=>"2016-03-05T22:00:00.0000000Z"
        );
        // Calling http_build_query is important to get the data formatted as expected.
        $token_request_body = http_build_query($token_request_data);
        error_log("Request body: ".$token_request_body);
        $curl = curl_init(self::$authority."/api/v2.0/me/subscriptions");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $token_request_body);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($curl);
        echo $response;
        echo "KLAAR";
    }
}
if (isset($_GET[code])) {
    $res=(object)mse::getTokenFromAuthCode($_GET[code]);
    die(json_encode($res));
    //$res->userID=$aim->userID;
}
else if (isset($_POST[validationtoken])) mse::validationtoken($_POST[validationtoken]);
else if (isset($_GET[getRefreshToken])) {mse::getUserToken(); echo mse::getRefreshToken();}
?>
