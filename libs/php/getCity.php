<?php
$executionStartTime = microtime(true);

$city = $_REQUEST['city'];

$url = 'https://api.opencagedata.com/geocode/v1/json?q='. $city . '&key=3bc501fd169c46028631f3383bbbcd9b';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);
if(isset($decode)){
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['latitude'] = $decode['results'][0]['geometry']['lat'];
    $output['data']['longitude'] = $decode['results'][0]['geometry']['lng'];
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "no data";
    $output['status']['description'] = "No data available";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['status']['url'] = $url;
}
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?>