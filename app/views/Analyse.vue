<template>
  <Page>
    <ActionBar :title="actionbarTitle">
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
    <GridLayout class="page" backgroundColor="white" rows="*, auto">
      <!-- <MDTabs row="0" :selectedIndex="currentTab" swipeEnabled="false">
        <MDTabContentItem>
          <GridLayout class="p-20">
            <Label
              class="h1 text-center"
              text="First tab"
              textWrap="true"
            ></Label>
            <Button
              text="select sthird"
              @tap="selectThird"
              horizontalAlignment="center"
              verticalAlignment="bottom"
            />
          </GridLayout>
        </MDTabContentItem>
        <MDTabContentItem>
          <GridLayout class="p-20">
            <Label
              class="h1 text-center"
              text="Third tab"
              textWrap="true"
            ></Label>
          </GridLayout>
        </MDTabContentItem>
      </MDTabs> -->
      <MDBottomNavigationBar
        ref="bottomBar"
        row="1"
        activeColor="green"
        inactiveColor="brown"
        selectedTabIndex="1"
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
import { ChangeToBaby, BabyInfo } from "../models";
import Record from "./Record.vue";

interface Data {
  babyname: string;
}

export default Vue.extend({
  props: {
    name: String,
    babyList: Array,
  },
  data: function (): Data {
    return {
      babyname: this.name,
    };
  },
  computed: {
    actionbarTitle() {
      return `Baby Care/Analyse/${this.babyname}`;
    },
  },
  methods: {
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
        .then((res: string) => {
          this.babyname = res;
        })
        .catch((e) => {
          console.log(`changeBaby get err ${e}`);
        });
    },
    onBottomNavigationTabSelected(args: TabSelectedEventData): void {
      console.log(`old tab index:  ${args.oldIndex}`);
      console.log(`selected tab index:  ${args.newIndex}`);
      if (args.newIndex == 0) {
        this.$navigateTo(Record, {
          transition: "fade",
          props: {
            name: this.babyname,
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
