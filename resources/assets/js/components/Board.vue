<template>
    <div>
        <canvas :id="'canvas-'+_uid" :width="cssWidth" :height="cssHeight" :style="{border:'1px solid #ccc', width: '100%', height: cssHeight+'px'}" v-drag="dragging"></canvas>
        Canvas Board
    </div>
</template>

<script>
    var self
    var img = new Image;
    export default {
        props: ['blade'],
        data() {
          return {
            id: '',
            canvas: '',
            width: 1920,
            height: 1080,
            ctx: '',
            color: '',
            lineWidth: 21,
            x: '',
            y: '',
            cssHeight: 0,
            cssWidth: 0,
            data: '',
            channel: ''
          }
        },
        mounted() {
            this.channel = this.blade.owner + ':' + this.blade.uuid
            this.id = this._uid
            self = this
            self.updateCanvas()
            self.resize();
            self.redraw(this.blade.data);

            self.$nextTick(function() {
              window.addEventListener('resize', self.resize)
            })

            socket.on(`draw:dragStart:${self.channel}`, function (data) {
              self.dragStart(false, data)
            })
            socket.on(`draw:dragging:${self.channel}`, function (data) {
              self.dragging(false, data)
            })
        },

        methods: {

          updateCanvas: function (e=null, io=null) {
            if (io == null) self.color = self.$parent.color.selected
            if (e) {
              self.canvas = e.target
            }else {
              self.canvas = document.getElementById('canvas-' + self.id)
            }
            self.ctx = self.canvas.getContext("2d")
            self.ctx.fillStyle = "solid"
            self.ctx.strokeStyle = self.color
            self.ctx.lineWidth = self.lineWidth
            self.ctx.lineCap = "round"
            self.ctx.lineJoin = "round"
          },

          resize: function(){
            var ratio = self.height / self.width
            self.cssWidth = self.canvas.clientWidth
            self.cssHeight = self.canvas.clientWidth * ratio
            if (self.data) {
              self.redraw(self.data);
            }else {
              self.redraw(self.blade.data)
            }
          },

          dragStart: function (e, io=null) {
            if (io) {
              self.x = io.x
              self.y = io.y
              self.color = io.color
              self.lineWidth = io.lineWidth
              self.updateCanvas(e, io)
            }else {
              self.updateCanvas(e, io)
              self.x = e.offsetX
              self.y = e.offsetY
              socket.emit('send:dragStart', self.$data)
            }



            self.ctx.beginPath()
            self.ctx.moveTo(self.x, self.y)
          },
          dragging: function (e, io=null) {
            if (io) {
              self.x = io.x
              self.y = io.y
            }else {
              self.x = e.offsetX
              self.y = e.offsetY
              socket.emit('send:dragging', self.$data)
            }
            self.ctx.lineTo(self.x, self.y)
            self.ctx.stroke()
          },
          dragEnd: function (e) {
            self.ctx.closePath()
            self.data = self.canvas.toDataURL('image/png')
            socket.emit('send:save', self.$data)
            axios.post('/board/save', {
                id: 1,
                uuid: 'GZHdC5oaUhD'
            }).then(function(response){
              console.log(response.data);
            })
          },
          redraw: function (source) {
            if (this.blade.data.length > 0){
              img.onload = function(){self.ctx.drawImage(img, 0,0)}
              img.src = source
            }
          }
        }
    }
</script>
