@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="module-wrapper">
                  <module v-for="(board, index) in boards"
                          :obj="board"
                          v-on:remove="boards.splice(index,1)"></module>
                  <module></module>
                </div>
            </div>
        </div>

    </div>
</div>
@endsection
