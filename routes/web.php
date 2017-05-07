<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/image/blank.png', function() {
  return Image::canvas(1, 1, 'rgba(0, 0, 0, 0)')->response('png');
});

Route::post('/board/create', 'boardController@create');
Route::post('/board/save', 'boardController@save');
Route::post('/board/delete', 'boardController@delete');
Route::post('/boards/get', 'boardController@boards');
Route::post('/share', 'boardController@share');

Route::get('/join/{username}/{share}', 'boardController@join');
Route::get('/{owner}/{id}', 'boardController@get');


Auth::routes();
Route::get('/i/{username}/{uuid}', 'boardController@imageAPI');
Route::get('/home', 'HomeController@index')->name('home');
