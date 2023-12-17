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
                <router-link class="catalog-top-nav-router-link" :to="{name: 'information-resources-list'}">
                  <span>← До особистого кабінету</span>
                </router-link>
                <h1 class="diia-nav-menu-h1-header">Моя організація</h1>
                <v-tabs
                v-model="main_nav_tab"
                light
                background-color="transparent"
                class="pt-0 pb-0 ma-0"
                >
                <v-tab class="diia-style-v-tab" @click="onClickTab('organization-detail')" v-if="$config.user_data.access">
                    Загальна інформація
                </v-tab>
                <v-tab class="diia-style-v-tab" @click="onClickTab('users')" v-if="$config.user_data.access">
                    Користувачі
                </v-tab>
                <v-tab class="diia-style-v-tab" @click="onClickTab('historylog')" v-if="$config.user_data.access">
                    Історія дій
                </v-tab>
                </v-tabs>
            </v-card>
        </v-container>
    </v-card>
    <keep-alive>
        <router-view @on-error-message-show="onErrorTextShow" @on-info-message-show="onInfoTextShow"></router-view>
    </keep-alive>
</span>
</template>


<script>
/* eslint-disable */
export default {
  name: "HeaderOrganization",
  components: {},
  data: () => ({
    main_nav_tab: 0,

    error_message: '',
    info_message: '',

    error_alert: false,
    info_alert: false,
  }),
  mounted() {
    this.setTabMenu();
  },
  watch: {
    $route(to, from) {
        this.setTabMenu();
    },
  },
  methods: {
    onErrorTextShow(message) {
        this.$emit('on-error-message-show', message);
    },
    onInfoTextShow(message) {
        this.$emit('on-info-message-show', message);
    },

    setTabMenu() {
        if (this.$route.name == 'organization-detail')
            this.main_nav_tab = 0;
        else if (['profiles', 'profile-detail', 'new-profile'].includes(this.$route.name))
            this.main_nav_tab = 1;
        else if (['history-log-list'].includes(this.$route.name))
            this.main_nav_tab = 2;
    },

    onClickTab(value) {
        if (value == 'organization-detail') {
            this.$router.replace({name: 'organization-detail', query: this.$config.query_params});
        }

        if (value == 'users') {
            this.$router.replace({name: 'profiles', query: this.$config.query_params});
        }

        if (value == 'historylog') {
            this.$router.replace({name: 'history-log-list', query: this.$config.query_params});
        }
    }
  }
}
</script>