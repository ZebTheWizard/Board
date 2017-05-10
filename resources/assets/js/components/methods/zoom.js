var scale = function (self, e, factor) {
  var pt =  self.getCoord(e)

  self.scale = self.scale * factor
  self.descale = 1/self.scale

  self.data = self.camera.canvas.toDataURL('image/png')

  // self.canvas.width  = self.width * self.scale
  // self.canvas.height = self.height * self.scale
  // console.log(self.canvas.width, self.canvas.height);

  self.Clear()

  // self.ctx.translate(pt.x, pt.y)
  self.ctx.scale(factor, factor)


  // self.ctx.translate(-pt.x, -pt.y)

  self.redraw(self.data)



}

module.exports = {
  In: function (self, e, io=null) {
    scale(self, e, 1.25)
  },
  Out: function (self, e, io=null) {
    scale(self, e, 0.8)
  }
}
