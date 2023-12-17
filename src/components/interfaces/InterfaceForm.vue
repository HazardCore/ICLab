<template>
    <v-container class="mt-10">
        <v-form ref="form" v-model="form_valid">
            <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
            <v-row>
                <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'viewinterface'">Деталі інтерфейсу е-ресурсу</h3>
                <h3 class="mb-10 diia-h3-header" v-else-if="selected_submenu_item == 'editinterface'">Редагування інтерфейсу е-ресурсу</h3>
                <h3 class="mb-10 diia-h3-header" v-else>Створення інтерфейсу е-ресурсу</h3>
            </v-row>
            <v-row>
                <v-col cols="12" class="pl-0">
                    <v-autocomplete
                        v-model="information_resource" class="diia-v-input"
                        label="Назва е-ресурсу"
                        dense
                        :loading="new_interface_irs_selection_list_loading"
                        required :rules="[v => !!v || 'Обовязково до заповнення']"
                        :items="information_resources_selection_list"
                        item-text="name" item-value="id"
                        @change="onInformationResourceChange"
                        :readonly="selected_submenu_item != 'addinterface' || interface_services_list.length > 0"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-text-field dense required class="diia-v-input"
                        :rules="[v => !!v || 'Обовязково до заповнення']"
                        v-model="name"
                        label="Назва інтерфейсу е-ресурсу"
                        :readonly="selected_submenu_item == 'viewinterface'"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-select
                        dense v-model="exchange_data_type" class="diia-v-input"
                        :rules="[v => !!v || 'Обовязково до заповнення']"
                        label="Тип інтерфейсу"
                        :readonly="selected_submenu_item == 'viewinterface'"
                        :items="[
                            {value: 'RECEIVER', text: 'Отримання даних'}, 
                            {value: 'SENDER', text: 'Надання даних'}
                        ]"
                        item-text="text" item-value="value"
                    ></v-select>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-textarea dense
                        :rules="[v => !!v || 'Обовязково до заповнення']" class="diia-v-input"
                        auto-grow no-resize rows="1"
                        v-model="description"
                        label="Опис призначення"
                        :readonly="selected_submenu_item == 'viewinterface'"
                    ></v-textarea>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-textarea dense
                        :rules="[v => !!v || 'Обовязково до заповнення']" class="diia-v-input"
                        auto-grow no-resize rows="1"
                        v-model="services_description"
                        label="Скорочені коди сервісів, що формують інтерфейс е-ресурсу"
                        :readonly="selected_submenu_item == 'viewinterface'"
                    ></v-textarea>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-textarea dense
                        :rules="[v => !!v || 'Обовязково до заповнення']" class="diia-v-input"
                        auto-grow no-resize rows="1"
                        v-model="services_call_sequence_description"
                        label="Послідовність виклику сервісів"
                        :readonly="selected_submenu_item == 'viewinterface'"
                    ></v-textarea>
                </v-col>
                <v-col cols="12" class="pl-0">
                    <v-textarea dense
                        v-model="usage_restrictions"
                        auto-grow no-resize rows="1"
                        label="Обмеження щодо використання" class="diia-v-input"
                        :readonly="selected_submenu_item == 'viewinterface'"
                    ></v-textarea>
                </v-col>
                <v-col cols="12" class="pl-0 pt-0">
                    <v-checkbox dense
                        v-model="is_public"
                        label="Публічний інтерфейс"
                        :persistent-hint="selected_submenu_item != 'viewinterface'"
                        hint="Позначка «Публічний інтерфейс» встановлюється, якщо інтерфейс е-ресурсу доступний всім суб’єктам електронної взаємодії без необхідності укладання договору про інформаційну взаємодію."
                        :readonly="selected_submenu_item == 'viewinterface'" :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                    ></v-checkbox>
                </v-col>
                <v-col cols="12" class="pl-0 pt-0">
                    <v-checkbox dense
                        v-model="personal_data_processing"
                        :persistent-hint="selected_submenu_item != 'viewinterface'"
                        label="Обробка персональних даних інтерфейсом е-ресурсу"
                        hint="Позначка «Обробка персональних даних е-ресурсом» встановлюється, якщо інтерфейс е-ресурсу передбачає обмін персональними даними."
                        :readonly="selected_submenu_item == 'viewinterface'" :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-form>
        <v-row>
            <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
        </v-row>
        <v-form ref="service_form" v-model="service_form_valid" fluid lazy>
        <v-row>
            <h3 class="mb-10 diia-h3-header">Сервіси інтерфейсу е-ресурсу</h3>
        </v-row>
        <v-row v-if="selected_submenu_item != 'viewinterface'">
            <DiiaMessageBox :text="$config.TRANSLATION.INTERFACE.BANNERS.SERVICES_EDIT"/>
        </v-row>
        <v-row>
            <v-col cols="12" class="pl-0">
                <v-data-table
                    locale="uk-UA"
                    :headers="interface_services_list_headers"
                    :items="interface_services_list"
                    disable-pagination
                    disable-sort
                    disable-filtering
                    hide-default-footer
                    mobile-breakpoint="1"
                    no-data-text="Сервіси не додано"
                    loading-text="Виконується запит..."
                    class="elevation-0 pa-0 data-table-detail-design"
                    @click:row="onInterfaceServiceSelect"
                >
                    <template v-slot:item.actions="{ item }" v-if="selected_submenu_item != 'viewinterface'">
                        <v-icon
                            @click="deleteInterfaceService(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:item.instance="{ item }">
                        <span v-if="item.instance == 'SEVDEIR'">Промислове середовище</span>
                        <span v-if="item.instance == 'SEVDEIR-TEST'">Тестове середовище</span>
                    </template>
                </v-data-table>
            </v-col>
            <template v-if="selected_submenu_item != 'viewinterface'">
                    <v-col cols="4" class="pl-0">
                        <v-select dense
                            v-model="new_webservice_methods_instance" class="diia-v-input"
                            :rules="[v => !!v || 'Обовязково до заповнення']"
                            label="Середовище"
                            :items="[
                                {value: 'SEVDEIR-TEST', text: 'Тестове середовище'}, 
                                {value: 'SEVDEIR', text: 'Промислове середовище'}
                            ]"
                            item-text="text" item-value="value" required
                            :disabled="information_resource_service_selection_mode"
                            @change="onServiceInstanceChange"
                        ></v-select>
                    </v-col>
                    <v-col cols="8" class="pl-0" v-if="!information_resource_service_selection_mode">
                        <v-autocomplete dense return-object
                            v-model="new_webservice_methods_selected_object" class="diia-v-input"
                            :rules="[v => !!v || 'Обовязково до заповнення']"
                            :loading="selected_information_resource_services_selection_list_loading"
                            label="Код сервісу" required
                            :items="new_webservice_methods_selection_list"
                            item-text="full_sevdeir_identifier" item-value="id"
                            @change="onServiceObjectChange"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="8" class="pl-0" v-if="information_resource_service_selection_mode">
                        <v-text-field dense
                            v-model="selected_service_identifier" class="diia-v-input"
                            :disabled="true"
                            label="Обраний сервіс"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="4" class="pl-0">
                        <v-select dense
                            v-model="new_webservice_methods_role" class="diia-v-input"
                            :rules="[v => !!v || 'Обовязково до заповнення']"
                            label="Роль" required
                            :disabled="new_webservice_methods_role_disable"
                            :items="[
                                {value: 'MAIN', text: 'Основний'}, 
                                {value: 'SUPPORT', text: 'Допоміжний'}
                            ]"
                            item-text="text" item-value="value"
                        ></v-select>
                    </v-col>
                    <v-col cols="8" class="pl-0">
                        <v-text-field dense return-object class="diia-v-input"
                            :rules="[v => !!v || 'Обовязково до заповнення']"
                            v-model="new_webservice_methods_name" required
                            label="Назва сервісу"
                        ></v-text-field>
                    </v-col>
                <v-col cols="12" class="pl-0 pt-0 justify-space-between d-flex">
                    <v-btn
                        class="diia-button-style-3"
                        elevation="0"
                        @click="addInterfaceService"
                        v-if="!information_resource_service_selection_mode"
                    >
                    Додати сервіс
                    </v-btn>
                    <span>
                        <v-btn
                            class="diia-button-style-3"
                            elevation="0"
                            @click="clearSelectedServiceForm"
                            v-if="information_resource_service_selection_mode"
                        >
                        Скасувати вибір
                        </v-btn>
                        <v-btn
                            class="diia-button-style-3 ml-3"
                            elevation="0"
                            @click="updateInterfaceService"
                            v-if="information_resource_service_selection_mode"
                        >
                        Зберегти
                        </v-btn>
                    </span>
                    <v-btn
                        class="diia-button-style-3 ml-3"
                        elevation="0"
                        @click="deleteInterfaceService"
                        v-if="information_resource_service_selection_mode"
                    >
                    Видалити
                    </v-btn>
                </v-col>
            </template>
        </v-row>
        </v-form>
        <v-row>
            <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
        </v-row>
        <v-form ref="documentation_form" v-model="documentation_form_valid" fluid lazy>
            <v-row>
                <h3 class="mb-10 diia-h3-header">Документація інтерфейсу е-ресурсу</h3>
            </v-row>
            <v-row v-if="selected_submenu_item != 'viewinterface'">
                <DiiaMessageBox :text="$config.TRANSLATION.INTERFACE.BANNERS.DOCUMENTATION_EDIT"/>
            </v-row>
            <v-row>
                <v-col cols="12" class="pl-0">
                    <v-data-table
                        locale="uk-UA"
                        :headers="interface_documentation_list_headers"
                        :items="interface_documentation_list"
                        disable-pagination
                        disable-sort
                        disable-filtering
                        hide-default-footer
                        mobile-breakpoint="1"
                        no-data-text="Документація інтерфейсу відсутня"
                        loading-text="Виконується запит..."
                        class="elevation-0 pa-0 data-table-detail-design"
                    >
                        <template v-slot:item.actions="{ item }" v-if="selected_submenu_item != 'viewinterface'">
                            <v-icon
                                @click="deleteInterfaceDocumentation(item)"
                                color="black"
                            >
                                mdi-close
                            </v-icon>
                        </template>
                        <template v-slot:item.file="{ item }">
                            <v-file-input
                                prepend-icon class="diia-v-input mt-0"
                                v-if="item.load_side == 'client' || item.load_side == 'server_update'"
                                :clearable="false"
                                v-model="item.file"
                                disabled
                                label="Файл"

                            ></v-file-input>
                            <a v-if="item.load_side == 'server'" :href="$config.backend_url + item.file">Завантажити</a>
                        </template>
                    </v-data-table>
                </v-col>
                <template v-if="selected_submenu_item != 'viewinterface'">
                    <v-col cols="12" class="pl-0">
                        <v-text-field dense required
                            :rules="[v => !!v || 'Обовязково до заповнення']"
                            v-model="new_doc_name" class="diia-v-input"
                            label="Назва документу"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pl-0 pt-0">
                        <v-file-input dense required
                            v-model="new_doc_file" class="diia-v-input"
                            :rules="[v => !!v || 'Обовязково до заповнення']"
                            small-chips
                            label="Файл"
                        ></v-file-input>
                    </v-col>
                    <v-col cols="12" class="pl-0 pt-0 justify-space-between d-flex">
                        <v-btn
                            class="diia-button-style-3"
                            elevation="0"
                            @click="addInterfaceDocumentation"
                            v-if="!interface_documentation_selection_mode"
                        >
                        Додати документ
                        </v-btn>
                    </v-col>
                </template>
            </v-row>
        </v-form>
        <template v-if="selected_submenu_item != 'viewinterface'">
            <template v-if="selected_submenu_item == 'editinterface'">
                <v-form ref="form_addition" v-model="addition_form_valid">
                    <v-row>
                        <v-divider class="mt-10 mb-10 diia-divider"></v-divider>
                    </v-row>
                    <v-row>
                        <h3 class="mb-10 diia-h3-header">Додаток до заявки</h3>
                    </v-row>
                    <v-row>
                        <DiiaMessageBox :text="$config.TRANSLATION.INTERFACE.BANNERS.APPLICATION_CANCEL_AGREEMENT"/>
                    </v-row>
                    <v-row class="mt-5">
                        <v-checkbox
                            v-model="cancel_prev_applications"
                            required :rules="[v => !!v || 'Обовязково до заповнення']"
                            :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                            :label="`Я погоджуюсь з скасуванням попередньо поданих активних заяв до інтерфейсу е-ресурсу.`"
                        ></v-checkbox>
                    </v-row>
                    <v-row class="mt-5">
                        <v-text-field dense required class="diia-v-input"
                                :rules="[v => !!v || 'Обовязково до заповнення']"
                                v-model="crud_reason"
                                label="Причина/Підстава для внесення змін до інтерфейсу е-ресурсу"
                        ></v-text-field>
                    </v-row>
                </v-form>
            </template>
            <v-row>
                <v-btn
                    v-if="selected_submenu_item == 'addinterface'"
                    elevation="0"
                    class="diia-button-style-3 mt-5 mb-10"
                    @click="createNewInterfaceApplication"
                >
                Подати заявку
                </v-btn>
                <v-btn
                    v-if="selected_submenu_item == 'editinterface'"
                    elevation="0"
                    class="diia-button-style-3 mt-5"
                    @click="submitEditInterfaceApplication"
                >
                Подати заявку
                </v-btn>
            </v-row>
        </template>
    </v-container>
</template>

<script>
/* eslint-disable */
export default {
  name: "InterfaceForm",
  components: {},
  props: ['selected_submenu_item'],
  data: () => ({
    overlay: false,
    overlay_text: 'Зачекайте будь ласка',

    selected_information_resource_services_selection_list_loading: false,
    new_interface_irs_selection_list_loading: false,

    form_valid: true,
    documentation_form_valid: true,
    service_form_valid: true,
    addition_form_valid: true,

    name: "",
    published: false,
    is_deleted: false,
    exchange_data_type: "",
    description: "",
    usage_restrictions: "",
    is_public: false,
    personal_data_processing: false,
    services_description: "",
    services_call_sequence_description: "",
    information_resource: "",

    request_interface_services_list: '',
    request_interface_documentation_list: '',
    request_name: '',
    request_exchange_data_type: '',
    request_description: '',
    request_usage_restrictions: '',
    request_is_public: '',
    request_personal_data_processing: '',
    request_services_description: '',
    request_services_call_sequence_description: '',
    request_prev_application_is_active: '',
    request_information_resource: '',
    request_published: '',
    request_is_deleted: '',

    cancel_prev_applications: false,
    prev_application_is_active: false,
    crud_reason: "",

    selected_service_item: "",
    selected_service_identifier: "",
    new_webservice_methods_role: null,
    new_webservice_methods_name: null,
    new_webservice_methods_instance: null,
    new_webservice_methods_selected_object: null,
    new_webservice_methods_role_disable: null,
    new_webservice_methods_selection_list: [],
    information_resource_service_selection_mode: false,

    selected_doc_item: "",
    new_doc_name: "",
    new_doc_file: null,
    interface_documentation_selection_mode: false,
    sent_file_uuids: [],

    information_resources_selection_list: [],
    selected_information_resource_prod_services_selection_list: [],
    selected_information_resource_test_services_selection_list: [],

    interface_documentation_list: [],
    interface_documentation_list_headers: [
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
            width: '300px',
        },
        { 
            text: 'Дії', 
            value: 'actions', 
            align: 'start',
            class: 'data-table-header',
            width: '40px',
        },
    ],

    interface_services_list: [],
    interface_services_list_headers: [
        {
            text: 'Код сервісу',
            value: 'full_sevdeir_identifier',
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Назва сервісу', 
            value: 'name', 
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Роль', 
            value: 'service_role_verbose', 
            align: 'start',
            class: 'data-table-header',
            width: '100px',
        },
        { 
            text: 'Середовище', 
            value: 'instance', 
            align: 'start',
            class: 'data-table-header',
            width: '200px',
        },
    ]
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';

    if (this.selected_submenu_item == 'addinterface') {
        this.requestNewInterfaceIrsSelectionList();
    }

    if (this.selected_submenu_item == 'viewinterface') {
        this.requestInterfaceDetail();
    }
  },

  watch: {
      $route(to, from) {
        if (to.name == 'interface-detail') {
            this.interfaceDetailViewClearForm();
            this.requestInterfaceDetail();
        }
      },

      selected_submenu_item(new_value, old_value) {
        if (old_value == 'editinterface' && new_value != old_value) {
            this.clearSelectedServiceForm();
            this.clearSelectedDocumentationForm();

            this.crud_reason = "";
            this.interface_services_list = [...this.request_interface_services_list];
            this.interface_documentation_list = [...this.request_interface_documentation_list];
            this.name = this.request_name;
            this.exchange_data_type = this.request_exchange_data_type;
            this.description = this.request_description;
            this.usage_restrictions = this.request_usage_restrictions;
            this.is_public = this.request_is_public;
            this.personal_data_processing = this.request_personal_data_processing;
            this.services_description = this.request_services_description;
            this.services_call_sequence_description = this.request_services_call_sequence_description;
            this.prev_application_is_active = this.request_prev_application_is_active;
            this.information_resource = this.request_information_resource;
        }
      }
  },

  methods: {
    interfaceDetailViewClearForm() {
        this.selected_information_resource_services_selection_list_loading = false;
        this.new_interface_irs_selection_list_loading = false;

        this.form_valid = true;
        this.documentation_form_valid = true;
        this.service_form_valid = true;
        this.addition_form_valid = true;

        this.cancel_prev_applications = false;
        this.published = false;
        this.is_deleted = false;
        this.prev_application_is_active = false;
        this.crud_reason = "";
        this.name = "";
        this.exchange_data_type = "";
        this.description = "";
        this.usage_restrictions = "";
        this.is_public = false;
        this.personal_data_processing = false;
        this.services_description = "";
        this.services_call_sequence_description = "";
        this.information_resource = "";

        this.information_resources_selection_list = [];
        this.selected_information_resource_prod_services_selection_list = [];
        this.selected_information_resource_test_services_selection_list = [];

        this.request_interface_services_list = [];
        this.request_interface_documentation_list = [];

        this.request_name = "";
        this.request_exchange_data_type = "";
        this.request_description = "";
        this.request_usage_restrictions = "";
        this.request_is_public = "";
        this.request_personal_data_processing = "";
        this.request_services_description = "";
        this.request_services_call_sequence_description = "";
        this.request_prev_application_is_active = "";
        this.request_information_resource = "";
        this.request_published = "";
        this.request_is_deleted = "";

        this.selected_service_item = "";
        this.selected_service_identifier = "";
        this.new_webservice_methods_role = null;
        this.new_webservice_methods_name = null;
        this.new_webservice_methods_instance = null;
        this.new_webservice_methods_selected_object = null;
        this.new_webservice_methods_role_disable = null;
        this.new_webservice_methods_selection_list = [];
        this.information_resource_service_selection_mode = false;

        this.selected_doc_item = "";
        this.new_doc_name = "";
        this.new_doc_file = null;
        this.interface_documentation_selection_mode = false;
        this.sent_file_uuids = [];


        this.interface_documentation_list = [];
        this.interface_services_list = [];

        this.clearSelectedServiceForm();
        this.clearSelectedDocumentationForm();
    },

    // SERVICES BUTTONS
    addInterfaceService() {
        this.$refs.service_form.validate();

        if (this.service_form_valid) {
            if (this.interface_services_list.find(x => x.id === this.new_webservice_methods_selected_object.id)) {
                this.$emit('on-error-message-show', 'Обраний сервіс вже додано до списку.');
                this.clearSelectedServiceForm();
                return false;
            }

            let service_obj = JSON.parse(JSON.stringify(this.new_webservice_methods_selected_object));

            service_obj.service_role = this.new_webservice_methods_role;
            service_obj.service_role_verbose = this.new_webservice_methods_role == 'MAIN' ? 'Основний' : 'Допоміжний';
            service_obj.name = this.new_webservice_methods_name;
            this.interface_services_list.push(service_obj);
            this.clearSelectedServiceForm();
        }
    },

    onInterfaceServiceSelect(item) {
        if (this.selected_submenu_item != 'viewinterface') {
            this.new_webservice_methods_role = item.service_role;
            this.new_webservice_methods_name = item.name;
            this.new_webservice_methods_instance = item.instance;
            this.selected_service_identifier = item.full_sevdeir_identifier;
            this.new_webservice_methods_role_disable = !item.allow_role_change;

            this.selected_service_item = item;
            this.information_resource_service_selection_mode = true;
        }
    },

    clearSelectedServiceForm() {
        this.information_resource_service_selection_mode = false;
        this.new_webservice_methods_role_disable = false;
        this.new_webservice_methods_instance = null;
        this.new_webservice_methods_role = null;
        this.new_webservice_methods_name = null;
        this.selected_service_item = null;
        this.new_webservice_methods_selected_object = null;
        this.new_webservice_methods_selection_list = [];
        this.$refs.service_form.resetValidation();
    },

    updateInterfaceService() {
        this.$refs.service_form.validate();

        if (this.service_form_valid) {
            this.selected_service_item.service_role = this.new_webservice_methods_role;
            this.selected_service_item.service_role_verbose = this.new_webservice_methods_role == 'MAIN' ? 'Основний' : 'Допоміжний';
            this.selected_service_item.name = this.new_webservice_methods_name;
            this.clearSelectedServiceForm();
        }
    },

    deleteInterfaceService() {
        this.interface_services_list = this.interface_services_list.filter(x => x.id !== this.selected_service_item.id); 
        this.clearSelectedServiceForm();
    },

    
    // DOCUMENTS BUTTONS
    addInterfaceDocumentation() {
        this.$refs.documentation_form.validate();

        if (this.documentation_form_valid) {
            this.interface_documentation_list.push({
                "name": this.new_doc_name,
                "file": this.new_doc_file,
                "load_side": 'client'
            })

            this.clearSelectedDocumentationForm();
        }
    },

    clearSelectedDocumentationForm() {
        this.new_doc_name = '';
        this.new_doc_file = null;
        this.selected_doc_item = null;
        this.interface_documentation_selection_mode = false;
        this.$refs.documentation_form.resetValidation();
    },

    deleteInterfaceDocumentation(item) {
        this.interface_documentation_list = this.interface_documentation_list.filter(x => x.name !== item.name); 
        this.clearSelectedDocumentationForm();
    },

    // SERVICE LISTENER
    onInformationResourceChange() {
        this.clearSelectedServiceForm();
        this.selected_information_resource_test_services_selection_list = [];
        this.selected_information_resource_prod_services_selection_list = [];

        this.requestInterfaceInformationResourceProdMethodsList();
        this.requestInterfaceInformationResourceTestMethodsList();
    },

    onServiceInstanceChange() {
        let curr_inst = this.new_webservice_methods_instance;
        this.clearSelectedServiceForm();
        this.new_webservice_methods_instance = curr_inst;

        if (this.new_webservice_methods_instance == 'SEVDEIR') {
            this.new_webservice_methods_selection_list = this.selected_information_resource_prod_services_selection_list;
        } else {
            this.new_webservice_methods_selection_list = this.selected_information_resource_test_services_selection_list;
        }
    },

    onServiceObjectChange(item) {
        this.new_webservice_methods_role_disable = false;
        this.new_webservice_methods_role = item.service_role;
        this.new_webservice_methods_name = item.name;

        if (item.service_role) {
            this.new_webservice_methods_role_disable = true;
        }
    },

    requestInterfaceDetail() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INTERFACE.LOADING.LOAD_DETAIL;

        return this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/interface/" + this.$route.params.id,
        })
        .then((response) => {
            this.name = response.data.name;
            this.exchange_data_type = response.data.exchange_data_type;
            this.description = response.data.description;
            this.usage_restrictions = response.data.usage_restrictions;
            this.is_public = response.data.is_public;
            this.personal_data_processing = response.data.personal_data_processing;
            this.services_description = response.data.services_description;
            this.services_call_sequence_description = response.data.services_call_sequence_description;
            this.prev_application_is_active = response.data.prev_application_is_active;

            this.information_resources_selection_list.push({
                "id": response.data.information_resource,
                "name": response.data.information_resource_name
            })
            this.information_resource = response.data.information_resource;

            this.published = response.data.published;
            this.is_deleted = response.data.is_deleted;

            for (let i in response.data.main_services_prod) {
                this.interface_services_list.push(response.data.main_services_prod[i]);
            }

            for (let i in response.data.main_services_test) {
                this.interface_services_list.push(response.data.main_services_test[i]);
            }

            for (let i in response.data.sub_services_prod) {
                this.interface_services_list.push(response.data.sub_services_prod[i]);
            }

            for (let i in response.data.sub_services_test) {
                this.interface_services_list.push(response.data.sub_services_test[i]);
            }

            for (let idx in response.data.documents) {
                this.interface_documentation_list.push({
                    'name': response.data.documents[idx].name,
                    'file': response.data.documents[idx].document_url,
                    'load_side': 'server',
                    'unique_uuid': response.data.documents[idx].unique_uuid,
                })
            }

            this.$emit('on-interface-request', this.is_deleted, this.published);

            this.requestInterfaceInformationResourceProdMethodsList();
            this.requestInterfaceInformationResourceTestMethodsList();

            this.request_interface_services_list = [...this.interface_services_list];
            this.request_interface_documentation_list = [...this.interface_documentation_list];
            this.request_name = response.data.name;
            this.request_exchange_data_type = response.data.exchange_data_type;
            this.request_description = response.data.description;
            this.request_usage_restrictions = response.data.usage_restrictions;
            this.request_is_public = response.data.is_public;
            this.request_personal_data_processing = response.data.personal_data_processing;
            this.request_services_description = response.data.services_description;
            this.request_services_call_sequence_description = response.data.services_call_sequence_description;
            this.request_prev_application_is_active = response.data.prev_application_is_active;
            this.request_information_resource = response.data.information_resource;
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    requestNewInterfaceIrsSelectionList() {
        this.new_interface_irs_selection_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/information_resource_for_operators/?object_status=active",
        })
        .then((response) => {
            this.information_resources_selection_list = []
            for (let item in response.data) {
                this.information_resources_selection_list.push({
                    "id": response.data[item].id,
                    "name": response.data[item].name,
                    "class": 'data-table-header'
                })
            }
        })
        .catch((error) => {
            this.handleError(error);
            this.$emit('on-error-message-show', 'Виникла помилка при завантаженні списку доступних е-ресурсів.');
        })
        .finally(() => {
            this.new_interface_irs_selection_list_loading = false;
        });
    },

    requestInterfaceInformationResourceProdMethodsList() {
        if (!this.information_resource) {
            return false;
        }

        this.selected_information_resource_services_selection_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/" + this.information_resource + "/methods_for_interface?instance=SEVDEIR",
        })
        .then((response) => {
            for (let item in response.data) {
                this.selected_information_resource_prod_services_selection_list.push({
                    "id": response.data[item].id,
                    "name": response.data[item].name,
                    "service_role": response.data[item].service_role,
                    "full_sevdeir_identifier": response.data[item].full_sevdeir_identifier,
                    "instance": 'SEVDEIR',
                    "class": 'data-table-header'
                })
            }
        })
        .catch((error) => {
            this.handleError(error);
            this.$emit('on-error-message-show', 'Виникла помилка при підвантаженні списку доступних сервісів промислового середовища.');
        })
        .finally(() => {
            this.selected_information_resource_services_selection_list_loading = false;
        });
    },

    requestInterfaceInformationResourceTestMethodsList() {
        if (!this.information_resource) {
            return false;
        }

        this.selected_information_resource_services_selection_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/" + this.information_resource + "/methods_for_interface?instance=SEVDEIR-TEST",
        })
        .then((response) => {
            for (let item in response.data) {
                this.selected_information_resource_test_services_selection_list.push({
                    "id": response.data[item].id,
                    "name": response.data[item].name,
                    "service_role": response.data[item].service_role,
                    "full_sevdeir_identifier": response.data[item].full_sevdeir_identifier,
                    "instance": 'SEVDEIR-TEST',
                    "class": 'data-table-header'
                })
            }
        })
        .catch((error) => {
            this.handleError(error);
            this.$emit('on-error-message-show', 'Виникла помилка при підвантаженні списку доступних сервісів тестового середовища.');
        })
        .finally(() => {
            this.selected_information_resource_services_selection_list_loading = false;
        });
    },

    async submitEditInterfaceApplication() {
        this.$refs.form.validate();
        this.$refs.form_addition.validate();

        if (!this.form_valid || !this.addition_form_valid) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля');
            return false;
        }

        if (this.interface_services_list.length == 0) {
            this.$emit('on-error-message-show', 'Необхідно вказати хочаб один основний сервіс.');
            return false;
        }

        let main_found = false;
        for (let method_id in this.interface_services_list) {
            if (this.interface_services_list[method_id].service_role == 'MAIN')
                main_found = true;
        }

        if (!main_found) {
            this.$emit('on-error-message-show', 'Необхідно вказати хочаб один основний сервіс.');
            return false;
        }

        if (this.interface_documentation_list.length == 0) {
            this.$emit('on-error-message-show', 'Необхідно прикріпити документацію інтерфейсу.');
            return false;
        }

        for (let file_id in this.interface_documentation_list) {
            if (this.interface_documentation_list[file_id].load_side == 'client' && this.interface_documentation_list[file_id].file) {
                if (this.interface_documentation_list[file_id].file.size > this.$config.INFORMATION_RESOURCE_INTERFACE_DOCUMENTATION_MAX_FILE_SIZE) {
                    this.$emit('on-error-message-show', 'Розмір документації інтерфейсу перевищує допустимий розмір.');
                    return false;
                }

                let format_found = false;
                let formats = this.$config.INFORMATION_RESOURCE_INTERFACE_DOCUMENTATION_ALLOWED_FORMATS.split(', ');
                for (let format in formats) {
                    if (this.interface_documentation_list[file_id].file.name.endsWith(formats[format]))
                        format_found = true;
                }
                
                if (!format_found) {
                    this.$emit('on-error-message-show', 'Документація інтерфейсу має недопустимий формат (Дозволені: [' + this.$config.INFORMATION_RESOURCE_INTERFACE_DOCUMENTATION_ALLOWED_FORMATS + '])');
                    return false;
                }
            }
        }

        this.sent_file_uuids = [];

        for (let file_id in this.interface_documentation_list) {
            if (this.interface_documentation_list[file_id].load_side == 'client') {
                await this.sendFile(this.interface_documentation_list[file_id]);
            } else {
                this.sent_file_uuids.push(this.interface_documentation_list[file_id].unique_uuid);
            }
        }

        let main_services_prod = [];
        let main_services_test = [];
        let sub_services_prod = [];
        let sub_services_test = [];


        for (let method_id in this.interface_services_list) {
            if (this.interface_services_list[method_id].instance == 'SEVDEIR' && this.interface_services_list[method_id].service_role == 'MAIN')
                main_services_prod.push({
                    'id': this.interface_services_list[method_id].id,
                    'instance': this.interface_services_list[method_id].instance,
                    'full_sevdeir_identifier': this.interface_services_list[method_id].full_sevdeir_identifier,
                    'name': this.interface_services_list[method_id].name,
                    'service_role': this.interface_services_list[method_id].service_role,
                })
            else if (this.interface_services_list[method_id].instance == 'SEVDEIR' && this.interface_services_list[method_id].service_role == 'SUPPORT')
                sub_services_prod.push({
                    'id': this.interface_services_list[method_id].id,
                    'instance': this.interface_services_list[method_id].instance,
                    'full_sevdeir_identifier': this.interface_services_list[method_id].full_sevdeir_identifier,
                    'name': this.interface_services_list[method_id].name,
                    'service_role': this.interface_services_list[method_id].service_role,
                })
            else if (this.interface_services_list[method_id].instance == 'SEVDEIR-TEST' && this.interface_services_list[method_id].service_role == 'MAIN')
                main_services_test.push({
                    'id': this.interface_services_list[method_id].id,
                    'instance': this.interface_services_list[method_id].instance,
                    'full_sevdeir_identifier': this.interface_services_list[method_id].full_sevdeir_identifier,
                    'name': this.interface_services_list[method_id].name,
                    'service_role': this.interface_services_list[method_id].service_role,
                })
            else if (this.interface_services_list[method_id].instance == 'SEVDEIR-TEST' && this.interface_services_list[method_id].service_role == 'SUPPORT')
                sub_services_test.push({
                    'id': this.interface_services_list[method_id].id,
                    'instance': this.interface_services_list[method_id].instance,
                    'full_sevdeir_identifier': this.interface_services_list[method_id].full_sevdeir_identifier,
                    'name': this.interface_services_list[method_id].name,
                    'service_role': this.interface_services_list[method_id].service_role,
                })
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INTERFACE.LOADING.SEND_APPLICATION;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/interface_application",
            data: {
                'application_type': "EDIT",
                'interface': this.$route.params.id,
                'name': this.name,
                'description': this.description,
                'exchange_data_type': this.exchange_data_type,
                'usage_restrictions': this.usage_restrictions,
                'is_public': this.is_public,
                'personal_data_processing': this.personal_data_processing,
                'services_description': this.services_description,
                'services_call_sequence_description': this.services_call_sequence_description,
                'information_eresource': this.information_resource,
                'main_services_prod': main_services_prod,
                'main_services_test': main_services_test,
                'sub_services_prod': sub_services_prod,
                'sub_services_test': sub_services_test,
                'interface_application_documentation': this.sent_file_uuids,
                'submitter_crud_reason': this.crud_reason,
            }
        })
        .then((response) => {
            if (this.$config.user_data.access && this.$config.user_data.access.p == 'ADMIN') {
                this.$emit('on-success-submit', this.$config.TRANSLATION.INTERFACE.SUCCESS.SEND_APPLICATION_UPDATE_INTERFACE);
            } else {
                this.$emit('on-success-submit', this.$config.TRANSLATION.INTERFACE.SUCCESS.SEND_APPLICATION_UPDATE_INTERFACE_APPROVAL);
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    async createNewInterfaceApplication() {
        this.$refs.form.validate();

        if (!this.form_valid) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля.');
            return false;
        }

        if (this.interface_services_list.length == 0) {
            this.$emit('on-error-message-show', 'Необхідно вказати хочаб один основний сервіс.');
            return false;
        }

        let main_found = false;
        for (let method_id in this.interface_services_list) {
            if (this.interface_services_list[method_id].service_role == 'MAIN')
                main_found = true;
        }

        if (!main_found) {
            this.$emit('on-error-message-show', 'Необхідно вказати хочаб один основний сервіс.');
            return false;
        }

        if (this.interface_documentation_list.length == 0) {
            this.$emit('on-error-message-show', 'Необхідно прикріпити документацію інтерфейсу.');
            return false;
        }

        for (let file_id in this.interface_documentation_list) {
            if (this.interface_documentation_list[file_id] && this.interface_documentation_list[file_id].file) {
                if (this.interface_documentation_list[file_id].file.size > this.$config.INFORMATION_RESOURCE_INTERFACE_DOCUMENTATION_MAX_FILE_SIZE) {
                    this.$emit('on-error-message-show', 'Розмір документації інтерфейсу перевищує допустимий розмір.');
                    return false;
                }

                let format_found = false;
                let formats = this.$config.INFORMATION_RESOURCE_INTERFACE_DOCUMENTATION_ALLOWED_FORMATS.split(', ');
                for (let format in formats) {
                    if (this.interface_documentation_list[file_id].file.name.endsWith(formats[format]))
                        format_found = true;
                }
                
                if (!format_found) {
                    this.$emit('on-error-message-show', 'Документація інтерфейсу має недопустимий формат (Дозволені: [' + this.$config.INFORMATION_RESOURCE_INTERFACE_DOCUMENTATION_ALLOWED_FORMATS + '])');
                    return false;
                }
            }
        }

        this.sent_file_uuids = [];

        for (let file_id in this.interface_documentation_list) {
            await this.sendFile(this.interface_documentation_list[file_id])
        }

        let main_services_prod = [];
        let main_services_test = [];
        let sub_services_prod = [];
        let sub_services_test = [];


        for (let method_id in this.interface_services_list) {
            if (this.interface_services_list[method_id].instance == 'SEVDEIR' && this.interface_services_list[method_id].service_role == 'MAIN')
                main_services_prod.push({
                    'id': this.interface_services_list[method_id].id,
                    'instance': this.interface_services_list[method_id].instance,
                    'full_sevdeir_identifier': this.interface_services_list[method_id].full_sevdeir_identifier,
                    'name': this.interface_services_list[method_id].name,
                    'service_role': this.interface_services_list[method_id].service_role,
                })
            else if (this.interface_services_list[method_id].instance == 'SEVDEIR' && this.interface_services_list[method_id].service_role == 'SUPPORT')
                sub_services_prod.push({
                    'id': this.interface_services_list[method_id].id,
                    'instance': this.interface_services_list[method_id].instance,
                    'full_sevdeir_identifier': this.interface_services_list[method_id].full_sevdeir_identifier,
                    'name': this.interface_services_list[method_id].name,
                    'service_role': this.interface_services_list[method_id].service_role,
                })
            else if (this.interface_services_list[method_id].instance == 'SEVDEIR-TEST' && this.interface_services_list[method_id].service_role == 'MAIN')
                main_services_test.push({
                    'id': this.interface_services_list[method_id].id,
                    'instance': this.interface_services_list[method_id].instance,
                    'full_sevdeir_identifier': this.interface_services_list[method_id].full_sevdeir_identifier,
                    'name': this.interface_services_list[method_id].name,
                    'service_role': this.interface_services_list[method_id].service_role,
                })
            else if (this.interface_services_list[method_id].instance == 'SEVDEIR-TEST' && this.interface_services_list[method_id].service_role == 'SUPPORT')
                sub_services_test.push({
                    'id': this.interface_services_list[method_id].id,
                    'instance': this.interface_services_list[method_id].instance,
                    'full_sevdeir_identifier': this.interface_services_list[method_id].full_sevdeir_identifier,
                    'name': this.interface_services_list[method_id].name,
                    'service_role': this.interface_services_list[method_id].service_role,
                })
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INTERFACE.LOADING.SEND_APPLICATION;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/interface_application",
            data: {
                'application_type': "CREATE",
                'name': this.name,
                'description': this.description,
                'exchange_data_type': this.exchange_data_type,
                'usage_restrictions': this.usage_restrictions,
                'is_public': this.is_public,
                'personal_data_processing': this.personal_data_processing,
                'services_description': this.services_description,
                'services_call_sequence_description': this.services_call_sequence_description,
                'information_eresource': this.information_resource,
                'main_services_prod': main_services_prod,
                'main_services_test': main_services_test,
                'sub_services_prod': sub_services_prod,
                'sub_services_test': sub_services_test,
                'interface_application_documentation': this.sent_file_uuids,
                'submitter_crud_reason': '',
            }
        })
        .then((response) => {
            if (this.$config.user_data.access && this.$config.user_data.access.p == 'ADMIN') {
                this.$emit('on-success-submit', this.$config.TRANSLATION.INTERFACE.SUCCESS.SEND_APPLICATION_NEW_INTERFACE);
            } else {
                this.$emit('on-success-submit', this.$config.TRANSLATION.INTERFACE.SUCCESS.SEND_APPLICATION_NEW_INTERFACE_APPROVAL);
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    async sendFile(file) {
        var bodyFormData = new FormData();
        bodyFormData.append('name', file.name);
        bodyFormData.append('content', file.file);

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INTERFACE.LOADING.SEND_DOCUMENTS;
        return this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/interface_application_documentation",
            headers: {
                "Content-Type": "multipart/form-data;charset=UTF-8",
            },
            data: bodyFormData
        })
        .then((response) => {
            this.sent_file_uuids.push(response.data.unique_uuid);
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