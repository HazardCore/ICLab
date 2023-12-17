<template>
    <v-card fluid elevation=0>
        <v-container style="max-width: 1680px;" class="pt-0 pb-0 container-side-padding background-diia">
                <v-card
                    fluid
                    elevation="0"
                    class="pt-6 mr-0 pb-0 background-diia"
                >
            <!-- <div style='position: absolute; left: 0; right: 0; top: 30%;'>
            <v-container> -->
                <v-row style="height: 200px;"></v-row>
                <v-row class="justify-center">
                    <span style="font-size: 56px; font-weight: 200; line-height: 1.2;">Особистий кабінет</span>
                </v-row>
                <v-row class="justify-center mt-5">
                    <span style="font-size: 28px; word-break: word-wrap;" >Система Трембіта</span>
                </v-row>
                <v-row class="justify-center ma-2 mt-8" style="word-break: word-wrap;">
                    Для продовження роботи необхідно авторизуватися через id.gov.ua
                </v-row>
                <v-row class="justify-center mt-8">
                    <v-btn elevation="0" class="diia-button-style-3 mt-6 mb-6" @click="$clib.redirectToIdGovUa($config.IDGOVUA.url, $config.IDGOVUA.client_id, $config.IDGOVUA.state, $config.IDGOVUA.redirect_uri)">Увійти до кабінету</v-btn>
                </v-row>
                <v-row style="height: 200px;"></v-row>
                </v-card>
            <!-- </v-container>
            </div> -->
            <!-- <v-card-actions class="justify-center">
                <h1>404</h1>
                <v-card-title>Такої сторінки не існує</v-card-title>
                Схоже, це неправильна адреса або елемент було видалено
            </v-card-actions> -->
        </v-container>
    </v-card>
</template>


<script>
/* eslint-disable */
import clib from "../js/common_lib";

export default {
  name: "RedirectAuthPage",
  components: {
    //   ListFilterDialog,
  },
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
        }
      }
  },

  mounted: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.title = this.$route.params.title;
    this.message = this.$route.params.message;
    this.auth_button = this.$route.params.auth_button || false;
    this.return_button = this.$route.params.return_button || false;
  },
  methods: {
    returnToPrevRoute() {
      this.$router.go(-2);
    }
  }
}
</script>

