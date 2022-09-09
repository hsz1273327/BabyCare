import Vue from 'nativescript-vue'

import Registbaby from './views/Registbaby.vue'
import Loading from './views/Loading.vue'
// import Awake from './views/Awake.vue'
// import Sleep from './views/Sleep.vue'
import Record from './views/Record.vue'
import { Init, GetOpenData, OpenData } from './models'
import DrawerPlugin from '@nativescript-community/ui-drawer/vue'
import { themer, installMixins } from '@nativescript-community/ui-material-core';
import FloatingActionButtonPlugin from '@nativescript-community/ui-material-floatingactionbutton/vue';
import ButtonPlugin from '@nativescript-community/ui-material-button/vue';
import TextFieldPlugin from '@nativescript-community/ui-material-textfield/vue';
import BottomNavigationBar from '@nativescript-community/ui-material-bottomnavigationbar/vue';
import TabsPlugin from '@nativescript-community/ui-material-tabs/vue';
import CardViewPlugin from '@nativescript-community/ui-material-cardview/vue';




installMixins();

if (global.isIOS) {
  themer.setPrimaryColor('#bff937');
  themer.setAccentColor('#ff8a39');
  themer.setSecondaryColor('#a830d7');
}
Vue.use(FloatingActionButtonPlugin);
Vue.use(BottomNavigationBar);
Vue.use(TabsPlugin);
Vue.use(ButtonPlugin);
Vue.use(TextFieldPlugin);
Vue.use(DrawerPlugin);
Vue.use(CardViewPlugin);
declare let __DEV__: boolean;

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = !__DEV__

const OpenInfo = async (): Promise<OpenData> => {
  await Init()
  let result = await GetOpenData()
  return result
}
interface Data {
  opendata: OpenData
}

new Vue({
  data(): Data {
    return {
      opendata: null,
    };
  },
  render: function (h) {
    if (this.opendata === null) {
      return h('frame', [h(Loading)])
    } else {
      if (this.opendata.isFirstUse) {
        return h('frame', [h(Registbaby)])
      } else {
        let props = {
          babyList: this.opendata.babyList,
          name: this.opendata.babyName
        }
        return h('frame', [h(Record, { props })])
      }
    }
  },
  created: function () {
    OpenInfo().then((res) => {
      console.log("get openinfo")
      console.log(res)
      this.opendata = res
    }).catch((e) => { console.error(e) })
  }
}).$start()
