<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Uuid;
use Auth;

class Board extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'uuid', 'owner', 'name', 'share'
    ];

    public static function make($name){
      if (!Auth::check()) abort(501);
      return Board::firstOrCreate([
        "owner" => Auth::id(),
        "uuid" => rand_64(11),
        "share" => rand_64(20),
        "name" => $name
      ]);
    }

    public static function open($owner, $uuid) {
      if (strlen($uuid) == 11) {
        $b = Board::where('uuid', $uuid)->where('owner', $owner)->get();
      } else if (strlen($uuid) == 20) {
        $b = Board::where('share', $uuid)->where('owner', $owner)->get();
      }
      if ($b->count() != 1) abort(404); //if this happens, we're in deep shit.
      return $b[0];
    }

    public static function user() {
      return $this->belongsToMany('App\User')->wherePivot('isOwner', 1);
    }


    public function users() {
      return $this->belongsToMany('App\User')->withPivot('isOwner', 'canEdit')->withTrashed();
    }
}
