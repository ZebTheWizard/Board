var Private
var Public
var Self

var l = function (S) {
  Self = S
  Private = S.Private
  Public = S.Public
  Parent = S.$parent
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
    var x, y
    if(e.type == 'mousedown' || e.type == 'mousemove') {
      x = e.offsetX
      y = e.offsetY
    }else {
      var offset = $(Private.canvas).offset()
      x = (e.touches[0].pageX - offset.left)
      y = (e.touches[0].pageY - offset.top)
    }
    return {
      x: x / Private.scale,
      y: y / Private.scale
    }

  },

  redraw: function (source) {
    if (Self.$parent.blade.data.length > 0){
      Self.img.onload = function(){
        Private.ctx.drawImage(Self.img, Private.camera.x, Private.camera.y)
        Private.camera.ctx.drawImage(Self.img, 0,0)
      }
      Self.img.src = source
    }
  },

  getContext: function (el, obj) {
    var ctx = el.getContext("2d")
    ctx.fillStyle = "solid"
    ctx.strokeStyle = obj.color
    ctx.lineWidth = obj.lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.globalCompositeOperation = obj.blendMode
    return ctx;
  },

  getKey: function (str){
    if (str == 'forever') return window.location.origin + `/join/${Parent.Public.ownerUsername}/${Parent.Public.uuid}`
    if (str == 'imageurl') return window.location.origin + `/i/${Parent.Public.ownerUsername}/${Parent.Public.uuid}`
  },
  toggleShare: function () {
    if (!Private.showShare) {
      axios.post('/share', {
        owner: Parent.Public.owner,
        uuid: Parent.Public.uuid
      }).then(response => {
        var b = response.data
        Parent.Public.temp = ''
        Parent.Public.forever = b.share
      })
    }
    else {
      Parent.Public.temp = ''
      Parent.Public.forever = ''
    }
    Parent.$parent.setMode('share')
  },

  toggleClear: function (s=null) {
    if (s == 'submit') {
      this.Clear()
      axios.post('/clear', {
        channel: Parent.Public.channel
      }).then(response => {
        this.Clear()
        socket.emit('send:clear:confirm', Parent.Public)
      })
    }
    Parent.$parent.setMode('clear')
  },

  brushSize: function (Self, t) {
    if (t == '-' && Self.Public.user.lineWidth >= 6) Self.Public.user.lineWidth -= 5
    if (t == '+' && Self.Public.user.lineWidth <= 206) Self.Public.user.lineWidth += 5
  }

}
