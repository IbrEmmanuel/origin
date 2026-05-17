import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MarketplaceView from '../views/MarketplaceView.vue'
import LoadAuditView from '../views/LoadAuditView.vue'
import ContactView from '../views/ContactView.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/marketplace',
        name: 'Marketplace',
        component: MarketplaceView
    },
    {
        path: '/product/:id',
        name: 'Product',
        component: () => import('../views/ProductView.vue')
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../views/CartView.vue')
    },
    {
        path: '/load-audit',
        name: 'LoadAudit',
        component: LoadAuditView,
        meta: { requiresAuth: true }
    },
    {
        path: '/contact',
        name: 'Contact',
        component: ContactView
    },
    {
        path: '/refund-policy',
        name: 'RefundPolicy',
        component: () => import('../views/RefundPolicyView.vue')
    },
    {
        path: '/use-policy',
        name: 'AcceptableUsePolicy',
        component: () => import('../views/AcceptableUsePolicyView.vue')
    },
    {
        path: '/blog',
        name: 'Blog',
        component: () => import('../views/BlogView.vue')
    },
    {
        path: '/blog/:slug',
        name: 'BlogPost',
        component: () => import('../views/BlogPostView.vue')
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('../views/CheckoutView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/order-success',
        name: 'OrderSuccess',
        component: () => import('../views/OrderSuccessView.vue'),
        meta: { requiresAuth: true }
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
                component: () => import('../views/Account/Overview.vue')
            },
            {
                path: 'orders',
                name: 'AccountOrders',
                component: () => import('../views/Account/Orders.vue')
            },
            {
                path: 'orders/:id',
                name: 'AccountOrderDetails',
                component: () => import('../views/Account/OrderDetails.vue')
            },
            {
                path: 'vendor',
                name: 'AccountVendor',
                component: () => import('../views/Account/Vendor.vue')
            },
            {
                path: 'market',
                name: 'AccountMarket',
                component: () => import('../views/Account/MarketDashboard.vue')
            },
            {
                path: 'consultations',
                name: 'AccountConsultations',
                component: () => import('../views/Account/Consultations.vue')
            },
            {
                path: 'profile',
                name: 'AccountProfile',
                component: () => import('../views/Account/Profile.vue')
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('../views/SignupView.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/ForgotPasswordView.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/verify-email',
        name: 'VerifyEmail',
        component: () => import('../views/VerifyEmailView.vue')
    },
    {
        path: '/origin-talk',
        name: 'OriginTalk',
        component: () => import('@/views/EnergyAIView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor-apply',
        name: 'VendorApply',
        component: () => import('@/views/VendorApplicationView.vue'),
        meta: { requiresAuth: true }
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

export default router
