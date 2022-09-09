<template>
  <Page actionBarHidden="true">
    <!-- <ActionBar title="Baby Care">
      <Label text="BabyCare" />
    </ActionBar> -->

    <ActivityIndicator busy="true"></ActivityIndicator>
  </Page>
</template>

<script lang="ts">
import Vue from "nativescript-vue";

export default Vue.extend({
  computed: {
    message() {
      return "app Loading page";
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
