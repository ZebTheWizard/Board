@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    You are logged in!
                </div>

                <picker :hex="color.primary" type="primary" v-on:updatecolor="updateColor"></picker>
                <picker :hex="color.secondary" type="secondary" v-on:updatecolor="updateColor"></picker>
                <board ></board>
                <board ></board>
                <board ></board>
            </div>
        </div>
    </div>
</div>
@endsection
