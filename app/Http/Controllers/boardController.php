<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Redis;
use Illuminate\Http\Request;
use Exception;
use App\Board;
use stdClass;
use App\User;
use Image;
use Uuid;
use Auth;

class boardController extends Controller
{
    public function get($owner, $uuid) {
      $u = User::search($owner);
      $board = Board::open($u->id, $uuid);
      $channel = $board->owner.':'.$board->uuid;
      $imageData = Redis::hget($channel, 'data');
      $board->imageData = $imageData; //this is not part of the DB
      try {
        $board->authUser = $board->users()->where('id', Auth::id())->first()->pivot;
      } catch (Exception $e) {
        $board->authUser = (object) array(
          'canEdit' => null,
          'isOwner' => null
        );
      }
      // $board->users()->where('id', Auth::id())->first()->pivot->canEdit;
      return view('board', compact('board'));
    }

    public function create(Request $r) {
      $b = Board::make($r->name);
      $u = Auth::user();
      $b->users()->save($u, ['isOwner' => True, 'canEdit' =>True]);
      return redirect("/".Auth::user()->username."/$b->uuid");
    }

    public function save(Request $r) {
      // return $r->id;
      $board = Board::open($r->id, $r->uuid);
      $channel = $board->owner.':'.$board->uuid;
      $imageData = Redis::hget($channel, 'data');
      $board->image = store_data_uri($imageData, "/i/c/$channel.png");
      $board->save();
    }

    public function delete(Request $r){
      $b = Board::find($r->id);
      $b->delete();
    }

    public function boards(Request $r) {
      if (Auth::check()) {
        $data = [
          "boards" => Auth::user()->boards()->get(),
        ];
        foreach ($data['boards'] as $board) {
          $channel = $board->owner.':'.$board->uuid;
          $imageData = Redis::hget($channel, 'data');
          if ($imageData) {
            $board->image = store_data_uri($imageData, "/i/c/$channel.png");
          }else {
            $board->image = '/image/blank.png';
          }
          $board->save();
          $board->username = User::find($board->owner)->username;
        }
        return $data;
      }

    }


    public function join ($username, $share) {
      $u = User::search($username);
      if (Auth::check()){
        $b = Board::open($u->id, $share);
        try {
          $b->users()->save(Auth::user(), ['isOwner' => False, 'canEdit' =>True]);
          return redirect("/".$username."/$b->uuid");
        } catch (Exception $e) {
          return redirect("/".$username."/$b->uuid");
        }
      } else {
        abort(501);
      }
    }

    public function share (Request $r) {
      $b = Board::open($r->owner, $r->uuid);
      return $b;
    }

    public function clear (Request $r) {
      // return $r->channel;
      Redis::del($r->channel);
      return;
    }

    public function imageAPI ($username, $uuid) {
      $u = User::search($username);
      $b = Board::open($u->id, $uuid);
      return Image::make(public_path($b->image))->response('png');
    }
}
