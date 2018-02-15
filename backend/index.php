<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');

$cacheFile = 'cache.json';
$today = new DateTime();
$yesterday = new DateTime();
$yesterday->add(DateInterval::createFromDateString('yesterday'));

if (file_exists($cacheFile)) {
    $cachDate = (new DateTime())->setTimestamp(filemtime($cacheFile));
    if ($today->diff($cachDate)->days === 0) {
        echo file_get_contents($cacheFile);
        exit;
    }
}

$url = 'http://app.luis.steiermark.at/luft2/auswertung.php' .
    '?station1=172&station2=&komponente1=125&station3=&station4=&komponente2=' .
    '&von_tag=' . $yesterday->format('j') . '&von_monat=' . $yesterday->format('n') . '&von_jahr=' . $yesterday->format('Y') . '&mittelwert=21' .
    '&bis_tag=' . $today->format('j') . '&bis_monat=' . $today->format('n') . '&bis_jahr=' . $today->format('Y');

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$html = curl_exec($ch);
curl_close($ch);

$dom = new DOMDocument();
$dom->loadHTML($html);

$xpath = new DOMXPath($dom);
$value = $xpath->query('//table[1]//table[3]//tr[4]//td[2]/text()')->item(0)->nodeValue;

$result = ['value' => $value];

$json = json_encode($result);

file_put_contents($cacheFile, $json);

echo $json;
