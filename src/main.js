import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import { routes } from './routes';
import * as VueGoogleMaps from "vue2-google-maps";
import VueDisqus from 'vue-disqus'
import firebase from 'firebase';

Vue.use(VueDisqus);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDlI-Xwfk5NCsv4cUeL7rNND7cYkanUdxw",
    libraries: "places" // necessary for places input
  }
});

Vue.use(VueRouter);


const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});

// Router guard checks if AuthRequired
router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('SignUp')
  else if (!requiresAuth && currentUser) next()
  else next()
})

let app;

//Initialize the app after Firebase has iniitalized

firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      render: h => h(App)
    });
  }
})

