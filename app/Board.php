<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Uuid;
use Auth;

class Board extends Model
{
    public $incrementing = false;

    protected $fillable = [
        'uuid', 'owner'
    ];

    public static function make(){
      if (!Auth::check()) abort(501);
      return Board::firstOrCreate([
        "owner" => Auth::id(),
        "uuid" => rand_64(11)
      ]);
    }

    public static function open($owner, $uuid) {
      $b = Board::where('uuid', $uuid)->where('owner', $owner)->get();
      if ($b->count() != 1) abort(404); //if this happens, we're in deep shit.
      return $b[0];
    }
}
