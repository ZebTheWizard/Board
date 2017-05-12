<template>
  <!-- <div class="picker">
    <input type="text" name="" value="">
    <swatches-picker v-model="colors" @change-color="onChange"></swatches-picker>
  </div> -->
  <div class="color-picker" style="position:absolute">
    <div v-on:click="toggle"
          class="btn btn-default dropdown-toggle"
          data-toggle="dropdown"
          v-bind:style="{ backgroundColor: colors.hex, color: eyedropper, width:'30px', height: '30px' }">

    </div>
    <div style="position:absolute; z-index: 9999">
      <chrome-picker v-model="colors" @change-color="onChange" v-show="isOpen"></chrome-picker>
    </div>
    <br>
  </div>

</template>

<script>
    import { Chrome } from 'vue-color'
    export default {
        props: ['hex', 'type'],
        data () {
          return {
            eyedropper: '',
            isOpen: false,
            colors: {
              hex: this.hex,
            }
          }
        },
        mounted() {
          // window.addEventListener('mousedown', (e) => {
          //   if (this.isOpen) this.toggle()
          // })

        },
        watch: {
          hex: function (val) {
            this.colors.hex = val
          }
        },
        components: {
          'chrome-picker': Chrome
        },
        methods: {
          onChange: function (val) {
            this.colors = val
            this.eyedropper = this.getContrast(this.colors)
            this.$emit('updatecolor', this.colors.hex, this.type)
          },
          onFocus: function () {
            alert()
          },
          getContrast: function (colors){
          	return (colors.hsl.l > .6) ? 'black':'white';
          },
          toggle: function () {
            this.isOpen = !this.isOpen
          }
        }
    }
</script>
