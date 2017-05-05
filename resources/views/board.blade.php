@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">

        <!-- Side Bar -->
        <div class="col-md-2">
          <span class="fa-stack fa-lg color-swap" v-on:click="swapColor">
            <i class="fa fa-long-arrow-left fa-stack-1x" style="left: -9px"></i>
            <i class="fa fa-long-arrow-down fa-stack-1x" style="top: 9px"></i>
          </span>
          <picker :hex="color.secondary" type="secondary" v-on:updatecolor="updateColor" style="left:30px;top:15px"></picker>
          <picker :hex="color.primary" type="primary" v-on:updatecolor="updateColor" ></picker>
        </div>



        <div class="col-md-8">
          {{$board->owner.':'.$board->uuid}}








          <board :blade="{
            uuid: '{{$board->uuid}}',
            owner:'{{$board->owner}}',
            data: '{{$board->imageData}}'
          }"></board>
        </div>
    </div>
</div>
@endsection
