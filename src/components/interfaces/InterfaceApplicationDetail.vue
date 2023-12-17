<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;">
        <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
          <v-row>
            <v-col cols="12" md="9" order-sm="3" order-md="1" class="pb-10 container-side-padding">
              <template v-if="application_detail && application_detail.allow_cancel">
                    <v-btn-toggle
                        v-model="toggle_position"
                        borderless
                        active-class="diia-secondary-tab-active"
                        mandatory
                    >
                        <v-btn
                            class="diia-secondary-tab mt-10 mr-5"
                            elevation="0"
                            @click="displayApplicationDetail"
                        >
                            <span>Деталі</span>
                        </v-btn>
                        <v-btn
                            class="diia-secondary-tab mt-10 mr-5"
                            elevation="0"
                            @click="displayApplicationCancel"
                        >
                            <span>Скасувати заявку</span>
                        </v-btn>
                    </v-btn-toggle>
              </template>
            <template v-if="selected_submenu_item === 'viewapplication'">
                <v-container class="mt-10">
                    <v-row>
                        <h3 class="mb-10 diia-h3-header">Деталі заявки</h3>
                        <v-col cols="12" class="pl-0">
                            <v-data-table
                                locale="uk-UA"
                                :headers="wevsrv_application_detail_list_headers"
                                :items="wevsrv_application_detail_list"
                                disable-pagination
                                disable-sort
                                disable-filtering
                                hide-default-footer
                                hide-default-header
                                mobile-breakpoint="1"
                                no-data-text="Дані відсутні"
                                loading-text="Виконується запит..."
                                class="elevation-0 pa-0 data-table-detail-design"
                            >
                                <template v-slot:item.value="{ item }">
                                    <span v-if="item.field == 'Статус' && item.value == 'Потребує погодження'" class="diia-list-badge-primary">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Подана на виконання'" class="diia-list-badge-warning">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Виконана'" class="diia-list-badge-success">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Відхилена'" class="diia-list-badge-error">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Скасована'"  class="diia-list-badge-secondary">{{ item.value }}</span>
                                    <span v-else>{{ item.value }}</span>
                                </template>
                            </v-data-table>
                        </v-col>
                    </v-row>
                    <template v-if="application_detail && application_detail.application_type !== 'ARCHIVE' && application_detail.application_type !== 'PUBLISH' && application_detail.application_type !== 'DEPUBLISH' && application_detail.application_type !== 'UNARCHIVE'">
                        <v-row>
                            <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                        </v-row>
                        <v-row>
                            <h3 class="mb-10 diia-h3-header">Деталі інтерфейсу е-ресурсу</h3>
                            <v-col cols="12" class="pl-0">
                                <v-data-table
                                    locale="uk-UA"
                                    :headers="websrv_fields_list_headers"
                                    :items="websrv_fields_list"
                                    disable-pagination
                                    disable-sort
                                    disable-filtering
                                    hide-default-footer
                                    hide-default-header
                                    mobile-breakpoint="1"
                                    no-data-text="Дані відсутні"
                                    loading-text="Виконується запит..."
                                    class="elevation-0 pa-0 data-table-detail-design"
                                >
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                        </v-row>
                        <v-row>
                            <h3 class="mb-10 diia-h3-header">Сервіси інтерфейсу е-ресурсу</h3>
                            <v-col cols="12" class="pl-0">
                                <v-data-table
                                    locale="uk-UA"
                                    :headers="websrv_methods_list_headers"
                                    :items="websrv_methods_list"
                                    disable-pagination
                                    disable-sort
                                    disable-filtering
                                    hide-default-footer
                                    hide-default-header
                                    mobile-breakpoint="1"
                                    no-data-text="Сервіси відсутні"
                                    loading-text="Виконується запит..."
                                    class="elevation-0 pa-0 data-table-detail-design"
                                >
                                    <template v-slot:item.instance="{ item }">
                                        <span v-if="item.instance == 'SEVDEIR'">Промислове середовище</span>
                                        <span v-if="item.instance == 'SEVDEIR-TEST'">Тестове середовище</span>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                        </v-row>
                        <v-row>
                            <h3 class="mb-10 diia-h3-header">Документація інтерфейсу е-ресурсу</h3>
                            <v-col cols="12" class="pl-0">
                                <v-data-table
                                    locale="uk-UA"
                                    :headers="websrvdoc_list_headers"
                                    :items="websrvdoc_list"
                                    disable-pagination
                                    disable-sort
                                    disable-filtering
                                    hide-default-footer
                                    hide-default-header
                                    mobile-breakpoint="1"
                                    no-data-text="Документи відсутні"
                                    loading-text="Виконується запит..."
                                    class="elevation-0 pa-0 data-table-detail-design"
                                >
                                    <template v-slot:item.file="{ item }">
                                        <a :href="$config.backend_url + item.file">Завантажити</a>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                    </template>
                    <template v-if="application_detail && application_detail.allow_approve">
                        <v-row>
                            <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                        </v-row>
                        <v-row>
                            <h3 class="mb-10 diia-h3-header">Погодження заявки</h3>
                        </v-row>
                        <v-row>
                            <DiiaMessageBox :text="$config.TRANSLATION.INTERFACE.BANNERS.APPLICATION_CANCEL_AGREEMENT"/>
                        </v-row>
                        <v-row class="mt-10">
                            <v-checkbox
                                v-model="cancel_prev_applications"
                                :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                                :label="`Я погоджуюсь з скасуванням попередньо поданих активних заяв до обраного інтерфейсу е-ресурсу.`"
                            ></v-checkbox>
                        </v-row>
                        <v-row>
                            <v-btn
                                class="diia-button-style-3 mt-5"
                                elevation="0"
                                @click="approveWebserviceApplication"
                            >
                                Погодити заявку
                            </v-btn>
                        </v-row>
                    </template>
                </v-container>
            </template>
            <v-container class="mt-10" v-if="selected_submenu_item == 'cancelapplication'">
                <v-row>
                    <h3 class="mb-10 diia-h3-header">Скасування заявки</h3>
                </v-row>
                <v-row>
                    <v-text-field dense required class="mt-5 diia-v-input"
                        :rules="[v => !!v || 'Обовязково до заповнення']"
                        v-model="cancel_reason"
                        label="Причина/Підстава для скасування заявки"
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-btn
                        class="diia-button-style-3 mt-5"
                        elevation="0"
                        @click="cancelWebserviceApplication"
                    >
                    Скасувати заявку
                    </v-btn>
                </v-row>
            </v-container>
            
            </v-col>
            <v-col cols="12" md="3" order-sm="1" order-md="3" class="d-none d-sm-none d-md-block" style="background-color: rgb(243 243 243);">
              <v-expansion-panels multiple class="side-help-menu-expansion-panels mt-10">
                    <v-expansion-panel class="side-help-menu-expansion-panel" v-for="item in $config.INTERFACE_DETAIL_HELP['application']" v-bind:key="item.title">
                        <v-expansion-panel-header class="side-help-menu-expansion-panel-header">
                            <div v-html="item.title">{{ item.title }}</div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="side-help-menu-expansion-panel-content">
                            <div v-html="item.content">{{ item.content }}</div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
          </v-row>
          </v-container>
          </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "InterfaceApplicationDetail",
  components: {},
  data: () => ({
    selected_submenu_item: 'viewapplication',

    overlay: false,
    overlay_text: 'Зачекайте будь ласка',

    cancel_prev_applications: false,
    cancel_reason: '',
    application_detail: {},

    toggle_position: 0,

    wevsrv_application_detail_list_headers: [
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
    wevsrv_application_detail_list: [],

    websrv_fields_list_headers: [
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
    websrv_fields_list: [],

    websrvdoc_list_headers: [
        {
            text: 'Назва документу',
            value: 'name',
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Файл', 
            value: 'file', 
            align: 'start',
            class: 'data-table-header',
        },
    ],
    websrvdoc_list: [],

    websrv_methods_list_headers: [
        {
            text: 'Код методу',
            value: 'full_sevdeir_identifier',
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Середовище', 
            value: 'name', 
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Середовище', 
            value: 'service_role_verbose', 
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Середовище', 
            value: 'instance', 
            align: 'start',
            class: 'data-table-header',
        },
    ],
    websrv_methods_list: [],
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestInterfaceApplicationDetail();
  },

  watch: {
      $route(to, from) {
          if (to.name == 'interface-application-detail') {
            this.clearForm();
            this.toggle_position = 0;
            this.$clib.gotoTop();
            this.selected_submenu_item = 'viewapplication';
            this.requestInterfaceApplicationDetail();
          }
      }
  },

  methods: {
    clearForm() {
        this.cancel_reason = "";
        this.websrvdoc_list = [];
        this.websrv_methods_list = [];
        this.wevsrv_application_detail_list = [];
        this.websrv_fields_list = [];
        this.cancel_prev_applications = false;
    },

    applyWebserviceApplication() {

    },

    displayApplicationDetail() {
        this.selected_submenu_item = 'viewapplication';
    },
    displayApplicationCancel() {
        this.selected_submenu_item = 'cancelapplication';
    },

    onErrorMessageShow(message) {
        this.$emit('on-error-message-show', message);
    },

    onSuccessSubmit(message) {
        this.$emit('on-info-message-show', message);
        this.$router.push({name: 'interface-applications-list', params: {'update_apps': true}});
    },

    requestInterfaceApplicationDetail() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.LOAD_APPLICATION_DETAIL;
        return this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/interface_application/" + this.$route.params.id,
        })
        .then((response) => {
            this.application_detail = response.data;

            this.wevsrv_application_detail_list = [];
            this.websrv_fields_list = [];
            for (let item in response.data) {

                let route_type = ""
                let id = ""
                let field = ""
                let value = response.data[item]

                if ((item == "executed_at" || item == "created_at" || item == "canceled_at" || item == "approved_at" || item == "canceled_by" || item == "approver" || item == "webservice" || item == "admin_comment" || item == "submitter_crud_reason" || item == "cancel_reason") && !value)
                    continue;

                if (item == "webservice_name" && !this.application_detail.webservice)
                    continue;

                if (item == "id")
                    field = "Номер заявки";
                if (item == "status_verbose") {
                    field = "Статус";
                }
                if (item == "interface_name")
                    field = "Інтерфейс е-ресурса";
                if (item == "application_type_verbose")
                    field = "Тип";
                if (item == "webservice_name")
                    field = "Інтерфейс е-ресурсу";
                if (item == "submitter")
                    field = "Автор заявки";
                if (item == "approver")
                    field = "Погоджувач заявки";
                if (item == "canceled_by")
                    field = "Особа, що скасувала заявку";
                if (item == "cancel_reason")
                    field = "Причина скасування заявки";
                if (item == "admin_comment")
                    field = "Коментар адміністратора";
                if (item == "submitter_crud_reason")
                    field = "Причина внесення змін до інтерфейсу е-ресурсу";
                if (item == "created_at") {
                    field = "Дата подання заявки";
                    value = this.$clib.formatDateTimeWithMonthText(value);
                }
                if (item == "executed_at") {
                    field = "Дата виконання/відхилення заявки";
                    value = this.$clib.formatDateTimeWithMonthText(value);
                }
                if (item == "canceled_at") {
                    field = "Дата скасування заявки";
                    value = this.$clib.formatDateTimeWithMonthText(value);
                }
                if (item == "approved_at") {
                    field = "Дата погодження заявки";
                    value = this.$clib.formatDateTimeWithMonthText(value);
                }

                if (item == "name")
                    field = "Назва інтерфейса е-ресурса";
                if (item == "description")
                    field = "Опис призначення";
                if (item == "information_resource_name")
                    field = "Інформаційний е-ресурс";
                if (item == "usage_restrictions")
                    field = "Обмеження щодо використання";
                if (item == "services_description")
                    field = "Скорочені коди сервісів, що формують інтерфейс е-ресурсу";
                if (item == "services_call_sequence_description")
                    field = "Послідовність виклику сервісів";
                if (item == "is_public") {
                    field = "Публічний інтерфейс";
                    value = value ? 'Так' : 'Ні';
                }
                if (item == "personal_data_processing") {
                    field = "Обробка персональних даних інтерфейсом е-ресурсу";
                    value = value ? 'Так' : 'Ні';
                }
                if (item == "exchange_data_type")
                    field = "Тип інтерфейсу";


                if (item != "name" && item != "description" && item != "exchange_data_type" && item != "usage_restrictions" && item != "services_description" && item != "services_call_sequence_description" && item != "is_public" && item != "personal_data_processing" && item != "main_services_prod" && item != "main_services_test" && item != "sub_services_prod" && item != "sub_services_test" && item != "interface" && item != "status" && item != "application_type" && item != "allow_cancel" && item != "allow_approve" && item != "information_resource_name" && item != "prev_application_is_active" && item != "information_resource" && item != "documents") {
                    this.wevsrv_application_detail_list.push({
                        "field": field,
                        "value": value,
                        "route_type": route_type,
                        "id": id
                    })
                }

                if (item == "name" || item == "description" || item == "usage_restrictions" || item == "exchange_data_type" || item == "personal_data_processing" || item == "is_public" || item == "services_call_sequence_description" || item == "services_description" || item == "information_resource_name") {
                    this.websrv_fields_list.push({
                        "field": field,
                        "value": value,
                        "route_type": route_type,
                        "id": id
                    })
                }
            }            

            for (let i in response.data.main_services_prod) {
                response.data.main_services_prod[i].service_role_verbose = response.data.main_services_prod[i].service_role == 'MAIN' ? 'Основний' : 'Допоміжний'
                this.websrv_methods_list.push(response.data.main_services_prod[i]);
            }

            for (let i in response.data.main_services_test) {
                response.data.main_services_test[i].service_role_verbose = response.data.main_services_test[i].service_role == 'MAIN' ? 'Основний' : 'Допоміжний'
                this.websrv_methods_list.push(response.data.main_services_test[i]);
            }

            for (let i in response.data.sub_services_prod) {
                response.data.sub_services_prod[i].service_role_verbose = response.data.sub_services_prod[i].service_role == 'MAIN' ? 'Основний' : 'Допоміжний'
                this.websrv_methods_list.push(response.data.sub_services_prod[i]);
            }

            for (let i in response.data.sub_services_test) {
                response.data.sub_services_test[i].service_role_verbose = response.data.sub_services_test[i].service_role == 'MAIN' ? 'Основний' : 'Допоміжний'
                this.websrv_methods_list.push(response.data.sub_services_test[i]);
            }

            for (let idx in response.data.documents) {
                this.websrvdoc_list.push({
                    'name': response.data.documents[idx].name,
                    'file': response.data.documents[idx].document_url,
                    'unique_uuid': response.data.documents[idx].unique_uuid,
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

    approveWebserviceApplication() {
        if (!this.cancel_prev_applications && this.application_detail.prev_application_is_active) {
            this.onErrorMessageShow('Спочатку необхідно погодитись з скасуванням попередніх заяв до поданого інтерфейсу е-ресурсу.');
            return false;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.APPROVE_APPLICATION;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/interface_application/" + this.$route.params.id + "/approve"
        })
        .then((response) => {
            this.onSuccessSubmit(this.$config.TRANSLATION.INTERFACE.SUCCESS.APPROVED);
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    cancelWebserviceApplication() {
        if (!this.cancel_reason) {
            this.onErrorMessageShow('Необхідно заповнити обов\'язкові поля');
            return false;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.CANCEL_APPLICATION;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/interface_application/" + this.$route.params.id + "/cancel",
            data: {
                'cancel_reason': this.cancel_reason
            }
        })
        .then((response) => {
            this.onSuccessSubmit(this.$config.TRANSLATION.INTERFACE.SUCCESS.CANCELED);
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