var Private
var Public
var Self
var Misc

var l = function (S) {
  Self = S
  Private = S.Private
  Misc = require('./Misc.js'); Misc.Load(Self)
}

module.exports = {
  Load: function (Self) {
    l(Self)
  },
  draw: function (obj){
    Private.ctx.beginPath()
    Private.ctx.moveTo(obj.last.x, obj.last.y)
    Private.ctx.lineTo(obj.current.x, obj.current.y)
    Private.ctx.stroke()

    Private.camera.ctx.beginPath()
    Private.camera.ctx.moveTo(obj.last.x, obj.last.y)
    Private.camera.ctx.lineTo(obj.current.x, obj.current.y)
    Private.camera.ctx.stroke()

    Private.x = obj.current.x
    Private.y = obj.current.y

    Private.ctx.closePath()
    Private.camera.ctx.closePath()


    return {
      prop: Private.prop,
      current: {
        x: obj.current.x,
        y: obj.current.y
      },
      last: {
        x: obj.last.x,
        y: obj.last.y
      }
    }
  },
  Start: function (e) {
    // console.log(Private.camera);
    var pos = Misc.getCoord(e)

    var d = this.draw({
      current: {
        x: pos.x,
        y: pos.y
      },
      last: {
        x: pos.x,
        y: pos.y
      }
    })
    socket.emit('send:draw', d)
    // Self.$emit('user', Private.data)
  },
  ing: function (e) {
    var pos = Misc.getCoord(e)

    var d = this.draw({
      current: {
        x: pos.x,
        y: pos.y
      },
      last: {
        x: Private.x,
        y: Private.y
      }
    })
    socket.emit('send:draw', d)
  },
  End: function (e) {
    // Private.ctx.closePath()
    // Private.camera.ctx.closePath()
    Private.data = Private.camera.canvas.toDataURL('image/png')
    socket.emit('send:save', {
      channel: Private.prop.channel,
      data: Private.data
    })
    axios.post('/board/save', {
        id: Private.prop.owner,
        uuid: Private.prop.uuid
    })
  }
}
