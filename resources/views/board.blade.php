@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">

        <!-- Side Bar -->

          <div class="toolbar" :style="{width: toolbarWidth+'px'}" v-if='toolbarIsOpen'>

            <div id="mode-paint" class="section" v-on:click="setMode('paint')">
              <i class="fa fa-paint-brush" aria-hidden="true"></i>
            </div>
            <div id="mode-erase" class="section" v-on:click="setMode('erase')">
              <i class="fa fa-eraser" aria-hidden="true"></i>
            </div>
            <div id="mode-pan" class="section" v-on:click="setMode('pan')">
              <i class="fa fa-camera" aria-hidden="true"></i>
            </div>
            @if(Auth::check() && $board->authUser->canEdit)
              <div id="mode-share" class="section" v-on:click="setMode('share')">
                <i class="fa fa-link" aria-hidden="true"></i>
              </div>
            @endif

            <div id="mode-pick"class="section full">
              <div class="color-picker-wrapper">
                <span class="fa-stack fa-lg color-swap" v-on:click="swapColor">
                  <i class="fa fa-long-arrow-left fa-stack-1x" style="left: -9px"></i>
                  <i class="fa fa-long-arrow-down fa-stack-1x" style="top: 9px"></i>
                </span>
                <picker :hex="color.secondary" type="secondary" v-on:updatecolor="updateColor" style="right:-23px;bottom:-18px"></picker>
                <picker :hex="color.primary" type="primary" v-on:updatecolor="updateColor" ></picker>
              </div>
            </div>

          </div>





        <div :style="{width:'calc(100% - '+ toolbarOffset +'px)', float:'right'}">
          <div class="col-sm-12 ">

            @if(Auth::check() && $board->authUser->canEdit)
              <board :blade="{
                uuid: '{{$board->uuid}}',
                owner:'{{$board->owner}}',
                data: '{{$board->imageData}}',
                ownerUsername: '{{\App\User::find($board->owner)->username}}',
                edit: true
              }"></board>
            @else
            <board :blade="{
              uuid: '{{$board->uuid}}',
              owner:'{{$board->owner}}',
              data: '{{$board->imageData}}',
              edit: false
            }"></board>
            @endif




          </div>
        </div>

    </div>
</div>
@endsection
