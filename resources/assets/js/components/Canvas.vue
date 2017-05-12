<template>

  <div>
    <canvas :id="'canvas-'+_uid" :width="1920" :height="1080"  v-drag="dragging"></canvas>
    <canvas :id="'camera-'+_uid" :width="1920" :height="1080" class="camera"></canvas>
  </div>

</template>

<script>
    var Self
    var Private
    var Paint = require('./methods/Paint.js')
    var Move = require('./methods/Move.js')
    var Zoom = require('./methods/Zoom.js')
    var Misc = require('./methods/Misc.js')
    export default {
        props: ['data'],
        data() {
          return {
            Private: {
              id: '',
              prop: {},
              img: '',
              x: '',
              y: '',
              id: '',
              canvas: '',
              width: 1920,
              height: 1080,
              ctx: '',
              cssHeight: 0,
              cssWidth: 0,
              data: '',
              scale: 1,
              camera: {
                x: 0,
                y: 0,
                canvas: '',
                ctx: ''
              },
            }

          }
        },
        mounted() {
          Self = this;
          Private = Self.Private
          Private.id = Self._uid
          Paint.Load(Self)

          Private.prop = Self.data
          Private.canvas = document.getElementById('canvas-' + Private.id)
          Private.ctx = Misc.getContext(Private.canvas)
          Private.camera.canvas = document.getElementById('camera-' + Private.id)
          Private.camera.ctx = Misc.getContext(Private.camera.canvas)

          Private.canvas.bind()

          socket.on(`draw:${Private.prop.channel}`, function (io) {
            console.log(io);
            Paint.draw(io)
          })
        },


        methods: {
          dragStart: function (e, io=null) {
              Paint.Start(e)
          },
          dragging: function (e, io=null) {
              Paint.ing(e)
          },
          dragEnd: function (e, io=null) {
              Paint.End(e)
          },
        }
    }
</script>
