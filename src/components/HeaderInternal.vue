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
                <h1 class="diia-nav-menu-h1-header">Особистий кабінет</h1>
                <v-tabs
                v-model="main_nav_tab"
                light
                background-color="transparent"
                class="pt-0 pb-0 ma-0"
                >
                <v-tab class="diia-style-v-tab" @click="onClickTab('irs')" v-if="$config.user_data.access && $config.user_data.access.p == 'ADMIN'">
                    Е-ресурси
                </v-tab>
                <v-tab class="diia-style-v-tab" @click="onClickTab('websrv')" v-if="$config.user_data.access && ($config.user_data.access.p == 'ADMIN' || $config.user_data.access.itr_admin)">
                    Інтерфейси е-ресурсів
                </v-tab>
                <v-tab class="diia-style-v-tab" @click="onClickTab('interactions')" v-if="$config.user_data.access">
                    Взаємодії
                </v-tab>
                <v-tab class="diia-style-v-tab" @click="onClickTab('materials')" v-if="$config.user_data.access">
                    Матеріали
                </v-tab>
                </v-tabs>
            </v-card>
        </v-container>
    </v-card>
    <keep-alive>
        <router-view @on-error-message-show="onErrorMessageShow" @on-info-message-show="onSuccessSubmit"></router-view>
      </keep-alive>
</span>
</template>


<script>
/* eslint-disable */
export default {
  name: "HeaderInternal",
  components: {},
  data: () => ({
    main_nav_tab: 0,

    error_message: '',
    info_message: '',

    error_alert: false,
    info_alert: false,
  }),
  mounted() {
    this.redirectProfileCheck();
    this.setTabMenu();
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
            if (['information-resources-list', "information-resource-detail", "new-information-resource"].includes(this.$route.name))
                this.main_nav_tab = 0;
        } else {
            recount += 1;
        }

        if (this.$config.user_data.access && (this.$config.user_data.access.p == 'ADMIN' || this.$config.user_data.access.itr_admin)) {
            if (['interfaces-list', "interface-detail", "new-interface"].includes(this.$route.name))
                this.main_nav_tab = 1 - recount;
        } else {
            recount += 1;
        }

        if (['interactions-list', 'interaction-detail'].includes(this.$route.name))
            this.main_nav_tab = 2 - recount;

        if (['materials-list'].includes(this.$route.name)) {
            this.main_nav_tab = 3 - recount;
        }
    },

    onErrorMessageShow(message) {
        this.$emit('on-error-message-show', message);
    },
    onSuccessSubmit(message) {
        this.$emit('on-info-message-show', message);
    },

    onClickTab(value) {
        if (value == 'irs')
            this.$router.replace({name: 'information-resources-list', query: this.$config.query_params});
        else if (value == 'websrv')
            this.$router.replace({name: 'interfaces-list', query: this.$config.query_params});
        else if (value == 'interactions')
            this.$router.replace({name: 'interactions-list', query: this.$config.query_params});
        else if (value == 'materials')
            this.$router.replace({name: 'materials-list', query: this.$config.query_params});
    }
  }
}
</script>