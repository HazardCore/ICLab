<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;">
            <v-row>
                <v-col cols="12" md="9" order="3" order-sm="3" order-md="1" class="pb-10 container-side-padding">
                <template v-if="application_detail && (application_detail.allow_cancel || application_detail.allow_execute)">
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
                            v-if="application_detail.allow_cancel"
                            @click="displayApplicationCancel"
                        >
                            <span>Скасувати запит</span>
                        </v-btn>
                        <v-btn
                            class="diia-secondary-tab mt-10 mr-5"
                            elevation="0"
                            v-if="application_detail.allow_execute"
                            @click="displayApplicationExecute"
                        >
                            <span>Виконати запит</span>
                        </v-btn>
                        <v-btn
                            class="diia-secondary-tab mt-10 mr-5"
                            elevation="0"
                            v-if="application_detail.allow_execute"
                            @click="displayApplicationReject"
                        >
                            <span>Відхилити запит</span>
                        </v-btn>
                    </v-btn-toggle>
                </template>
                <template v-if="selected_submenu_item === 'viewapplication'">
                    <v-container class="mt-10">
                        <v-row>
                            <h3 class="mb-10 diia-h3-header">Деталі запиту</h3>
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
                                    <span v-if="item.field == 'Статус' && item.value == 'Потребує погодження'" class="diia-list-badge-primary">{{ item.value }}</span>
                                    <span v-if="item.field == 'Статус' && item.value == 'Подано на виконання'" class="diia-list-badge-warning">{{ item.value }}</span>
                                    <span v-if="item.field == 'Статус' && item.value == 'Виконано'" class="diia-list-badge-success">{{ item.value }}</span>
                                    <span v-if="item.field == 'Статус' && item.value == 'Відхилено'" class="diia-list-badge-error">{{ item.value }}</span>
                                    <span v-if="item.field == 'Статус' && item.value == 'Скасовано'" class="diia-list-badge-secondary">{{ item.value }}</span>
                                    <span v-if="item.field != 'Статус'">{{ item.value }}</span>
                                </template>

                            </v-data-table>
                        </v-row>
                        <v-row>
                            <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                        </v-row>
                        <v-row>
                            <h3 class="mb-10 mt-5 diia-h3-header" ref="detail_stats">Поля запиту</h3>

                            <v-data-table
                                dense
                                locale="uk-UA"
                                :headers="fields_headers"
                                :items="fields_data"
                                disable-pagination
                                disable-sort
                                disable-filtering
                                hide-default-footer
                                hide-default-header
                                :loading="fields_loading"
                                mobile-breakpoint="1"
                                class="elevation-0 pa-0 data-table-detail-design fifty-table"
                            >
                                <template v-slot:item.value="{ item }">
                                    <a style="text-decoration: underline;" v-if="item.field_type == 'FILE'" @click="requestFile(item.value.uuid, item.value.name)" color="black">Завантажити</a>
                                    <!-- <a v-if="item.field_type == 'FILE'" :href="$config.backend_url + item.value" style="view-href-a">Завантажити</a> -->
                                    <span v-if="item.field_type != 'FILE'">{{ item.value }}</span>
                                </template>
                            </v-data-table>
                        </v-row>

                        <template v-if="application_detail.status == 'Виконано'">
                            <v-row>
                                <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                            </v-row>

                            <v-row>
                                <h3 class="mb-10 mt-5 diia-h3-header" ref="detail_stats">Відповідь до запиту</h3>

                                <v-data-table
                                    dense
                                    locale="uk-UA"
                                    :headers="response_fields_headers"
                                    :items="response_fields_data"
                                    disable-pagination
                                    disable-sort
                                    disable-filtering
                                    hide-default-footer
                                    hide-default-header
                                    :loading="response_fields_loading"
                                    mobile-breakpoint="1"
                                    class="elevation-0 pa-0 data-table-detail-design fifty-table"
                                >
                                    <template v-slot:item.value="{ item }">
                                        <a style="text-decoration: underline;" v-if="item.field_type == 'FILE'" @click="requestFile(item.value.uuid, item.value.name)" color="black">Завантажити</a>
                                        <!-- <a v-if="item.field_type == 'FILE'" :href="$config.backend_url + item.value" style="view-href-a">Завантажити</a> -->
                                        <span v-if="item.field_type != 'FILE'">{{ item.value }}</span>
                                    </template>
                                </v-data-table>
                            </v-row>
                        </template>

                        <template v-if="application_detail && application_detail.allow_approve">
                            <v-row>
                                <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                            </v-row>
                            <v-row>
                                <h3 class="mb-10 diia-h3-header">Погодження запиту</h3>
                            </v-row>
                            <v-row>
                                <DiiaMessageBox :text="$config.TRANSLATION.EXTERNAL_APPLICATIONS.BANNERS.ON_APPROVAL"/>
                            </v-row>
                            <v-row>
                                <v-btn
                                    class="diia-button-style-3 mt-10"
                                    elevation="0"
                                    @click="approveApplication"
                                >
                                    Погодити запит
                                </v-btn>
                            </v-row>
                        </template>
                    </v-container>
                </template>
                <v-container class="mt-10" v-if="selected_submenu_item == 'cancelapplication'">
                    <v-row>
                        <h3 class="mb-10 diia-h3-header">Скасування запиту</h3>
                    </v-row>
                    <v-row>
                        <v-text-field dense required class="mt-5 diia-v-input"
                            :rules="[v => !!v || 'Обовязково до заповнення']"
                            v-model="cancel_reason"
                            label="Причина/Підстава для скасування запиту"
                        ></v-text-field>
                    </v-row>
                    <v-row>
                        <v-btn
                            class="diia-button-style-3 mt-5"
                            elevation="0"
                            @click="cancelApplication"
                        >
                        Скасувати заявку
                        </v-btn>
                    </v-row>
                </v-container>
                <template v-if="selected_submenu_item == 'executeapplication'">
                    <h3 class="mb-10 mt-10 diia-h3-header">Виконання запиту</h3>
                    <ExternalApplicationForm @on-template-request="onTemplateRequest" @on-error-message-show="onErrorMessageShow" @on-info-message-show="onSuccessSubmit" selected_submenu_item="responseapplication" :template_id="application_detail.template_id"/>
                </template>
                <v-container class="mt-10" v-if="selected_submenu_item == 'rejectapplication'">
                    <v-form ref="form" v-model="form_valid_reject">
                        <v-row>
                            <h3 class="mb-10 diia-h3-header">Відхилення запиту</h3>
                        </v-row>
                        <v-row>
                            <v-text-field dense required class="mt-5 diia-v-input"
                                :rules="[v => !!v || 'Обовязково до заповнення']"
                                v-model="recipient_comment"
                                label="Повідомлення для автора запиту, щодо причини відхилення"
                            ></v-text-field>
                        </v-row>
                        <v-row>
                            <v-btn
                                class="diia-button-style-3 mt-5"
                                elevation="0"
                                @click="rejectApplication"
                            >
                            Відхилити запит
                            </v-btn>
                        </v-row>
                    </v-form>
                </v-container>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
/* eslint-disable */
import ExternalApplicationForm from "./ExternalApplicationForm";
export default {
    name: "ExternalApplicationDetail",
    components: {
        ExternalApplicationForm,
    },
    data: () => ({
        template_fields: [],
        response_template_fields: [],
        form_valid: true,
        user_form_data: {},
        template_detail: {},
        items: [
            'Тестове середовище',
            'Промислове середовище',
        ],
        choices: {},
        sent_files: {},

        selected_submenu_item: "viewapplication",

        result_data: {},

        cancel_reason: '',
        recipient_comment: '',

        form_valid_reject: true,

        application_detail: {},

        toggle_position: 0,

        detail_headers: [
            {
                align: 'start',
                value: 'field',
                class: 'data-table-detail-header fifty-width',
            },
            {
                align: 'start',
                value: 'value', 
                class: 'data-table-detail-header fifty-width',
            },
        ],
        detail_data: [],
        detail_loading: false,
        fields_headers: [
            {
                align: 'start',
                value: 'field',
                class: 'data-table-detail-header fifty-width',
            },
            {
                align: 'start',
                value: 'value', 
                class: 'data-table-detail-header fifty-width',
            },
        ],
        fields_data: [],
        fields_loading: false,

        response_fields_headers: [
            {
                align: 'start',
                value: 'field',
                class: 'data-table-detail-header fifty-width',
            },
            {
                align: 'start',
                value: 'value', 
                class: 'data-table-detail-header fifty-width',
            },
        ],
        response_fields_data: [],
        response_fields_loading: false,
    }),
    created: function () {
        document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';

        this.loadContent();
    },
    watch: {
        $route(to, from) {
            if (to.name == 'external-applications-detail') {
                this.application_detail = {};
                this.toggle_position = 0;
                this.$clib.gotoTop();
                this.selected_submenu_item = 'viewapplication';
                this.clearForm();
                this.loadContent();
            }
        }
    },
    methods: {
        displayApplicationDetail() {
            this.selected_submenu_item = 'viewapplication';
        },

        displayApplicationCancel() {
            this.selected_submenu_item = 'cancelapplication';
        },

        displayApplicationExecute() {
            this.selected_submenu_item = 'executeapplication';
        },

        displayApplicationReject() {
            this.selected_submenu_item = 'rejectapplication';
        },

        clearForm() {
            this.template_fields = [];
            this.response_template_fields = [];
            this.cancel_reason = '';
            this.recipient_comment = '';
        },

        onErrorMessageShow(message) {
            this.$emit('on-error-message-show', message);
        },

        onSuccessSubmit(message) {
            this.$emit('on-info-message-show', message);
            this.$router.push({name: 'external-applications-list', params: {'update_apps': true}});
        },


        async loadContent() {
            await this.requestApplicationDetail();
            await this.requestFormFields(this.application_detail.template_id);

            this.fields_data = [];
            for (let field in this.template_fields) {
                let fd = this.template_fields[field];

                if (this.application_detail.request_fields[fd.name]) {
                    this.fields_data.push({
                        "field": fd.label,
                        "field_type": fd.field_type,
                        "value": this.application_detail.request_fields[fd.name]
                    });
                }
            }

            await this.requestFormResponseFields(this.application_detail.template_id);
            this.response_fields_data = [];
            for (let field in this.response_template_fields) {
                let fd = this.response_template_fields[field];

                if (this.application_detail.response_fields[fd.name]) {
                    this.response_fields_data.push({
                        "field": fd.label,
                        "field_type": fd.field_type,
                        "value": this.application_detail.response_fields[fd.name]
                    });
                }
            }
        },

        async requestApplicationDetail() {
            this.detail_data = [];

            this.overlay = true;
            this.overlay_text = this.$config.TRANSLATION.APPLICATIONS.LOADING.LOAD_APPLICATION_DETAIL;
            return this.axios({
                method: "get",
                url: this.$config.backend_url + "/api/v1/internal/external_application/" + this.$route.params.id,
            })
            .then((response) => {
                this.application_detail = response.data;

                this.detail_data = [];
                for (let item in response.data) {

                    let route_type = ""
                    let id = ""
                    let field = ""
                    let value = response.data[item]

                    if ((item == "recipient_comment" || item == "instance_verbose" || item == "submitter_phone" || item == "submitter_email") && !value)
                        continue;

                    if ((item == "executed_at" || item == "created_at" || item == "canceled_at" || item == "approved_at" || item == "canceled_by" || item == "approver" || item == "admin_comment" || item == "cancel_reason") && !value)
                        continue;



                    if (item == "id")
                        field = "Номер запиту";
                    if (item == "template_name")
                        field = "Тип запиту";
                    if (item == "status") {
                        field = "Статус";
                    }
                    if (item == "instance_verbose")
                        field = "Середовище СЕВДЕІР";
                    if (item == "sender")
                        field = "Організація-відправник";
                    if (item == "recipient")
                        field = "Організація-отримувач";
                    if (item == "submitter")
                        field = "Автор запиту";
                    if (item == "submitter_phone")
                        field = "Контактний телефон автора запиту";
                    if (item == "submitter_email")
                        field = "Контактна email адреса автора запиту";
                    if (item == "recipient_comment")
                        field = "Коментар особи, що відхилила заявку";
                    if (item == "approver")
                        field = "Погоджувач запиту";
                    if (item == "canceled_by")
                        field = "Особа, що скасувала заявку";
                    if (item == "cancel_reason")
                        field = "Причина скасування запиту";
                    if (item == "created_at") {
                        field = "Дата створення/подання запиту";
                        value = this.$clib.formatDateTimeWithMonthText(value);
                    }
                    if (item == "executed_at") {
                        field = "Дата виконання/відхилення запиту";
                        value = this.$clib.formatDateTimeWithMonthText(value);
                    }
                    if (item == "canceled_at") {
                        field = "Дата скасування запиту";
                        value = this.$clib.formatDateTimeWithMonthText(value);
                    }
                    if (item == "approved_at") {
                        field = "Дата погодження запиту";
                        value = this.$clib.formatDateTimeWithMonthText(value);
                    }

                    if (item != "template_id" && item != "response_fields" && item != "request_fields" && item != "instance" && item != "allow_approve" && item != "allow_execute" && item != "allow_cancel" && item != "response_fields")
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

        async requestFormFields(template_id) {
            this.fields_loading = true;
            return this.axios({
                method: "get",
                url: this.$config.backend_url + "/api/v1/internal/external_application_template/" + template_id + "/fields",
            })
            .then((response) => {
                this.template_fields = [];
                for (let item in response.data) {
                    this.template_fields.push(response.data[item]);
                }
                this.template_fields.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
            })
            .catch((error) => {
                this.handleError(error);
            })
            .finally(() => {
                this.fields_loading = false;
            });
        },

        async requestFormResponseFields(template_id) {
            this.response_fields_loading = true;
            return this.axios({
                method: "get",
                url: this.$config.backend_url + "/api/v1/internal/external_application_template/" + template_id + "/response_fields",
            })
            .then((response) => {
                this.response_template_fields = [];
                for (let item in response.data) {
                    this.response_template_fields.push(response.data[item]);
                }
                this.response_template_fields.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
            })
            .catch((error) => {
                this.handleError(error);
            })
            .finally(() => {
                this.response_fields_loading = false;
            });
        },


        approveApplication() {
            this.overlay = true;
            this.overlay_text = this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.LOADING.APPROVE_APPLICATION;
            this.axios({
                method: "post",
                url: this.$config.backend_url + "/api/v1/internal/external_application/" + this.$route.params.id + "/approve"
            })
            .then((response) => {
                this.onSuccessSubmit(this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.SUCCESS.APPROVED);
            })
            .catch((error) => {
                this.handleError(error);
            })
            .finally(() => {
                this.overlay = false;
            });
        },

        cancelApplication() {
            if (!this.cancel_reason) {
                this.onErrorMessageShow('Необхідно заповнити обов\'язкові поля');
                return false;
            }

            this.overlay = true;
            this.overlay_text = this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.LOADING.CANCEL_APPLICATION;
            this.axios({
                method: "post",
                url: this.$config.backend_url + "/api/v1/internal/external_application/" + this.$route.params.id + "/cancel",
                data: {
                    'cancel_reason': this.cancel_reason
                }
            })
            .then((response) => {
                this.onSuccessSubmit(this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.SUCCESS.CANCELED);
            })
            .catch((error) => {
                this.handleError(error);
            })
            .finally(() => {
                this.overlay = false;
            });
        },

        rejectApplication() {
            this.$refs.form.validate();

            if (!this.form_valid_reject) {
                this.onErrorMessageShow('Необхідно заповнити обов\'язкові поля');
                return false;
            }

            this.overlay = true;
            this.overlay_text = this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.LOADING.REJECT_APPLICATION;
            this.axios({
                method: "post",
                url: this.$config.backend_url + "/api/v1/internal/external_application/" + this.$route.params.id + "/reject",
                data: {
                    'recipient_comment': this.recipient_comment
                }
            })
            .then((response) => {
                this.onSuccessSubmit(this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.SUCCESS.REJECTED);
            })
            .catch((error) => {
                this.handleError(error);
            })
            .finally(() => {
                this.overlay = false;
            });
        },

        requestFile(uuid, name) {
            this.axios({
                method: "get",
                url: this.$config.backend_url + "/api/v1/internal/external_application_file/" + uuid,
                responseType: 'blob', // Important
            })
            .then((response) => {
                let blob = new Blob([response.data], { type: "application/octet-stream" });
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = name;
                link.click()
            })
            .catch((error) => {
                this.handleError(error);
            })
            .finally(() => {});
        },
    }
}
</script>
