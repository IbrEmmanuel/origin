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
        meta: {
            title: 'Home',
            description:
                'Origin Electric — solar, inverters, CCTV, and engineering for homes and industry in Nigeria. Shop the marketplace and book consultations.'
        }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/AboutView.vue'),
        meta: {
            title: 'About Us',
            description:
                'Learn about Origin Electric — Nigerian solar, security, and electrical engineering experts serving homes and industry.'
        }
    },
    {
        path: '/services',
        name: 'Services',
        component: () => import('../views/ServicesView.vue'),
        meta: {
            title: 'Our Services',
            description:
                'Solar installation, inverter systems, CCTV, access control, fire detection, and M&E protective drawings from Origin Electric.'
        }
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import('../views/ProjectsView.vue'),
        meta: {
            title: 'Featured Projects',
            description:
                'Featured Origin Electric solar and security projects across Nigeria.'
        }
    },
    {
        path: '/marketplace',
        name: 'Marketplace',
        component: MarketplaceView,
        meta: {
            title: 'Marketplace',
            description:
                'Buy solar batteries, inverters, CCTV, and energy products online from Origin Electric marketplace — Nigeria delivery.'
        }
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
        meta: {
            title: 'Power Load Calculator',
            description:
                'Free power load calculator — size your solar and inverter needs with Origin Electric.'
        }
    },
    {
        path: '/contact',
        name: 'Contact',
        component: ContactView,
        meta: {
            title: 'Contact Us',
            description:
                'Contact Origin Electric for solar quotes, security systems, and engineering consultations in Nigeria.'
        }
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
        meta: {
            title: 'Energy Blog & Insights',
            description:
                'Solar, inverter, and security insights from Origin Electric — practical guides for Nigerian homes and businesses.'
        }
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
                meta: {
                    title: 'Vendor Dashboard',
                    // Only approved suppliers (admin-approved) may open the hub
                    requiresVendorApproved: true
                }
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
        meta: { title: 'Origin Customer Care Agent' }
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

router.beforeEach(async (to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isVerified = user.is_verified;

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            next({ name: 'Login', query: { redirect: to.fullPath } });
            return;
        }
        if (!isVerified) {
            next({ name: 'VerifyEmail', query: { email: user.email } });
            return;
        }
    } else if (to.matched.some(record => record.meta.guestOnly)) {
        if (isAuthenticated && isVerified) {
            next({ name: 'AccountDashboard' });
            return;
        }
        next();
        return;
    }

    // Supplier hub: block until admin approves the vendor application
    if (to.matched.some((record) => record.meta.requiresVendorApproved)) {
        if (!isAuthenticated) {
            next({ name: 'Login', query: { redirect: to.fullPath } });
            return;
        }
        try {
            const { default: vendorService } = await import('@/services/vendor.service');
            const data = await vendorService.getStatus();
            const status = String(data?.status || '').toLowerCase();
            if (status !== 'approved') {
                next({
                    name: 'VendorApply',
                    query: { waiting: status || 'apply' }
                });
                return;
            }
        } catch {
            next({ name: 'VendorApply', query: { waiting: 'apply' } });
            return;
        }
    }

    next();
});

router.afterEach((to) => {
    // Dynamic pages (product / blog post) set richer SEO themselves after data loads.
    if (to.name === 'Product' || to.name === 'BlogPost') return;

    const isPrivate = to.matched.some(
        (r) => r.meta?.requiresAuth || r.path.startsWith('/account')
    );

    import('@/composables/useSeo').then(({ applySeo, organizationJsonLd }) => {
        const title =
            to.meta?.title === 'Home' || !to.meta?.title
                ? null
                : to.meta.title;
        applySeo({
            title,
            description: to.meta?.description || undefined,
            path: to.path,
            type: 'website',
            noindex: isPrivate,
            jsonLd: to.name === 'Home' && !isPrivate ? organizationJsonLd() : undefined,
            jsonLdId: 'page'
        });
    });
});

export default router
