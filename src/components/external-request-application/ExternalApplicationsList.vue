<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;" class="container-side-padding mb-10" v-if="selected_submenu_item == 'apps'">
          <v-row>
            <v-col cols="12" md="12" order-sm="3" order-md="1">
                <v-row>
                    <v-text-field
                        v-model="app_list_search"
                        class="pl-3 pr-3 mt-15 v-colored-search"
                        label="Пошук по запитам"
                        append-icon="mdi-magnify"
                        single-line
                    >
                    </v-text-field>
                    <v-select
                        v-model="external_application_direction_filter"
                        class="pl-3 pr-3 mt-15 v-colored-search"
                        item-text="name"
                        item-value="id"
                        label="Тип запиту"

                        :items="[{
                            id: 'IN', 
                            name:'Вхідні', 
                        }, {
                            id: 'OUT', 
                            name: 'Вихідні'
                        }, {
                            id: 'ALL', 
                            name: 'Усі'
                        }]"
                        single-line
                        clearable
                    >
                    </v-select>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="diia-button-style-create mt-15 mr-3"
                        elevation="0"
                        @click="displaySelectNewApplication"
                    >
                        <v-icon>mdi-plus</v-icon>
                        <span>Створити запит</span>
                    </v-btn>
                </v-row>
                <v-data-table
                    locale="uk-UA"
                    :search="app_list_search"
                    :headers="app_list_headers"
                    :items="app_list"
                    :items-per-page="10"
                    :footer-props="{'items-per-page-options':[4, 10, 25, 50]}"
                    mobile-breakpoint="1"
                    @click:row="onClickApplicationDetailSelect"
                    :loading="app_list_loading"
                    loading-text="Виконується запит..."
                    class="elevation-0 pa-0 data-table-design mt-10"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                >
                    <template v-slot:item.status="{ item }">
                        <span v-if="item.status == 'Потребує погодження'" class="diia-list-badge-primary">{{ item.status }}</span>
                        <span v-else-if="item.status == 'Подано на виконання' && item.direction == 'IN'" class="diia-list-badge-warning">Очікує розгляду</span>
                        <span v-else-if="item.status == 'Подано на виконання' && item.direction == 'OUT'" class="diia-list-badge-warning">Відправлено</span>
                        <span v-else-if="item.status == 'Виконано'" class="diia-list-badge-success">{{ item.status }}</span>
                        <span v-else-if="item.status == 'Відхилено'" class="diia-list-badge-error">{{ item.status }}</span>
                        <span v-else-if="item.status == 'Скасовано'" class="diia-list-badge-secondary">{{ item.status }}</span>
                        <span v-else class="diia-list-badge-secondary">{{ item.status }}</span>
                    </template>
                    <template v-slot:item.instance_verbose="{ item }">
                        <v-chip v-if="item.instance_verbose">{{ item.instance_verbose }}</v-chip>
                    </template>
                    <template v-slot:item.direction="{ item }">
                        <b v-if="item.direction == 'IN'">Вхідні</b>
                        <b v-if="item.direction == 'OUT'">Вихідні</b>
                    </template>
                </v-data-table>
            </v-col>
          </v-row>
          </v-container>
          <v-container style="max-width: 1680px;" v-if="selected_submenu_item == 'selectnewapp'">
            <v-row>
                <v-col cols="12" md="9" order-sm="3" order-md="1" class="container-side-padding">
                    <v-row>
                        <v-text-field
                            v-model="new_app_list_search"
                            class="pl-3 pr-3 mt-15 v-colored-search"
                            label="Пошук за назвою"
                            append-icon="mdi-magnify"
                            single-line
                        >
                        </v-text-field>
                        <v-select
                            v-model="instance_filter"
                            class="pl-3 pr-3 mt-15 v-colored-search"
                            label="Середовище"
                            :items="['Промислове середовище', 'Тестове середовище', 'Без середовища']"
                            single-line
                            clearable
                        >
                        </v-select>
                    </v-row>
                    <v-data-table
                        dense
                        :search="new_app_list_search"
                        locale="uk-UA"
                        hide-default-footer
                        :headers="new_app_list_headers"
                        :items="new_app_list"
                        @click:row="onClickNewApplicationSelect"
                        :loading="new_app_list_loading"
                        disable-pagination
                        disable-sort
                        disable-filtering
                        no-data-text="Шаблони запитів відсутні"
                        mobile-breakpoint="1"
                        class="elevation-0 pa-0 data-table-design mt-10 mb-10"
                    >
                    </v-data-table>
                </v-col>
                <v-col cols="12" md="3" order-sm="1" order-md="3" class="d-none d-sm-none d-md-block" style="background-color: rgb(243 243 243); padding-left: 40px; padding-right: 40px; padding-top: 90px;">
                    <p style="font-size: 20px;
                                font-weight: normal;
                                line-height: 28px;
                                margin-bottom: 34px;
                                letter-spacing: -0.02em;">Як подати запит?
                    </p>
                    <p style="font-size: 16px;
                            font-weight: normal;
                            line-height: 24px;
                            letter-spacing: -0.02em; margin-bottom: 20px;">
                        Із запропонованого списку оберіть та натисніть на запит, що відповідає середовищу системи.
                    </p>
                </v-col>
            </v-row>
          </v-container>
        </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "ExternalApplicationsList",
  components: {},
  data: () => ({
    sortBy: 'id',
    sortDesc: true,
    selected_submenu_item: 'apps',

    addData: {},

    instance_filter: '',
    tags_list: [],
    tags_filter: [],

    tags_loading: false,

    on_approval_count: 0,
    on_execute_count: 0,

    external_application_direction_filter: 'ALL',

    app_list_data: [],
    app_list_search: '',
    app_list_loading: false,
    app_list_headers: [
        {
            text: "№",
            value: 'id',
            align: 'start',
            class: 'data-table-header',
            width: '50px'
        },
        {
            text: 'Напрям',
            value: 'direction',
            align: 'start',
            class: 'data-table-header',
            width: "100px"
        },
        {
            text: 'Тип запиту',
            value: 'template_name',
            align: 'start',
            class: 'data-table-header',
        },
        {
            text: 'Відправник/Отримувач',
            value: 'from_to',
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Середовище', 
            value: 'instance_verbose', 
            align: 'start',
            class: 'data-table-header',
            width: "200px"
        },
        { 
            text: 'Статус',
            value: 'status',
            align: 'start',
            class: 'data-table-header',
            width: '200px'
        },
    ],

    new_app_list_data: [],
    new_app_list_search: "",
    new_app_list_loading: false,
    new_app_list_headers: [
        {
            text: 'Тип запиту',
            value: 'name',
            align: 'start',
            class: 'data-table-header',
        },
        {
            text: 'Середовище',
            value: 'instance_verbose',
            align: 'start',
            class: 'data-table-header',
        },
    ],
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestApplicationsList();
    this.requestNewApplicationSelectList();

    if (this.$route.name == 'select-external-application') {
        this.selected_submenu_item = 'selectnewapp';
    }
  },

  watch: {
      $route(to, from) {
        if (to.name == 'external-applications-list') {
            this.selected_submenu_item = 'apps';
            if (this.$route.params && this.$route.params.update_apps) {
                this.requestApplicationsList();
            }
        }
        if (to.name == 'select-external-application') {
            this.selected_submenu_item = 'selectnewapp';
        }
      }
  },

  computed: {
    app_list: function() {
        let apps_search = this.$clib.imprecizeComparison(this.app_list_search, this.app_list_data, ["id", "status", "instance", "template_id", "submitter", "class"]);

        if (this.external_application_direction_filter && this.external_application_direction_filter != 'ALL') {
            let result_array = [];
            for (let app in apps_search) {
                if (apps_search[app].direction == this.external_application_direction_filter)
                    result_array.push(apps_search[app]);
            }
            apps_search = result_array;
        }

        return apps_search;
    },
    new_app_list: function() {
        let apps_search = this.$clib.imprecizeComparison(this.new_app_list_search, this.new_app_list_data, ["id"]);
        if (this.tags_filter.length > 0) {
            let result_array = [];
            for (let app in apps_search) {
                if (this.tags_filter.every(element => {return apps_search[app].tags.includes(element);}))
                    result_array.push(apps_search[app]);
            }
            apps_search = result_array;
        }

        if (this.instance_filter) {
            let result_array = [];
            for (let app in apps_search) {
                if (apps_search[app].instance_verbose == this.instance_filter || (this.instance_filter == 'Без середовища' && !apps_search[app].instance_verbose))
                    result_array.push(apps_search[app]);
            }
            apps_search = result_array;
        }

        return apps_search;
    },
  },

  methods: {
    onClickNewApplicationSelect(val) {
        this.$router.push({name: 'new-external-application', params: {'id': val.id}});
    },

    onClickApplicationDetailSelect(val) {
        this.$router.push({name: 'external-applications-detail', params: {'id': val.id}});
    },

    displayApplications() {
          this.selected_submenu_item = 'apps';
    },
    displaySelectNewApplication() {
          this.selected_submenu_item = 'selectnewapp';
          this.$router.push({name: 'select-external-application'});
    },

    requestApplicationsList() {
        this.on_execute_count = 0;
        this.on_approval_count = 0;
        this.app_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/external_application",
        })
        .then((response) => {
            this.app_list_data = [];
            for (let item in response.data) {
                if (response.data[item].status == 'Подано на виконання' && response.data[item].direction == 'IN') {
                    this.on_execute_count += 1;
                }

                if (response.data[item].status == 'Потребує погодження' && response.data[item].direction == 'OUT') {
                    this.on_approval_count += 1;
                }

                this.app_list_data.push(response.data[item]);
            }

            if (this.$config.user_data.access && this.$config.user_data.access.p == 'ADMIN') {
                sessionStorage.setItem('external_request_application_approve', this.on_approval_count);
                sessionStorage.setItem('external_request_application_execute', this.on_execute_count);
                this.$emit('on-counter-update');
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.app_list_loading = false;
        });
    },

    requestNewApplicationSelectList() {
        this.new_app_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/external_application_template",
        })
        .then((response) => {
            this.new_app_list_data = []
            for (let item in response.data) {
                this.new_app_list_data.push(response.data[item]);
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.new_app_list_loading = false;
        });
    },
  }
}
</script>