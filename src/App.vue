<style lang="scss">
  @import 'styles/custom.scss';
  @import 'styles/overrides.scss';
</style>




<style>
    .v-divider-light {
        background-color: rgb(231, 238, 243);
        border-width: 1px !important;
    }

    .diia-button-style {
        background-color: #000 !important;
        align-items: center !important;
        border-radius: 40px !important;
        color: #fff !important;
        padding: 26px 68px !important;
        font-size: 16px;
        font-weight: 500;
        text-transform: initial !important;
        letter-spacing: -0.02em !important;
        line-height: 1 !important;
    }

    .diia-button-style-2 {
        background-color: #000 !important;
        align-items: center !important;
        border-radius: 40px !important;
        color: #fff !important;
        padding: 12px 28px !important;
        font-size: 16px;
        font-weight: 500;
        letter-spacing: -0.02em !important;
        text-transform: initial !important;
        line-height: 1 !important;
    }

    .v-list-item-profile-menu {
      padding: 8px 16px !important; 
      font-size: 13px; 
      line-height: 1; 
      min-height: 20px !important;
      background-color: #fff;
    }

    .v-list-item-profile-menu:hover {
      background-color: #e7eef3;
      cursor: pointer;
    }

  .filter-list-item-title {
      line-height: 50px; 
      font-size: 18px !important;
      font-weight: 300px;
  }

  .textarea-colored > .v-input__control > .v-input__slot:before {
      border-bottom-width: 3px !important; 
      border-image-slice: 1; 
      border-color: #222222;
      border-image-source: linear-gradient(339deg, rgba(194,192,231,1) 0%, rgba(173,216,230,1) 49%, rgba(102,210,232,1) 100%);
  }

</style>







<style>
  /* <!-- DIIA COLOR -->
<!-- color: #323A45; --> */
  * {
    font-family: "e-Ukraine", ProbaPro, sans serif !important;
    font-style: ultra-light;
    color: #000;
    letter-spacing: -0.02em !important;
  }


  .diia-top-menu-item-active {
    border-bottom: #000 2px solid;
  }

  /* .v-application {
  font-family: "e-UkraineHead", "Times New Roman";
  font-style: ultra-light;
  line-height: 1.5;
} */

  /* .app-header {
    box-shadow: 0px 2px 10px 2px rgb(0 0 0 / 20%);
    align-items: center;
    background: radial-gradient(circle, rgb(16, 77, 130), rgb(35, 65, 97));
  } */

  .data-table-date-col-width {
    width: 180px;
  }
  /* .app-footer {
    background: radial-gradient(circle, rgb(16, 77, 130), rgb(35, 65, 97));
    font-weight: 400;
  } */
  /* .data-table-design tr:nth-child(odd) {
    background-color: #f2f2f2;
  } */
  .fifty-width {
    width: 50%;
    white-space: normal;
  }
  .fifty-table table {
    table-layout : fixed;
  }


  .v-text-field--rounded > .v-input__control > .v-input__slot {
    padding: 10px 24px !important;
  }

  .v-slide-group__prev, .v-slide-group__prev--disabled {
    min-width: 0px !important;
    flex: 0px !important;
  }
  .view-href-chip {
    border: 2px solid black !important; 
    background-color: white !important;
  }
  .view-href-chip:hover {
    color: #fff;
    background-color: black !important;
  }
  .view-href-a {
    font-size: 13px;
    font-weight: normal;
    color: black !important;
    text-decoration: none !important;
    box-sizing: border-box;
    border: 2px solid black !important;
    padding: 10px 24px;
    border-radius: 20px;
    line-height: 1;
  }
  .view-href-a:hover {
    color: #fff !important;
    text-decoration: none !important;
    background-color: black !important;
  }
  .diia-a-style {
    color: #fff !important;
    text-decoration: none;
  }
  .diia-a-style:hover {
    text-decoration: underline;
  }
  /* .diia-side-nav-item {

  } */
  .theme--light.v-list-item:focus::before, .theme--light.v-list-item--active::before, .theme--light.v-list-item:hover::before, .theme--light.v-list-item--active:focus::before {
    background-color: transparent !important;
    opacity: 0 !important;
  }
  .theme--light.v-list-item--active {
    font-weight: bold !important;
  }

  .diia-side-nav-item:hover > v-list-item--link:before {
    background-color: #fff !important;
  }
  .diia-side-nav-item:active {
    background-color: #fff !important;
  }
  .diia-side-nav-item:hover {
    text-decoration: underline;
  }
  .v-list-item--link:hover {
    background-color: #E7EEF3 !important;
    color: #000 !important; 
  }
  
  /* .theme--light.v-list-item--link {
    color: #ffffff !important;
  } */
  .theme--light.v-list-item--link:hover {
    color: #000 !important;
  }
  .v-list-item--link:before {
    background-color: #000 !important;
  }


  .catalog-top-nav-router-link {
    text-decoration: none;
    line-height: 1;
  }
  .catalog-top-nav-item {
    color: #000 !important;
    margin: 0px 10px;
    font-size: 14px;
    text-decoration: none;
  }


  .catalog-top-nav-item:hover {
    text-decoration: underline;
  }

  .v-data-table__progress.primary {
    background-color: red !important;
  }

  .burger_menu_icon {
    padding: 0px !important;
    min-width: 24px !important;
    height: 36px !important;
  }

  .burger_menu_icon:hover::before {
    opacity: 0 !important;
  }

  .burger_menu_icon > .v-ripple__container {
    display: none !important;
  }

  .burger_menu_icon > .v-btn__content {
    padding: 0px !important;
  }

  .burger_menu_icon > .v-btn__content >.v-icon.v-icon {
    font-size: 36px !important;
    color: #000;
  }

  .burger_menu_icon > .v-btn__content >.v-icon.v-icon:focus::after {
    opacity: 0 !important;
  }


  .burger_menu_icon__large {
    padding: 0px !important;
    min-width: 24px !important;
    height: 36px !important;
  }

  .burger_menu_icon__large:hover::before {
    opacity: 0 !important;
  }

  .burger_menu_icon__large > .v-ripple__container {
    display: none !important;
  }

  .burger_menu_icon__large > .v-btn__content {
    padding: 0px !important;
    transition: none !important;
  }

  .burger_menu_icon__large > .v-btn__content >.v-icon.v-icon {
    font-size: 48px !important;
    color: #000;
    transition: none !important;
  }

  .burger_menu_icon__large > .v-btn__content >.v-icon.v-icon {
    font-size: 48px !important;
    color: #000;
    transition: none !important;
  }

  .burger_menu_icon__large > .v-btn__content >.v-icon.v-icon:focus::after {
    opacity: 0 !important;
  }


  .instance_switch {
    line-height: 1px; 
    font-size: 12px;
  }
  .instance_switch:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }


  .background-diia {
      border-radius: 0px !important; 
      background-image: linear-gradient(to right, #9cedff 0%, #4dcee8 100%);
      background-size: 200% 300%;
      background-attachment: fixed;
    }

    @-webkit-keyframes granimate {
        0%,
        100% {
            background-position: 0 25%;
        }
        25%,
        75% {
            background-position: 50% 50%;
        }
        50% {
            background-position: 100% 100%;
        }
    }

    @keyframes granimate {
        0%,
        100% {
            background-position: 0 25%;
        }
        25%,
        75% {
            background-position: 50% 50%;
        }
        50% {
            background-position: 100% 100%;
        }
    }




    .theme--light.v-list-item--link.user-menu-items {
      color: #000 !important;
      text-decoration: none !important;
    }
    .theme--light.v-list-item--link.user-menu-items:hover {
      background-color: #9cedff !important;
    }


.diia-nav-bar-item {
    line-height: 16px; 
    font-size: 13px;
}
.diia-nav-bar-item:hover {
    cursor: pointer;
}











</style>
<template>
<v-app>
  <v-main>
      <v-container style="max-width: 1680px;" class="pa-0">
        <v-card
          dark
          fluid
          elevation="0"
          class="pt-6 mr-0 pb-0 background-diia"
          style="padding-left: 0px;"
        >
          <div class="d-flex justify-space-between pa-0" style="margin-bottom: 20px;">
            <span>
              <a :href="$config.website_url" target="_blank">
                <img src="./assets/logo.svg" alt="Трембіта" height="32px" class="ml-5" style="vertical-align: middle;"/>
              </a>
              <div style="display: inline;" class="d-none d-md-inline">
                <a class="catalog-top-nav-router-link" :href="$config.catalog_url" target="_blank">
                  <a class="catalog-top-nav-item ml-6 mb-2" style="font-size: 13px;" target="_blank">Каталог</a>
                </a>
              </div>
            </span>
            <div style="display: inline;" class="mr-5">
              <template v-if="loggined && !hide_user_menu">
                <span id="menuRoute1" @click="onNavBarItemClick('administration')" class="d-none d-md-inline-flex justify-end diia-nav-bar-item diia-top-menu-item-active unselectable mr-10">Адміністрування</span>
                <span id="menuRoute2" @click="onNavBarItemClick('applications')" class="d-none d-md-inline-flex justify-end diia-nav-bar-item unselectable mr-10">
                  <v-badge color="#FFD600" dot class="diia-badge-notification" v-if="display_application_event_badge">Керування заявками</v-badge>
                  <span v-if="!display_application_event_badge">Керування заявками</span>
                </span>
              </template>
              <v-menu offset-y v-if="loggined && !hide_user_menu">
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on" class="d-none d-md-inline-flex justify-end diia-nav-bar-item unselectable"><span id="menuRoute3">{{ $config.user_data.first_name }} {{ $config.user_data.last_name }}</span>
                    <v-icon style="line-height: 1px; font-size: 12px; margin-left: 5px;">mdi-chevron-up</v-icon>
                  </span>
                </template>
                <v-list class="mt-3">
                    <v-list-item class="ma-0 v-list-item-profile-menu user-menu-items" @click="onClickMenu('me-detail')">Мій профіль</v-list-item>
                    <v-list-item class="ma-0 v-list-item-profile-menu user-menu-items" @click="onClickMenu('organization-detail')" v-if="$config.user_data.access && $config.user_data.access.p == 'ADMIN'">Моя організація</v-list-item>
                    <v-list-item class="ma-0 v-list-item-profile-menu user-menu-items" @click="onClickMenu('exit')">Вихід</v-list-item>
                </v-list>
              </v-menu>
              <v-btn
                  large
                  elevation="0"
                  color="transparent"
                  class="burger_menu_icon d-inline-flex d-md-none justify-end"
                >
                <v-icon @click="switchNavMenu()">mdi-menu</v-icon>
              </v-btn>
            </div>
            <v-dialog
              v-model="nav_menu_dialog"
              fullscreen
              hide-overlay
              transition="none"
            >
              <v-card tile>
                <v-container fluid>
                  <v-list>
                    <v-list-item class="justify-end ma-0 pa-0">
                      <v-btn
                          large
                          elevation="0"
                          color="transparent"
                          class="burger_menu_icon__large"
                      >
                          <v-icon @click="switchNavMenu()">mdi-close</v-icon>
                      </v-btn>
                    </v-list-item>
                    <v-list-item class="justify-center mt-8">
                      <router-link class="catalog-top-nav-router-link" :to="{name: 'catalog', query: {'env': $config.query_params.env}}">
                        <a @click="switchNavMenu()" class="catalog-top-nav-item mb-2">Каталог</a>
                      </router-link>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item class="justify-center">
                      <span id="menuRoute1" @click="onNavBarItemClick('administration')" class="diia-nav-bar-item unselectable">Адміністрування</span>
                    </v-list-item>
                    <v-list-item class="justify-center">
                      <span id="menuRoute2" @click="onNavBarItemClick('applications')" class="diia-nav-bar-item unselectable">
                        <v-badge color="#FFD600" dot class="diia-badge-notification" v-if="display_application_event_badge">Заявки</v-badge>
                        <span v-if="!display_application_event_badge">Заявки</span>
                      </span>
                    </v-list-item>
                    <v-list-item class="justify-center">
                      <span @click="onClickMenu('me-detail')" class="diia-nav-bar-item unselectable">Мій профіль</span>
                    </v-list-item>
                    <v-list-item class="justify-center" v-if="$config.user_data.access && $config.user_data.access.p == 'ADMIN'">
                      <span @click="onClickMenu('organization-detail')" class="diia-nav-bar-item unselectable">Моя організація</span>
                    </v-list-item>
                    <v-list-item class="justify-center">
                      <span @click="onClickMenu('exit')" class="diia-nav-bar-item unselectable">Вихід</span>
                    </v-list-item>
                  </v-list>
                </v-container>
              </v-card>
            </v-dialog>
          </div>
          <v-divider style="background-color: black; border-width: 1px;" class="mt-0"></v-divider>
        </v-card>
      </v-container>
      <DiiaAlertNotificationMultiple ref="diiaAlertNotificationMultiple"/>
      <keep-alive>
        <router-view @on-error-message-show="errorTextShow" @on-info-message-show="infoTextShow" @on-counter-update="renderEventBadges"></router-view>
      </keep-alive>
      <v-container style="max-width: 1680px;" class="pa-0">
        <v-card style="background-color: rgba(0,0,0); border-radius: 0px;" dark>
          <v-container style="max-width: 1680px;" class="container-side-padding pt-10 pb-10">
              <v-row>
                <v-col cols="12" md="6" style="color: #ffffff; font-size: 12px;">
                  <img src="https://e-resources.gov.ua/images/logo.mincifra.svg" width="220">
                </v-col>
                <v-col cols="12" md="6" style="color: #ffffff; font-size: 12px;">
                  <a href="/" class="diia-a-style">Особистий кабінет</a>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12"><v-divider style="background-color: #4C4C4C;" class="mt-5 mb-5"></v-divider></v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6" style="color: #ffffff; font-size: 12px;">Якщо ви маєте зауваження або пропозиції, будь ласка, напишіть нам: trembita@diia.gov.ua</v-col>
                <v-col cols="12" md="6" style="color: #ffffff; font-size: 12px;">Особистий кабінет системи Трембіта створено Міністерством цифрової трансформації України та державним підприємством «Дія» за підтримки проєкту міжнародної технічної допомоги «Підтримка ЄС цифрової трансформації України (DT4UA)», що фінансується із загального бюджету Європейського Союзу</v-col>
              </v-row>
          </v-container>
        </v-card>
      </v-container>
    </v-main>
  </v-app>

</template>

<script>
/* eslint-disable */

export default {
  name: "App",
  components: {},
  data: () => ({
    env: 'SEVDEIR',
    nav_menu_dialog: false,
    loggined: false,
    hide_user_menu: false,

    display_application_event_badge: false,
  }),
  created: function () {
    document.title = 'Особистий кабінет';

    // Check if user has logined in.
    this.loggined = localStorage.getItem('token') || false;
    if (!this.loggined && this.$route.name !== "redirect_auth") {
      this.$router.push({
        name: 'error',
        params: {
            title: 'Ви не авторизовані.', 
            message: 'Для роботи з особистим кабінетом необхідно авторизуватися.',
            auth_button: true
        }
      });
    }

    this.hide_user_menu = this.$route.name === 'error' || this.$route.name === 'redirect_auth';

    // Set token and other stuff in configuration
    this.setConfig();
  },
  mounted: function() {
    this.setNavBar(this.$route.name);

    this.renderEventBadges();
  },
  watch: {
      $route(to, from) {
          if (from.name == 'redirect_auth') {
              this.getUserActiveEvents();
          }

          document.title = this.$route.meta.title || 'Особистий кабінет';

          this.hide_user_menu = this.$route.name === 'error' || this.$route.name === 'redirect_auth';

          this.setConfig();
          this.setNavBar(to.name);
      },
  },
  methods: {
    renderEventBadges() {
        let information_resource_interface_application_approve = sessionStorage.getItem('information_resource_interface_application_approve', 0);
        let information_resource_application_at_sign = sessionStorage.getItem('information_resource_application_at_sign', 0);
        let request_application_approve = sessionStorage.getItem('request_application_approve', 0);
        let external_request_application_approve = sessionStorage.getItem('external_request_application_approve', 0);
        let external_request_application_execute = sessionStorage.getItem('external_request_application_execute', 0);

        if (information_resource_interface_application_approve != 0 || external_request_application_approve != 0 || external_request_application_execute != 0 || information_resource_application_at_sign != 0 || request_application_approve != 0) {
            this.display_application_event_badge = true;
        } else {
            this.display_application_event_badge = false;
        }
    },
    errorTextShow(data) {
        this.$refs.diiaAlertNotificationMultiple.pushNotification('error', data);
        this.$clib.gotoTop();
    },
    infoTextShow(data) {
        this.$refs.diiaAlertNotificationMultiple.pushNotification('info', data);
        this.$clib.gotoTop();
    },
    warningTextShow(data) {
        this.$refs.diiaAlertNotificationMultiple.pushNotification('warning', data);
        this.$clib.gotoTop();
    },

    onNavBarItemClick(value) {
        // temporary for mobile
        this.nav_menu_dialog = false;

        var menuRoute1 = document.getElementById("menuRoute1");
        var menuRoute2 = document.getElementById("menuRoute2");
        var menuRoute3 = document.getElementById("menuRoute3");

        menuRoute1.className = menuRoute1.className.replace(" diia-top-menu-item-active", "");
        menuRoute2.className = menuRoute2.className.replace(" diia-top-menu-item-active", "");
        menuRoute3.className = menuRoute3.className.replace(" diia-top-menu-item-active", "");

        if (value == "administration") {
            menuRoute1.className += " diia-top-menu-item-active";
            this.$router.replace({name: 'materials-list', query: this.$config.query_params});
        }
        else if (value == "applications") {
            menuRoute2.className += " diia-top-menu-item-active";
            this.$router.replace({name: 'applications-list', query: this.$config.query_params});
        }
    },

    getUserActiveEvents() {
        sessionStorage.setItem('information_resource_interface_application_approve', 0);
        sessionStorage.setItem('information_resource_application_at_sign', 0);
        sessionStorage.setItem('request_application_approve', 0);
        sessionStorage.setItem('external_request_application_approve', 0);
        sessionStorage.setItem('external_request_application_execute', 0);
        
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/events/",
        })
        .then((response) => {
            for (let item in response.data) {
                if (response.data[item]['key'] == 'information_resource_interface_application_approve' && response.data[item]['count'] > 0) {
                    sessionStorage.setItem('information_resource_interface_application_approve', response.data[item]['count']);
                    this.warningTextShow("Зверніть увагу! (" + response.data[item]['count'] + ") заявок щодо інтерфейсів інформаційних е-ресурсів очікують вашого розгляду");
                }
                if (response.data[item]['key'] == 'information_resource_application_at_sign' && response.data[item]['count'] > 0) {
                    sessionStorage.setItem('information_resource_application_at_sign', response.data[item]['count']);
                    this.warningTextShow("Зверніть увагу! (" + response.data[item]['count'] + ") заявок щодо інформаційних е-ресурсів потребують підпису");
                }
                if (response.data[item]['key'] == 'request_application_approve' && response.data[item]['count'] > 0) {
                    sessionStorage.setItem('request_application_approve', response.data[item]['count']);
                    this.warningTextShow("Зверніть увагу! (" + response.data[item]['count'] + ") заявок з адміністрування системи очікують вашого розгляду");
                }
                if (response.data[item]['key'] == 'external_request_application_approve' && response.data[item]['count'] > 0) {
                    sessionStorage.setItem('external_request_application_approve', response.data[item]['count']);
                    this.warningTextShow("Зверніть увагу! (" + response.data[item]['count'] + ") запитів очікують вашого розгляду для погодження");
                }
                if (response.data[item]['key'] == 'external_request_application_execute' && response.data[item]['count'] > 0) {
                    sessionStorage.setItem('external_request_application_execute', response.data[item]['count']);
                    this.warningTextShow("Зверніть увагу! (" + response.data[item]['count'] + ") запитів надіслано від інших організацій та потребують вашого розгляду");
                }
            }
            this.renderEventBadges();
        })
        .catch((error) => {
        })
        .finally(() => {
        });
    },

    setNavBar(route_name) {
        var menuRoute1 = document.getElementById("menuRoute1");
        var menuRoute2 = document.getElementById("menuRoute2");
        var menuRoute3 = document.getElementById("menuRoute3");

        menuRoute1.className = menuRoute1.className.replace(" diia-top-menu-item-active", "");
        menuRoute2.className = menuRoute2.className.replace(" diia-top-menu-item-active", "");
        menuRoute3.className = menuRoute3.className.replace(" diia-top-menu-item-active", "");

        if ([
            'information-resources-list',
            'new-information-resource',
            'information-resource-detail',
            'interfaces-list',
            'new-interface',
            'interface-detail',
            'interactions-list',
            'interaction-detail',
            'materials-list',
          ].includes(route_name)) {
              menuRoute1.className += " diia-top-menu-item-active";
        }

        if ([
            'applications-list',
            'new-application',
            'interface-applications-list',
            'information-resource-applications-list',
            'interface-application-detail',
            'information-resource-application-detail',
            'applications-detail',
            'select-application',
            'external-applications-detail',
            'select-external-application',
            'external-applications-list',
            'new-external-application',
          ].includes(route_name)) {
              menuRoute2.className += " diia-top-menu-item-active";
        }

        if ([
            'me-detail',
            'organization-detail',
            'profiles',
            'new-profile',
            'profile-detail',
            'history-log-detail',
            'history-log-list',
          ].includes(route_name)) {
              menuRoute3.className += " diia-top-menu-item-active";
        }
    },


    onClickMenu(value) {
      // temporary for mobile
      this.nav_menu_dialog = false;

      var menuRoute1 = document.getElementById("menuRoute1");
      var menuRoute2 = document.getElementById("menuRoute2");
      var menuRoute3 = document.getElementById("menuRoute3");

      menuRoute1.className = menuRoute1.className.replace(" diia-top-menu-item-active", "");
      menuRoute2.className = menuRoute2.className.replace(" diia-top-menu-item-active", "");
      menuRoute3.className = menuRoute3.className.replace(" diia-top-menu-item-active", "");
      
      menuRoute3.className += " diia-top-menu-item-active";
      
      if (value == 'me-detail') {
        this.$router.replace({name: 'me-detail', query: this.$config.query_params});
      }
      else if (value == 'organization-detail') {
        this.$router.replace({name: 'organization-detail', query: this.$config.query_params});
      }
      else if (value == 'exit') {
        localStorage.removeItem('redirect_to_profile');
        localStorage.removeItem('token');
        this.$refs.diiaAlertNotificationMultiple.removeNotifications();
        this.$router.push({
            name: 'error',
            params: {
                title: 'Вихід з особистого кабінету.', message: 'Ви здійснили вихід з особистого кабінету.', auth_button: true,
            }
        });
      }
    },

    setConfig() {
      const token = localStorage.getItem('token') || '';
      if (token) {
        this.loggined = true;
        this.$config.user_data = JSON.parse(decodeURIComponent(escape(window.atob( token.split('.')[1] ))));
      }
    },

    switchNavMenu() {
      this.nav_menu_dialog = !this.nav_menu_dialog;
    },
  }
};
</script>