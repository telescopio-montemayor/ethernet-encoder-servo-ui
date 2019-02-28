<template>
    <canvas ref="chartCanvas" width="500px" height="100px">
    </canvas>
</template>

<style scoped>
</style>

<script>
import { TimeSeries, SmoothieChart } from 'smoothie';

export default {
  name: 'chart',
  props: {
      running: {
        default: true,
      },
      delay: {
        type: Number,
        default: 50,
      },
      maxDataSetLength: {
        type: Number,
        default: 10,
      },
      gridStyle: {
        type: Object,
        default () {
            return {
                strokeStyle:'rgb(125, 0, 0)',
                fillStyle:'rgb(60, 0, 0)',
                lineWidth: 1,
                millisPerLine: 500,
                verticalSections: 6,
            };
        }
      },
      labelStyle: {
        type: Object,
        default () {
            return {
                fillStyle:'rgb(255, 255, 0)'
            };
        }
      },
      lineStyle: {
        type: Object,
        default () {
            return {
                strokeStyle:'rgba(0, 255, 0, .8)',
                lineWidth:1,
            };
        }
      },
      chartOptions: {
        type: Object,
        default () {
            return {
                millisPerPixel: 20,
            };
        }
      },
      yFormatter: {
        type: Function,
        default () {
            return SmoothieChart.defaultChartOptions.yIntermediateFormatter
        }
      }
  },

  methods: {
      addData(data, when=undefined) {
        if (when === undefined) {
            when = (new Date()).getTime();
        }
        return this.$dataSeries.append(when, data);
      },
      $updateStyles() {
          Object.assign(this.$chart.getTimeSeriesOptions(this.$dataSeries), SmoothieChart.defaultSeriesPresentationOptions, this.lineStyle);
          Object.assign(this.$chart.options,        SmoothieChart.defaultChartOptions,        this.chartOptions);
          Object.assign(this.$chart.options.grid,   SmoothieChart.defaultChartOptions.grid,   this.gridStyle);
          Object.assign(this.$chart.options.labels, SmoothieChart.defaultChartOptions.labels, this.labelStyle);
      },
      $updateOptions() {
          this.$dataSeries.delay = this.$chart.delay = parseInt(this.delay);
          this.$chart.options.maxDataSetLenght = parseInt(this.maxDataSetLenght);
          this.$chart.options.yMaxFormatter = this.yFormatter || SmoothieChart.defaultChartOptions.yIntermediateFormatter;
          this.$chart.options.yMinFormatter = this.yFormatter || SmoothieChart.defaultChartOptions.yIntermediateFormatter;
          this.$chart.options.yIntermediateFormatter = this.yFormatter || SmoothieChart.defaultChartOptions.yIntermediateFormatter;
      },
  },

  mounted () {
      let chart = this.$chart = new SmoothieChart({
        nonRealtimeData: false,
        millisPerPixel: 20,
        maxDataSetLength: this.maxDataSetLenght,
        yMinFormatter: this.yFormatter,
        yMaxFormatter: this.yFormatter,
        yIntermediateFormatter: this.yFormatter,
      });
      let data1 = this.$dataSeries = new TimeSeries();

      chart.streamTo(this.$refs.chartCanvas, this.delay);
      chart.addTimeSeries(data1);

      this.$updateStyles();
      this.$updateOptions();
  },

  updated () {
      this.$updateStyles();
      this.$updateOptions();
  },

  watch: {
      running () {
          if (this.running) {
            this.$chart.start();
          } else {
            this.$chart.stop();
          }
      }
  },

  beforeDestroy () {
      this.$chart.removeTimeSeries(this.$dataSeries);
      this.$chart.stop();
  }
}
</script>
