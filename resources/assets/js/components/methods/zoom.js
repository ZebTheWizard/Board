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

var scale = function (Self, e, factor) {
  var pt =  Misc.getCoord(e)

  Private.scale = Private.scale * factor

  Private.data = Private.camera.canvas.toDataURL('image/png')

  // Private.canvas.width  = Private.width * Private.scale
  // Private.canvas.height = Private.height * Private.scale

  Misc.Clear()

  // Private.ctx.translate(pt.x, pt.y)
  Private.ctx.scale(factor, factor)


  // Private.ctx.translate(-pt.x, -pt.y)

  Misc.redraw(Private.data)



}

module.exports = {
  Load: function (Self) {
    l(Self)
  },
  In: function (Self, e, io=null) {
    scale(Self, e, 1.25)
  },
  Out: function (Self, e, io=null) {
    scale(Self, e, 0.8)
  }
}
