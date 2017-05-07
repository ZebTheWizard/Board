<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
   use SoftDeletes;
   protected $dates = ['deleted_at'];
    protected $fillable = [
        'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public static function search($user){
      return User::where('username', $user)->firstOrFail();
    }

    public function boards() {
      return $this->belongsToMany('App\Board')->withPivot('isOwner', 'canEdit')->withTrashed();
    }


}
