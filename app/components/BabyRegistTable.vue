<template>
  <FlexboxLayout flexDirection="column">
    <Label text="宝宝的名字" height="70" />
    <!-- <MDTextField v-model="name"/> -->
    <TextField v-model="name" @returnPress="onChange" height="70" />
    <Label text="宝宝的性别" height="70" />
    <ListPicker
      :items="listOfgenders"
      v-model="selectedgender"
      @selectedIndexChange="onChange"
    />
    <Label text="输入出生日期" height="70" @timeChange="onChange" />
    <DatePicker v-model="birthday" />
    <Label text="输入出生时间" height="70"  @timeChange="onChange"/>
    <TimePicker v-model="birthtime" />
    <!-- <MDButton rippleColor="blue" text="提交"  @tap="onButtonTap"/> -->
    <Button @tap="onButtonTap" height="70">
      <FormattedString>
          <Span class="mdi" text="mdi-account-check" style="font-size: large"></Span>
          <Span text="提交" fontAttributes="Bold"></Span>            
      </FormattedString>
    </Button>
  </FlexboxLayout>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
interface Data {
  name: string;
  selectedgender: number;
  birthday: Date;
  birthtime: Date;
  listOfgenders: Array<string>;
}
export default Vue.extend({
  model: {
    prop: "babyinfo",
    event: "change",
  },
  props: {
    babyinfo: Object,
  },
  data(): Data {
    return {
      name: "",
      selectedgender: 0,
      birthday: new Date(),
      birthtime: new Date(),
      listOfgenders: ["male", "female"],
    };
  },
  methods: {
    change() {
      let birthtime = new Date(
        this.birthday.getFullYear(),
        this.birthday.getMonth(),
        this.birthday.getDate(),
        this.birthtime.getHours(),
        this.birthtime.getMinutes(),
        this.birthtime.getSeconds()
      );
      let insertinfo = {
        name: this.name,
        gender: this.listOfgenders[this.selectedgender],
        birthtime: birthtime.toISOString(),
      };
      return insertinfo;
    },
    onChange() {
      let insertinfo = this.change();
      this.$emit("change", insertinfo);
    },
    onButtonTap() {
      let insertinfo = this.change();
      this.$emit("submit", insertinfo);
    },
  },
});
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles
.cus {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}
</style>
