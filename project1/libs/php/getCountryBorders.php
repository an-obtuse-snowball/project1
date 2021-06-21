
<?php

$executionStartTime = microtime(true);

$url='https://michaelsnow.xyz/project1/libs/js/countryBorders.json';

//
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

        //Loop through the results of the JSON array and creating a new index by the ISO code
        foreach($decode["features"] as $countrydata) {
            $newdata[$countrydata]["properties"]["iso_a2"] = $countrydata;
        }
        $output['data'] = $newdata[$iso];
        //$output['data'] = $decode;
    
} else {
    $output['status']['code'] = "500";
    $output['status']['name'] = "no data";
    $output['status']['description'] = "No data available";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
}

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?>