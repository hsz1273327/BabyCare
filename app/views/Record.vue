<template>
  <Page>
    <ActionBar :title="actionbarTitle" :backgroundColor="genderColor">
      <ActionItem
        @tap="changeBabySleepStatus"
        ios.position="left"
        android.position="actionBar"
        :icon="actionbarSleepFont"
        class="mdi"
      />
      <ActionItem
        @tap="changeBabyDiseaseStatus"
        ios.position="left"
        android.position="actionBar"
        :icon="actionbarDiseaseFont"
        class="mdi"
      />
      <ActionItem
        v-show="babyList.length > 1"
        @tap="changeBaby"
        ios.position="left"
        android.position="actionBar"
        icon="font://mdi-clipboard-list-outline"
        class="mdi"
      />
      <ActionItem
        @tap="toRegistBaby"
        ios.position="left"
        android.position="actionBar"
        icon="font://mdi-clipboard-plus-outline"
        class="mdi"
      />
    </ActionBar>
    <GridLayout
      class="page"
      :backgroundColor="diseaseStatusColor"
      rows="*, auto"
    >
      <template v-if="sleepingstatus !== false">
        <TimerCard
          row="0"
          width="200"
          height="200"
          title="睡眠时间"
          :backgroundColor="diseaseStatusColor"
          :withStart="sleepingstatus"
        ></TimerCard>

        <!-- <Button text="醒了" @tap="changeBabySleepStatus" /> -->
      </template>
      <template v-else>
        <FlexboxLayout row="0" flexDirection="column" justifyContent="center">
          <template v-if="eatstatus !== 'NotEating'">
            <TimerCard
              width="200"
              height="200"
              title="吃饭时长"
              canHandle
              :backgroundColor="diseaseStatusColor"
              :withStart="eatingattime"
              @TimerStop="onRecordEatingEnd"
            ></TimerCard>
          </template>
          <template v-else>
            <MDCardView
              rippleColor="blue"
              width="200"
              height="200"
              backgroundColor="green"
              @tap="onRecordEating"
            >
              <Label text="吃饭" />
            </MDCardView>
          </template>
          <MDCardView
            rippleColor="blue"
            width="200"
            height="200"
            backgroundColor="green"
            @tap="onRecordPooPoo"
          >
            <Label text="排便" />
          </MDCardView>
        </FlexboxLayout>
      </template>
      <MDBottomNavigationBar
        ref="bottomBar"
        row="1"
        activeColor="green"
        inactiveColor="brown"
        selectedTabIndex="0"
        :backgroundColor="genderColor"
        class="mdi"
        @tabSelected="onBottomNavigationTabSelected"
      >
        <MDBottomNavigationTab
          title="记录"
          icon="font://mdi-human-baby-changing-table"
          class="mdi"
        />
        <MDBottomNavigationTab
          title="分析"
          icon="font://mdi-chart-bar"
          class="mdi"
        />
      </MDBottomNavigationBar>
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";
import Registbaby from "./Registbaby.vue";
import { TabSelectedEventData } from "@nativescript-community/ui-material-bottomnavigationbar";
import { ChangeToBaby, BabyInfo, GetBabyInfo } from "../models";
import TimerCard from "../components/TimerCard.vue";
import Analyse from "./Analyse.vue";

interface Data {
  babyname: string;
  babygender: string;
  babybirthtime: string;
  sleepingstatus: boolean | Date;
  eatstatus: string;
  eatingattime: boolean | Date;
  diseasestatus: boolean;
}

export default Vue.extend({
  components: {
    TimerCard,
    // Test,
  },
  props: {
    name: String,
    // gender: String,
    // birthtime: String,
    // sleeping: Boolean,
    // eating: String,
    // diseased: Boolean,
    babyList: Array,
  },
  data: function (): Data {
    return {
      babyname: this.name,
      babygender: "",
      babybirthtime: "",
      sleepingstatus: false,
      eatstatus: "NotEating",
      eatingattime: false,
      diseasestatus: false,
    };
  },
  computed: {
    actionbarTitle() {
      return `小宝宝${this.babyname}`;
    },
    actionbarSleepFont() {
      if (this.sleepingstatus !== false) {
        return "font://mdi-sleep-off";
      }
      return "font://mdi-sleep";
    },
    actionbarDiseaseFont() {
      if (this.diseasestatus) {
        return "font://mdi-pill-off";
      }
      return "font://mdi-pill-multiple";
    },
    diseaseStatusColor() {
      if (this.diseasestatus) {
        return "#B0E0E6";
      }
      return "#FCE6C9";
    },
    genderColor() {
      if (this.babygender == "male") {
        return "#33A1C9";
      }
      return "#FFC0CB";
    },
  },
  mounted() {
    ChangeToBaby(this.name)
      .then((res) => {
        return GetBabyInfo(res);
      })
      .then((res: BabyInfo) => {
        this.babyname = res.name;
        this.babygender = res.gender;
        this.babybirthtime = res.birthtime;
        this.sleepingstatus = res.sleeping;
        this.eatstatus = res.eating;
        this.eatingattime = res.eatingattime;
        this.diseasestatus = res.diseased;
      })
      .catch((e) => {
        console.log(`changeBaby get err ${e}`);
      });
  },
  methods: {
    changeBabySleepStatus() {
      let event;
      if (this.sleepingstatus === false) {
        event = "StartSleep";
      } else {
        event = "ENDSleep";
      }
      this.sleepingstatus = !this.sleepingstatus;
      console.log(`event ${event}`);
    },
    changeBabyDiseaseStatus() {
      let event;
      if (this.diseasestatus === false) {
        event = "StartDiseased";
      } else {
        event = "EndDiseased";
      }
      this.diseasestatus = !this.diseasestatus;
      console.log(`event ${event}`);
    },
    onRecordPooPoo() {
      let event = "PooPoo";
      //todo
      console.log(`event ${event}`);
    },
    onRecordEating() {
      global
        .action("选择食物", "退出", ["母乳", "牛奶", "辅食"])
        .then((result) => {
          this.eatingattime = new Date();
          switch (result) {
            case "辅食":
              {
                this.eatstatus = "StartComplementaryFeeding";
              }
              break;
            case "牛奶":
              {
                this.eatstatus = "StartMilkFeeding";
              }
              break;
            default: {
              this.eatstatus = "StartBreastFeeding";
            }
          }
          let event = this.eatstatus;

          //todo
          console.log(`event ${event} @ ${this.eatingattime}`);
        });
    },
    onRecordEatingEnd(timerstopinfo) {
      let event;
      switch (this.eatstatus) {
        case "StartComplementaryFeeding":
          {
            event = "ENDComplementaryFeeding";
          }
          break;
        case "StartMilkFeeding":
          {
            event = "ENDMilkFeeding";
          }
          break;
        default: {
          event = "ENDBreastFeeding";
        }
      }
      //todo
      console.log(`event ${event} @ ${timerstopinfo.end}`);
      this.eatstatus = "NotEating";
    },
    toRegistBaby() {
      this.$navigateTo(Registbaby);
    },
    changeBaby() {
      global
        .action("选择宝宝", "退出", this.babyList)
        .then((res: string) => {
          if (res === "退出") {
            throw "exit change baby";
          }
          return ChangeToBaby(res);
        })
        .then((res) => {
          return GetBabyInfo(res);
        })
        .then((res: BabyInfo) => {
          this.babyname = res.name;
          this.babygender = res.gender;
          this.babybirthtime = res.birthtime;
          this.sleepingstatus = res.sleeping;
          this.eatstatus = res.eating;
          this.diseasestatus = res.diseased;
        })
        .catch((e) => {
          console.log(`changeBaby get err ${e}`);
        });
    },
    onBottomNavigationTabSelected(args: TabSelectedEventData): void {
      console.log(`old tab index:  ${args.oldIndex}`);
      console.log(`selected tab index:  ${args.newIndex}`);
      // this.currentTab = args.newIndex;
      if (args.newIndex == 1) {
        this.$navigateTo(Analyse, {
          transition: "fade",
          props: {
            name: this.babyname,
            gender: this.babygender,
            birthtime: this.babybirthtime,
            sleeping: this.sleepingstatus,
            eating: this.eatstatus,
            diseased: this.diseasestatus,
            babyList: this.babyList,
          },
        });
      }
    },
  },
});
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

.bticon {
  padding: 0 0 0 0;
}
// Custom styles
.cus {
  @include colorize($color: accent);
}

.info {
  font-size: 20;
  horizontal-align: center;
  vertical-align: center;
}
.botom-nav {
  active-color: green;
  inactive-color: black;
  background-color: blue;
}
</style>
