<template>

  <div>
    <canvas :id="'canvas-'+_uid" :width="1920" :height="1080"  v-drag="dragging"></canvas>
    <canvas :id="'camera-'+_uid" :width="1920" :height="1080" class="camera"></canvas>
  </div>

</template>

<script>
    var Self
    var Private
    var Mode
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
              }
            }

          }
        },
        mounted() {
          Self = this;
          Private = Self.Private
          Private.id = Self._uid
          Paint.Load(Self)
          Private.prop = Self.data
          Self.img = new Image;
          Private.mode = Self.$parent.$parent.mode

          Self.update(Private.prop.user)

          Misc.redraw(Self.$parent.blade.data);


          Self.$nextTick(function() {
            window.addEventListener('resize', Self.resize, false)
            window.addEventListener('orientationchange', Self.resize, false)
            // Self.resize();
          })

          socket.on(`draw:${Private.prop.channel}`, function (io) {
            Paint.draw(io)
          })
          socket.on(`show:clear:confirm:${Private.prop.channel}`, Misc.Clear)
        },


        methods: {
          dragStart: function (e, io=null) {
              Mode = Self.$parent.$parent.mode
              if (Mode != 'pan') e.preventDefault()
              if (Mode == 'paint') Paint.Start(e)
          },
          dragging: function (e, io=null) {
              if (Mode != 'pan') e.preventDefault()
              if (Mode == 'paint') Paint.ing(e)
          },
          dragEnd: function (e, io=null) {
              if (Mode != 'pan') e.preventDefault()
              if (Mode == 'paint') Paint.End(e)
          },

          update: function (obj) {
            Private.canvas = document.getElementById('canvas-' + Private.id)
            Private.ctx = Misc.getContext(Private.canvas, obj)
            Private.camera.canvas = document.getElementById('camera-' + Private.id)
            Private.camera.ctx = Misc.getContext(Private.camera.canvas, obj)

            Private.canvas.bind()
          },

          resize: function(){
            var ratio = Private.height / Private.width
            Private.cssWidth = Private.canvas.clientWidth
            Private.cssHeight = $('.canvas-wrapper').width() * ratio

            // if (Private.data) {
            Private.data = Private.camera.canvas.toDataURL('image/png')
            Misc.redraw(Private.data);
            // }
          },
        },

        watch: {
          camera: {
            handler: function (val, oldVal) {
              if (Private.data) {
                Misc.redraw(Private.data);
              }else {
                Misc.redraw(Self.$parent.blade.data)
              }
            },
            deep: true
          },
          'Public.blendMode': function () {
            Private.ctx = Misc.getContext(Private.canvas)
            Private.camera.ctx = Misc.getContext(Private.camera.canvas)
          }

        }
    }
</script>
