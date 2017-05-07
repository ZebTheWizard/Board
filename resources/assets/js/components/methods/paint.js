module.exports = {
  Start: function (self, e, io=null) {
    console.log(e);
    if (io) {
      self.public.x = io.x
      self.public.y = io.y
      self.public.color = io.color
      self.public.lineWidth = io.lineWidth
      self.updateCanvas(e, io)
    }else {
      self.updateCanvas(e, io)
      self.public.x = e.offsetX
      self.public.y = e.offsetY
      socket.emit('send:paint:Start', self.public)
    }

    if (self.$parent.mode == 'paint') {
      self.public.blendMode = 'source-over'
    } else if (self.$parent.mode == 'erase') {
      self.public.blendMode = 'destination-out'
    }

    self.ctx.beginPath()
    self.ctx.moveTo(self.public.x, self.public.y)

    self.camera.ctx.beginPath()
    self.camera.ctx.moveTo(self.public.x, self.public.y)
  },
  ing: function (self, e, io=null) {
    if (io) {
      self.public.x = io.x
      self.public.y = io.y
      self.ctx.globalCompositeOperation = io.blendMode
      self.camera.ctx.globalCompositeOperation = io.blendMode
    }else {
      self.public.x = e.offsetX
      self.public.y = e.offsetY
      socket.emit('send:paint:ing', self.public)
    }

    self.ctx.lineTo(self.public.x, self.public.y)
    self.ctx.stroke()

    self.camera.ctx.lineTo(self.public.x, self.public.y)
    self.camera.ctx.stroke()
  },
  End: function (self, e, io=null) {
    self.ctx.closePath()
    self.camera.ctx.closePath()
    self.data = self.camera.canvas.toDataURL('image/png')

    if (!io) {
      socket.emit('send:save', {
        channel: self.public.channel,
        data: self.data
      })
      axios.post('/board/save', {
          id: self.blade.owner,
          uuid: self.blade.uuid
      })
    }

  }
}
