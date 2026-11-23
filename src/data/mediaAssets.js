// Gene - Nov, 23, 2026: Vite-bundled static image assets mapped by key for Vue components
import harmonyLogo from '@/assets/harmony-logo.png';
import harmonyIcon from '@/assets/harmony-icon.png';
import pauloPhoto from '@/assets/founders/paulo.jpg';
import genePhoto from '@/assets/founders/gene.jpg';
import bryPhoto from '@/assets/founders/bry.jpg';
import switchfiberAdmin from '@/assets/projects/switchfiber-admin.png';
import switchfiberSubscriber from '@/assets/projects/switchfiber-subscriber.png';
import switchfiberMobile from '@/assets/projects/switchfiber-mobile.png';

export const BRAND_ASSETS = {
  logo: harmonyLogo,
  icon: harmonyIcon
};

export const FOUNDER_PHOTOS = {
  paulo: pauloPhoto,
  gene: genePhoto,
  bry: bryPhoto
};

export const PROJECT_THUMBNAILS = {
  'switchfiber-admin': switchfiberAdmin,
  'switchfiber-subscriber': switchfiberSubscriber,
  'switchfiber-mobile': switchfiberMobile
};
