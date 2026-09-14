import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MarketplaceView from '../views/MarketplaceView.vue'
import LoadAuditView from '../views/LoadAuditView.vue'
import ContactView from '../views/ContactView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { title: 'Home' }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/AboutView.vue'),
        meta: { title: 'About Us' }
    },
    {
        path: '/services',
        name: 'Services',
        component: () => import('../views/ServicesView.vue'),
        meta: { title: 'Our Services' }
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('../views/ProjectsView.vue'),
        meta: { title: 'Featured Projects' }
    },
    {
        path: '/marketplace',
        name: 'Marketplace',
        component: MarketplaceView,
        meta: { title: 'Marketplace' }
    },
    {
        path: '/product/:id',
        name: 'Product',
        component: () => import('../views/ProductView.vue'),
        meta: { title: 'Product Details' }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/CartView.vue'),
        meta: { title: 'Shopping Cart' }
    },
    {
        path: '/load-audit',
        name: 'LoadAudit',
        component: LoadAuditView,
        meta: { requiresAuth: true, title: 'Power Load Calculator' }
    },
    {
        path: '/contact',
        name: 'Contact',
        component: ContactView,
        meta: { title: 'Contact Us' }
    },
    {
        path: '/refund-policy',
        name: 'RefundPolicy',
        component: () => import('../views/RefundPolicyView.vue'),
        meta: { title: 'Refund Policy' }
    },
    {
        path: '/use-policy',
        name: 'AcceptableUsePolicy',
        component: () => import('../views/AcceptableUsePolicyView.vue'),
        meta: { title: 'Acceptable Use Policy' }
    },
    {
        path: '/blog',
        name: 'Blog',
        component: () => import('../views/BlogView.vue'),
        meta: { title: 'Energy Blog & Insights' }
    },
    {
        path: '/blog/:slug',
        name: 'BlogPost',
        component: () => import('../views/BlogPostView.vue'),
        meta: { title: 'Blog Post' }
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('../views/CheckoutView.vue'),
        meta: { requiresAuth: true, title: 'Checkout' }
    },
    {
        path: '/order-success',
        name: 'OrderSuccess',
        component: () => import('../views/OrderSuccessView.vue'),
        meta: { requiresAuth: true, title: 'Order Placed Successfully' }
    },
    {
        path: '/account',
        component: () => import('../views/Account/AccountLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/account/dashboard'
            },
            {
                path: 'dashboard',
                name: 'AccountDashboard',
                component: () => import('../views/Account/Overview.vue'),
                meta: { title: 'Account Dashboard' }
            },
            {
                path: 'orders',
                name: 'AccountOrders',
                component: () => import('../views/Account/Orders.vue'),
                meta: { title: 'My Orders' }
            },
            {
                path: 'orders/:id',
                name: 'AccountOrderDetails',
                component: () => import('../views/Account/OrderDetails.vue'),
                meta: { title: 'Order Details' }
            },
            {
                path: 'vendor',
                name: 'AccountVendor',
                component: () => import('../views/Account/Vendor.vue'),
                meta: { title: 'Vendor Dashboard' }
            },
            {
                path: 'market',
                name: 'AccountMarket',
                component: () => import('../views/Account/MarketDashboard.vue'),
                meta: { title: 'Marketplace Dashboard' }
            },
            {
                path: 'consultations',
                name: 'AccountConsultations',
                component: () => import('../views/Account/Consultations.vue'),
                meta: { title: 'My Consultations' }
            },
            {
                path: 'profile',
                name: 'AccountProfile',
                component: () => import('../views/Account/Profile.vue'),
                meta: { title: 'My Profile' }
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { guestOnly: true, title: 'Login' }
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('../views/SignupView.vue'),
        meta: { guestOnly: true, title: 'Sign Up' }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/ForgotPasswordView.vue'),
        meta: { guestOnly: true, title: 'Forgot Password' }
    },
    {
        path: '/verify-email',
        name: 'VerifyEmail',
        component: () => import('../views/VerifyEmailView.vue'),
        meta: { title: 'Verify Email' }
    },
    {
        path: '/origin-talk',
        name: 'OriginTalk',
        component: () => import('@/views/EnergyAIView.vue'),
        meta: { requiresAuth: true, title: 'Origin Talk - AI Energy Consultant' }
    },
    {
        path: '/sales-chat',
        name: 'SalesChat',
        component: () => import('../views/SalesChatView.vue'),
        meta: { title: 'Solar Consultation Chat - Origin Electric' }
    },
    {
        path: '/sales',
        redirect: { name: 'SalesChat' }
    },
    {
        path: '/chat',
        redirect: { name: 'SalesChat' }
    },
    {
        path: '/vendor-apply',
        name: 'VendorApply',
        component: () => import('@/views/VendorApplicationView.vue'),
        meta: { requiresAuth: true, title: 'Apply as Vendor' }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0, behavior: 'smooth' }
        }
    }
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isVerified = user.is_verified;

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({ name: 'Login', query: { redirect: to.fullPath } });
        } else if (!isVerified) {
            next({ name: 'VerifyEmail', query: { email: user.email } });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guestOnly)) {
        if (isAuthenticated && isVerified) {
            next({ name: 'AccountDashboard' });
        } else {
            next();
        }
    } else {
        next();
    }
});

router.afterEach((to) => {
    const defaultTitle = 'Origin Electric | Smart Energy & Security Solutions';
    if (to.meta && to.meta.title) {
        if (to.meta.title === 'Home') {
            document.title = defaultTitle;
        } else {
            document.title = `${to.meta.title} | Origin Electric`;
        }
    } else {
        document.title = defaultTitle;
    }

    // Dynamic Canonical Link Sync
    const baseDomain = 'https://originelectric.com';
    const canonicalUrl = `${baseDomain}${to.path === '/' ? '' : to.path}`;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
});

export default router
