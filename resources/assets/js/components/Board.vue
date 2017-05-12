<template>
    <div>

      <div class="canvas-wrapper" >
        <canv :data='Public' v-on:user="updateUser"></canv>
      </div>


      <div class="nameModal" v-if="Private.showShare">
        <div class="modal-body">
          <form action="/board/create" method="post">
                <div class="form-group">
                  <label>Ulimited</label>
                  <div class="input-group">
                    <input id="forever-code" type="text" class="form-control" :value="Misc.getKey('forever')">
                    <div class="input-group-btn">
                      <button data-clipboard-target="#forever-code" type="button" class="clipboard btn btn-primary" >Copy</button>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <label>Image URL</label>
                  <div class="input-group">
                    <input id="image-url" type="text" class="form-control" :value="Misc.getKey('imageurl')">
                    <div class="input-group-btn">
                      <button data-clipboard-target="#image-url" type="button" class="clipboard btn btn-primary" >Copy</button>
                    </div>
                  </div>
                </div>
          </form>
        </div>
      </div>
      <div class="nameModal-background" v-if="Private.showShare" v-on:click="Misc.toggleShare"></div>

      <div class="nameModal" v-if="Private.showClear">
        <div class="modal-header">
          <h3>Are you sure you would like to clear the canvas?</h3>
        </div>
        <div class="modal-body">
          <form action="/board/create" method="post">
                <div class="pull-right">
                  <button type="button" class="btn btn-default btn-lg" v-on:click="Misc.toggleClear">Cancel</button>
                  <button type="button" class="btn btn-danger btn-lg" v-on:click="Misc.toggleClear('submit')"><i class="fa fa-trash-o" aria-hidden="true"></i> Yes</button>
                </div>

          </form>
        </div>
      </div>
      <div class="nameModal-background" v-if="Private.showClear" v-on:click="Misc.toggleClear"></div>

    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    var Self
    var Private
    var Public
    var Paint = require('./methods/Paint.js')
    var Move = require('./methods/Move.js')
    var Zoom = require('./methods/Zoom.js')
    var Misc = require('./methods/Misc.js')

    export default {
        props: ['blade'],

        components: {
            draggable,
        },

        data() {
          return {
            Misc: {},

            Public: {
              channel: this.blade.owner + ':' + this.blade.uuid,
              owner: this.blade.owner,
              uuid: this.blade.uuid,
              ownerUsername: this.blade.ownerUsername,
              temp: '',
              forever: '',
              user: {
                username: '',
                color: '#000',
                lineWidth: 10,
                blendMode: 'source-over'
              },
            },
            Private: {
              users: [],
              mode: '',
              showShare: false,
              showClear: false
            },

          }
        },
        mounted() {
          Self = this
          Public = Self.Public
          Private = Self.Private


          Public.user.username = this.blade.user
          Self.Misc = Misc

          socket.emit('user:connected', Public)

          socket.on(`user:connected:${Public.channel}`, function (io) {
            Private.users = $.map(io, function (value, index){

              if (value != 'false') {
                return [JSON.parse(value)]
              }
            })
          })
          // Public.channel =
        },

        methods: {
          updateUser: function () {
          },
          zindex: function (i) {
            return Private.Users.length - i
          }

        },


        watch: {
          '$parent.color.selected': function (val) {
            Public.user.color = val
          },
          '$parent.mode': function (val, oldVal) {
            Private.mode = val
            if (val == 'paint')       {Public.user.blendMode = 'source-over'}
            if (val == 'erase')       {Public.user.blendMode = 'destination-out'}
            if (val == 'brush-plus')  {Misc.brushSize(Self, '+');Self.$parent.setMode(oldVal)}
            if (val == 'brush-minus') {Misc.brushSize(Self, '-');Self.$parent.setMode(oldVal)}
            if (val == 'clear')       {Private.showClear = !Private.showClear; Self.$parent.setMode(oldVal)}
            if (val == 'share')       {Private.showShare = !Private.showShare; Self.$parent.setMode(oldVal)}
          }
        }
    }
</script>
