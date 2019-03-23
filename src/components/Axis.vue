<template>
  <b-container fluid :class="{'offline border border-danger rounded': !$encoder.online}" class="mb-5">
    <h4 class="text-sm-left"> {{ axis.state.name }} <small> <span v-show="!$encoder.online" class="badge xbadge-pill badge-danger"> offline </span></small> </h4>

    <b-row align-content="start" align-h="start" align-v="center" class="text-left align-items-sm-center my-3">
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
            v-model="axis.state.closed_loop"
            v-on:change="setClosedLoop"
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
            :disabled="!axis.state.closed_loop"
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

    <b-row align-content="start" align-h="start" align-v="center" class="text-left align-items-sm-center my-3">

      <b-col sm="auto">
        <span> Current position </span> <AngleDisplay :angle="displayDMS ? axis.state.position_angle : axis.state.position_astronomical "/>
      </b-col>

      <b-col sm="auto">
        <span> Target </span>
        <AngleDisplay :angle="displayDMS ? axis.state.target_angle : axis.state.target_astronomical" v-b-toggle="`target-${ axis.$id }`"/>
        <b-button size="sm" variant="outline-primary" v-b-toggle="`target-${ axis.$id }`">
          <font-awesome-icon icon="edit" />
        </b-button>
      </b-col>

      <b-col sm="auto">
        <b-collapse :id="`target-${ axis.$id }`" size="sm">
            <AngleEdit v-bind:angle="newTarget" @update="goto($event); $root.$emit('bv::toggle::collapse', `target-${ axis.$id }`)"/>
        </b-collapse>
      </b-col>

    </b-row>


    <b-row align-content="start" align-h="start" align-v="center" class="text-left align-items-sm-center my-3">
      <b-col sm="auto">
        <span> Nudge </span>
        <b-button size="sm" variant="outline-primary" @click="nudge('down')">
          <font-awesome-icon icon="caret-down" />
        </b-button>
        <b-button size="sm" variant="outline-primary" @click="nudge('up')">
          <font-awesome-icon icon="caret-up" />
        </b-button>
        <b-button size="sm" variant="outline-primary" v-b-toggle="`nudge-${ axis.$id }`">
          <font-awesome-icon icon="edit" />
        </b-button>
      </b-col>

      <b-col sm="auto">
        <b-collapse :id="`nudge-${ axis.$id }`" size="sm">
          <AngleEdit v-bind:angle="nudgeAmount" @change="nudgeAmount = $event" no-update-button/>
        </b-collapse>
      </b-col>
    </b-row>

    <b-row align-content="start" align-h="start" align-v="center" class="text-left align-items-sm-center my-3" v-b-toggle="`error-chart-${ axis.$id }`">
      <b-col sm="auto">
        <span> Position error </span>
        <AngleDisplay :angle="positionError"/>
        <b-button size="sm" variant="outline-primary">
            Toggle Plot
        </b-button>
        <b-collapse :id="`error-chart-${ axis.$id }`" size="sm">
          <chart ref="errorChart" :running="$encoder.online" :y-formatter="formatErrorValue"> </chart>
        </b-collapse>
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
[role="button"] {
  cursor: pointer;
}
</style>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCaretUp, faCaretDown, faEdit  } from '@fortawesome/free-solid-svg-icons'
library.add(faCaretUp);
library.add(faCaretDown);
library.add(faEdit);

import AngleDisplay from './AngleDisplay.vue'
import AngleEdit from './AngleEdit.vue'
import Chart from './Chart.vue'

import { AnglePosition, AstronomicalPosition, decimal_to_dms } from '../units';

export default {
  name: 'axis',
  components: {
    AngleDisplay,
    AngleEdit,
    Chart,
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
        displayDMS: true,
        target_angle: {degrees: 0, minutes: 0, seconds: 0},
        target_astronomical: {hours: 0, minutes: 0, seconds: 0},
        nudge_angle: {degrees: 0, minutes: 0, seconds: 0},
        nudge_astronomical: {hours: 0, minutes: 0, seconds: 0},
    }
  },
  computed: {
      positionError () {
          let target, currentPosition, delta;
          let state = this.axis.state;

          if (this.displayDMS) {
            target = new AnglePosition(state.target_angle);
            currentPosition = new AnglePosition(state.position_angle);
          } else {
            target = new AstronomicalPosition(state.target_astronomical);
            currentPosition = new AstronomicalPosition(state.position_astronomical);
          }


          delta = target.to_decimal() - currentPosition.to_decimal();
          if (this.displayDMS) {
            return AnglePosition.from_decimal(delta);
          } else {
            return AstronomicalPosition.from_decimal(delta);
          }
      },

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
      async goto ($event) {
        this.axis.goto($event);
      },
      async setTracking (value) {
        this.axis.tracking = value;
      },
      async setClosedLoop (value) {
        this.axis.closed_loop = value;
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
      onAxisUpdate () {
          let error = this.positionError.to_decimal();
          this.$refs.errorChart.addData(error);
      },
      formatErrorValue(error) {
          let unit = this.displayDMS ? 'D' : 'H';
          let parsed = decimal_to_dms(error);

          let dh = parsed.degrees;
          let m  = parsed.minutes;
          let s  = parsed.seconds.toPrecision(2);
          return `${dh}${unit} : ${m}M : ${s}S`;
      }
  },

  mounted () {
    this.axis.$on('update', this.onAxisUpdate, this);
  },

  beforeDestroy () {
    this.axis.$off('update', this.onAxisUpdate, this);
  }
}
</script>
