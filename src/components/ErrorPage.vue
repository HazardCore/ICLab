<template>
<v-card
        fluid
        elevation="0"
        class="pb-0"
        style=""
    >
        <v-container style="max-width: 1680px;" class="pt-0 pb-0 container-side-padding">
            <v-card
                fluid
                elevation="0"
                class="pt-6 mr-0 pb-0"
                style="min-height: 600px; max-width: 800px;"
            >
                <template v-if="true">
                    <h3 class="mb-10 mt-10 diia-h3-header">{{ title }}</h3>
                    <span style="font-size: 1rem;">{{ message }}</span>
                    <div v-if="auth_button">
                      <v-btn elevation="0" class="diia-button-style-3 mt-6 mb-6" @click="$clib.redirectToIdGovUa($config.IDGOVUA.url, $config.IDGOVUA.client_id, $config.IDGOVUA.state, $config.IDGOVUA.redirect_uri)">Увійти до кабінету</v-btn>
                    </div>
                    <div v-if="return_button">
                      <span class="catalog-top-nav-router-link" style="cursor: pointer" @click="returnToPrevRoute">← Повернутися</span>
                    </div>
                </template>
            </v-card>
        </v-container>
    </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "ErrorPage",
  components: {},
  data: () => ({
    title: '',
    message: '',
    auth_button: false,
    return_button: false
  }),

  watch: {
      $route(to, from) {
        if (to.name == 'error') {
          this.title = this.$route.params.title;
          this.message = this.$route.params.message;

          this.auth_button = this.$route.params.auth_button || false;
          this.return_button = this.$route.params.return_button || false;

          if (this.$route.params.session_expired) {
              this.$config.decoded_token = {};
              this.$config.user_data = {};

              localStorage.removeItem('token');
              localStorage.removeItem('user_data');
          }
        }
      }
  },

  mounted: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.title = this.$route.params.title;
    this.message = this.$route.params.message;
    this.auth_button = this.$route.params.auth_button || false;
    this.return_button = this.$route.params.return_button || false;
    
    if (this.$route.params.session_expired) {
        this.$config.decoded_token = {};
        this.$config.user_data = {};

        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
    }

  },
  methods: {
    returnToPrevRoute() {
      this.$router.go(-2);
    }
  }
}
</script>