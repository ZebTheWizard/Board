module.exports = {
  Start: function (self, e, io=null) {
    if (io) {
      self.private.x = io.x
      self.private.y = io.y
      self.public.color = io.color
      self.public.lineWidth = io.lineWidth
      self.updateCanvas(e, io)
    }else {
      self.updateCanvas(e, io)
      self.getCoord(e)
      socket.emit('send:paint:Start', self.public)
    }

    if (self.$parent.mode == 'paint') {
      self.public.blendMode = 'source-over'
    } else if (self.$parent.mode == 'erase') {
      self.public.blendMode = 'destination-out'
    }
    self.private.ctx.beginPath()
    self.private.ctx.moveTo(self.private.x / self.private.scale, self.private.y / self.private.scale)

    self.private.camera.ctx.beginPath()
    self.private.camera.ctx.moveTo(self.private.x / self.private.scale, self.private.y / self.private.scale)
    self.private.ctx.lineTo(self.private.x / self.private.scale, self.private.y / self.private.scale)
    self.private.ctx.stroke()

    self.private.camera.ctx.lineTo(self.private.x / self.private.scale, self.private.y / self.private.scale)
    self.private.camera.ctx.stroke()
  },
  ing: function (self, e, io=null) {
    if (io) {
      self.private.x = io.x
      self.private.y = io.y
      self.private.ctx.globalCompositeOperation = io.blendMode
      self.private.camera.ctx.globalCompositeOperation = io.blendMode
    }else {
      self.getCoord(e)
      socket.emit('send:paint:ing', self.public)
    }

    // if (self.public.x <= self.private.width && self.public.x >=0 && self.public.y <= self.private.height && self.public.y >= 0) {
      self.private.ctx.lineTo(self.private.x / self.private.scale, self.private.y / self.private.scale)
      self.private.ctx.stroke()

      self.private.camera.ctx.lineTo(self.private.x / self.private.scale, self.private.y / self.private.scale)
      self.private.camera.ctx.stroke()
    // }

  },
  End: function (self, e, io=null) {
    self.private.ctx.closePath()
    self.private.camera.ctx.closePath()
    self.private.data = self.private.camera.canvas.toDataURL('image/png')

    if (!io) {
      socket.emit('send:save', {
        channel: self.public.channel,
        data: self.private.data
      })
      axios.post('/board/save', {
          id: self.blade.owner,
          uuid: self.blade.uuid
      })
    }

  }
}
