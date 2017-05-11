<template>
    <div>
        <div class="canvas-wrapper" >

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
        <div class="nameModal-background" v-if="showShare || showClear" v-on:click="toggleShare"></div>


        <div class="nameModal" v-if="showClear">
          <div class="modal-header">
            <h3>Are you sure you would like to clear the canvas?</h3>
          </div>
          <div class="modal-body">
            <form action="/board/create" method="post">
                  <div class="pull-right">
                    <button type="button" class="btn btn-default btn-lg" v-on:click="toggleClear">Cancel</button>
                    <button type="button" class="btn btn-danger btn-lg" v-on:click="toggleClear('submit')"><i class="fa fa-trash-o" aria-hidden="true"></i> Yes</button>
                  </div>

            </form>
          </div>

          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-default" v-on:click="toggleShare">Close</button>
          </div> -->

        </div>
        <div class="nameModal-background" v-if="showShare || showClear" v-on:click="toggleShare"></div>
    </div>
</template>

<script>
    var self
    var img = new Image;
    var paint = require('./methods/paint.js')
    var move = require('./methods/move.js')
    var zoom = require('./methods/zoom.js')
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
            private: {
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
            this.public.channel = this.blade.owner + ':' + this.blade.uuid
            this.private.id = this._uid
            self = this
            self.updateCanvas()
            self.redraw(this.blade.data);

            // console.log(self.private.canvas.bind);

            self.$nextTick(function() {
              window.addEventListener('resize', self.resize, false)
              window.addEventListener('orientationchange', self.resize, false)
              self.resize();
            })

            socket.on(`paint:Start:${self.public.channel}`, function (io) {
              paint.Start(self, false, io)
            })
            socket.on(`paint:ing:${self.public.channel}`, function (io) {
              paint.ing(self, false, io)
            })
            socket.on(`paint:End:${self.public.channel}`, function (io) {
              paint.End(self, false, io)
            })
            socket.on(`show:share`, self.toggleShare)
            socket.on(`show:brush-plus`, function () {self.brushSize('+')})
            socket.on(`show:brush-minus`, function () {self.brushSize('-')})
            socket.on(`show:brush-minus`, function () {self.brushSize('-')})
            socket.on(`show:clear`, self.toggleClear)
            socket.on(`show:clear:confirm`, self.Clear)
        },

        methods: {
          getKey: function (str){
            if (str == 'forever') return window.location.origin + `/join/${self.blade.ownerUsername}/${self.private.share.forever}`
            if (str == 'imageurl') return window.location.origin + `/i/${self.blade.ownerUsername}/${self.blade.uuid}`
          },
          toggleShare: function () {
            if (!self.private.showShare) {
              axios.post('/share', {
                owner: self.blade.owner,
                uuid: self.blade.uuid
              }).then(response => {
                var b = response.data
                self.private.share.temp = ''
                self.private.share.forever = b.share
              })
            }else {
              self.private.share.temp = ''
              self.private.share.forever = ''
            }
            self.private.showShare = !self.private.showShare
          },

          toggleClear: function (s=null) {
            if (s == 'submit') {
              self.Clear()
              axios.post('/clear', {
                channel: self.public.channel
              }).then(response => {
                self.Clear()
                socket.emit('send:clear:confirm')
              })
            }
            self.private.showClear = !self.private.showClear
          },

          updateCanvas: function (e=null, io=null) {
            if (io == null) self.public.color = self.$parent.color.selected
            if (e) {
              self.private.canvas = e.target
            }else {
              self.private.canvas = document.getElementById('canvas-' + self.private.id)
            }

            //get context and canvas el
            self.private.ctx = self.getContext(self.private.canvas)
            self.private.camera.canvas = document.getElementById('camera-' + self.private.id)
            self.private.camera.ctx = self.getContext(self.private.camera.canvas)

            //Bind or unbind canvas based on permissions
            if (self.blade.edit) {
              self.private.canvas.bind()
            } else {
              self.private.canvas.unbind()
            }
          },

          resize: function(){
            var ratio = self.private.height / self.private.width
            self.private.cssWidth = self.private.canvas.clientWidth
            self.private.cssHeight = $('.canvas-wrapper').width() * ratio

            if (self.private.data) {
              self.private.data = self.private.camera.canvas.toDataURL('image/png')
              self.redraw(self.private.data);
            }
          },

          dragStart: function (e, io=null) {
              if (self.$parent.mode != 'pan') e.preventDefault()
              if (self.$parent.mode == 'paint' || self.$parent.mode == 'erase') paint.Start(self, e, io)
              if (self.$parent.mode == 'move') move.Start(self, e, io)
              if (self.$parent.mode == 'zoom-in') zoom.In(self, e, io)
              if (self.$parent.mode == 'zoom-out') zoom.Out(self, e, io)
          },
          dragging: function (e, io=null) {
              if (self.$parent.mode != 'pan') e.preventDefault()
              if (self.$parent.mode == 'paint' || self.$parent.mode == 'erase') paint.ing(self, e, io)
              if (self.$parent.mode == 'move') move.ing(self, e, io)
          },
          dragEnd: function (e, io=null) {
              if (self.$parent.mode == 'paint' || self.$parent.mode == 'erase') paint.End(self, e, io)
              if (self.$parent.mode == 'move') move.End(self, e, io)
          },
          redraw: function (source) {
            if (this.blade.data.length > 0){
              img.onload = function(){
                self.private.ctx.drawImage(img, self.private.camera.x, self.private.camera.y)
                self.private.camera.ctx.drawImage(img, 0,0)
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
            self.private.ctx.clearRect(0, 0, 9999, 9999);
            self.private.camera.ctx.clearRect(0, 0, self.private.width, self.private.height);
          },

          getCoord: function (e) {
            if(e.type == 'mousedown' || e.type == 'mousemove') {
              self.private.x = e.offsetX
              self.private.y = e.offsetY
            }else {
              var offset = $(self.private.canvas).offset()
              self.private.x = (e.touches[0].pageX - offset.left)
              self.private.y = (e.touches[0].pageY - offset.top)
            }
            self.public.x = self.private.x / self.private.scale
            self.public.y = self.private.y / self.private.scale
          },

          brushSize: function (t) {
            if (t == '-' && self.public.lineWidth >= 6) self.public.lineWidth -= 5
            if (t == '+' && self.public.lineWidth <= 206) self.public.lineWidth += 5
          }


        },


        watch: {
          camera: {
            handler: function (val, oldVal) {
              if (self.private.data) {
                self.redraw(self.private.data);
              }else {
                self.redraw(self.blade.data)
              }
            },
            deep: true
          },
          'public.blendMode': function () {
            self.private.ctx = self.getContext(self.private.canvas)
            self.private.camera.ctx = self.getContext(self.private.camera.canvas)
          }
        }
    }
</script>
