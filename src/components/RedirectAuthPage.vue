<template>
<v-card
        fluid
        elevation="0"
        class="pb-0"
    >
        <v-container style="max-width: 1680px;">
            <v-card
                fluid
                elevation="0"
                class="mr-0 pb-0"
            >
          <v-row>
            <v-col cols="12" md="9" order-sm="3" order-md="1" style="min-height: 600px;" class="pb-10 container-side-padding">
                <DiiaLoaderOverlay :show_overlay="overlay" text="Зачекайте будь ласка, виконується авторизація"/>
                <template v-if="show_auth_error">
                    <h3 style="margin-bottom: 48px; margin-top: 48px;" class="diia-h3-header">Помилка при авторизації.</h3>
                    <v-btn class="diia-button-style-3 mt-6" elevation="0" :ripple="false" @click="$clib.redirectToIdGovUa($config.IDGOVUA.url, $config.IDGOVUA.client_id, $config.IDGOVUA.state, $config.IDGOVUA.redirect_uri)">Увійти до кабінету</v-btn>
                </template>
                <template v-if="show_auth_loading">
                    <h2 style="margin-bottom: 48px; margin-top: 48px; font-size: 38px; line-height: 40px; font-weight: 400;">Авторизація</h2>
                    <v-card-text class="pa-0">
                            Виконується вхід в особистий кабінет.
                            <div class="mb-5">
                                <v-progress-linear
                                    indeterminate
                                    size="48"
                                >
                                </v-progress-linear>
                            </div>
                    </v-card-text>
                </template>
                <template v-if="show_organization_selection">
                   <h2 style="margin-bottom: 48px; margin-top: 48px; font-size: 38px; line-height: 40px; font-weight: 400;">Авторизація</h2>
                   <v-data-table
                        dense
                        locale="uk-UA"
                        hide-default-footer
                        :headers="organization_selection_list_headers"
                        :items="organization_selection_list_items"
                        @click:row="onClickOrganizationSelect"
                        disable-pagination
                        disable-sort
                        disable-filtering
                        no-data-text="Немає організацій для входу"
                        mobile-breakpoint="1"
                        class="elevation-0 pa-0 data-table-design"
                    >
                    </v-data-table>
                </template>
            </v-col>
                <v-col cols="12" md="3" order-sm="1" order-md="3" class="d-none d-sm-none d-md-block" style="background-color: rgb(243 243 243); padding-left: 40px; padding-right: 40px; padding-top: 90px;">
                    <template v-if="show_organization_selection">
                    <p style="font-size: 20px;
                                font-weight: normal;
                                line-height: 28px;
                                margin-bottom: 34px;
                                letter-spacing: -0.02em;">Наступний крок авторизації.
                    </p>
                    <p style="font-size: 16px;
                            font-weight: normal;
                            line-height: 24px;
                            letter-spacing: -0.02em; margin-bottom: 20px;">
                        Ви можете авторизуватись до внутрішнього кабінету будь-якої організації з запропонованих в списку за наданими повноваженнями.
                    </p>
                    </template>
                    <p style="font-size: 16px;
                            font-weight: normal;
                            line-height: 24px;
                            letter-spacing: -0.02em; margin-bottom: 20px;">
                        Для отримання доступу подайте відповідну форму на сайті trembita.gov.ua, або зверніться до відповідальних осіб організації.
                    </p>
                </v-col>
                </v-row>
            </v-card>
        </v-container>
    </v-card>
</template>

<script>
/* eslint-disable */
import axios from "axios";

export default {
  name: "RedirectAuthPage",
  components: {},
  data: () => ({
    show_auth_loading: false,
    show_auth_error: false,
    show_organization_selection: false,
    token_type: null,

    overlay: false,


    organization_selection_list_headers: [
        {
            text: 'Назва організації',
            align: 'start',
            value: 'organization_name',
            class: 'data-table-header',
            width: "550px",
        },
        { 
            text: 'Роль', 
            value: 'access_level', 
            align: 'start',
            class: 'data-table-header',
        },
    ],

    organization_selection_list_items: [],

    redirect_to_profile: false,

  }),
  mounted: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    
    if (this.$route.query.code) {
      this.loginByUAoAuth()
    }

    if (this.$route.query.check) {
        // check if user has already signed in
        if (localStorage.getItem('token', null)) {
            const token = localStorage.getItem('token', null);
            const decoded_token = JSON.parse(decodeURIComponent(escape(window.atob( token.split('.')[1] ))));
            if (decoded_token.type == 'ACCESS') {
                this.$router.replace({name: 'materials-list'});
            } else {
                // if type of token is preaccess force to login with id.gov.ua again
                this.goToAuth();
            }
        } else {
            // redirect user to id.gov.ua page
            this.goToAuth();
        }
    }
  },
  methods: {
      goToAuth() {
        window.open(`${this.$config.IDGOVUA.url}/?response_type=code&client_id=${this.$config.IDGOVUA.client_id}&state=${this.$config.IDGOVUA.state}&redirect_uri=${this.$config.IDGOVUA.redirect_uri}`, 
                    '_self',
                    null);
    },

  onClickOrganizationSelect(item) {
    // get new access token based on selected organization, request is performed with preaccess in localstorage
    axios.post(`${this.$config.backend_url}/api/v1/account/internal/profiles/permissions_select`, {'permission_id': item.id})
        .then(response => {
            if (response.data.token) {
                const token = response.data.token;

                // set parameter if user data need to be clarified
                this.redirect_to_profile = response.data.redirect_to_profile;

                this.$config.decoded_token = JSON.parse(decodeURIComponent(escape(window.atob( token.split('.')[1] ))));

                localStorage.setItem('token', token);
                localStorage.setItem('user_data', JSON.stringify(this.$config.decoded_token));

                axios.defaults.headers.common['Authorization'] = `Token ${token}`;

                if (this.redirect_to_profile) {
                    localStorage.setItem('redirect_to_profile', true);
                    this.$router.replace({name: 'me-detail'});
                } else {
                    this.$router.replace({name: 'materials-list'});
                }
            }
        }).catch((error) => {
            this.handleError(error);
        })
        .finally(() => {});
  },

  loginByUAoAuth() {
    let data = {
        code: this.$route.query.code,
        state: this.$route.query.state
    };

    this.show_auth_loading = true;

    let prom = new Promise((resolve, reject) => {
            this.overlay = true;
            delete axios.defaults.headers.common['Authorization'];

            // provide a request to backend to retrieve user data from id.gov.ua and return user
            axios.get(`${this.$config.backend_url}/api/v1/auth/catalog_auth/signin?code=${data.code}&state=${data.state}`,)
                .then(response => {
                    const data = response.data;
                    const token = data.token;
                    
                    // set parameter if user data need to be clarified
                    this.redirect_to_profile = data.redirect_to_profile;

                    this.$config.decoded_token = JSON.parse(decodeURIComponent(escape(window.atob( token.split('.')[1] ))));

                    // save token to storage for any future request uses
                    localStorage.setItem('token', token);
                    localStorage.setItem('user_data', JSON.stringify(this.$config.decoded_token));

                    axios.defaults.headers.common['Authorization'] = `Token ${token}`;

                    // check if user token type is temporary and user has few options for organizations to login to
                    if (this.$config.decoded_token.type === "PREACCESS") {
                        this.show_auth_loading = false;
                        this.show_organization_selection = true;
                        this.token_type = 'PREACCESS';

                        // request organizations list
                        axios.get(`${this.$config.backend_url}/api/v1/account/internal/profiles/permissions_list`,)
                            .then(response => {
                                this.overlay = false;
                                this.organization_selection_list_items = [];
                                    for (let item in response.data) {
                                        this.organization_selection_list_items.push({
                                            "id": response.data[item].id,
                                            "organization_name": response.data[item].organization_name,
                                            "access_level": response.data[item].access_level,
                                            "class": 'data-table-header'
                                        })
                                    }
                            });
                    } else if (this.$config.decoded_token.type === "ACCESS") {
                        this.token_type = 'ACCESS';
                    }
                    return (response)
                }).then(result => {
                    resolve(result)
                })
                .catch(err => {
                    localStorage.removeItem('token');
                    this.show_auth_error = true;
                    this.show_auth_loading = false;
                    this.show_organization_selection = false;
                    reject(err)
                })
                .finally(() => {
                    this.overlay = false;
                })
        });

    prom.then(() => {
        this.$nextTick().then(() => {
            if (this.token_type === 'ACCESS') {
                if (this.redirect_to_profile) {
                    localStorage.setItem('redirect_to_profile', true);
                    this.$router.replace({name: 'me-detail'});
                } else {
                    this.$router.replace({name: 'materials-list'});
                }
            }
        })
        }).then((result) => {
            return result
        }).catch(err => {
            console.log(err);
        });
    },
  }
}
</script>