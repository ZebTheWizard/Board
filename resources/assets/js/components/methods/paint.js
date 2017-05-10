module.exports = {
  Start: function (self, e, io=null) {
    if (io) {
      self.x = io.x
      self.y = io.y
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
    self.ctx.beginPath()
    self.ctx.moveTo(self.x / self.scale, self.y / self.scale)

    self.camera.ctx.beginPath()
    self.camera.ctx.moveTo(self.x / self.scale, self.y / self.scale)
    self.ctx.lineTo(self.x / self.scale, self.y / self.scale)
    self.ctx.stroke()

    self.camera.ctx.lineTo(self.x / self.scale, self.y / self.scale)
    self.camera.ctx.stroke()
  },
  ing: function (self, e, io=null) {
    if (io) {
      self.x = io.x
      self.y = io.y
      self.ctx.globalCompositeOperation = io.blendMode
      self.camera.ctx.globalCompositeOperation = io.blendMode
    }else {
      self.getCoord(e)
      socket.emit('send:paint:ing', self.public)
    }

    // if (self.public.x <= self.width && self.public.x >=0 && self.public.y <= self.height && self.public.y >= 0) {
      self.ctx.lineTo(self.x / self.scale, self.y / self.scale)
      self.ctx.stroke()

      self.camera.ctx.lineTo(self.x / self.scale, self.y / self.scale)
      self.camera.ctx.stroke()
    // }

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
