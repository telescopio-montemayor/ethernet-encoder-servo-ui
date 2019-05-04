import Vue from 'vue'
import App from './App.vue'

import Encoder from './encoder_api';

// Edit as needed
Vue.use(Encoder, 'http://localhost:5000', {
  auth: {
    username: 'some-user-name',
    password: 'a-very-secret-password'
  }
});

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

import 'bootswatch/dist/cyborg/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
