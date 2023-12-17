<template>
    <v-card elevation="0" class="mb-10">
        <v-container style="max-width: 1680px;" class="container-side-padding" v-if="selected_submenu_item == 'userlist'">
          <v-row>
            <v-col cols="12" md="12" order-sm="3" order-md="1">
            <v-row>
                <v-text-field
                    v-model="user_list_search"
                    class="pl-3 pr-3 mt-15 v-colored-search"
                    label="Пошук користувачів"
                    append-icon="mdi-magnify"
                    single-line
                >
                </v-text-field>
                <v-spacer></v-spacer>
                <v-btn
                    class="diia-button-style-create mt-15 mr-3"
                    elevation="0"
                    @click="displayAddUser"
                >
                    <v-icon>mdi-plus</v-icon>
                    <span>Новий користувач</span>
                </v-btn>
            </v-row>    
            <template>
                <v-data-table
                    locale="uk-UA"
                    :headers="user_list_headers"
                    :items="user_list"
                    :items-per-page="10"
                    :footer-props="{'items-per-page-options':[4, 10, 25, 50]}"
                    mobile-breakpoint="1"
                    @click:row="onClickUserDetailSelect"
                    :loading="user_list_loading"
                    loading-text="Виконується запит..."
                    class="elevation-0 pa-0 data-table-design mt-10"
                >
                    <template v-slot:item.permission_active="{ item }">
                        <span v-if="item.permission_active" class="diia-list-badge-success">Активний</span>
                        <span v-if="!item.permission_active" style="color: white; background-color: #fa594f; padding: 2px 4px;">Деактивований</span>
                    </template>
                
                </v-data-table>
              </template>
            </v-col>
          </v-row>
          </v-container>
          <v-container style="max-width: 1680px;" v-if="selected_submenu_item == 'adduser'">
            <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
            <v-row>
                <v-col cols="12" md="9" order-sm="3" order-md="1" class="container-side-padding">
                    <v-form ref="form" v-model="form_valid">
                        <v-row>
                            <h3 class="mb-10 mt-15 diia-h3-header">Створення користувача</h3>
                        </v-row>
                        <v-row>
                            <v-col cols="6" class="pl-0">
                                <v-text-field
                                    v-model="addUserData.first_name"
                                    required class="diia-v-input" dense
                                    :rules="[v => !!v || 'Обовязково до заповнення']"
                                    label="Імя"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6" class="pl-0">
                                <v-text-field
                                    v-model="addUserData.last_name"
                                    required class="diia-v-input" dense
                                    :rules="[v => !!v || 'Обовязково до заповнення']"
                                    label="Прізвище"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" class="pl-0">
                                <v-text-field
                                    v-model="addUserData.drfocode"
                                    required class="diia-v-input" dense
                                    :rules="drfoRules"
                                    label="РНОКПП"
                                    hint="РНОКПП користувача або серія (за наявності) та номер паспорта (для користувачів, які через свої релігійні переконання відмовляються від прийняття РНОКПП та офіційно повідомили про це відповідний контролюючий орган і мають відмітку у паспорті). Використовується для аутентифікації користувача через особистий кабінет."
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6" class="pl-0">
                                <v-checkbox
                                    v-model="addUserData.has_interaction_admin_access"
                                    :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                                    label="Дозвіл: Адміністратор взаємодій"
                                ></v-checkbox>
                            </v-col>
                            <v-col cols="6" class="pl-0">
                                <v-checkbox
                                    v-model="addUserData.has_security_server_admin_access"
                                    :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                                    label="Дозвіл: Адміністратор ШБО"
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-btn
                                class="diia-button-style-3 mt-5"
                                @click="addUser"
                                elevation="0"
                                :ripple="false"
                            >
                            Створити
                            </v-btn>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "Internal",
  components: {},
  data: () => ({
    selected_submenu_item: 'userlist',

    addUserData: {},
    form_valid: false,

    overlay: false,
    overlay_text: 'Зачекайте будь ласка',

    drfoRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => (/[0-9]{10}/.test(v) || /[АБВГДЕЄЖЗИІКЛМНОПРСТУФХЦЧШЩЮЯ]{2}[0-9]{6}/.test(v) || /[0-9]{9}/.test(v)) || "Не коректно заповнений РНОКПП",
      (v) => v && v.length <= 10 || "Розмір перевищує 10 символів",
    ],

    user_list_search: "",
    user_list_loading: false,
    user_list_headers: [
        {
            text: 'Ім\'я',
            align: 'start',
            value: 'first_name',
            class: 'data-table-header',
            width: "110px",
        },
        { 
            text: 'Прізвище', 
            value: 'last_name', 
            align: 'start',
            class: 'data-table-header',
            width: "110px",
        },
        { 
            text: 'Код РНОКПП', 
            value: 'drfocode', 
            align: 'start',
            class: 'data-table-header',
            width: "110px",
        },
        { 
            text: 'Роль', 
            value: 'permission', 
            align: 'start',
            class: 'data-table-header',
            width: "110px",
        },
        { 
            text: 'Статус', 
            value: 'permission_active', 
            align: 'start',
            class: 'data-table-header',
            width: "110px",
        },
    ],
    user_list_data: [],
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestUserList();

    if (this.$route.name == 'new-profile') {
        this.selected_submenu_item = 'adduser';
    }
  },

  watch: {
    $route(to, from) {
        if (to.name == 'profiles') {
            this.selected_submenu_item = 'userlist';
            if (this.$route.params && this.$route.params.update) {
                this.requestUserList();
            }
        }

        if (to.name == 'new-profile') {
            this.selected_submenu_item = 'adduser';
            this.clearForm();
        }
      }
  },

  computed: {
    user_list: function() {
      return this.$clib.imprecizeComparison(
          this.user_list_search, 
          this.user_list_data, 
          ["permission", "permission_id", "permission_active", "permission_last_login_datetime", "class"]);
    },
  },

  methods: {
    onClickUserDetailSelect(val) {
        this.$router.push({name: 'profile-detail', params: {'id': val.permission_id}});
    },
    displayUserTable() {
        this.selected_submenu_item = 'userlist';
    },
    displayAddUser() {
        this.selected_submenu_item = 'adduser';
        this.$router.push({name: 'new-profile'});
    },

    clearForm() {
        this.addUserData = {};
    },

     requestUserList() {
        this.user_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/profile",
        })
        .then((response) => {
            this.user_list_data = [];
            for (let item in response.data) {
                this.user_list_data.push({
                    "first_name": response.data[item].first_name,
                    "last_name": response.data[item].last_name,
                    "permission": response.data[item].permission,
                    "permission_id": response.data[item].permission_id,
                    "permission_active": response.data[item].permission_active,
                    "permission_last_login_datetime": response.data[item].permission_last_login_datetime,
                    "drfocode": response.data[item].drfocode,
                    "class": 'data-table-header'
                })
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.user_list_loading = false;
        });
    },

    addUser() {
        this.$refs.form.validate();

        if (!this.form_valid) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля.');
            return false;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.PROFILE.LOADING.CREATE_PROFILE;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/permissions",
            data: {
                'drfocode': this.addUserData.drfocode,
                'first_name': this.addUserData.first_name,
                'last_name': this.addUserData.last_name,
                'has_interaction_admin_access': this.addUserData.has_interaction_admin_access,
                'has_security_server_admin_access': this.addUserData.has_security_server_admin_access,
            }
        })
        .then((response) => {
            this.$emit('on-info-message-show', this.$config.TRANSLATION.PROFILE.SUCCESS.CREATE_PROFILE);
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