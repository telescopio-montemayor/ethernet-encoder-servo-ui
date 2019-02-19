<template>
    <b-form inline v-on:change="onChange" @keyup.enter="onUpdate" class="text-monospace">
      <b-input-group :append="getAngleUnit()" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="angle-hour" type="number" v-model.number="degrees"/>
      </b-input-group>
      <b-input-group append="M" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="minutes" type="number" min="-59" max="59" v-model.number="minutes"/>
      </b-input-group>
      <b-input-group append="S" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="seconds" type="number" step="0.1" v-model.number="seconds"/>
      </b-input-group>
      <b-button size="sm" variant="success" @click="onUpdate">
        <font-awesome-icon icon="chevron-circle-right" />
      </b-button>
    </b-form>
</template>

<style scoped>
input {
  width: 6em !important;
}
</style>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronCircleRight  } from '@fortawesome/free-solid-svg-icons'
library.add(faChevronCircleRight);

function formatPayload (instance) {
  var payload = {
    minutes: instance.minutes || 0,
    seconds: instance.seconds || 0,
  };

  var degrees = instance.degrees || 0;
  if (instance.angle.hours !== undefined) {
    payload.hours = degrees;
  } else {
    payload.degrees = degrees;
  }

  return payload;
}

export default {
  name: 'angle-edit',
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
  },
  methods: {
    getAngleUnit() {
      if (this.angle.hours !== undefined) {
        return 'H';
      } else {
        return 'D';
      }
    },
    onChange() {
      this.$emit('change', formatPayload(this));
    },
    onUpdate() {
      this.$emit('update', formatPayload(this));
    }
  },
  data: function () {
    return {
      degrees: (this.angle.hours !== undefined) ? this.angle.hours : this.angle.degrees,
      minutes: this.angle.minutes,
      seconds: this.angle.seconds,
    }
  },
}
</script>
