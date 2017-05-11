var Private
var Public
var Self

var l = function (S) {
  Self = S
  Private = S.Private
  Public = S.Public
}

module.exports = {
  Load: function (Self) {
    l(Self)
  },

  Clear: function () {
    Private.ctx.clearRect(0, 0, 9999, 9999);
    Private.camera.ctx.clearRect(0, 0, Private.width, Private.height);
  },

  getCoord: function (e) {
    if(e.type == 'mousedown' || e.type == 'mousemove') {
      Private.x = e.offsetX
      Private.y = e.offsetY
    }else {
      var offset = $(Private.canvas).offset()
      Private.x = (e.touches[0].pageX - offset.left)
      Private.y = (e.touches[0].pageY - offset.top)
    }
    Public.x = Private.x / Private.scale
    Public.y = Private.y / Private.scale
  },

  redraw: function (source) {
    if (Self.blade.data.length > 0){
      Self.img.onload = function(){
        Private.ctx.drawImage(Self.img, Private.camera.x, Private.camera.y)
        Private.camera.ctx.drawImage(Self.img, 0,0)
      }
      Self.img.src = source


    }
  },

  getContext: function (el) {
    var ctx = el.getContext("2d")
    ctx.fillStyle = "solid"
    ctx.strokeStyle = Public.color
    ctx.lineWidth = Public.lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.globalCompositeOperation = Public.blendMode;
    return ctx;
  },

  getKey: function (str){
    if (str == 'forever') return window.location.origin + `/join/${Self.blade.ownerUsername}/${Private.share.forever}`
    if (str == 'imageurl') return window.location.origin + `/i/${Self.blade.ownerUsername}/${Self.blade.uuid}`
  },
  toggleShare: function () {
    if (!Private.showShare) {
      axios.post('/share', {
        owner: Self.blade.owner,
        uuid: Self.blade.uuid
      }).then(response => {
        var b = response.data
        Private.share.temp = ''
        Private.share.forever = b.share
      })
    }else {
      Private.share.temp = ''
      Private.share.forever = ''
    }
    Private.showShare = !Private.showShare
  },

  toggleClear: function (s=null) {
    if (s == 'submit') {
      this.Clear()
      axios.post('/clear', {
        channel: Public.channel
      }).then(response => {
        this.Clear()
        socket.emit('send:clear:confirm')
      })
    }
    Private.showClear = !Private.showClear
  },

  brushSize: function (t) {
    if (t == '-' && Public.lineWidth >= 6) Public.lineWidth -= 5
    if (t == '+' && Public.lineWidth <= 206) Public.lineWidth += 5
  }

}
