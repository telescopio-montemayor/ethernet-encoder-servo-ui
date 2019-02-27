<template>
    <b-badge variant="dark" class="text-monospace d-inline-block">
        {{ angle.hours || angle.degrees || 0 }}{{ angle.hours !== undefined ? 'H':'D' }} : {{ angle.minutes || 0 }}M : {{ parseFloat(angle.seconds || 0).toPrecision(3) }}S
    </b-badge>
</template>

<style scoped>
span.badge {
  font-size: 1.2rem;
  vertical-align: middle;
}
</style>

<script>
export default {
  name: 'angle-display',
  props: {
      angle: {
        type: Object,
        default: function () {
            return {
                hours: undefined,
                degrees: 0,
                minutes: 0,
                seconds: 0
            }
        }
      }
  }
}
</script>
