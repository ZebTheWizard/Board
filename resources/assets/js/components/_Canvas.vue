<template>

  <div>
    <canvas :id="'canvas-'+_uid" :width="Private.width" :height="Private.height"  v-drag="dragging"></canvas>
    <canvas :id="'camera-'+_uid" :width="Private.width" :height="Private.height" class="camera"></canvas>
  </div>

</template>

<script>
    import { Chrome } from 'vue-color'
    export default {
        props: ['uuid'],
        data () {
          return {

          }
        },
        mounted() {

        },


        methods: {

        }
    }
</script>
