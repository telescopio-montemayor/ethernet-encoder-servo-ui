<template>
  <div id="app">
      <b-container fluid class="mb-5">
          <b-button block variant="outline-danger" :disabled="!api.online" @click="haltAll()">
              Halt All
          </b-button>
      </b-container>
      <axis v-for="axis in api.$axes" :key="axis.id" :axis="axis"/>
  </div>
</template>

<script>
import Axis from './components/Axis.vue'

export default {
  name: 'app',
  components: {
    Axis
  },
  methods: {
    async haltAll () {
        for (let axis of this.$encoder.$axes) {
            axis.closed_loop = false;
        }
    }
  },
  data () {
      return {
          api: this.$encoder
      }
  },
  async mounted () {
    this.$encoder.getAxes();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
