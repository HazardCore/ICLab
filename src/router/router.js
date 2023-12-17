import Vue from 'vue'
import VueRouter from 'vue-router'

import NotFound404 from '../components/NotFound404'

import OrganizationDetail from '../components/OrganizationDetail'
import RedirectAuthPage from '../components/RedirectAuthPage'
import ErrorPage from '../components/ErrorPage'

import InformationResourcesList from '../components/information-resources/InformationResourcesList'
import InformationResourceDetail from '../components/information-resources/InformationResourceDetail'
import InformationResourceApplicationDetail from '../components/information-resources/InformationResourceApplicationDetail'
import InformationResourceApplicationsList from '../components/information-resources/InformationResourceApplicationsList'

import InterfacesList from '../components/interfaces/InterfacesList'
import InterfaceDetail from '../components/interfaces/InterfaceDetail'
import InterfaceApplicationDetail from '../components/interfaces/InterfaceApplicationDetail'
import InterfaceApplicationsList from '../components/interfaces/InterfaceApplicationsList'

import InteractionsList from '../components/interactions/InteractionsList'
import InteractionDetail from '../components/interactions/InteractionDetail'

import MaterialsList from '../components/MaterialsList'

import HistoryLogList from '../components/HistoryLogList'
import ProfileDetail from '../components/ProfileDetail'
import ProfilesList from '../components/ProfilesList'

import ApplicationDetail from '../components/request-application/ApplicationDetail'
import ApplicationsList from '../components/request-application/ApplicationsList'
import ApplicationForm from '../components/request-application/ApplicationForm'

import ExternalApplicationDetail from '../components/external-request-application/ExternalApplicationDetail'
import ExternalApplicationsList from '../components/external-request-application/ExternalApplicationsList'
import ExternalApplicationCreateForm from '../components/external-request-application/ExternalApplicationCreateForm'

import MyProfileDetail from '../components/MyProfileDetail'

import HeaderMe from '../components/HeaderMe'
import HeaderInternal from '../components/HeaderInternal'
import HeaderOrganization from '../components/HeaderOrganization'
import HeaderApplications from '../components/HeaderApplications'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

let router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'materials-root',
            redirect: { name: 'materials-list' },
        },
        {
            path: '*',
            name: 'notfound',
            component: NotFound404,
        },
        {
            path: '/me',
            name: 'me-root',
            redirect: { name: 'me-detail' },
            component: HeaderMe,
            children: [
                {
                    path: 'detail',
                    name: 'me-detail',
                    component: MyProfileDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
            ]
        },
        {
            path: '/organization',
            name: 'admin-root',
            redirect: { name: 'organization-detail' },
            component: HeaderOrganization,
            children: [
                {
                    path: 'detail',
                    name: 'organization-detail',
                    component: OrganizationDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: 'profiles',
                    name: 'profiles',
                    component: ProfilesList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: 'new-profile',
                    name: 'new-profile',
                    component: ProfilesList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: 'profiles/:id',
                    name: 'profile-detail',
                    component: ProfileDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: 'history',
                    name: 'history-log-list',
                    component: HistoryLogList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
            ]
        },
        {
            path: '/',
            name: 'applications-root',
            redirect: { name: 'applications' },
            component: HeaderApplications,
            children: [
                {
                    path: '/applications',
                    name: 'applications-list',
                    component: ApplicationsList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/select-application',
                    name: 'select-application',
                    component: ApplicationsList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/new-application/:id',
                    name: 'new-application',
                    component: ApplicationForm,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/applications/:id',
                    name: 'applications-detail',
                    component: ApplicationDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/external-applications',
                    name: 'external-applications-list',
                    component: ExternalApplicationsList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/select-external-application',
                    name: 'select-external-application',
                    component: ExternalApplicationsList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/new-external-application/:id',
                    name: 'new-external-application',
                    component: ExternalApplicationCreateForm,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/external-applications/:id',
                    name: 'external-applications-detail',
                    component: ExternalApplicationDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/interface-applications',
                    name: 'interface-applications-list',
                    component: InterfaceApplicationsList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/information-resource-applications',
                    name: 'information-resource-applications-list',
                    component: InformationResourceApplicationsList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/information-resources-application/:id',
                    name: 'information-resource-application-detail',
                    component: InformationResourceApplicationDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/interface-applications/:id',
                    name: 'interface-application-detail',
                    component: InterfaceApplicationDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
            ]
        },
        {
            path: '/',
            name: 'root',
            redirect: { name: 'information-resources-list' },
            component: HeaderInternal,
            children: [
                // {
                //     path: '/organization-detail',
                //     name: 'organization-detail',
                //     component: OrganizationDetail,
                //     meta: {
                //         'title': 'Особистий кабінет'
                //     },
                //     props: true
                // },
                {
                    path: '/information-resources',
                    name: 'information-resources-list',
                    component: InformationResourcesList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/information-resources/new',
                    name: 'new-information-resource',
                    component: InformationResourcesList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/information-resources/:id',
                    name: 'information-resource-detail',
                    component: InformationResourceDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/interfaces',
                    name: 'interfaces-list',
                    component: InterfacesList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/interfaces/new',
                    name: 'new-interface',
                    component: InterfacesList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/interfaces/:id',
                    name: 'interface-detail',
                    component: InterfaceDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/interactions',
                    name: 'interactions-list',
                    component: InteractionsList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/interactions/:id',
                    name: 'interaction-detail',
                    component: InteractionDetail,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
                {
                    path: '/materials',
                    name: 'materials-list',
                    component: MaterialsList,
                    meta: {
                        'title': 'Особистий кабінет'
                    },
                    props: true
                },
            ],
        },
        {
            path: '/redirect_auth',
            name: 'redirect_auth',
            component: RedirectAuthPage,
            // props: true
        },
        {
            path: '/error',
            name: 'error',
            component: ErrorPage,
            props: true
        },
        // {
        //     path: '*',
        //     name: '404',
        //     component: NotFound404
        // }
    ]
}); 


// https://gitlab.dir.gov.ua/letsolexandr/sev_sed_client/-/blob/master/src/router/index.js

// router.beforeEach((to, from, next) => {
//     set_permissions(store)
//     let next_path = to.query.next ? to.query.next : to.fullPath;

//     if (!checkIfExist(router, to)) {
//         next('/error/404');
//         return
//     }


//     if (to.path === '/') {
//         let path = get_main_route();
//         next(path);
//         return
//     }
//     //console.log(from)
//     if (!to.meta.requiresAuth) {
//         next();
//         return;
//     }
//     if (!store.getters.isLoggedIn) {
//         //debugger
//         if (to.name !== 'login') {
//             //next(`/login`);
//             next(`/login?next=${to.fullPath}`);

//         } else {
//             next()//next_path === to.path ? next() : next(next_path);
//         }
//         return
//     }

//     if (checkRouteAuthRequired(to)) {
//         let has_route_permission = checkPermissions(store, to);
//         if (has_route_permission) {
//             next()
//         } else {
//             next('/error/403');
//         }

//     } else {
//         next_path === to.fullPath ? next() : next(next_path);
//     }

// }
// );



export default router;