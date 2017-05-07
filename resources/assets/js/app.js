
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, window.socketURL);
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('board', require('./components/Board.vue'));
Vue.component('module', require('./components/Module.vue'));
Vue.component('picker', require('./components/Picker.vue'));

Vue.directive('drag', {
  bind: (el, binding, vnode) => {

    var obj = vnode.context

    el.addEventListener("mousedown", dragStart,true);

    function dragStart(e) {
      if (typeof obj.dragStart == 'function') obj.dragStart(e)

      el.addEventListener("mousemove",dragging,true);
      window.addEventListener("mouseup",dragEnd,true);
    }
    function dragging(e) {
      binding.value(e)
    }
    function dragEnd(e){
      if (typeof obj.dragEnd == 'function') obj.dragEnd(e)
      el.removeEventListener("mousemove", dragging ,true);
      window.removeEventListener("mouseup", dragEnd ,true);
    }


  }
})


const app = new Vue({
    el: '#app',
    data: {
      lastUsedId: 1,
      color: {
        selected: '#000',
        primary: '#000',
        secondary: '#fff',
      },
      mode: 'paint',
      toolbarOffset: 0,
      toolbarIsOpen: true,
      toolbarWidth: 100,
      boards: {}
    },
    mounted() {
      this.resize();
      axios.post('/boards/get').then(response => {
        console.log(response);
        this.boards = response.data['boards']
      })
      this.$nextTick(function() {
        window.addEventListener('resize', this.resize)
        $('#mode-'+this.mode).addClass('selected')


      })
    },
    methods: {
      updateColor: function (color, type) {
        if (type == 'primary'){
          this.color.primary = color
          this.color.selected = color
        }else{
          this.color.secondary = color
        }
      },
      swapColor: function (){
        this.color.selected = this.color.secondary
        this.color.secondary = this.color.primary
        this.color.primary = this.color.selected
      },
      setMode: function (mode) {
        this.mode = mode;
        $('.toolbar .section').removeClass('selected')
        $('#mode-' + mode).addClass('selected')
        if (mode == 'share') {
          socket.emit('send:share');
        }
      },
      toggleToolbar: function (option=null) {
        this.toolbarIsOpen = !this.toolbarIsOpen
      },
      resize: function () {
        var w = document.body.clientWidth

        if( w < 752 ) {
          this.toolbarIsOpen = false
          this.toolbarOffset = 0
        }else {
          this.toolbarIsOpen = true
          this.toolbarOffset = this.toolbarWidth
        }


        if ($('#navbar-toolbar-caller').length) {
          $('#navbar-toolbar-toggle').hide()
        }
        // console.log();
      }
    },
    computed: {
      csrf: function () { return window.Laravel.csrfToken }
    }
});
