<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Redis;
use Illuminate\Http\Request;
use App\Board;
use App\User;
use Uuid;

class boardController extends Controller
{
    public function get($owner, $uuid) {
      $u = User::search($owner);
      $board = Board::open($u->id, $uuid);
      $channel = $board->owner.':'.$board->uuid;
      $imageData = Redis::hget($channel, 'data');
      $board->imageData = $imageData; //this is not part of the DB
      return view('board', compact('board'));
    }

    public function create() {
      Board::make();
    }

    public function save(Request $r) {
      // return $r->id;
      $board = Board::open($r->id, $r->uuid);
      $channel = $board->owner.':'.$board->uuid;
      $imageData = Redis::hget($channel, 'data');
      store_data_uri($imageData, "/i/c/$channel.png");
    }
}
