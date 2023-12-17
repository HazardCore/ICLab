import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/router'
// import VueRouter from 'vue-router'

import httpClient from './plugins/httpClient';
import errorHandler from "./plugins/errorHandler";

import DiiaLoaderOverlay from './components/custom/DiiaLoaderOverlay.vue';
import DiiaAlertNotification from './components/custom/DiiaAlertNotification.vue';
import DiiaAlertNotificationMultiple from './components/custom/DiiaAlertNotificationMultiple.vue';
import DiiaMessageBox from './components/custom/DiiaMessageBox.vue';

// Vue.use(VueRouter)

Vue.use(httpClient);
Vue.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  Vue.prototype.$config = require('./config/production').default;
} else if (process.env.NODE_ENV === 'staging') {
  Vue.prototype.$config = require('./config/staging').default;
} else {
  // FOR VUE SERVE
  Vue.prototype.$config = require('./config').default;
}


Vue.prototype.$clib = require('./js/common_lib').default;

Vue.component('DiiaLoaderOverlay', DiiaLoaderOverlay);
Vue.component('DiiaAlertNotification', DiiaAlertNotification);
Vue.component('DiiaAlertNotificationMultiple', DiiaAlertNotificationMultiple);
Vue.component('DiiaMessageBox', DiiaMessageBox);

Vue.config.productionTip = false

// App.component('DiiaLoaderOverlay', DiiaLoaderOverlay);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')