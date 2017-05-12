<template>
  <div :id="'mode-'+ mode" class="section" v-on:click="$parent.setMode(mode)">
    <i :class="'fa fa-' + icon" aria-hidden="true"></i>
    <!-- <div id="mode-pick"class="section full">
      <div class="color-picker-wrapper">
        <span class="fa-stack fa-lg color-swap" v-on:click="swapColor">
          <i class="fa fa-long-arrow-left fa-stack-1x" style="left: -9px"></i>
          <i class="fa fa-long-arrow-down fa-stack-1x" style="top: 9px"></i>
        </span>
        <picker :hex="color.secondary" type="secondary" v-on:updatecolor="updateColor" style="right:-23px;bottom:-18px"></picker>
        <picker :hex="color.primary" type="primary" v-on:updatecolor="updateColor" ></picker>
      </div>
    </div> -->
  </div>
</template>

<script>

    export default {
        props: ['mode', 'icon'],

        data() {
          return {

          }
        },
        mounted() {

        },

        methods: {

        },


        watch: {

        }
    }
</script>
