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
                <router-link class="catalog-top-nav-router-link" :to="{name: 'materials-list'}" v-if="!redirect_to_profile">
                  <span>← До особистого кабінету</span>
                </router-link>
                <h1 class="diia-nav-menu-h1-header">Мій профіль</h1>
                <v-tabs
                    v-model="main_nav_tab"
                    light
                    background-color="transparent"
                    class="pt-0 pb-0 ma-0"
                >
                <v-tab class="diia-style-v-tab" @click="onClickTab('profile-detail')" v-if="$config.user_data.access">
                    Профіль
                </v-tab>
                </v-tabs>
            </v-card>
        </v-container>
    </v-card>
    <keep-alive>
        <router-view @on-error-message-show="onErrorMessageShow" @on-info-message-show="onInfoTextShow"></router-view>
      </keep-alive>
</span>
</template>

<script>
/* eslint-disable */
export default {
  name: "HeaderMe",
  components: {},
  data: () => ({
    main_nav_tab: 0,

    error_message: '',
    info_message: '',

    error_alert: false,
    info_alert: false,

    redirect_to_profile: false,
  }),
  mounted() {
    this.redirect_to_profile = localStorage.getItem('redirect_to_profile') || false;

    if (this.$route.name == 'me-detail') {
      this.main_nav_tab = 0;
    }
  },
  watch: {
    $route(to, from) {
        this.redirect_to_profile = localStorage.getItem('redirect_to_profile') || false;
    },
  },
  methods: {
    onErrorMessageShow(message) {
        this.$emit('on-error-message-show', message);
    },
    onInfoTextShow(message) {
        this.$emit('on-info-message-show', message);
    },
    onClickTab(value) {
        if (value == 'profile-detail') {
            this.$router.replace({name: 'me-detail', query: this.$config.query_params});
        }
    }
  }
}
</script>