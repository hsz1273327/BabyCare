<template>
  <MDCardView
    :elevation="elevation"
    :width="width"
    :height="height"
    :backgroundColor="backgroundColor"
    :rippleColor="rippleColor"
    @tap="onTap"
    @longPress="onLongPress"
  >
    <Label textWrap="true"
      height="70"
      fontSize="24"
      textAlignment="center"
      :backgroundColor="backgroundColor"
    >
      <FormattedString>
        <Span :text="durationTimeString " style="color: red" />
      </FormattedString>
    </Label>
  </MDCardView>
</template>

<script lang="ts">
import Vue from "nativescript-vue";

const sec2str = (input: number): string => {
  let sec_num = Math.trunc(input / 1000);
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - hours * 3600) / 60);
  let seconds = sec_num - hours * 3600 - minutes * 60;
  let hoursstring = hours < 10 ? `0${hours}` : `${hours}`;
  let minutesstring = minutes < 10 ? `0${minutes}` : `${minutes}`;
  let secondsstring = seconds < 10 ? `0${seconds}` : `${seconds}`;
  let time = `${hoursstring}:${minutesstring}:${secondsstring}`;
  return time;
};
interface Data {
  startTime: Date;
  cycle: number;
  duration: number;
}
export default Vue.extend({
  props: {
    title: {
      type: String,
      default: "",
    },
    withStart: {
      type: [Boolean, Date],
      default: false,
    },
    canHandle: {
      type: Boolean,
      default: false,
    },
    elevation: {
      type: String,
      default: "5",
    },
    width: {
      type: String,
      default: "200",
    },
    height: {
      type: String,
      default: "200",
    },
    rippleColor: {
      type: String,
      default: "white",
    },
    backgroundColor: {
      type: String,
      default: "white",
    },
  },
  data(): Data {
    return {
      startTime: null,
      cycle: null,
      duration: 0,
    };
  },
  computed: {
    durationTimeString(): string {
      let timestr = sec2str(this.duration);
      if (this.title !== "") {
        return `${this.title}: ${timestr}`;
      }
      return timestr;
    },
  },
  methods: {
    continue() {
      if (this.startTime !== null && this.cycle === null) {
        this.cycle = setInterval(() => {
          let now = new Date();
          this.duration = now.valueOf() - this.startTime.valueOf();
        }, 1000);
      } else {
        console.error("timer continue not run");
        console.error(this.startTime);
        console.error(this.cycle);
      }
    },
    start(): Date | null {
      if (this.startTime !== null) {
        console.error("timer start not run");
        return null;
      }
      this.startTime = new Date();
      this.continue();
    },
    stop(): Date | null {
      if (typeof this.cycle === "number") {
        clearInterval(this.cycle);
        this.cycle = null;
        console.error("timer stoped");
        return new Date();
      } else {
        console.error("timer stop not run");
        console.error(this.cycle);
        return null;
      }
    },
    reset() {
      this.stop();
      this.startTime = null;
    },
    restart() {
      this.reset();
      this.start();
    },
    onTap() {
      if (this.canHandle) {
        if (this.startTime === null) {
          this.start();
          this.$emit("TimerStart", { start: this.startTime });
        } else {
          if (this.cycle === null) {
            this.continue();
            this.$emit("TimerContinue", { start: this.startTime });
          } else {
            let now = this.stop();
            this.$emit("TimerStop", {
              start: this.startTime,
              end: now,
            });
          }
        }
      }
    },
    onLongPress() {
      if (this.canHandle) {
        if (this.startTime !== null) {
          this.reset();
        }
        this.$emit("TimerReset");
      }
    },
  },
  mounted() {
    if (typeof this.withStart === "boolean") {
      if (this.withStart) {
        this.start();
        this.$emit("TimerStart", { start: this.startTime });
      }
    } else {
      this.startTime = this.withStart;
      this.continue();
      this.$emit("TimerContinue", { start: this.startTime });
    }
  },
  beforeDestroy() {
    this.stop();
  },
});
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.fas {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}
</style>
