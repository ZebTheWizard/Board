var scale = function (self, e, factor) {
  var pt =  self.getCoord(e)

  self.private.scale = self.private.scale * factor

  self.private.data = self.private.camera.canvas.toDataURL('image/png')

  // self.private.canvas.width  = self.private.width * self.private.scale
  // self.private.canvas.height = self.private.height * self.private.scale
  // console.log(self.private.canvas.width, self.private.canvas.height);

  self.Clear()

  // self.private.ctx.translate(pt.x, pt.y)
  self.private.ctx.scale(factor, factor)


  // self.private.ctx.translate(-pt.x, -pt.y)

  self.redraw(self.private.data)



}

module.exports = {
  In: function (self, e, io=null) {
    scale(self, e, 1.25)
  },
  Out: function (self, e, io=null) {
    scale(self, e, 0.8)
  }
}
