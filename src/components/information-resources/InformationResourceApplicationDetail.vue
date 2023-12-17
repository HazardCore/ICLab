<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;">
        <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
        <v-form ref="form" v-model="form_valid">
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
                                <template v-slot:item.value="{ item }">
                                    <span v-if="item.field == 'Статус' && item.value == 'Потребує підписання'" class="diia-list-badge-primary">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Подана на виконання'" class="diia-list-badge-warning">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Відправлена зовнішніми засобами'" class="diia-list-badge-warning">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Виконана'" class="diia-list-badge-success">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Відхилена'" class="diia-list-badge-error">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Скасована'" class="diia-list-badge-secondary">{{ item.value }}</span>
                                    <span v-else-if="item.field == 'Статус' && item.value == 'Скасована до підписання/відправки'" class="diia-list-badge-secondary">{{ item.value }}</span>
                                    <a v-else-if="item.field == 'Файл підпису (*.p7s)'" v-bind:href="$config.backend_url + item.value" target="_blank" class="view-href-a">Завантажити</a>
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
                            <h3 class="mb-10 diia-h3-header">Поля заявки</h3>
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
                                        <a v-else-if="item.value && item.field == 'Документ на підставі якого діє керівник/уповноважена особа'" v-bind:href="$config.backend_url + item.value" target="_blank" class="view-href-a">Завантажити</a>
                                        <a v-else-if="item.value && item.field == 'Документ, підстава щодо припинення повноваження оператора(-ів)'" v-bind:href="$config.backend_url + item.value" target="_blank" class="view-href-a">Завантажити</a>
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
                                <!-- <v-col class="pa-0">
                                    <p>Завантажте згенеровану заявку в PDF форматі, та надайте уповноваженій особі/керівникові на підпис.</p>
                                    <p>Для підпису радимо скористатись: <a href="https://id.gov.ua/sign" target="_blank"> id.gov.ua</a></p>
                                    <p><b>Вимоги по підпису:</b></p>
                                    <li>Обов'язковий підпис з накладеною міткою часу</li>
                                    <li>Документ має бути підписаний керівником організації з кодом ЄДРПОУ організації.</li><br>
                                    <p><b>Вимоги до форматів:</b></p>
                                    <li>Дані та підпис зберігаються в CMS файлі (*.p7s) у форматі CadES-X Long</li>
                                    <li>ASIC-E. Дані та підпис зберігаються в архіві (розширений формат)</li>
                                    <li>ASIC-S. Дані та підпис зберігаються в архіві (простий формат)</li>
                                </v-col> -->
                                <v-col class="pa-0">
                                    <!-- <p><b>Згенерована заявка може бути подана до Держателя одним із таких способів:</b></p>
                                    <li>В електронній формі через Форму подання Повідомлень, попередньо підписавши за
                                        допомогою кваліфікованого електронного підпису (керівника/уповноваженої особи органу
                                        державної влади/органу місцевого самоврядування/суб’єкта господарювання на вчинення
                                        правочинів від імені Учасника)</li>
                                    <li>Із урахуванням вимог законодавства з питань документування управлінської діяльності,
                                        попередньо завантаживши та підписавши Повідомлення, надіслати яке можна, зокрема,
                                        засобами СЕВ ОВВ або поштовим зв’язком.</li> -->
                                    <p><b>Заявка про підключення е-ресурсу до системи Трембіта може бути надіслана Держателю системи Трембіта (Мінцифри) одним із таких способів:</b></p>

                                    <li> 1. В електронній формі через Форму подачі заявки, попередньо підписавши за допомогою кваліфікованого 
                                    електронного підпису (керівника/уповноваженої особи суб’єкта владних повноважень/суб’єкта господарювання на 
                                    вчинення відповідних правочинів).</li>
                                    <br>
                                    <li>2. Із урахуванням вимог законодавства з питань документування управлінської діяльності, попередньо 
                                    завантаживши та підписавши Заявку, надіслати яку можна, зокрема, засобами СЕВ ОВВ або поштовим зв’язком.</li>
                                    <br>
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
                                <DiiaMessageBox :text="$config.TRANSLATION.INFORMATION_RESOURCE.BANNERS.APPLICATION_APPLY"/>
                            </v-row>
                        </template>
                        <v-row>
                            <v-btn
                                class="diia-button-style-3 mt-5 mr-5"
                                elevation="0"
                                @click="validateSignAndSubmitInformationResourceApplication"
                                v-if="application_detail.allow_sign_download"
                            >
                                Подати заявку онлайн
                            </v-btn>
                            <v-btn
                                class="diia-button-style-3 mt-5"
                                elevation="0"
                                @click="sentEnternallyInformationResourceApplication"
                                v-if="application_detail.allow_sign_download"
                            >
                                Відправити зовнішніми засобами
                            </v-btn>
                            <v-btn
                                class="diia-button-style-3 mt-5"
                                elevation="0"
                                @click="cancelEnternallyInformationResourceApplication"
                                v-if="application_detail.status_verbose == 'Відправлена зовнішніми засобами'"
                            >
                                Скасувати відправку зовнішніми засобами
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
                        @click="cancelInformationResourceApplication"
                    >
                    Скасувати заявку
                    </v-btn>
                </v-row>
            </v-container>
            
            </v-col>
            <v-col cols="12" md="3" order-sm="1" order-md="3" class="d-none d-sm-none d-md-block" style="background-color: rgb(243 243 243);">
              <v-expansion-panels multiple class="side-help-menu-expansion-panels mt-10">
                    <v-expansion-panel class="side-help-menu-expansion-panel" v-for="item in $config.INFORMATION_RESOURCE_DETAIL_HELP['application']" v-bind:key="item.title">
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
        </v-form>
          </v-container>
    </v-card>
</template>

<script>
import clib from "../../js/common_lib"

export default {
  name: "InformationResourceApplicationDetail",
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
    signature_file: null,

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
    /* eslint-disable */
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestInformationResourceApplicationDetail();
  },

  watch: {
      $route(to, from) {
          if (to.name == 'information-resource-application-detail') {
            this.clearForm();
            this.toggle_position = 0;
            this.$clib.gotoTop();
            this.selected_submenu_item = 'viewapplication';
            this.requestInformationResourceApplicationDetail();
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

    validateSignAndSubmitInformationResourceApplication() {
        this.$refs.form.validate();

        if (!this.form_valid) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля');
            return false;
        }

        if (!clib.isEmptyObject(this.signature_file) && this.signature_file) {
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
                    this.requestInformationResourceApplicationDetail();

                    if (this.application_detail.application_type == 'ADD_OPERATOR')
                        this.onSuccessSubmit(this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.SIGNED_ADD_OPERATOR);
                    else if (this.application_detail.application_type == 'DELETE_OPERATOR')
                        this.onSuccessSubmit(this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.SIGNED_DELETE_OPERATOR);
                    else
                        this.onSuccessSubmit(this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.SIGNED);
                })
                .catch((error) => {
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
        this.signature_file = null;
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

    requestInformationResourceApplicationDetail() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.LOAD_APPLICATION_DETAIL;
        return this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/information_resource_application/" + this.$route.params.id,
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

                if (([
                        "owner_name",
                        "name",
                        "operators",
                        "description",
                        "executed_at",
                        "administrator_organization_name",
                        "administrator_organization_code",
                        "operator_legal_basis",
                        "nreir_identifier",
                        "legal_basis",
                        "head_person_document",
                        "head_person_document_file",
                        "created_at",
                        "canceled_at",
                        "approved_at",
                        "canceled_by",
                        "approver",
                        "webservice",
                        "operator_legal_basis_file",
                        "admin_comment",
                        "submitter_crud_reason",
                        "cancel_reason"
                    ].includes(item)) && !value)
                    continue;

                if (item == "information_resource_name" && !this.application_detail.information_resource)
                    continue;

                if (item == "id")
                    field = "Номер заявки";
                if (item == "status_verbose") {
                    field = "Статус";
                }
                if (item == "application_type_verbose")
                    field = "Тип";
                if (item == "information_resource_name")
                    field = "Е-ресурс";
                if (item == "submitter")
                    field = "Автор заявки";
                if (item == "approver")
                    field = "Погоджувач заявки";
                if (item == "canceled_by")
                    field = "Особа, що скасувала заявку";
                if (item == "cancel_reason")
                    field = "Причина скасування заявки";
                if (item == "admin_comment")
                    field = "Коментар держателя";
                if (item == "submitter_crud_reason")
                    field = "Причина внесення змін до е-ресурсу";
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

                if (item == "owner_name")
                    field = "Власник е-ресурсу";
                if (item == "name")
                    field = "Назва е-ресурсу";
                if (item == "description")
                    field = "Призначення е-ресурсу";
                if (item == "administrator_organization_name")
                    field = "Найменування технічного адміністратора";
                if (item == "administrator_organization_code")
                    field = "Код за ЄДРПОУ технічного адміністратора";
                if (item == "legal_basis")
                    field = "Нормативно-правова підстава створення е-ресурсу";
                if (item == "head_person_full_name")
                    field = "Власне ім'я ПРІЗВИЩЕ керівника/уповноваженої особи";
                if (item == "head_person_position")
                    field = "Посада керівника/уповноваженої особи";
                if (item == "head_person_document")
                    field = "Назва документу на підставі якого діє керівник/уповноважена особа"
                if (item == "head_person_document_file")
                    field = "Документ на підставі якого діє керівник/уповноважена особа"
                if (item == "nreir_identifier")
                    field = "Реєстраційний номер в НРЕІР";
                if (item == "operators")
                    field = "Оператори е-ресурсу";
                if (item == "operator_legal_basis")
                    field = "Підстава щодо визначення/припинення повноваження оператора(-ів)";
                if (item == "operator_legal_basis_file")
                    field = "Документ, підстава щодо припинення повноваження оператора(-ів)";

                if (item == "application_file")
                    this.pdf_view_url = this.$config.backend_url + value;
                if (item == "sign_file" && value) {
                    field = "Файл підпису (*.p7s)";
                    this.irs_application_detail_list.push({
                        "field": field,
                        "value": value,
                        "route_type": route_type,
                        "id": id
                    })
                }

                if (![
                        "owner_name",
                        "name",
                        "sign_file",
                        "allow_sign_download",
                        "description",
                        "application_file",
                        "nreir_identifier",
                        "operators",
                        "operator_legal_basis",
                        "information_resource",
                        "status",
                        "application_type",
                        "allow_cancel",
                        "allow_approve",
                        "administrator_organization_name",
                        "administrator_organization_code",
                        "legal_basis",
                        "operator_legal_basis_file",
                        "head_person_full_name",
                        "head_person_position",
                        "head_person_document",
                        "head_person_document_file",
                        "prev_application_is_active",
                        "information_resource",
                        "test_services",
                        "prod_services",
                        "documents"
                    ].includes(item)) {
                    this.irs_application_detail_list.push({
                        "field": field,
                        "value": value,
                        "route_type": route_type,
                        "id": id
                    })
                }

                if ([
                        "owner_name",
                        "name", 
                        "description", 
                        "administrator_organization_name",
                        "administrator_organization_code",
                        "legal_basis",
                        "operator_legal_basis",
                        "head_person_full_name",
                        "operator_legal_basis_file",
                        "head_person_position",
                        "head_person_document_file",
                        "head_person_document",
                        "nreir_identifier",
                        "operators"
                    ].includes(item)) {
                    this.irs_application_fields_list.push({
                        "field": field,
                        "value": value,
                        "route_type": route_type,
                        "id": id
                    })
                }
            }            
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    cancelInformationResourceApplication() {
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
            this.requestInformationResourceApplicationDetail();
            this.onSuccessSubmit(this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.CANCELED);
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    sentEnternallyInformationResourceApplication() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.SEND_APPLICATION;
        this.axios({
            method: "put",
            url: this.$config.backend_url + "/api/v1/internal/information_resource_application/" + this.$route.params.id + "/status",
            data: {
                'status': "SENT_EXTERNALLY",
            }
        })
        .then((response) => {
            this.selected_submenu_item = 'viewapplication';
            this.requestInformationResourceApplicationDetail();
            this.onSuccessSubmit(this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.SENT_EXTERNALLY);
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    cancelEnternallyInformationResourceApplication() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.SEND_APPLICATION;
        this.axios({
            method: "put",
            url: this.$config.backend_url + "/api/v1/internal/information_resource_application/" + this.$route.params.id + "/status",
            data: {
                'status': "CANCEL_EXTERNALLY",
            }
        })
        .then((response) => {
            this.selected_submenu_item = 'viewapplication';
            this.requestInformationResourceApplicationDetail();
            this.onSuccessSubmit(this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.UNSENT_EXTERNALLY);
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