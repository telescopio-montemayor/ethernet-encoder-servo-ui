<template>
  <div id="app">
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
  margin-top: 60px;
}
</style>
