<template>
    <b-form inline v-on:change="onChange" @keyup.enter="onUpdate" class="text-monospace">
      <b-input-group append="Kp" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="Kp" type="number" min="0" max="1000" step=".25" v-model.number="Kp"/>
      </b-input-group>

      <b-input-group append="Ki" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="Ki" type="number" min="0" max="1000" step=".25" v-model.number="Ki"/>
      </b-input-group>

      <b-input-group append="Kd" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="Kd" type="number" min="0" max="10" step=".025" v-model.number="Kd"/>
      </b-input-group>

      <b-input-group append="D.Filtering" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="derivative_filtering" type="number" min="0" max="1" step=".01" v-model.number="derivative_filtering"/>
      </b-input-group>

      <b-button size="sm" variant="success" @click="onUpdate" v-if="!noUpdateButton">
        <font-awesome-icon icon="chevron-circle-right" />
      </b-button>
    </b-form>
</template>

<style scoped>
</style>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronCircleRight  } from '@fortawesome/free-solid-svg-icons'
library.add(faChevronCircleRight);

export default {
  name: 'pid-edit',
  props: {
      parameters: {
        type: Object,
        default: function () {
            return {
                Kp: 1.8,
                Ki: 1,
                Kd: 1,
                derivative_filtering: 0.75,
            }
        }
      },
      noUpdateButton: {
        type: Boolean,
        default: false,
      }
  },
  methods: {
    onChange() {
      this.$emit('change', this);
    },
    onUpdate() {
      this.$emit('update', this);
    }
  },
  data: function () {
    return {
        Kp: this.parameters.Kp,
        Ki: this.parameters.Ki,
        Kd: this.parameters.Kd,
        derivative_filtering: this.parameters.derivative_filtering,
    }
  },
}
</script>
