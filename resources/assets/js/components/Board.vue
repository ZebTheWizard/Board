<template>
    <div>
        <div class="canvas-wrapper" :style="{height: cssHeight+'px'}">

          <div class="alert alert-warning alert-dismissible" role="alert" v-if="!blade.edit">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            You are currently in <strong>View-Only</strong> mode.
          </div>

          <canvas :id="'canvas-'+_uid" :width="width" :height="height"  v-drag="dragging"></canvas>
        </div>
        <canvas :id="'camera-'+_uid" :width="width" :height="height" class="camera"></canvas>

        <div class="nameModal" v-if="showShare">
          <div class="modal-body">
            <form action="/board/create" method="post">
                  <div class="form-group">
                    <label>Ulimited</label>
                    <div class="input-group">
                      <input id="forever-code" type="text" class="form-control" :value="getKey('forever')">
                      <div class="input-group-btn">
                        <button data-clipboard-target="#forever-code" type="button" class="clipboard btn btn-primary" >Copy</button>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Image URL</label>
                    <div class="input-group">
                      <input id="image-url" type="text" class="form-control" :value="getKey('imageurl')">
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
        <div class="nameModal-background" v-if="showShare" v-on:click="toggleShare"></div>
    </div>
</template>

<script>
    var self
    var img = new Image;
    var paint = require('./methods/paint.js')
    var move = require('./methods/move.js')
    export default {
        props: ['blade'],
        data() {
          return {
            public: {
              x: '',
              y: '',
              color: '',
              lineWidth: 21,
              channel: '',
              blendMode: 'source-over'
            },
            id: '',
            canvas: '',
            width: 1920,
            height: 1080,
            ctx: '',
            cssHeight: 0,
            cssWidth: 0,
            data: '',
            camera: {
              x: 0,
              y: 0,
              canvas: '',
              ctx: ''
            },
            showShare: false,
            share: {
              temp: '',
              forever: '',
            },
            preventedEdit: false
          }
        },
        mounted() {
            this.public.channel = this.blade.owner + ':' + this.blade.uuid
            this.id = this._uid
            self = this
            self.updateCanvas()
            self.resize();
            self.redraw(this.blade.data);

            self.$nextTick(function() {
              window.addEventListener('resize', self.resize)
            })

            socket.on(`paint:Start:${self.public.channel}`, function (data) {
              self.dragStart(false, data)
            })
            socket.on(`paint:ing:${self.public.channel}`, function (data) {
              self.dragging(false, data)
            })
            socket.on(`paint:End:${self.public.channel}`, function (data) {
              self.dragEnd(false, data)
            })
            socket.on(`show:share`, self.toggleShare)
        },

        methods: {
          getKey: function (str){
            if (str == 'forever') return window.location.origin + `/join/${self.blade.ownerUsername}/${self.share.forever}`
            if (str == 'imageurl') return window.location.origin + `/i/${self.blade.ownerUsername}/${self.blade.uuid}`
          },
          toggleShare: function () {
            if (!self.showShare) {
              axios.post('/share', {
                owner: self.blade.owner,
                uuid: self.blade.uuid
              }).then(response => {
                var b = response.data
                self.share.temp = ''
                self.share.forever = b.share
              })
            }else {
              self.share.temp = ''
              self.share.forever = ''
            }
            self.showShare = !self.showShare
          },

          updateCanvas: function (e=null, io=null) {
            if (io == null) self.public.color = self.$parent.color.selected
            if (e) {
              self.canvas = e.target
            }else {
              self.canvas = document.getElementById('canvas-' + self.id)
            }

            if (!self.blade.edit && !self.preventedEdit){
              var new_canvas = self.canvas.cloneNode(true)
              self.canvas.parentNode.replaceChild(new_canvas, self.canvas)
              self.canvas = new_canvas
              self.preventedEdit = true
            }


            self.ctx = self.getContext(self.canvas)

            self.camera.canvas = document.getElementById('camera-' + self.id)
            self.camera.ctx = self.getContext(self.camera.canvas)
          },

          resize: function(){
            var ratio = self.height / self.width
            self.cssWidth = self.canvas.clientWidth
            self.cssHeight = $('.canvas-wrapper').width() * ratio

            if (self.data) {
              self.data = self.camera.canvas.toDataURL('image/png')
              self.redraw(self.data);
            }else {
              self.redraw(self.blade.data)
            }
          },

          dragStart: function (e, io=null) {
            // if (self.blade.edit) {
              if (self.$parent.mode == 'paint' || self.$parent.mode == 'erase') paint.Start(self, e, io)
              if (self.$parent.mode == 'move') move.Start(self, e, io)
            // }
          },
          dragging: function (e, io=null) {
            // if (self.blade.edit) {
              if (self.$parent.mode == 'paint' || self.$parent.mode == 'erase') paint.ing(self, e, io)
              if (self.$parent.mode == 'move') move.ing(self, e, io)
            // }
          },
          dragEnd: function (e, io=null) {
            // if (self.blade.edit) {
              if (self.$parent.mode == 'paint' || self.$parent.mode == 'erase') paint.End(self, e, io)
              if (self.$parent.mode == 'move') move.End(self, e, io)
            // }
          },
          redraw: function (source) {

            self.Clear()
            if (this.blade.data.length > 0){
              img.onload = function(){
                self.ctx.drawImage(img, self.camera.x, self.camera.y)
                self.camera.ctx.drawImage(img, 0,0)
              }
              img.src = source
            }
          },

          getContext: function (el) {
            var ctx = el.getContext("2d")
            ctx.fillStyle = "solid"
            ctx.strokeStyle = self.public.color
            ctx.lineWidth = self.public.lineWidth
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            ctx.globalCompositeOperation = self.public.blendMode;
            return ctx;
          },

          Clear: function () {
            self.ctx.clearRect(0, 0, 9999, 9999);
            self.camera.ctx.clearRect(0, 0, self.width, self.height);
          }


        },


        watch: {
          camera: {
            handler: function (val, oldVal) {
              if (self.data) {
                self.redraw(self.data);
              }else {
                self.redraw(self.blade.data)
              }
            },
            deep: true
          },
          'public.blendMode': function () {
            self.ctx = self.getContext(self.canvas)
            self.camera.ctx = self.getContext(self.camera.canvas)
          }
        }
    }
</script>
