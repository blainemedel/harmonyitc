// Gene - Nov, 23, 2026: Vue Router 4 history configuration, route metadata, canonical/OG synchronization, and hash scrolling
import { createRouter, createWebHistory } from 'vue-router';
import { SITE_META } from '@/data/siteContent';
import HomeView from '@/views/HomeView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Harmony IT Consultancy — Practical Web & Business Systems',
      description:
        'Harmony IT Consultancy builds custom websites and web tools around how your business operates, helping fix workflow bottlenecks, strengthen your online presence, simplify daily tasks, and grow steady revenue.'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'About Us — Harmony IT Consultancy',
      description:
        'Meet Paulo, Gene, and Bry at Harmony IT Consultancy. We build practical websites, dependable backends, and clean user experiences tailored to your team.'
    }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
    meta: {
      title: 'Projects — Harmony IT Consultancy',
      description:
        'Explore live SwitchFiber web platforms built by Harmony IT Consultancy: SwitchFiber Admin Network Management, the SwitchFiber Public & Subscriber Portal, and the Field Technician Terminal.'
    }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      title: 'Contact Us — Harmony IT Consultancy',
      description:
        'Start a conversation with Harmony IT Consultancy. Put together a quick project brief and connect directly with Paulo, Gene, and Bry.'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Page Not Found — Harmony IT Consultancy',
      description: 'The requested page could not be found on Harmony IT Consultancy.'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  }
});

function setMetaContent(selector, content) {
  const el = document.querySelector(selector);
  if (el && content) {
    el.setAttribute('content', content);
  }
}

router.afterEach((to) => {
  const { title, description } = to.meta || {};
  const resolvedTitle = title || `${SITE_META.brandName}`;
  const canonicalPath = to.path === '/' ? '/' : to.path.replace(/\/+$/, '');
  const canonicalUrl = `${SITE_META.domain}${canonicalPath}`;

  document.title = resolvedTitle;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', resolvedTitle);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonicalUrl);
  setMetaContent('meta[name="twitter:title"]', resolvedTitle);
  setMetaContent('meta[name="twitter:description"]', description);

  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.setAttribute('href', canonicalUrl);
  }
});

export default router;
