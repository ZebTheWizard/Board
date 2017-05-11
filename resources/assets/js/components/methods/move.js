module.exports = {
  last: {
    x: '',
    y: ''
  },
  current: {
    x: '',
    y: ''
  },
  Start: function (self, e, io=null) {
    this.last.x = e.offsetX
    this.last.y = e.offsetY
  },
  ing: function (self, e, io=null) {
    this.current.x = e.offsetX
    this.current.y = e.offsetY

    self.camera.x = this.current.x - this.last.x
    self.camera.y = this.current.y - this.last.y
  },
  End: function (self, e) {

  }
}
//
