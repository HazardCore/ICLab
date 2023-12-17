<template>
    <span>
        <v-card
            fluid
            elevation="0"
            class="pb-0"
            style=""
        >
            <v-container style="max-width: 1680px;" class="pt-0 pb-0 container-side-padding background-diia">
                <v-card
                    fluid
                    elevation="0"
                    class="pt-6 mr-0 pb-0 background-diia"
                >
                    <h1 class="diia-nav-menu-h1-header">Керування заявками</h1>
                    <v-tabs
                        v-model="main_nav_tab"
                        light
                        background-color="transparent"
                        class="pt-0 pb-0 ma-0"
                    >
                        <v-tab class="diia-style-v-tab" @click="onClickTab('irs')" v-if="$config.user_data.access && $config.user_data.access.p == 'ADMIN'">
                            <v-badge
                                class="diia-badge-notification-tab"
                                color="black"
                                :content="information_resource_application_at_sign_count"
                                v-if="information_resource_application_at_sign_count && information_resource_application_at_sign_count != 0"
                                inline
                            >
                                Заявки е-ресурсів
                            </v-badge>
                            <span class="diia-badge-notification-tab" v-if="!(information_resource_application_at_sign_count && information_resource_application_at_sign_count != 0)">Заявки е-ресурсів</span>
                        </v-tab>
                        <v-tab class="diia-style-v-tab" @click="onClickTab('intf')" v-if="$config.user_data.access && ($config.user_data.access.p == 'ADMIN' || $config.user_data.access.itr_admin)">
                            <v-badge
                                class="diia-badge-notification-tab"
                                color="black"
                                :content="information_resource_interface_application_approve_count"
                                v-if="information_resource_interface_application_approve_count && information_resource_interface_application_approve_count != 0"
                                inline
                            >
                                Заявки інтерфейсів е-ресурсів
                            </v-badge>
                            <span class="diia-badge-notification-tab" v-if="!(information_resource_interface_application_approve_count && information_resource_interface_application_approve_count != 0)">Заявки інтерфейсів е-ресурсів</span>
                        </v-tab>
                        <v-tab class="diia-style-v-tab" @click="onClickTab('applications')" v-if="$config.user_data.access">
                            <v-badge
                                class="diia-badge-notification-tab"
                                color="black"
                                :content="request_application_approve_count"
                                v-if="request_application_approve_count && request_application_approve_count != 0"
                                inline
                            >
                            Технічні заявки (регламент)
                            </v-badge>
                            <span class="diia-badge-notification-tab" v-if="!(request_application_approve_count && request_application_approve_count != 0)">Технічні заявки (регламент)</span>
                        </v-tab>
                        <v-tab class="diia-style-v-tab" @click="onClickTab('external-applications')" v-if="$config.user_data.access">
                            <v-badge
                                class="diia-badge-notification-tab"
                                color="black"
                                :content="+external_request_application_approve_count + +external_request_application_execute_count"
                                v-if="(external_request_application_approve_count && external_request_application_approve_count != 0) || (external_request_application_execute_count && external_request_application_execute_count != 0)"
                                inline
                            >
                            Запити іншим суб'єктам
                            </v-badge>
                            <span class="diia-badge-notification-tab" v-if="!(external_request_application_approve_count && external_request_application_approve_count != 0) && !(external_request_application_execute_count && external_request_application_execute_count != 0)">Запити іншим суб'єктам</span>
                        </v-tab>
                    </v-tabs>
                </v-card>
            </v-container>
        </v-card>
        <keep-alive>
            <router-view @on-error-message-show="onErrorMessageShow" @on-info-message-show="onSuccessSubmit" @on-counter-update="updateCounters"></router-view>
        </keep-alive>
    </span>
</template>


<script>
/* eslint-disable */
export default {
  name: "HeaderApplications",
  data: () => ({
    main_nav_tab: 0,

    error_message: '',
    info_message: '',

    error_alert: false,
    info_alert: false,

    information_resource_interface_application_approve_count: 0,
    information_resource_application_at_sign_count: 0,
    request_application_approve_count: 0,
    external_request_application_approve_count: 0,
    external_request_application_execute_count: 0,
  }),
  mounted() {
    this.redirectProfileCheck();
    this.setTabMenu();

    this.updateCounters();
  },
  watch: {
    $route(to, from) {
        this.redirectProfileCheck();
        this.setTabMenu();
    }
  },
  methods: {
    redirectProfileCheck() {
        if (localStorage.getItem('redirect_to_profile') || false) {
            this.$router.replace({name: 'me-detail', query: this.$config.query_params});
        }
    },

    setTabMenu() {
        let recount = 0;

        if (this.$config.user_data.access && this.$config.user_data.access.p == 'ADMIN') {
            if (["information-resource-application-list", "information-resource-application-detail"].includes(this.$route.name))
                this.main_nav_tab = 0;
        } else {
            recount += 1;
        }

        if (this.$config.user_data.access && (this.$config.user_data.access.p == 'ADMIN' || this.$config.user_data.access.itr_admin)) {
            if (["interface-applications-list", "interface-application-detail"].includes(this.$route.name))
                this.main_nav_tab = 1 - recount;
        } else {
            recount += 1;
        }

        if (["applications-list", "new-application", "applications-detail", "select-application"].includes(this.$route.name))
            this.main_nav_tab = 2 - recount;
        else if (["external-applications-list", "new-external-application", "external-applications-detail", "select-external-application"].includes(this.$route.name))
            this.main_nav_tab = 3 - recount;
    },

    onErrorMessageShow(message) {
        this.$emit('on-error-message-show', message);
    },
    onSuccessSubmit(message) {
        this.$emit('on-info-message-show', message);
    },
    updateCounters() {
        this.information_resource_interface_application_approve_count = sessionStorage.getItem('information_resource_interface_application_approve');
        this.information_resource_application_at_sign_count = sessionStorage.getItem('information_resource_application_at_sign');
        this.request_application_approve_count = sessionStorage.getItem('request_application_approve');
        this.external_request_application_approve_count = sessionStorage.getItem('external_request_application_approve');
        this.external_request_application_execute_count = sessionStorage.getItem('external_request_application_execute');
        this.$emit('on-counter-update');
    },

    onClickTab(value) {
        if (value == 'irs')
            this.$router.replace({name: 'information-resource-applications-list', query: this.$config.query_params});
        else if (value == 'intf')
            this.$router.replace({name: 'interface-applications-list', query: this.$config.query_params});
        else if (value == 'applications')
            this.$router.replace({name: 'applications-list', query: this.$config.query_params});
        else if (value == 'external-applications')
            this.$router.replace({name: 'external-applications-list', query: this.$config.query_params});
    }
  }
}
</script>