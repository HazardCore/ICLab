<template>
    <v-card elevation="0" class="mb-10">
        <v-container style="max-width: 1680px;">
            <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
            <v-row>
                <v-col cols="12" md="9" order="3" order-sm="3" order-md="1" class="container-side-padding">
                <h3 class="mb-10 mt-10 diia-h3-header">Профіль користувача</h3>
                <v-data-table
                    dense
                    locale="uk-UA"
                    :headers="detail_headers"
                    :items="detail_data"
                    disable-pagination
                    disable-sort
                    disable-filtering
                    hide-default-footer
                    hide-default-header
                    :loading="detail_loading"
                    mobile-breakpoint="1"
                    class="elevation-0 pa-0 data-table-detail-design fifty-table"
                >
                    <template v-slot:item.value="{ item }">
                        <span v-if="item.field == 'Статус профілю' && item.value" style="color: white; background-color: #19be6f; padding: 2px 4px;">Активний</span>
                        <span v-if="item.field == 'Статус профілю' && !item.value" style="color: white; background-color: #fa594f; padding: 2px 4px;">Деактивований</span>
                        <span v-if="item.field != 'Статус профілю'">{{ item.value }}</span>
                    </template>

                </v-data-table>

                <v-btn class="diia-button-style-3 mt-5" v-if="display_action_buttons && (!user_detail.permission_last_login_datetime && user_detail.permission != 'Відповідальна особа')" elevation="0" @click="deleteUser">Видалити</v-btn>
                <v-btn class="diia-button-style-3 mt-5" v-if="display_action_buttons && user_detail.permission_last_login_datetime && !user_detail.permission_active" elevation="0" @click="activateUser">Активувати</v-btn>
                <v-btn class="diia-button-style-3 mt-5" v-if="display_action_buttons && user_detail.permission_last_login_datetime && user_detail.permission_active" elevation="0" @click="deactivateUser">Деактивувати</v-btn>

                <v-divider class="mt-10 mb-10 diia-divider"></v-divider>

                <template v-if="user_detail.permission == 'Користувач'">
                    <h3 class="mb-5 mt-10 diia-h3-header">Дозволи</h3>
                    <v-col cols="6" class="pa-0 pt-3">
                        <v-checkbox
                            v-model="has_interaction_admin_access"
                            :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                            label="Дозвіл: Адміністратор взаємодій"
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="6" class="pa-0">
                        <v-checkbox
                            v-model="has_security_server_admin_access"
                            :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                            label="Дозвіл: Адміністратор ШБО"
                        ></v-checkbox>
                    </v-col>
                    <v-btn class="diia-button-style-3 mt-5" elevation="0" @click="changeAccessPermission">Внести зміни</v-btn>
                    <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                </template>

                <h3 class="mb-10 mt-10 diia-h3-header">Історія</h3>
                <v-data-table
                    :search="history_list_search"
                    dense
                    locale="uk-UA"
                    :hide-default-footer="history_list.length == 0"
                    :hide-default-header="history_list.length == 0"
                    :footer-props="{'items-per-page-options':[8, 25, 50]}"
                    :headers="history_list_headers"
                    :items="history_list"
                    :loading="history_list_loading"
                    :items-per-page="5"
                    mobile-breakpoint="1"
                    class="elevation-0 pa-0 data-table-detail-design"
                ></v-data-table>
                </v-col>
            </v-row>
          </v-container>
          </v-card>
</template>

<script>
/* eslint-disable */

export default {
  name: "ProfilesDetail",
  components: {},
  data: () => ({
    user_detail: {},

    detail_headers: [
        {
        align: 'start',
        value: 'field',
        class: 'data-table-header fifty-width',
      },
      {
        align: 'start',
        value: 'value', 
        class: 'data-table-header fifty-width',
      },
    ],
    detail_data: [],
    detail_loading: false,

    overlay: false,
    overlay_text: 'Зачекайте будь ласка',

    has_interaction_admin_access: false,
    has_security_server_admin_access: false,

    display_action_buttons: false,

    history_list_search: "",
    history_list_loading: false,
    history_list_headers: [
        { 
            text: 'Подія', 
            value: 'event_type', 
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Об\'єкт',
            value: 'object_repr',
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Дата та час',
            value: 'timestamp',
            align: 'start',
            class: 'data-table-header',
        },
    ],
    history_list: []
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';

    this.requestUserDetail();
    this.requestUserHistory();
  },

  watch: {
      $route(to, from) {
        if (to.name == 'profile-detail') {
            this.detail_data = [];
            this.history_list = [];
            this.display_action_buttons = false;
            this.requestUserDetail();
            this.requestUserHistory();
        }
      }
  },

  methods: {
    requestUserHistory() {
        this.history_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/permissions/" + this.$route.params.id + "/history",
        })
        .then((response) => {
            this.history_list = [];
            for (let item in response.data) {
                this.history_list.push({
                    "event_type": response.data[item].event_type,
                    "timestamp": response.data[item].timestamp ? this.$clib.formatDateTimeWithMonthText(response.data[item].timestamp) : '',
                    "object_repr": response.data[item].object_repr,
                    "actor": response.data[item].actor,
                })
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.history_list_loading = false;
        });
    },


    requestUserDetail() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.PROFILE.LOADING.LOAD_PROFILE;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/permissions/" + this.$route.params.id,
        })
        .then((response) => {
            this.detail_data = []
            for (let item in response.data) {
                this.user_detail = response.data;

                let route_type = ""
                let id = ""
                let field = ""
                let value = response.data[item]

                if (item == "first_name")
                    field = "Імя";
                if (item == "last_name") {
                    field = "Прізвище";
                }
                if (item == "drfocode")
                    field = "Код РНОКПП";
                if (item == "permission")
                    field = "Рівень доступу";
                if (item == "permission_active")
                    field = "Статус профілю";
                if (item == "permission_last_login_datetime") {
                    field = "Остання дата та час входу в систему";
                    value = this.$clib.formatDateTimeWithMonthText(value);
                }
                if (item == 'has_interaction_admin_access') {
                    this.has_interaction_admin_access = value;
                }
                if (item == 'has_security_server_admin_access') {
                    this.has_security_server_admin_access = value;
                }
                if (item == 'uuid') {
                    let user_uuid = JSON.parse(localStorage.getItem('user_data', ''));
                    if (user_uuid && user_uuid.id && value != user_uuid.id) {
                        this.display_action_buttons = true;
                    }
                }
                
                if (item != "permission_id" && item != "has_interaction_admin_access" && item != "has_security_server_admin_access" && item != "uuid")
                    this.detail_data.push({
                        "field": field,
                        "value": value,
                        "route_type": route_type,
                        "id": id
                    })
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
      },


    activateUser() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.PROFILE.LOADING.ACTIVATE_USER;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/permissions/" + this.user_detail.permission_id + "/activate",
        })
        .then((response) => {
            this.$emit('on-info-message-show', this.$config.TRANSLATION.PROFILE.SUCCESS.ACTIVATE_USER);
            this.$router.push({name: 'profiles', params: {'update': true}});
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    changeAccessPermission() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.PROFILE.LOADING.CHANGE_ACCESS_PERMISSION;
        this.axios({
            method: "put",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/permissions/" + this.user_detail.permission_id + "/change_access",
            data: {
                'has_interaction_admin_access': this.has_interaction_admin_access,
                'has_security_server_admin_access': this.has_security_server_admin_access,
            }
        })
        .then((response) => {
            this.$emit('on-info-message-show', this.$config.TRANSLATION.PROFILE.SUCCESS.CHANGE_ACCESS_PERMISSION);
            this.$router.push({name: 'profiles', params: {'update': true}});
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    deactivateUser() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.PROFILE.LOADING.DEACTIVATE_USER;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/permissions/" + this.user_detail.permission_id + "/deactivate",
        })
        .then((response) => {
            this.$emit('on-info-message-show', this.$config.TRANSLATION.PROFILE.SUCCESS.DEACTIVATE_USER);
            this.$router.push({name: 'profiles', params: {'update': true}});
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    deleteUser() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.PROFILE.LOADING.DELETE_USER;
        this.axios({
            method: "delete",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/permissions/" + this.user_detail.permission_id,
        })
        .then((response) => {
            this.$emit('on-info-message-show', this.$config.TRANSLATION.PROFILE.SUCCESS.DELETE_USER);
            this.$router.push({name: 'profiles', params: {'update': true}});
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },
  }
}
</script>