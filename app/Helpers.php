<?php

function rand_64($length){
  return substr(base64_encode(bcrypt(mt_rand())), 9, $length);
}

function store_data_uri($dataURI, $path) {
  $exploded = explode(',', $dataURI);
  $decodedDataURI = base64_decode($exploded[1]);
  $img = Image::make($decodedDataURI);
  $img->save(public_path($path));
  return $path;
}
