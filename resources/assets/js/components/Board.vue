<template>
    <div>
      {{Private.users}}
      <!-- <ul class="list-group"> -->
      <!-- <draggable :list="Private.users" >
          <li class="list-group-item" v-for="(element, index) in Private.users">[{{index}}]: {{element}}</li>
      </draggable> -->

      <div class="canvas-wrapper" >
        <canv :data='Public' v-on:user="updateUser"></canv>
      </div>

      <!-- </ul> -->
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
              user: {
                username: '',
                xs: {},
                ys: {},
                color: '',
                lineWidth: '',
                blendMode: ''
              },
            },
            Private: {
              users: []
            },

          }
        },
        mounted() {
          Self = this
          Public = Self.Public
          Private = Self.Private

          Public.user.username = this.blade.user
          console.log(Public.user.username);

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
            console.log('hhlkjl');
          },
          zindex: function (i) {
            return Private.Users.length - i
          }

        },


        watch: {

        }
    }
</script>
