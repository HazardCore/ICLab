<template>
    <v-container class="mt-10 mb-10">
        <v-form ref="form" v-model="form_valid">
        <template>
            <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
            <DiiaLoaderOverlay :show_overlay="overlay_attachments" :text="overlay_text_attachments"/>
            <v-row v-if="state == 'create_app_edit' || state == 'create_app_new'">
                <h3 class="mb-10 diia-h3-header">Визначення оператора(-ів) інформаційного е-ресурсу</h3>
            </v-row>
            <v-row v-if="state == 'create_app_edit' || state == 'create_app_new'">
                <v-col cols="12" class="pl-0">
                    <v-autocomplete dense
                        small-chips class="diia-v-input"
                        label="Найменування юридичної особи – оператора, якого суб’єкт електронної взаємодії уповноважив на виконання певних функцій суб’єкта електронної взаємодії в системі Трембіта"
                        hide-no-data hide-selected clearable
                        :menu-props="{ 'max-width': '600px' }"
                        v-model="operators"
                        :loading="operators_loading"
                        multiple
                        :items="operators_list"
                        item-text="name"
                        item-value="id"
                        required
                        persistent-hint
                        hint="Обрати зі списку можна лише ті організації, що вже уклали угоду/повідомлення приєднання до системи."
                        :rules="[v => v.length > 0 || 'Обовязково до заповнення']"
                        @change="preventOperatorsDelete"
                    >
                        <template v-slot:item="{ item }">
                            <div class="d-flex flex-column list-filter-autocomplete-item"> 
                                <span>{{ item.name }}</span>
                            </div>
                        </template>
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-text-field
                        dense required class="mt-5 diia-v-input"
                        :rules="[v => !!v || 'Обовязково до заповнення']"
                        v-model="operator_legal_basis"
                        label="Підстава щодо визначення оператора"
                        hint="Нормативно-правова підстава, договір про адміністрування, тощо"
                    ></v-text-field>
                </v-col>
                <v-col cols="8" class="pl-0">
                    <v-text-field dense required class="diia-v-input"
                        :rules="nameRules"
                        v-model="head_person_full_name"
                        label="Власне ім’я, ПРІЗВИЩЕ керівника/уповноваженої особи суб’єкта владних повноважень/суб’єкта господарювання на вчинення відповідних правочинів"
                        hint="Власне ім’я, ПРІЗВИЩЕ керівника/уповноваженої особи суб’єкта владних повноважень/суб’єкта господарювання на вчинення відповідних правочинів"
                    ></v-text-field>
                </v-col>
                <v-col cols="4" class="pl-0">
                    <v-text-field dense required class="diia-v-input"
                        :rules="textRules"
                        v-model="head_person_position"
                        label="Посада"
                    ></v-text-field>
                </v-col>
                <v-col cols="8" class="pl-0">
                    <v-text-field dense class="diia-v-input"
                        v-model="head_person_document"
                        label="Діє на підставі"
                        hint="Назва документу на підставі якого діє керівник/уповноважена особа"
                    ></v-text-field>
                </v-col>
                <v-col cols="4" class="pl-0">
                    <v-file-input
                        prepend-icon class="diia-v-input mt-0 mb-0 pa-0"
                        v-model="head_person_document_file"
                        label="Документ, що підтверджує повноваження"
                    ></v-file-input>
                </v-col>
            </v-row>
            <template>
                <v-row>
                    <v-btn
                        class="diia-button-style-3 mt-5"
                        elevation="0"
                        v-if="state == 'create_app_edit'"
                        @click="revertChangesOperatorInformationResourceApplication"
                    >
                        Скасувати зміни
                    </v-btn>

                    <v-btn
                        v-if="state == 'create_app_new'"
                        class="diia-button-style-3 mt-5"
                        elevation="0"
                        @click="createAddOperatorInformationResourceApplication"
                    >
                        Перейти до перегляду
                    </v-btn>
                    <v-btn
                        v-if="state == 'create_app_edit'"
                        class="diia-button-style-3 mt-5 ml-5"
                        elevation="0"
                        @click="updateAddOperatorInformationResourceApplication"
                    >
                        Підтвердити зміни
                    </v-btn>
                </v-row>
            </template>
        </template>
        <template v-if="state == 'create_app_review'">
            <!-- <v-row>
                <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
            </v-row> -->
            <v-row>
                <h3 class="mb-10 diia-h3-header">Перегляд заявки та підпис</h3>
            </v-row>
            <v-row>
            <embed
                :key="pdf_view_url_key"
                :src="pdf_view_url"
                width="100%"
                height="900px"
                type="application/pdf"
            />
            </v-row>
            <!-- class="justify-space-between d-flex" -->
            <v-row >
                <v-btn
                    class="diia-button-style-3 mt-10 mr-5"
                    elevation="0"
                    @click="editUpdateApplication"
                >
                    Редагувати
                </v-btn>
                <v-btn
                    class="diia-button-style-3 mt-10"
                    elevation="0"
                    @click="atSignApplication"
                >
                    Підтвердити та продовжити
                </v-btn>
            </v-row>
        </template>
        </v-form>
    </v-container>
</template>

<script>
/* eslint-disable */
export default {
  name: "InformationResourceOperatorAddForm",
  props: ['selected_submenu_item', 'operators_list', 'eresource_detail_data'],
  data: () => ({
    cancel_prev_applications: false,
    published: false,
    
    operator_readonly: false,

    prev_application_is_active: false,

    form_valid: true,
    overlay: false,
    overlay_text: "Зачекайте будь ласка",
    overlay_attachments: false,
    overlay_text_attachments: "Зачекайте будь ласка",
    operators_loading: true,

    operator_legal_basis: "",
    operator_legal_basis_delete: "",
    head_person_full_name: "",
    head_person_position: "",
    head_person_document: "",
    head_person_document_file: null,

    buffer_operator_legal_basis: "",
    buffer_operator_legal_basis_delete: "",
    buffer_head_person_full_name: "",
    buffer_head_person_position: "",
    buffer_head_person_document: "",
    buffer_head_person_document_file: null,

    operators: [],
    const_operators: [],
    buffer_operators: [],
    request_buffer_operators: [],

    pdf_view_url_key: 1,

    pdf_view_url: '',
    state: 'create_app_new',
    signature_file: '',

    first_draw: true,

    app_id: '',

    nameRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => v.split(" ").length >= 2 || "Не коректно заповнене Власне ім'я та ПРІЗВИЩЕ",
    ],
    edrpouRules: [
      (v) => ((v.length == 0 && this.administrator_organization_name.length == 0) || (v.length > 0 && this.administrator_organization_name.length > 0)) || "Назва та код ЄДРПОУ обов'язкові для заповнення",
      (v) => (v.length == 0 || v.length == 8) || "Код ЄДРПОУ складається з 8 цифр",
      (v) => (v.length == 0 || /^\d+$/.test(v)) || "Не коректно заповнений ЄДРПОУ",
    ],
    textRules: [
        (v) => !!v || "Поле обов'язкове",
        (v) => v.length > 1 || "Довжина поля занадто маленька",
    ],
  }),
  created: function () {
    /* eslint-disable */
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
  },

  watch: {
      $route(to, from) {
        if (to.name == 'information-resource-detail') {
            this.clearForm();
        }
      },

      operators_list(to, from) {
        this.operators_loading = false;
        this.$refs.form.resetValidation();
      },

      eresource_detail_data(new_value, old_value) {
        if (new_value) {
            this.operators = [...new_value.operators];
            this.buffer_operators = [...new_value.operators];
            this.request_buffer_operators = [...new_value.operators];
            this.const_operators = [...new_value.operators];
            this.prev_application_is_active = new_value.prev_application_is_active;
        }
      }
  },

  methods: {
    clearForm() {
        this.$refs.form.resetValidation();

        this.cancel_prev_applications = false;
        this.published = false;
        this.operator_readonly = false;
        this.prev_application_is_active = false;

        this.operator_legal_basis = "";
        this.head_person_full_name = "";
        this.head_person_position = "";
        this.head_person_document = "";
        this.head_person_document_file = null;
        
        this.operators = [];
        this.signature_file = '';
        this.state = 'create_app_new';
        this.pdf_view_url = '';
        this.const_operators = [];
    },

    preventOperatorsDelete() {
        if (!this.const_operators.every(el => this.operators.includes(el))) {
            this.operators = [...this.const_operators];
            this.$emit('on-error-message-show', 'Вилучення операторів має відбуватися тільки за допомогою відповідної заявки.');
        }
    },

    editUpdateApplication() {
        this.state = 'create_app_edit';

        this.buffer_operator_legal_basis = this.operator_legal_basis;
        this.buffer_head_person_full_name = this.head_person_full_name;
        this.buffer_head_person_position = this.head_person_position;
        this.buffer_head_person_document = this.head_person_document;
        this.buffer_head_person_document_file = this.head_person_document_file;

        this.buffer_operators = [...this.operators];
    },

    revertChangesOperatorInformationResourceApplication() {
        this.state = 'create_app_review';

        this.operator_legal_basis = this.buffer_operator_legal_basis;
        this.head_person_full_name = this.buffer_head_person_full_name;
        this.head_person_position = this.buffer_head_person_position;
        this.head_person_document = this.buffer_head_person_document;
        this.head_person_document_file = this.buffer_head_person_document_file;

        this.operators = [...this.buffer_operators];
    },

    async createAddOperatorInformationResourceApplication() {
        this.$refs.form.validate();

        if (!this.form_valid) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля');
            return false;
        }

        for (let i in this.operators) {
            if (this.$config.user_data.access.o == this.operators_list.find(x => x.id === this.operators[i]).member_code) {
                this.$emit('on-error-message-show', 'Неможливо вказати власну організацію оператором, оскільки вона буде визначена як власник е-ресурсу.');
                return false;
            }
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.GENERATE_DOCVIEW;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/generation_add_operator",
            timeout: 1000 * 300,
            data: {
                'application_type': "ADD_OPERATOR",
                'information_eresource': this.$route.params.id,
                'operator_legal_basis': this.operator_legal_basis,
                'head_person_full_name': this.head_person_full_name,
                'head_person_position': this.head_person_position,
                'head_person_document': this.head_person_document,
                'operators': this.operators,
                'submitter_crud_reason': '',
            }
        })
        .then((response) => {
            this.app_id = response.data.id;

            this.sendAttachmentFiles().then((result) => {
                if (result) {
                    this.pdf_view_url = this.$config.backend_url + response.data.application_file;
                    this.state = 'create_app_review';
                    this.pdf_view_url_key += 1;
                }
            });
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    async sendAttachmentFiles() {
        if (this.head_person_document_file) {
            if (this.head_person_document_file.size > this.$config.INFORMATION_RESOURCE_MAX_HEAD_PERSON_DOCUMENT_SIZE) {
                this.$emit('on-error-message-show', 'Розмір документу, що підтверджує повноваження керівника перевищує допустимий розмір.');
                return false;
            }

            // Check head person attachment allowed formats
            let format_found = false;
            let formats = this.$config.INFORMATION_RESOURCE_HEAD_PERSON_ALLOWED_FORMATS.split(', ');
            for (let format in formats) {
                if (this.head_person_document_file.name.endsWith(formats[format]))
                    format_found = true;
            }
            
            if (!format_found) {
                this.$emit('on-error-message-show', 'Документ, що підтверджує повноваження керівника має недопустимий формат (Дозволені: [' + this.$config.INFORMATION_RESOURCE_HEAD_PERSON_ALLOWED_FORMATS + '])');
                return false;
            }

            var bodyFormData = new FormData();
            bodyFormData.append('head_person_document_file', this.head_person_document_file);

            this.overlay_attachments = true;
            return this.axios({
                method: "put",
                url: this.$config.backend_url + "/api/v1/internal/information_resource/generation/" + this.app_id + "/attachments",
                headers: {
                    "Content-Type": "multipart/form-data;charset=UTF-8",
                },
                data: bodyFormData
            })
            .then((response) => {
                return true;
            })
            .catch((error) => {
                this.handleError(error);
            })
            .finally(() => {
                this.overlay_attachments = false;
            });
        }

        return true;
    },

    async updateAddOperatorInformationResourceApplication() {
        this.$refs.form.validate();

        if (!this.form_valid) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля');
            return false
        }

        for (let i in this.operators) {
            if (this.$config.user_data.access.o == this.operators_list.find(x => x.id === this.operators[i]).member_code) {
                this.$emit('on-error-message-show', 'Неможливо вказати власну організацію оператором, оскільки вона буде визначена як власник е-ресурсу.');
                return false;
            }
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.GENERATE_DOCVIEW;
        this.axios({
            method: "put",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/generation_add_operator/" + this.app_id,
            timeout: 1000 * 300,
            data: {
                'application_type': "ADD_OPERATOR",
                'information_eresource': this.$route.params.id,
                'operator_legal_basis': this.operator_legal_basis,
                'head_person_full_name': this.head_person_full_name,
                'head_person_position': this.head_person_position,
                'head_person_document': this.head_person_document,
                'operators': this.operators,
                'submitter_crud_reason': '',
            }
        })
        .then((response) => {
            this.sendAttachmentFiles().then((result) => {
                if (result) {
                    this.pdf_view_url = this.$config.backend_url + response.data.application_file;
                    this.state = 'create_app_review';
                    this.pdf_view_url_key += 1;
                }
            });
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    async atSignApplication() {
        this.$refs.form.validate();

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.MOVE_TO_AT_SIGN_STATE;
        this.axios({
            method: "put",
            url: this.$config.backend_url + "/api/v1/internal/information_resource_application/" + this.app_id + "/status",
            data: {
                'status': "AT_SIGN",
            }
        })
        .then((response) => {
            this.$router.push({name: 'information-resource-application-detail', params: {'id': this.app_id}});
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
