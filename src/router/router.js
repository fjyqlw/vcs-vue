
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录'
    },
    component: () => import('@/views/login')
};
export const registerRouter = {
    path: '/register',
    name: 'register',
    meta: {
        title: '注册',
        noAuth: true
    },
    component: () => import('@/views/system/user/register')
};
export const emailValidateRouter = {
    path: '/email-validate/:auditId/:code',
    name: 'emailValidate',
    meta: {
        title: '邮箱验证',
        noAuth: true
    },
    component: () => import('@/views/system/user/email-validate')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/common/components/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/common/components/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/common/components/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/common/components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: () => import('@/views/main.vue'),
    children: [
        { path: 'account', title: '账户中心', name: 'account', component: () => import('@/views/account') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/home',
        icon: 'ios-home-outline',
        name: 'home',
        title: '首页',
        component: () => import('@/views/main.vue'),
        children: [
            { 
                path: 'index', 
                title: '首页', 
                icon: 'ios-home-outline',
                name: 'home_index', 
                component: () => import('@/views/home') 
            },
            { 
                path: 'audit/svn', 
                title: '我的申请', 
                name: 'svn-apply',
                icon:'ios-checkbox-outline', 
                component: () => import('@/views/audit/apply-svn') 
            },
            { 
                path: 'audit/user', 
                title: '用户审核', 
                name: 'user_audit',
                icon:'ios-checkbox-outline', 
                component: () => import('@/views/audit/apply-user') 
            }
        ]
    },
    {
        path: '/svn',
        icon: 'ios-gear',
        name: 'svn',
        title: '版本管理',
        component: () => import('@/views/main.vue'),
        children: [
            { path: 'resp', icon: 'albums', title: '资源管理', name: 'resp', component: () => import('@/views/svn/resp') },
            { path: 'destop', icon: 'person', title: '资源库', name: 'destop', component: () => import('@/views/svn/destop') }
        ]
    },
    {
        path: '/system',
        icon: 'ios-gear',
        name: 'system',
        title: '系统设置',
        component: () => import('@/views/main.vue'),
        children: [
            { path: 'user', icon: 'person', title: '用户管理', name: 'system_user', component: () => import('@/views/system/user') },
            { path: 'person-stalker', icon: 'compose', title: '角色管理', name: 'system_role', component: () => import('@/views/system/role') },
            { path: 'resource', icon: 'lock-combination', title: '资源管理', name: 'system_resource', component: () => import('@/views/system/resource') },
            { path: 'log', icon: 'leaf', title: '系统日志', name: 'system_log', component: () => import('@/views/system/log') },
        ]
    }
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    registerRouter,
    emailValidateRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
