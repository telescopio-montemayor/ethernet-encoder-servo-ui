<template>
  <b-container fluid :class="{'offline border border-danger rounded': !$encoder.online}">
    <h4 class="text-sm-left"> {{ axis.state.name }} <small> <span v-show="!$encoder.online" class="badge xbadge-pill badge-danger"> offline </span></small> </h4>

    <b-row align-content="start" align-h="start" class="text-left">
      <b-col sm="auto" v-if="axis.state.supports_hour_angle">
        <span> Angle Units: </span>
        <b-form-radio-group
            size="sm"
            buttons
            button-variant="outline-primary"
            v-model="displayDMS"
            :options="[
                { text: 'HMS', value: false },
                { text: 'DMS', value: true  },
            ]"
        />
      </b-col>

      <b-col sm="auto">
        <b-form-radio-group
            size="sm"
            buttons
            button-variant="outline-primary"
            v-model="closedLoop"
            :options="[
                { text: 'Closed Loop', value: true  },
                { text: 'Open Loop',   value: false },
            ]"
        />
      </b-col>

      <b-col sm="auto" v-if="axis.state.can_track">
        <b-form-radio-group
            size="sm"
            buttons
            button-variant="outline-primary"
            :disabled="!closedLoop"
            v-model="axis.state.tracking"
            v-on:change="setTracking"
            :options="[
                { text: 'Tracking ON',  value: true  },
                { text: 'Tracking OFF', value: false },
            ]"
        />
      </b-col>
      <b-col sm="auto">
      </b-col>
    </b-row>

    <b-row align-content="start" align-h="start" class="text-left">

      <b-col sm="auto">
        <span> Current position </span> <AngleDisplay :angle="displayDMS ? axis.state.position_angle : axis.state.position_astronomical "/>
      </b-col>

      <b-col sm="auto">
        <span> Target </span> <AngleDisplay :angle="displayDMS ? axis.state.target_angle : axis.state.target_astronomical "/>
        <AngleEdit v-bind:angle="newTarget" @update="goto($event)"/>
      </b-col>

    </b-row>


    <b-row align-content="start" align-h="start" class="text-left">
      <b-col sm="auto">
        <span> Nudge </span>
        <b-button size="sm" variant="outline-primary" @click="nudge('down')">
          <font-awesome-icon icon="caret-down" />
        </b-button>
        <b-button size="sm" variant="outline-primary" @click="nudge('up')">
          <font-awesome-icon icon="caret-up" />
        </b-button>
      </b-col>

      <b-col sm="auto">
        <AngleEdit v-bind:angle="nudgeAmount" @change="nudgeAmount = $event" no-update-button/>
      </b-col>
    </b-row>

  </b-container>
</template>

<style scoped>
.offline {
  pointer-events: none;
  color: gray;
  border: 1px solid red;
}
</style>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretUp, faCaretDown  } from '@fortawesome/free-solid-svg-icons'
library.add(faCaretUp);
library.add(faCaretDown);

import AngleDisplay from './AngleDisplay.vue'
import AngleEdit from './AngleEdit.vue'

export default {
  name: 'axis',
  components: {
    AngleDisplay,
    AngleEdit,
  },
  props: {
      axis: {
        type: Object,
        default: function () {
            return {
            }
        }
      }
  },
  data: function () {
    return {
        closedLoop: true,
        displayDMS: true,
        target_angle: {degrees: 0, minutes: 0, seconds: 0},
        target_astronomical: {hours: 0, minutes: 0, seconds: 0},
        nudge_angle: {degrees: 0, minutes: 0, seconds: 0},
        nudge_astronomical: {hours: 0, minutes: 0, seconds: 0},
    }
  },
  computed: {
      newTarget () {
          if (this.displayDMS) {
            return this.target_angle;
          } else {
            return this.target_astronomical;
          }
      },
      nudgeAmount: {
        get () {
          if (this.displayDMS) {
            return this.nudge_angle;
          } else {
            return this.nudge_astronomical;
          }
        },
        set (value) {
          if (this.displayDMS) {
            this.nudge_angle = value;
          } else {
            this.nudge_astronomical = value;
          }
        }
      },
  },
  methods: {
      async update () {
        this.axis.update();
      },
      async goto ($event) {
        this.axis.goto($event);
      },
      async setTracking (value) {
        this.axis.tracking = value;
      },
      async nudge (direction='up') {
        let sign = (direction == 'up') ? 1.0 : -1.0;
        let amount = Object.assign({}, this.nudgeAmount);

        amount.seconds = Math.abs(amount.seconds) * sign;
        amount.minutes = Math.abs(amount.minutes) * sign;
        if (amount.hours !== undefined) {
            amount.hours = Math.abs(amount.hours) * sign;
        } else {
            amount.degrees = Math.abs(amount.degrees) * sign;
        }
        this.axis.goto(amount, {relative: true});
      },
  }
}
</script>
