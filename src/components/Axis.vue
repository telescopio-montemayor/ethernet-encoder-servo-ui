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
  }
}
</script>
