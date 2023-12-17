<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;">
        <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
        <v-form ref="form" v-model="form_valid">
          <v-row>
            <v-col cols="12" md="9" order-sm="3" order-md="1" class="pb-10 container-side-padding">
            <!-- <template v-if="application_detail && application_detail.allow_cancel"> -->
                <!-- <v-btn-toggle
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
                        <span>Змінити договір</span>
                    </v-btn>
                </v-btn-toggle> -->
            <!-- </template> -->
            <template v-if="selected_submenu_item === 'viewapplication'">
                <v-container class="mt-10">
                    <v-row>
                        <h3 class="mb-10 diia-h3-header">Відомості про взаємодію</h3>
                        <v-col cols="12" class="pl-0">
                            <v-data-table
                                locale="uk-UA"
                                :headers="irs_application_detail_list_headers"
                                :items="irs_application_detail_list"
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
                                <!-- <template v-slot:item.value="{ item }">
                                    <span v-if="item.field == 'Статус'" class="diia-list-badge-error">Не має юр. підстав</span>
                                    <span v-else>{{ item.value }}</span>
                                </template> -->
                                <!-- <template v-slot:item.value="{ item }">
                                    <span v-if="item.field == 'Статус' && item.value == 'Потребує підписання'" class="diia-list-badge-primary">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Подана на виконання'" class="diia-list-badge-warning">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Виконана'" class="diia-list-badge-success">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Відхилена'" class="diia-list-badge-error">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Скасована'" class="diia-list-badge-secondary">{{ item.value }}</span>
                                    <a v-else-if="item.field == 'Файл підпису (*.p7s)'" v-bind:href="$config.backend_url + item.value" target="_blank" class="view-href-a">Завантажити</a>
                                    <span v-else>{{ item.value }}</span>
                                </template> -->
                            </v-data-table>
                        </v-col>
                    </v-row>
                    <!-- <v-row>
                        <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                    </v-row>
                    <v-row>
                        <h3 class="mb-10 diia-h3-header">Договір про інформаційну взаємодію</h3>
                        <v-col cols="12" class="pl-0">
                            <v-text-field dense required class="diia-v-input"
                                :rules="[v => !!v || 'Обовязково до заповнення']"
                                v-model="name"
                                label="Файл договору"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pl-0">
                            <v-text-field dense required class="diia-v-input"
                                :rules="[v => !!v || 'Обовязково до заповнення']"
                                v-model="name"
                                label="Дата заключення договору"
                            ></v-text-field>
                        </v-col>
                    </v-row> -->



                    <!-- <template v-if="application_detail && application_detail.application_type !== 'ARCHIVE' && application_detail.application_type !== 'PUBLISH' && application_detail.application_type !== 'DEPUBLISH' && application_detail.application_type !== 'UNARCHIVE'">
                        <v-row>
                            <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                        </v-row>
                        <v-row>
                            <h3 class="mb-10 diia-h3-header">Деталі е-ресурсу</h3>
                            <v-col cols="12" class="pl-0">
                                <v-data-table
                                    locale="uk-UA"
                                    :headers="irs_application_fields_list_headers"
                                    :items="irs_application_fields_list"
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
                                        <a v-if="item.value && item.field == 'Публічне посилання на е-ресурс в НРЕІР'" v-bind:href="item.value" target="_blank" class="view-href-a">Переглянути</a>
                                        <span v-else-if="item.value">{{ item.value }}</span>
                                        <span v-else>-</span>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <v-row>
                             <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                        </v-row>
                        <v-row>
                            <h3 class="mb-10 diia-h3-header">Заявка у форматі PDF</h3>
                            <embed
                                :key="pdf_view_url_key"
                                :src="pdf_view_url"
                                width="100%"
                                height="900px"
                                type="application/pdf"
                            />
                        </v-row>
                        <template v-if="application_detail.allow_sign_download">
                            <v-row>
                                <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                            </v-row>
                            <v-row>
                                <h3 class="mb-10 diia-h3-header">Підписання заявки</h3>
                            </v-row>
                            <v-row style="white-space: pre-line;">
                                <v-col class="pa-0">
                                    <p>Завантажте згенеровану заявку в PDF форматі, та надайте уповноваженій особі/керівникові на підпис.</p>
                                    <p>Для підпису радимо скористатись: <a href="https://id.gov.ua/sign" target="_blank"> id.gov.ua</a></p>
                                    <p><b>Вимоги по підпису:</b></p>
                                    <li>Обов'язковий підпис з накладеною міткою часу</li>
                                    <li>Документ має бути підписаний керівником організації з кодом ЄДРПОУ організації.</li><br>
                                    <p><b>Вимоги до форматів:</b></p>
                                    <li>Дані та підпис зберігаються в CMS файлі (*.p7s) у форматі CadES-X Long</li>
                                    <li>ASIC-E. Дані та підпис зберігаються в архіві (розширений формат)</li>
                                    <li>ASIC-S. Дані та підпис зберігаються в архіві (простий формат)</li>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-file-input
                                    label="Файл підпису заявки"
                                    :rules="[v => !!v || 'Обовязково до заповнення']"
                                    v-model="signature_file"
                                    color="black"
                                    required
                                    placeholder="Файл підпису заявки"
                                    prepend-icon="mdi-file-sign"
                                    class="mt-5 diia-v-input"
                                    accept=".p7s,.asice,.asics"
                                >
                                </v-file-input>
                            </v-row>
                            <v-row>
                                <v-btn
                                    class="diia-button-style-3 mt-5"
                                    elevation="0"
                                    @click="validateSignAndSubmitInteraction"
                                >
                                    Подати заявку
                                </v-btn>
                            </v-row>
                        </template>
                    </template> -->
                </v-container>
            </template>
            <!-- <v-container class="mt-10" v-if="selected_submenu_item == 'cancelapplication'">
                <v-row>
                    <h3 class="mb-10 diia-h3-header">Скасування заявки</h3>
                </v-row>
                <v-row>
                    <v-text-field dense required class="diia-v-input"
                        :rules="[v => !!v || 'Обовязково до заповнення']"
                        v-model="cancel_reason"
                        label="Причина/Підстава для скасування заявки"
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-btn
                        class="diia-button-style-3 mt-5"
                        elevation="0"
                        @click="cancelInteraction"
                    >
                    Скасувати заявку
                    </v-btn>
                </v-row>
            </v-container> -->
            
            </v-col>
            <v-col cols="12" md="3" order-sm="1" order-md="3" class="d-none d-sm-none d-md-block" style="background-color: rgb(243 243 243);">
              <!-- <v-expansion-panels multiple class="side-help-menu-expansion-panels mt-10">
                    <v-expansion-panel class="side-help-menu-expansion-panel" v-for="item in $config.INFORMATION_RESOURCE_DETAIL_HELP" v-bind:key="item.title">
                        <v-expansion-panel-header class="side-help-menu-expansion-panel-header">
                            <div v-html="item.title">{{ item.title }}</div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="side-help-menu-expansion-panel-content">
                            <div v-html="item.content">{{ item.content }}</div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels> -->
            </v-col>
          </v-row>
        </v-form>
          </v-container>
    </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "InteractionDetail",
  components: {},
  data: () => ({
    overlay: false,
    overlay_text: 'Зачекайте будь ласка',
    allow_sign_download: false,
    selected_submenu_item: 'viewapplication',

    form_valid: true,

    toggle_position: 0,

    cancel_prev_applications: false,
    cancel_reason: '',
    application_detail: {},
    pdf_view_url: '',
    pdf_view_url_key: 1,
    signature_file: {},

    irs_application_detail_list_headers: [
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
    irs_application_detail_list: [],

    irs_application_fields_list_headers: [
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
    irs_application_fields_list: [],
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestInteractionDetail();
  },

  watch: {
      $route(to, from) {
          if (to.name == 'information-detail') {
            this.clearForm();
            this.toggle_position = 0;
            this.$clib.gotoTop();
            this.selected_submenu_item = 'viewapplication';
            this.requestInteractionDetail();
          }
      }
  },

  methods: {
    onErrorMessageShow(message) {
        this.$emit('on-error-message-show', message);
    },

    onSuccessSubmit(message) {
        this.$emit('on-info-message-show', message);
        this.$router.push({name: 'information-resource-applications-list', params: {'update_apps': true}});
    },

    validateSignAndSubmitInteraction() {
        this.$refs.form.validate();

        if (!this.$clib.isEmptyObject(this.signature_file)) {
            if (this.signature_file.size > 1000000) {
                this.$emit('on-error-message-show', 'Розмір файлу підпису перевищує допустимий');
                return false;
            }

            let format_found = false;
            let formats = ".p7s,.asice,.asics".split(',')
            for (let format in formats) {
                if (this.signature_file.name.endsWith(formats[format]))
                    format_found = true;
            }
            if (!format_found) {
                this.$emit('on-error-message-show', 'Файл підпису має недопустимий формат (Дозволені: [.p7s,.asice,.asics])');
                return false;
            }

            var bodyFormData = new FormData();
            bodyFormData.append("sign_file", this.signature_file);

            this.overlay = true;
            this.axios({
                    method: "put",
                    url:
                        this.$config.backend_url + 
                        "/api/v1/internal/information_resource_application/" +
                        this.$route.params.id +
                        "/submit",
                    headers: {
                        "Content-Type": "multipart/form-data;charset=UTF-8",
                    },
                    data: bodyFormData,
                })
                .then((response) => {
                    this.requestInteractionDetail();
                    this.onSuccessSubmit(this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.SIGNED);
                })
                .catch((error) => {
                    console.log(error.response.status);
                    console.log(error.response);
                    console.log(error);
                    this.handleError(error);
                })
                .finally(() => {
                    this.overlay = false;
                });
        } else {

        }
    },

    clearForm() {
        this.cancel_reason = "";
        this.signature_file = {};
        this.websrvdoc_list = [];
        this.websrv_methods_list = [];
        this.irs_application_detail_list = [];
        this.irs_application_fields_list = [];
    },

    displayApplicationDetail() {
        this.selected_submenu_item = 'viewapplication';
    },
    displayApplicationCancel() {
        this.selected_submenu_item = 'cancelapplication';
    },

    requestInteractionDetail() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.LOAD_APPLICATION_DETAIL;
        return this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/interaction/" + this.$route.params.id,
        })
        .then((response) => {
            this.application_detail = response.data;

            this.irs_application_detail_list = [];
            this.irs_application_fields_list = [];
            for (let item in response.data) {
                let route_type = ""
                let id = ""
                let field = ""
                let value = response.data[item]

                if ((item == "first_request_datetime_at_test" || item == "first_request_datetime_at_prod" || item == "interface_type") && !value)
                    continue;

                if (item == "information_resource_name" && !this.application_detail.information_resource)
                    continue;

                if (item == "producer_organization_name")
                    field = "Назва організації (вебсервіс)";

                if (item == "producer_organization_member_code")
                    field = "Код ЄДРПОУ (вебсервіс)";

                if (item == "producer_information_resource_name")
                    field = "Е-ресурс (вебсервіс)";
                if (item == "producer_interface_name")
                    field = "Інтерфейс е-ресурсу (вебсервіс)";

                if (item == "consumer_organization_name")
                    field = "Назва організації (вебклієнт)";
                if (item == "consumer_organization_member_code")
                    field = "Код ЄДРПОУ (вебклієнт)";
                if (item == "consumer_information_resource_name")
                    field = "Е-ресурс (вебклієнт)";

                if (item == "interface_type")
                    field = "Тип інтерфейсу е-ресурсу (вебсервіс)";
                if (item == "first_request_datetime_at_prod") {
                    field = "Дата початку взаємодії (Промислове середовище)";
                    value = this.$clib.formatDateTimeWithMonthText(value);
                }
                if (item == "first_request_datetime_at_test") {
                    field = "Дата початку взаємодії (Тестове середовище)";
                    value = this.$clib.formatDateTimeWithMonthText(value);
                }

                if (item == "is_deleted")
                    field = "Статус";
                

                if (item != "consumer_information_resource" && item != "consumer_organization" && item != "producer_interface" && item != "id" && item != "producer_information_resource"  && item != "producer_organization") {
                    this.irs_application_detail_list.push({
                        "field": field,
                        "value": value,
                        "route_type": route_type,
                        "id": id
                    })
                }
            }   
            
            // this.irs_application_detail_list.push({
            //     "field": 'Підстава для організації електронної взаємодії',
            //     "value": 'Статус',
            //     "route_type": "",
            //     "id": ""
            // })
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    cancelInteraction() {
        this.$refs.form.validate();

        if (!this.cancel_reason) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля');
            return false;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.CANCEL_APPLICATION;
        this.axios({
            method: "put",
            url: this.$config.backend_url + "/api/v1/internal/information_resource_application/" + this.$route.params.id + "/status",
            data: {
                'status': "CANCEL",
                'cancel_reason': this.cancel_reason,
            }
        })
        .then((response) => {
            this.selected_submenu_item = 'viewapplication';
            this.requestInteractionDetail();
            this.onSuccessSubmit(this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.CANCELED);
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