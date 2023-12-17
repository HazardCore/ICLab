<template>
    <v-container class="mt-10 mb-10">
        <v-form ref="form" v-model="form_valid">
        <template>
            <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
            <DiiaLoaderOverlay :show_overlay="overlay_attachments" :text="overlay_text_attachments"/>
            <v-row v-if="state == 'create_app_edit' || state == 'create_app_new'">
                <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'viewirs'">Деталі інформаційного е-ресурсу</h3>
                <h3 class="mb-10 diia-h3-header" v-else-if="selected_submenu_item == 'editirs'">Редагування інформаційного е-ресурсу</h3>
                <h3 class="mb-10 diia-h3-header" v-else>Приєднання інформаційного е-ресурсу</h3>
            </v-row>
            <v-row v-if="state == 'create_app_edit' || state == 'create_app_new'">
                <v-col cols="12" class="pl-0">
                    <v-text-field dense required class="diia-v-input"
                        :rules="textRules"
                        v-model="name"
                        label="Найменування електронного інформаційного ресурсу"
                        hint="Назва публічного електронного реєстру, інформаційної (автоматизованої) системи, інформаційно-комунікаційної системи"
                        :readonly="selected_submenu_item == 'viewirs'"
                    ></v-text-field>
                </v-col>
                <v-col cols="8" class="pl-0">
                    <v-text-field dense class="diia-v-input"
                        
                        v-model="administrator_organization_name"
                        label="Найменування юридичної особи – технічного адміністратора (за наявності)"
                        hint="Повне найменування суб’єкта владних повноважень/суб’єкта господарювання згідно з ЄДР"
                        :readonly="selected_submenu_item == 'viewirs'"
                    ></v-text-field>
                </v-col>
                <v-col cols="4" class="pl-0">
                    <v-text-field dense 
                        class="diia-v-input"
                        :rules="[
                            
                            (v) => (v.length == 0 || v.length == 8) || 'Код ЄДРПОУ складається з 8 цифр',
                            (v) => (v.length == 0 || /^\d+$/.test(v)) || 'Не коректно заповнений ЄДРПОУ',
                        ]"
                        v-model="administrator_organization_code"
                        label="Код ЄДРПОУ юридичної особи – технічного адміністратора (за наявності)"
                        hint="Код ЄДРПОУ суб’єкта владних повноважень/суб’єкта господарювання згідно з ЄДР"
                        :readonly="selected_submenu_item == 'viewirs'"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="pl-0" v-if="selected_submenu_item == 'createirs' || (selected_submenu_item == 'viewirs' && operators.length > 0)">
                    <v-autocomplete dense
                        small-chips class="diia-v-input"
                        label="Оператори інформаційного е-ресурсу (за наявності)"
                        hide-no-data hide-selected
                        :menu-props="{ 'max-width': '600px' }"
                        v-model="operators"
                        :loading="operators_loading"
                        multiple
                        :items="operators_list"
                        item-text="name"
                        item-value="id"
                        persistent-hint
                        hint="Обрати зі списку можна лише ті організації, що вже уклали угоду/повідомлення приєднання до системи."
                        :readonly="selected_submenu_item == 'viewirs'"
                        :clearable="selected_submenu_item != 'viewirs'"
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
                    <v-textarea dense class="diia-v-input"
                        :rules="textRules" required
                        v-model="description"
                        label="Призначення електронного інформаційного ресурсу"
                        auto-grow no-resize rows="1"
                        :readonly="selected_submenu_item == 'viewirs'"
                    ></v-textarea>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-text-field dense required class="diia-v-input"
                        :rules="textRules"
                        v-model="legal_basis"
                        label="Нормативно-правова підстава створення електронного інформаційного ресурсу"
                        hint="Нормативно-правова підстава створення електронного інформаційного ресурсу"
                        :readonly="selected_submenu_item == 'viewirs'"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-text-field dense class="diia-v-input"
                        v-model="nreir_identifier"
                        label="Реєстраційний номер електронного інформаційного ресурсу в Національному реєстрі електронних інформаційних ресурсів (за наявності)"
                        :readonly="selected_submenu_item == 'viewirs'"
                    ></v-text-field>
                </v-col>
                <v-col cols="8" class="pl-0" v-if="selected_submenu_item != 'viewirs'">
                    <v-text-field dense required class="diia-v-input"
                        :rules="nameRules"
                        v-model="head_person_full_name"
                        label="Власне ім’я, ПРІЗВИЩЕ керівника/уповноваженої особи суб’єкта владних повноважень/суб’єкта господарювання на вчинення відповідних правочинів"
                        hint="Власне ім’я, ПРІЗВИЩЕ керівника/уповноваженої особи суб’єкта владних повноважень/суб’єкта господарювання на вчинення відповідних правочинів"
                    ></v-text-field>
                </v-col>
                <v-col cols="4" class="pl-0" v-if="selected_submenu_item != 'viewirs'">
                    <v-text-field dense required class="diia-v-input"
                        :rules="textRules"
                        v-model="head_person_position"
                        label="Посада"
                    ></v-text-field>
                </v-col>
                <v-col cols="8" class="pl-0" v-if="selected_submenu_item != 'viewirs'">
                    <v-text-field dense class="diia-v-input"
                        v-model="head_person_document"
                        label="Діє на підставі"
                        hint="Назва документу на підставі якого діє керівник/уповноважена особа"
                    ></v-text-field>
                </v-col>
                <v-col cols="4" class="pl-0" v-if="selected_submenu_item != 'viewirs'">
                    <v-file-input
                        prepend-icon class="diia-v-input mt-0 mb-0 pa-0"
                        v-model="head_person_document_file"
                        label="Документ, що підтверджує повноваження"
                    ></v-file-input>
                </v-col>
            </v-row>
            <template v-if="selected_submenu_item == 'viewirs'">
                <v-row>
                    <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                </v-row>
                <v-row>
                    <h3 class="mb-10 diia-h3-header">Власні зареєстровані підсистеми е-ресурсу</h3>
                    <v-col cols="12" class="pl-0">
                        <v-data-table
                            locale="uk-UA"
                            :headers="irs_subsystems_headers"
                            :items="irs_subsystems"
                            disable-pagination
                            disable-sort
                            disable-filtering
                            :hide-default-header="irs_subsystems.length == 0"
                            hide-default-footer
                            mobile-breakpoint="1"
                            no-data-text="Власні підсистеми не зареєстровані"
                            loading-text="Виконується запит..."
                            class="elevation-0 pa-0 data-table-detail-design"
                        >
                            <template v-slot:item.catalog_display_requirements_met="{ item }">
                                <v-chip v-if="item.catalog_display_requirements_met">Опублікована</v-chip>
                                <v-chip v-else>Не опублікована</v-chip>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </template>
            <template v-if="selected_submenu_item != 'viewirs'">
                <v-row>
                    <v-btn
                        class="diia-button-style-3 mt-5"
                        elevation="0"
                        v-if="state == 'create_app_edit'"
                        @click="revertChangesNewInformationResourceApplication"
                    >
                        Скасувати зміни
                    </v-btn>

                    <v-btn
                        v-if="selected_submenu_item == 'createirs' && state == 'create_app_new'"
                        class="diia-button-style-3 mt-5"
                        elevation="0"
                        @click="createNewInformationResourceApplication"
                    >
                        Перейти до перегляду
                    </v-btn>
                    <v-btn
                        v-if="selected_submenu_item == 'createirs' && state == 'create_app_edit'"
                        class="diia-button-style-3 mt-5 ml-5"
                        elevation="0"
                        @click="updateNewInformationResourceApplication"
                    >
                        Підтвердити зміни
                    </v-btn>

                    <v-btn
                        v-if="selected_submenu_item == 'editirs' && state == 'create_app_new'"
                        class="diia-button-style-3 mt-5"
                        elevation="0"
                        @click="updateInformationResourceApplication"
                    >
                        Підтвердити зміни
                    </v-btn>
                    <v-btn
                        v-if="selected_submenu_item == 'editirs' && state == 'create_app_edit'"
                        class="diia-button-style-3 mt-5 ml-5"
                        elevation="0"
                        @click="updateEditInformationResourceApplication"
                    >
                        Підтвердити зміни
                    </v-btn>
                </v-row>
            </template>
        </template>
        <template v-if="state == 'create_app_review' && selected_submenu_item != 'viewirs'">
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
            <v-row >
                <v-btn
                    class="diia-button-style-3 mt-10 mr-5"
                    elevation="0"
                    @click="editUpdateNewInformationResourceApplication"
                >
                    Редагувати
                </v-btn>
                <v-btn
                    class="diia-button-style-3 mt-10"
                    elevation="0"
                    @click="atSignNewInformationResourceApplication"
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
  name: "InformationResourceForm",
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

    name: "",
    description: "",
    nreir_identifier: "",
    administrator_organization_name: "",
    administrator_organization_code: "",
    legal_basis: "",
    head_person_full_name: "",
    head_person_position: "",
    head_person_document: "",
    head_person_document_file: null,

    buffer_name: "",
    buffer_description: "",
    buffer_nreir_identifier: "",
    buffer_administrator_organization_name: "",
    buffer_administrator_organization_code: "",
    buffer_legal_basis: "",
    buffer_head_person_full_name: "",
    buffer_head_person_position: "",
    buffer_head_person_document: "",
    buffer_head_person_document_file: null,

    request_buffer_name: "",
    request_buffer_description: "",
    request_buffer_nreir_identifier: "",
    request_buffer_administrator_organization_name: "",
    request_buffer_administrator_organization_code: "",
    request_buffer_legal_basis: "",
    request_buffer_head_person_full_name: "",
    request_buffer_head_person_position: "",
    request_buffer_head_person_document: "",
    request_buffer_head_person_document_file: null,

    irs_subsystems_headers: [{ 
        text: 'Код підсистеми',
        align: 'start',
        value: 'subsystem_code', 
        class: 'data-table-header',
    }, { 
        text: 'Середовище',
        align: 'start',
        value: 'instance_verbose', 
        class: 'data-table-header',
    }, { 
        text: 'Відображається в каталозі',
        align: 'start',
        value: 'catalog_display_requirements_met', 
        class: 'data-table-header',
    }, { 
        text: 'Статус активності',
        align: 'start',
        value: 'is_deleted_verbose', 
        class: 'data-table-header',
    }],
    irs_subsystems: [],

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
        (v) => v && v.length > 1 || "Довжина поля занадто маленька",
    ],
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';

    if (this.selected_submenu_item == 'createirs') {
        this.fetchOperatorsList();
    } else {
        this.fetchInformationResourceOrganizationSubsystems();
    }
  },

  watch: {
      $route(to, from) {
        if (to.name == 'information-resource-detail') {
            this.fetchInformationResourceOrganizationSubsystems();
        }
      },

      selected_submenu_item(new_value, old_value) {
        if (old_value == 'editirs' && new_value != old_value) {
            this.informationResourceDetailViewClearForm();
            this.name = this.request_buffer_name;
            this.description = this.request_buffer_description;
            this.nreir_identifier = this.request_buffer_nreir_identifier;
            this.administrator_organization_name = this.request_buffer_administrator_organization_name;
            this.administrator_organization_code = this.request_buffer_administrator_organization_code;
            this.legal_basis = this.request_buffer_legal_basis;

            this.operators = [...this.request_buffer_operators];
        }

        this.$refs.form.resetValidation();
      },
      operators_list(to, from) {
        this.operators_loading = false;
      },
      eresource_detail_data(new_value, old_value) {
        this.informationResourceDetailViewClearForm();

        if (new_value) {
            this.name = new_value.name;
            this.description = new_value.description;
            this.nreir_identifier = new_value.nreir_identifier;
            this.administrator_organization_name = new_value.administrator_organization_name;
            this.administrator_organization_code = new_value.administrator_organization_code;
            this.legal_basis = new_value.legal_basis;
            this.operators = [...new_value.operators];

            this.buffer_name = new_value.name;
            this.buffer_description = new_value.description;
            this.buffer_nreir_identifier = new_value.nreir_identifier;
            this.buffer_administrator_organization_name = new_value.administrator_organization_name;
            this.buffer_administrator_organization_code = new_value.administrator_organization_code;
            this.buffer_legal_basis = new_value.legal_basis;
            this.buffer_operators = [...new_value.operators];

            this.request_buffer_name = new_value.name;
            this.request_buffer_description = new_value.description;
            this.request_buffer_nreir_identifier = new_value.nreir_identifier;
            this.request_buffer_administrator_organization_name = new_value.administrator_organization_name;
            this.request_buffer_administrator_organization_code = new_value.administrator_organization_code;
            this.request_buffer_legal_basis = new_value.legal_basis;
            this.request_buffer_operators = [...new_value.operators];

            this.const_operators = [...new_value.operators];
            this.prev_application_is_active = new_value.prev_application_is_active;

            this.published = new_value.published;
            this.is_deleted = new_value.is_deleted;
            this.operator_readonly = new_value.operator_readonly;
        }
      }
  },

  methods: {
    informationResourceDetailViewClearForm() {
        this.cancel_prev_applications = false;
        this.published = false;
        this.operator_readonly = false;
        this.prev_application_is_active = false;

        this.name = "";
        this.description = "";
        this.nreir_identifier = "";
        this.administrator_organization_name = "";
        this.administrator_organization_code = "";
        this.legal_basis = "";
        this.head_person_full_name = "";
        this.head_person_position = "";
        this.head_person_document = "";
        this.head_person_document_file = null;
        
        this.operators = [];
        this.signature_file = '';
        this.state = 'create_app_new';
        this.pdf_view_url = '';
        this.const_operators = [];

        this.$refs.form.resetValidation();
    },

    preventOperatorsDelete() {
        if (!this.const_operators.every(el => this.operators.includes(el))) {
            this.operators = [...this.const_operators];
            this.$emit('on-error-message-show', 'Вилучення операторів має відбуватися тільки за допомогою відповідної заявки.');
        }
    },

    editUpdateNewInformationResourceApplication() {
        this.state = 'create_app_edit';

        this.buffer_name = this.name;
        this.buffer_description = this.description;
        this.buffer_nreir_identifier = this.nreir_identifier;
        this.buffer_administrator_organization_name = this.administrator_organization_name;
        this.buffer_administrator_organization_code = this.administrator_organization_code;
        this.buffer_legal_basis = this.legal_basis;
        this.buffer_head_person_full_name = this.head_person_full_name;
        this.buffer_head_person_position = this.head_person_position;
        this.buffer_head_person_document = this.head_person_document;
        this.buffer_head_person_document_file = this.head_person_document_file;

        this.buffer_operators = [...this.operators];
    },

    revertChangesNewInformationResourceApplication() {
        this.state = 'create_app_review';

        this.name = this.buffer_name;
        this.description = this.buffer_description;
        this.nreir_identifier = this.buffer_nreir_identifier;
        this.administrator_organization_name = this.buffer_administrator_organization_name;
        this.administrator_organization_code = this.buffer_administrator_organization_code;
        this.legal_basis = this.buffer_legal_basis;
        this.head_person_full_name = this.buffer_head_person_full_name;
        this.head_person_position = this.buffer_head_person_position;
        this.head_person_document = this.buffer_head_person_document;
        this.head_person_document_file = this.buffer_head_person_document_file;

        this.operators = [...this.buffer_operators];
    },

    fetchInformationResourceOrganizationSubsystems() {
        this.irs_subsystems = [];
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/" + this.$route.params.id + "/subsystems",
        })
        .then((response) => {
            this.irs_subsystems = response.data;
        })
        .catch((error) => {
            this.$emit('on-error-message-show', 'Виникла помилка при завантаженні списку зареєстрованих підсистем е-ресурсу.');
        })
        .finally(() => {
        });
    },

    fetchOperatorsList() {
        this.operators_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/organization?show=displayed",
        })
        .then((response) => {
            this.operators_list = response.data;
        })
        .catch((error) => {
            this.$emit('on-error-message-show', 'Виникла помилка при завантаженні списку доступних операторів е-ресурсу.');
        })
        .finally(() => {
            this.operators_loading = false;
        });
    },

    createNewInformationResourceApplication() {
        this.$refs.form.validate();

        if (!((this.administrator_organization_code.length == 0 && this.administrator_organization_name.length == 0) || 
            (this.administrator_organization_code.length > 0 && this.administrator_organization_name.length > 0))) {
            this.$emit('on-error-message-show', 'Найменування технічного адміністратора та код ЄДРПОУ обов\'язкові для заповнення в парі');
            return false;
        }

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
            url: this.$config.backend_url + "/api/v1/internal/information_resource/generation_create",
            timeout: 1000 * 300,
            data: {
                'application_type': "CREATE",
                'name': this.name,
                'description': this.description,
                'nreir_identifier': this.nreir_identifier,
                'administrator_organization_name': this.administrator_organization_name,
                'administrator_organization_code': this.administrator_organization_code,
                'legal_basis': this.legal_basis,
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
            // Check head person attachment size
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

    async updateNewInformationResourceApplication() {
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

        if (!((this.administrator_organization_code.length == 0 && this.administrator_organization_name.length == 0) || 
            (this.administrator_organization_code.length > 0 && this.administrator_organization_name.length > 0))) {
            this.$emit('on-error-message-show', 'Найменування технічного адміністратора та код ЄДРПОУ обов\'язкові для заповнення в парі');
            return false;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.GENERATE_DOCVIEW;
        this.axios({
            method: "put",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/generation_create/" + this.app_id,
            timeout: 1000 * 300,
            data: {
                'application_type': "CREATE",
                'name': this.name,
                'description': this.description,
                'nreir_identifier': this.nreir_identifier,
                'administrator_organization_name': this.administrator_organization_name,
                'administrator_organization_code': this.administrator_organization_code,
                'legal_basis': this.legal_basis,
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

    async atSignNewInformationResourceApplication() {
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

    async updateInformationResourceApplication() {
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

        if (!((this.administrator_organization_code.length == 0 && this.administrator_organization_name.length == 0) || 
            (this.administrator_organization_code.length > 0 && this.administrator_organization_name.length > 0))) {
            this.$emit('on-error-message-show', 'Найменування технічного адміністратора та код ЄДРПОУ обов\'язкові для заповнення в парі');
            return false;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.GENERATE_DOCVIEW;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/generation_edit",
            timeout: 1000 * 120,
            data: {
                'application_type': "EDIT",
                'information_eresource': this.$route.params.id,
                'name': this.name,
                'description': this.description,
                'nreir_identifier': this.nreir_identifier,
                'administrator_organization_name': this.administrator_organization_name,
                'administrator_organization_code': this.administrator_organization_code,
                'legal_basis': this.legal_basis,
                'head_person_full_name': this.head_person_full_name,
                'head_person_position': this.head_person_position,
                'head_person_document': this.head_person_document,
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

    async updateEditInformationResourceApplication() {
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

        if (!((this.administrator_organization_code.length == 0 && this.administrator_organization_name.length == 0) || 
            (this.administrator_organization_code.length > 0 && this.administrator_organization_name.length > 0))) {
            this.$emit('on-error-message-show', 'Найменування технічного адміністратора та код ЄДРПОУ обов\'язкові для заповнення в парі');
            return false;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.GENERATE_DOCVIEW;
        this.axios({
            method: "put",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/generation_edit/" + this.app_id,
            timeout: 1000 * 120,
            data: {
                'application_type': "EDIT",
                'information_eresource': this.$route.params.id,
                'name': this.name,
                'description': this.description,
                'nreir_identifier': this.nreir_identifier,
                'administrator_organization_name': this.administrator_organization_name,
                'administrator_organization_code': this.administrator_organization_code,
                'legal_basis': this.legal_basis,
                'head_person_full_name': this.head_person_full_name,
                'head_person_position': this.head_person_position,
                'head_person_document': this.head_person_document,
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
}
}
</script>
