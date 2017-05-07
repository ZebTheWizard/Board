<template>

  <div :class="{module: true, add: !obj}" >
    <div style=" color: #bbb" v-if="obj">
      <div class="image" v-on:click="open">
        <div class="src" :style="{'background-image': 'url('+obj.image+')'}"> </div>
      </div>
      <div class="dropdown no-select" v-on:click="showOptions = !showOptions">
        <span class="selected">
          {{obj.name}}
        </span>
        <span class="pull-right" style="margin-right: 10px"><i class="fa fa-angle-down" aria-hidden="true"></i></span>
      </div>
      <div class="options" v-if="showOptions">
          <li class="item">
            <span class="choice">Rename</span>
          </li>
          <li class="item">
            <span class="choice">Share</span>
          </li>
          <li class="item danger">
            <span class="choice" v-on:click="remove">Delete</span>
          </li>
      </div>
    </div>
    <i class="fa fa-plus" aria-hidden="true" v-else="" v-on:click="create"></i>

    <div class="nameModal" v-if="showModal">
      <form action="/board/create" method="post">
        <input type="hidden" name="_token" :value="$parent.csrf">
          <div class="form-group">
            <label for="">Name</label>
            <input type="text" class="form-control" id="canvasName" name="name" placeholder="Board Name" required="true">
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
    <div class="nameModal-background" v-if="showModal"></div>
  </div>

</template>

<script>
    import { Chrome } from 'vue-color'
    export default {
        props: ['obj'],
        data () {
          return {
            showOptions: false,
            showModal: false
          }
        },
        mounted() {

        },


        methods: {
          open: function () {
            window.location.href = window.location.origin + `/${this.obj.username}/${this.obj.uuid}`
          },

          create: function () {
            this.showModal = true
          },
          remove: function () {
            this.showOptions = false;
            axios.post('/board/delete', this.obj)
            this.$emit('remove')
          }
        }
    }
</script>
