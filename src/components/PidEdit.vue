<template>
    <b-form inline v-on:change="onChange" @keyup.enter="onUpdate" class="text-monospace">
      <b-input-group prepend="Kp" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="Kp" type="number" min="0" max="1000" step=".25" v-model.number="state.Kp"
            @focus.native="edit($event.target.name)"
            @blur.native="leave($event.target.name)"
            />
      </b-input-group>

      <b-input-group prepend="Ki" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="Ki" type="number" min="0" max="1000" step=".25" v-model.number="state.Ki"
            @focus.native="edit($event.target.name)"
            @blur.native="leave($event.target.name)"
            />
      </b-input-group>

      <b-input-group prepend="Kd" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="Kd" type="number" min="0" max="10" step=".025" v-model.number="state.Kd"
            @focus.native="edit($event.target.name)"
            @blur.native="leave($event.target.name)"
            />
      </b-input-group>

      <b-input-group prepend="D.Filtering" size="sm">
        <b-input class="mb-12 mr-sm-12 mb-sm-0" name="derivative_filtering" type="number" min="0" max="1" step=".01" v-model.number="state.derivative_filtering"
            @focus.native="edit($event.target.name)"
            @blur.native="leave($event.target.name)"
            />
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
      this.$emit('change', Object.assign({}, this.state));
    },
    onUpdate() {
      this.$emit('update', Object.assign({}, this.state));
    },
    edit(name) {
      this.editing[name] = true;
    },
    leave(name) {
      this.editing[name] = false;
    }
  },
  watch: {
      parameters: function () {
          for (var k in this.editing) {
              if (!this.editing[k]) {
                    this.state[k] = this.parameters[k];
              }
          }
      },
  },
  data: function () {
    return {
        editing: {
            Kp: false,
            Ki: false,
            Kd: false,
            derivative_filtering: false,
        },
        state: {
            Kp: this.parameters.Kp,
            Ki: this.parameters.Ki,
            Kd: this.parameters.Kd,
            derivative_filtering: this.parameters.derivative_filtering,
        },
    }
  },
}
</script>
