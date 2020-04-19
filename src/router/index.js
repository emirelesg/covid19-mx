import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import State from '@/views/State.vue';
import NotFound from '@/views/NotFound.vue';
import { stateNames } from '@/plugins/helper';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/estado/:stateKey',
    name: 'State',
    component: State,
    beforeEnter: (to, from, next) => {
      if (stateNames[to.params.stateKey.toUpperCase()]) {
        next();
      } else {
        next({ name: 'NotFound' });
      }
    }
  },
  {
    path: '*',
    beforeEnter: (to, from, next) => {
      next({ name: 'NotFound' });
    }
  }
];

const router = new VueRouter({
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

export default router;
