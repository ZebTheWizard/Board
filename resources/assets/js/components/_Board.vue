<template>
    <div>
        <div class="canvas-wrapper" >

          <div class="alert alert-warning alert-dismissible" role="alert" v-if="!blade.edit">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            You are currently in <strong>View-Only</strong> mode.
          </div>

          <canvas :id="'canvas-'+_uid" :width="Private.width" :height="Private.height"  v-drag="dragging"></canvas>
        </div>
        <canvas :id="'camera-'+_uid" :width="Private.width" :height="Private.height" class="camera"></canvas>

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
                  <!-- /.col-lg-6 -->
            </form>
          </div>

          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-default" v-on:click="toggleShare">Close</button>
          </div> -->

        </div>
        <div class="nameModal-background" v-if="Private.showShare || Private.showClear" v-on:click="Misc.toggleShare"></div>


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

          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-default" v-on:click="toggleShare">Close</button>
          </div> -->

        </div>
        <div class="nameModal-background" v-if="Private.showShare || Private.showClear" v-on:click="Misc.toggleShare"></div>
    </div>
</template>

<script>
    var Self
    var Private
    var Public
    var Paint = require('./methods/Paint.js')
    var Move = require('./methods/Move.js')
    var Zoom = require('./methods/Zoom.js')
    var Misc = require('./methods/Misc.js')
    export default {
        props: ['blade'],
        data() {
          return {
            Misc: {},
            Public: {
              x: '',
              y: '',
              color: '',
              lineWidth: 21,
              channel: '',
              blendMode: 'source-over'
            },
            Private: {
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
              showShare: false,
              showClear: false,
              share: {
                temp: '',
                forever: '',
              }
            },

          }
        },
        mounted() {
            this.Public.channel = this.blade.owner + ':' + this.blade.uuid
            this.Private.id = this._uid
            Self = this
            Private = Self.Private
            Public = Self.Public
            Self.img = new Image;


            Paint.Load(Self)
            Zoom.Load(Self)
            Misc.Load(Self)

            Self.Misc = Misc
            Self.updateCanvas()
            Misc.redraw(this.blade.data);

            // console.log(Private.canvas.bind);

            Self.$nextTick(function() {
              window.addEventListener('resize', Self.resize, false)
              window.addEventListener('orientationchange', Self.resize, false)
              Self.resize();
            })

            socket.on(`paint:Start:${Public.channel}`, function (io) {
              Paint.Start(Self, false, io)
            })
            socket.on(`paint:ing:${Public.channel}`, function (io) {
              Paint.ing(Self, false, io)
            })
            socket.on(`paint:End:${Public.channel}`, function (io) {
              Paint.End(Self, false, io)
            })
            socket.on(`show:share`, Misc.toggleShare)
            socket.on(`show:brush-plus`, function () {Misc.brushSize('+')})
            socket.on(`show:brush-minus`, function () {Misc.brushSize('-')})
            socket.on(`show:clear`, Misc.toggleClear)
            socket.on(`show:clear:confirm`, Misc.Clear)
        },

        methods: {

          updateCanvas: function (e=null, io=null) {
            if (io == null) Public.color = Self.$parent.color.selected
            if (e) {
              Private.canvas = e.target
            }else {
              Private.canvas = document.getElementById('canvas-' + Private.id)
            }

            //get context and canvas el
            Private.ctx = Misc.getContext(Private.canvas)
            Private.camera.canvas = document.getElementById('camera-' + Private.id)
            Private.camera.ctx = Misc.getContext(Private.camera.canvas)

            //Bind or unbind canvas based on permissions
            if (Self.blade.edit) {
              Private.canvas.bind()
            } else {
              Private.canvas.unbind()
            }
          },

          resize: function(){
            var ratio = Private.height / Private.width
            Private.cssWidth = Private.canvas.clientWidth
            Private.cssHeight = $('.canvas-wrapper').width() * ratio

            if (Private.data) {
              Private.data = Private.camera.canvas.toDataURL('image/png')
              Misc.redraw(Private.data);
            }
          },

          dragStart: function (e, io=null) {
              if (Self.$parent.mode != 'pan') e.preventDefault()
              if (Self.$parent.mode == 'paint' || Self.$parent.mode == 'erase') Paint.Start(Self, e, io)
              if (Self.$parent.mode == 'move') Move.Start(Self, e, io)
              if (Self.$parent.mode == 'zoom-in') Zoom.In(Self, e, io)
              if (Self.$parent.mode == 'zoom-out') Zoom.Out(Self, e, io)
          },
          dragging: function (e, io=null) {
              if (Self.$parent.mode != 'pan') e.preventDefault()
              if (Self.$parent.mode == 'paint' || Self.$parent.mode == 'erase') Paint.ing(Self, e, io)
              if (Self.$parent.mode == 'move') Move.ing(Self, e, io)
          },
          dragEnd: function (e, io=null) {
              if (Self.$parent.mode == 'paint' || Self.$parent.mode == 'erase') Paint.End(Self, e, io)
              if (Self.$parent.mode == 'move') Move.End(Self, e, io)
          },

        },


        watch: {
          camera: {
            handler: function (val, oldVal) {
              if (Private.data) {
                Misc.redraw(Private.data);
              }else {
                Misc.redraw(Self.blade.data)
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
