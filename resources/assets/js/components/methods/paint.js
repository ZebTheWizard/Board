var Private
var Public
var Self
var Misc

var l = function (S) {
  Self = S
  Private = S.Private
  Public = S.Public
  Misc = require('./Misc.js'); Misc.Load(Self)
}

module.exports = {
  Load: function (Self) {
    l(Self)
  },
  Start: function (Self, e, io=null) {
    if (io) {
      Private.x = io.x
      Private.y = io.y
      Public.color = io.color
      Public.lineWidth = io.lineWidth
      Self.updateCanvas(e, io)
    }else {
      Self.updateCanvas(e, io)
      Misc.getCoord(e)
      socket.emit('send:paint:Start', Public)
    }

    if (Self.$parent.mode == 'paint') {
      Public.blendMode = 'source-over'
    } else if (Self.$parent.mode == 'erase') {
      Public.blendMode = 'destination-out'
    }
    Private.ctx.beginPath()
    Private.ctx.moveTo(Private.x / Private.scale, Private.y / Private.scale)

    Private.camera.ctx.beginPath()
    Private.camera.ctx.moveTo(Private.x / Private.scale, Private.y / Private.scale)
    Private.ctx.lineTo(Private.x / Private.scale, Private.y / Private.scale)
    Private.ctx.stroke()

    Private.camera.ctx.lineTo(Private.x / Private.scale, Private.y / Private.scale)
    Private.camera.ctx.stroke()
  },
  ing: function (Self, e, io=null) {
    if (io) {
      Private.x = io.x
      Private.y = io.y
      Private.ctx.globalCompositeOperation = io.blendMode
      Private.camera.ctx.globalCompositeOperation = io.blendMode
    }else {
      Misc.getCoord(e)
      socket.emit('send:paint:ing', Public)
    }

    // if (Public.x <= Private.width && Public.x >=0 && Public.y <= Private.height && Public.y >= 0) {
      Private.ctx.lineTo(Private.x / Private.scale, Private.y / Private.scale)
      Private.ctx.stroke()

      Private.camera.ctx.lineTo(Private.x / Private.scale, Private.y / Private.scale)
      Private.camera.ctx.stroke()
    // }

  },
  End: function (Self, e, io=null) {
    Private.ctx.closePath()
    Private.camera.ctx.closePath()
    Private.data = Private.camera.canvas.toDataURL('image/png')

    if (!io) {
      socket.emit('send:save', {
        channel: Public.channel,
        data: Private.data
      })
      axios.post('/board/save', {
          id: Self.blade.owner,
          uuid: Self.blade.uuid
      })
    }

  }
}
