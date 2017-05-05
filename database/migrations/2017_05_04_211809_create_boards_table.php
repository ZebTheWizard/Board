<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBoardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('boards', function (Blueprint $table) {
          $table->increments('id');
          $u = $table->uuid('uuid')->unique();
          $table->integer('owner');
          $table->string('name')->nullable();
          $table->string('image')->default('/image/blank.png');

          $table->timestamps();
          $table->softDeletes();
          $u->collation = 'utf8_bin';
          // $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('boards');
    }
}
