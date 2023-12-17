<template>
    <v-form ref="form"
            v-model="form_valid">
        <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
        
        <h3 class="mb-15 diia-h3-header" v-if="selected_submenu_item == 'requestapplication'">{{ template_detail.name }}<span v-if="template_detail.instance_verbose"> ({{ template_detail.instance_verbose }})</span></h3>
        <v-row :key="row_key">
            <v-col cols="12" v-if="selected_submenu_item == 'requestapplication'">
                <v-autocomplete label="Отримувач запиту" v-model="recipient" class="diia-v-input"
                    required :rules="[v => !!v || 'Обовязково до заповнення']" dense
                    :items="recipient_list" hide-no-data clearable
                    hint="Отримувач запиту" return-object
                    item-text="name" item-value="id"
                    @change="relatedValueChanged($event, 'recipient')"
                >
                </v-autocomplete>
            </v-col>
            <template v-for="field in template_fields">
                <v-col :cols="field.cols ? field.cols : 12" :key="field.name" v-if="!form_fields_hidden.find((x) => x == field.name)">
                    <template v-if="field.field_type==='TEXT'">
                        <v-text-field :label="field.label" dense v-model="user_form_data[field.name]" class="diia-v-input"
                                    :required="field.required" :rules="[v => (!field.required || !!v) || 'Обовязково до заповнення']"
                                    item-text="display_name" :hint="field.help_text"
                        >
                        </v-text-field>
                    </template>
                    <template v-if="field.field_type==='TEXTAREA'">
                        <v-textarea :label="field.label" dense v-model="user_form_data[field.name]" class="diia-v-input"
                                    :required="field.required" :rules="[v => (!field.required || !!v) || 'Обовязково до заповнення']"
                                    item-text="display_name" auto-grow no-resize rows="1" :hint="field.help_text"
                        >
                        </v-textarea>
                    </template>
                    <template v-if="field.field_type==='FILE'">
                        <v-file-input :label="field.label" dense v-model="user_form_data[field.name]" class="diia-v-input"
                                    :required="field.required" :rules="[v => (!field.required || !!v) || 'Обовязково до заповнення']"
                                    item-text="display_name" :hint="field.help_text" :accept="field.file_fields_allowed_formats"
                        >
                        </v-file-input>
                    </template>
                    <template v-if="field.field_type==='RELATED'">
                        <v-autocomplete :label="field.label" v-model="user_form_data[field.name]" class="diia-v-input" dense
                                    :required="field.required" :rules="[v => (!field.required || !!v) || 'Обовязково до заповнення']"
                                    :items="choices[field.name]" hide-no-data clearable
                                    :key="keys[field.name]" return-object :hint="field.help_text"
                                    :item-text="field.request_field_display" :item-value="field.request_field_value"
                                    @change="relatedValueChanged($event, field.name)"
                        >
                        </v-autocomplete>
                    </template>
                    <template v-if="field.field_type==='MULTIRELATED'">
                        <v-autocomplete :label="field.label" v-model="user_form_data[field.name]" class="diia-v-input" dense
                                    :required="field.required" :rules="[v => (!field.required || !!v) || 'Обовязково до заповнення']"
                                    :items="choices[field.name]" multiple hide-no-data hide-selected clearable
                                    :key="keys[field.name]" return-object :hint="field.help_text"
                                    :item-text="field.request_field_display" :item-value="field.request_field_value"
                        >
                        </v-autocomplete>
                    </template>
                    <template v-if="field.field_type==='BOOLEAN'">
                        <v-checkbox :label="field.label" v-model="user_form_data[field.name]" :hint="field.help_text" dense
                                    :required="field.required" :rules="[v => (!field.required || !!v) || 'Обовязково до заповнення']"
                                    @change="checkboxValueChanged($event, field.name)" :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                        >
                        </v-checkbox>
                    </template>
                    <template v-if="field.field_type==='DATETIME'">
                    <v-menu
                        v-model="date_menus[field.name]"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="user_form_data[field.name]"
                                class="diia-v-input"
                                :label="field.label" dense
                                :rules="[v => (!field.required || !!v) || 'Обовязково до заповнення']"
                                readonly clearable :hint="field.help_text"
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            color="black"
                            no-title
                            v-model="user_form_data[field.name]"
                            @input="date_menus[field.name] = false; row_key = $clib.uuidv4();"
                        ></v-date-picker>
                    </v-menu>
                    </template>
                </v-col>
            </template>
        </v-row>
        <v-btn class="diia-button-style-3 mt-5" v-if="selected_submenu_item == 'requestapplication'" elevation="0" @click="sendRequestApplication()" :ripple="false">Подати запит</v-btn>
        <v-btn class="diia-button-style-3 mt-5" v-if="selected_submenu_item == 'responseapplication'" elevation="0" @click="sendResponseApplication()" :ripple="false">Підтвердити відповідь</v-btn>
    </v-form>
</template>

<script>
/* eslint-disable */
    export default {
        name: "ExternalApplicationForm",
        props: ['selected_submenu_item', 'template_id'],
        data: () => ({
            template_fields: [],
            form_valid: true,
            user_form_data: {},
            form_fields_hidden: [],
            recipient_list: [],
            recipient: null,
            qa: [],
            template_detail: {},
            choices: {},
            keys: {},
            sent_files: {},

            result_data: {},
            row_key: 0,

            overlay: false,
            overlay_text: 'Зачекайте будь ласка',

            date_menus: [],
        }),
        created: function () {
            this.fetchTemplateInfo();
        },
        mounted: function() {
        },
        watch: {
            $route(to, from) {
                if (to.name == 'new-external-application') {
                    this.fetchTemplateInfo();
                }
            }
        },
        methods: {
            async fetchTemplateInfo() {
                this.template_detail = {};
                this.template_fields = [];
                this.form_fields_hidden = [];
                this.user_form_data = {};
                this.result_data = {};
                this.choices = {};
                this.sent_files = {};
                this.recipient_list = [];
                this.recipient = null;
                this.qa = [];

                if (this.selected_submenu_item == 'requestapplication') {
                    this.loadRecipient();
                    await this.requestFormDetail(this.$route.params.id);
                    await this.requestFormRequestFields(this.$route.params.id);
                }
                else if (this.selected_submenu_item == 'responseapplication') {
                    await this.requestFormDetail(this.template_id);
                    await this.requestFormResponseFields(this.template_id);
                }
            },

            async requestFormDetail(template_id) {
                this.overlay = true;
                return this.axios({
                    method: "get",
                    url: this.$config.backend_url + "/api/v1/internal/external_application_template/" + template_id,
                })
                .then((response) => {
                    this.template_detail = response.data;
                    this.template_detail.qa;
                })
                .catch((error) => {
                    this.handleError(error);
                })
                .finally(() => {
                    this.overlay = false;
                });
            },

            async requestFormRequestFields(template_id) {
                this.overlay = true;
                return this.axios({
                    method: "get",
                    url: this.$config.backend_url + "/api/v1/internal/external_application_template/" + template_id + "/fields",
                })
                .then((response) => {
                    this.template_fields = [];
                    for (let item in response.data) {
                        try {
                            this.template_fields.push(response.data[item]);

                            if (response.data[item].field_type === "RELATED" || response.data[item].field_type === "MULTIRELATED") {
                                this.choices[response.data[item].name] = [];

                                if (this.checkRequestRequirements(response.data[item].request_depends_on)) {
                                    this.loadChoices(response.data[item].request_url, response.data[item].name);
                                }
                            }

                            if (response.data[item].field_type === "MULTIRELATED") {
                                this.user_form_data[response.data[item].name] = [];
                            }

                            if (response.data[item].field_type === "DATETIME") {
                                this.date_menus[response.data[item].name] = false;
                            }

                            if (response.data[item].field_type === "BOOLEAN") {
                                let if_active_fields = response.data[item].display_fields_if_set ? response.data[item].display_fields_if_set.trim().split(', ') : '';
                                this.form_fields_hidden = this.form_fields_hidden.concat(if_active_fields);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    this.template_fields.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
                })
                .catch((error) => {
                    this.handleError(error);
                })
                .finally(() => {
                    this.overlay = false;
                });
            },

            async requestFormResponseFields(template_id) {
                this.overlay = true;
                return this.axios({
                    method: "get",
                    url: this.$config.backend_url + "/api/v1/internal/external_application_template/" + template_id + "/response_fields",
                })
                .then((response) => {
                    this.template_fields = [];
                    for (let item in response.data) {
                        try {
                            this.template_fields.push(response.data[item]);

                            if (response.data[item].field_type === "RELATED" || response.data[item].field_type === "MULTIRELATED") {
                                this.choices[response.data[item].name] = [];

                                if (this.checkRequestRequirements(response.data[item].request_depends_on)) {
                                    this.loadChoices(response.data[item].request_url, response.data[item].name);
                                }
                            }

                            if (response.data[item].field_type === "MULTIRELATED") {
                                this.user_form_data[response.data[item].name] = [];
                            }

                            if (response.data[item].field_type === "DATETIME") {
                                this.date_menus[response.data[item].name] = false;
                            }

                            if (response.data[item].field_type === "BOOLEAN") {
                                let if_active_fields = response.data[item].display_fields_if_set ? response.data[item].display_fields_if_set.trim().split(', ') : '';
                                this.form_fields_hidden = this.form_fields_hidden.concat(if_active_fields);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    this.template_fields.sort((a,b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
                })
                .catch((error) => {
                    this.handleError(error);
                })
                .finally(() => {
                    this.overlay = false;
                });
            },

            loadChoices(request_url, field_name) {
                let url = this.$config.backend_url + request_url;
                
                if (this.template_detail.instance && url.includes('?')) {
                    url = url + '&env=' + this.template_detail.instance;
                } else {
                    url = url + '?env=' + this.template_detail.instance;
                }

                this.axios({
                    method: "get",
                    url: url,
                })
                .then((response) => {
                    this.choices[field_name] = response.data;
                    this.row_key = this.$clib.uuidv4();
                })
                .catch((error) => {
                    this.handleError(error);
                })
                .finally(() => {
                    // this.template_fields_loading = false;
                });
            },

            loadRecipient() {
                let url = this.$config.backend_url + "/api/v1/internal/organization?show=displayed";

                this.axios({
                    method: "get",
                    url: url,
                })
                .then((response) => {
                    this.recipient_list = response.data;
                    this.row_key = this.$clib.uuidv4();
                })
                .catch((error) => {
                    this.handleError(error);
                })
                .finally(() => {
                });
            },


            async sendRequestApplication() {
                this.$refs.form.validate();

                if (!this.form_valid) {
                    this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля заявки.');
                    return false;
                }

                if (this.$config.user_data.access.o == this.recipient.member_code) {
                    this.$emit('on-error-message-show', 'Неможливо відправити запит на власну організацію.');
                    return false;
                }

                for (let item in this.template_fields) {
                    if (!this.form_fields_hidden.includes(this.template_fields[item].name)) {
                        let field_name = this.template_fields[item].name;

                        if (this.template_fields[item].field_type === "FILE" && this.user_form_data[field_name]) {
                            if (this.template_fields[item].file_fields_size_restriction > 0 && this.user_form_data[field_name].size > this.template_fields[item].file_fields_size_restriction) {
                                this.$emit('on-error-message-show', 'Файл в полі "' + this.template_fields[item].label + 
                                            '" перевищує дозволений розмір (' + this.$clib.fileSizeToString(this.template_fields[item].file_fields_size_restriction) + ')');
                                return false;
                            }

                            let format_found = false;
                            if (this.template_fields[item].file_fields_allowed_formats) {
                                let formats = this.template_fields[item].file_fields_allowed_formats.split(',')
                                for (let format in formats) {
                                    if (this.user_form_data[field_name].name.endsWith(formats[format]))
                                        format_found = true;
                                }
                                
                                if (!format_found) {
                                    this.$emit('on-error-message-show', 'Файл в полі "' + this.template_fields[item].label + 
                                                '" має недопустимий формат (Дозволені: [' + this.template_fields[item].file_fields_allowed_formats +'])');
                                    return false;
                                }
                            }
                        }
                    }
                }

                await this.prepareApplication();

                this.overlay = true;
                this.axios({
                    method: "post",
                    url: this.$config.backend_url + "/api/v1/internal/external_application",
                    data: {
                        template: this.template_detail.id,
                        request_fields: this.result_data,
                        recipient: this.recipient.id,
                        instance: this.template_detail.instance,
                    }
                })
                .then((response) => {
                    if (this.template_detail.requires_admin_approval && this.$config.user_data.access && this.$config.user_data.access.p == 'USER')
                        this.$emit('on-info-message-show', this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.SUCCESS.SEND_APPLICATION_APPROVAL);
                    else
                        this.$emit('on-info-message-show', this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.SUCCESS.SEND_APPLICATION);
                    this.$router.push({name: 'external-applications-list', params: {'update_apps': true}});
                })
                .catch((error) => {
                    this.handleError(error);
                })
                .finally(() => {
                    this.overlay = false;
                });
            },

            async sendResponseApplication() {
                this.$refs.form.validate();

                if (!this.form_valid) {
                    this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля заявки.');
                    return false;
                }

                for (let item in this.template_fields) {
                    if (!this.form_fields_hidden.includes(this.template_fields[item].name)) {
                        let field_name = this.template_fields[item].name;

                        if (this.template_fields[item].field_type === "FILE" && this.user_form_data[field_name]) {
                            if (this.template_fields[item].file_fields_size_restriction > 0 && this.user_form_data[field_name].size > this.template_fields[item].file_fields_size_restriction) {
                                this.$emit('on-error-message-show', 'Файл в полі "' + this.template_fields[item].label + 
                                            '" перевищує дозволений розмір (' + this.$clib.fileSizeToString(this.template_fields[item].file_fields_size_restriction) + ')');
                                return false;
                            }

                            let format_found = false;
                            if (this.template_fields[item].file_fields_allowed_formats) {
                                let formats = this.template_fields[item].file_fields_allowed_formats.split(',')
                                for (let format in formats) {
                                    if (this.user_form_data[field_name].name.endsWith(formats[format]))
                                        format_found = true;
                                }
                                
                                if (!format_found) {
                                    this.$emit('on-error-message-show', 'Файл в полі "' + this.template_fields[item].label + 
                                                '" має недопустимий формат (Дозволені: [' + this.template_fields[item].file_fields_allowed_formats +'])');
                                    return false;
                                }
                            }
                        }
                    }
                }

                await this.prepareApplication();

                this.overlay = true;
                this.axios({
                    method: "put",
                    url: this.$config.backend_url + "/api/v1/internal/external_application/" + this.$route.params.id + "/execute",
                    data: {
                        template: this.template_id,
                        response_fields: this.result_data,
                    }
                })
                .then((response) => {
                    this.$emit('on-info-message-show', this.$config.TRANSLATION.EXTERNAL_APPLICATIONS.SUCCESS.EXECUTED);
                    this.$router.push({name: 'external-applications-list', params: {'update_apps': true}});
                })
                .catch((error) => {
                    this.handleError(error);
                })
                .finally(() => {
                    this.overlay = false;
                });
            },

            async prepareApplication() {
                for (let item in this.template_fields) {
                    if (!this.form_fields_hidden.includes(this.template_fields[item].name)) {
                        let field_name = this.template_fields[item].name;

                        if (this.template_fields[item].field_type === "FILE") {
                            if (this.user_form_data[field_name]) {
                                await this.sendFile(field_name).then(() => {
                                    this.result_data[field_name] = this.sent_files[field_name];
                                });
                            }
                        } else if (this.template_fields[item].field_type === "RELATED") {
                            if (this.user_form_data[field_name]) {
                                this.result_data[field_name] = {
                                    'value': this.user_form_data[field_name][this.template_fields[item].request_field_value],
                                    'text': this.user_form_data[field_name][this.template_fields[item].request_field_display]
                                }
                            } else { 
                                this.user_form_data[field_name] = {}
                            }
                        } else if (this.template_fields[item].field_type === "MULTIRELATED") {
                            this.result_data[field_name] = [];
                            for (let item_selected in this.user_form_data[field_name]) {
                                let item_selected_value = this.user_form_data[field_name][item_selected];
                                this.result_data[field_name].push({
                                    'value': item_selected_value[this.template_fields[item].request_field_value],
                                    'text': item_selected_value[this.template_fields[item].request_field_display]
                                })
                            }
                        } else if (this.template_fields[item].field_type === "BOOLEAN") {
                            this.result_data[field_name] = this.user_form_data[field_name] ? true : false;
                        } else {
                            if (this.user_form_data[field_name]) {
                                this.result_data[field_name] = this.user_form_data[field_name];
                            }
                        }
                    }
                }
            },

            async sendFile(field_name) {
                var bodyFormData = new FormData();
                bodyFormData.append('content', this.user_form_data[field_name]);
                bodyFormData.append('application_template_id', this.template_detail.id);

                this.overlay = true;
                return this.axios({
                    method: "post",
                    url: this.$config.backend_url + "/api/v1/internal/external_application_file",
                    headers: {
                        "Content-Type": "multipart/form-data;charset=UTF-8",
                    },
                    data: bodyFormData
                })
                .then((response) => {
                    this.sent_files[field_name] = response.data.unique_uuid;
                })
                .catch((error) => {
                    this.handleError(error);
                    
                })
                .finally(() => {
                    this.overlay = false;
                });
            },

            checkboxValueChanged(event, field_name) {
                let field = this.template_fields.find((x) => x.name == field_name);

                let if_active_fields = field.display_fields_if_set ? field.display_fields_if_set.trim().split(', ') : []
                let if_disabled_fields = field.display_fields_if_not_set ? field.display_fields_if_not_set.trim().split(', ') : []

                if (event) {
                    this.form_fields_hidden = this.form_fields_hidden.filter( ( el ) => !if_active_fields.includes( el ) );
                    this.form_fields_hidden = this.form_fields_hidden.concat(if_disabled_fields);
                } else {
                    this.form_fields_hidden = this.form_fields_hidden.filter( ( el ) => !if_disabled_fields.includes( el ) );
                    this.form_fields_hidden = this.form_fields_hidden.concat(if_active_fields);
                }
            },

            isEmptyObject(obj) {
                if (!obj) return true;
                if (obj && Object.keys(obj).length === 0 && obj.constructor === Object)
                    return true;
                return false;
            },

            checkRequestRequirements(depends_on_fields) {
                // If field has no dependencies -> allow to loadChoices
                if (!depends_on_fields)
                    return true;

                // Loop over fields and check that required fields were already selected by a user
                for (let field in depends_on_fields['fields']) {
                    let lookup_field_name = depends_on_fields['fields'][field]['field_name'];

                    if (depends_on_fields['fields'][field]['required']) {
                        if (lookup_field_name == 'recipient') {
                            if (!this.recipient)
                                return false;
                        } else {
                            if (this.isEmptyObject(this.user_form_data[lookup_field_name]))
                                return false;
                        } 
                    }
                }
                return true;
            },

            formRelatedRequestQueryUrl(depends_on_fields) {
                let query_arr = []
                for (let field in depends_on_fields['fields']) {
                    let field_data = depends_on_fields['fields'][field];
                    if (field_data['field_name'] == 'recipient') {
                        if (this.recipient)
                            query_arr.push(field_data['target_query_parameter'] + '=' + this.recipient.id);
                    } else {
                        if (this.user_form_data[field_data['field_name']][field_data['field_value']])
                            query_arr.push(field_data['target_query_parameter'] + '=' + this.user_form_data[field_data['field_name']][field_data['field_value']]);
                    }
                }
                return query_arr.join('&');
            },

            relatedValueChanged(event, field_name) {
                for (let item in this.template_fields) {
                    let template_field = this.template_fields[item];
                    if (template_field && template_field.request_depends_on) {
                        for (let depends_on_item in template_field.request_depends_on['fields']) {
                            let field_data = template_field.request_depends_on['fields'][depends_on_item];
                            
                            if (field_data['field_name'] == field_name) {
                                // Clear the related objects, because now the choice might be not valid and rerender form
                                this.user_form_data[template_field.name] = null;
                                this.choices[template_field.name] = [];
                                this.row_key = this.$clib.uuidv4();

                                // CHeck if all required fields are filled the perform the request
                                if (this.checkRequestRequirements(template_field.request_depends_on)) {
                                    this.loadChoices(template_field.request_url + '&' + this.formRelatedRequestQueryUrl(template_field.request_depends_on), template_field.name);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</script>