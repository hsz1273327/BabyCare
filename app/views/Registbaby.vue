<template>
  <Page>
    <ActionBar>
      <Label text="请填写宝宝的基本信息" />
    </ActionBar>

    <BabyRegistTable v-model="babyinfo" @submit="onButtonTap"></BabyRegistTable>
    <!-- <FlexboxLayout flexDirection="column"> -->

    <!-- </FlexboxLayout> -->
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import { RegistBaby, BabyInfoBaseModel } from "../models";
import BabyRegistTable from "../components/BabyRegistTable.vue";
// import Test from "../components/Test.vue";
import Record from "./Record.vue";
interface Data {
  babyinfo: BabyInfoBaseModel;
}
export default Vue.extend({
  components: {
    BabyRegistTable,
    // Test,
  },
  data(): Data {
    return {
      babyinfo: { name: "", gender: "male", birthtime: "" },
    };
  },
  methods: {
    onButtonTap(insertinfo) {
      console.log(`get insert`);
      console.log(insertinfo);
      if (insertinfo.name === "") {
        alert(`注册失败: 需要有宝宝的名字`);
        return;
      }
      RegistBaby(insertinfo)
        .then((res) => {
          this.$navigateTo(Record, {
            transition: "fade",
            props: {
              name: insertinfo.name,
              babyList: res,
            },
          });
        })
        .catch((err) => {
          alert(`注册失败:${err}`);
        });
    },
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
