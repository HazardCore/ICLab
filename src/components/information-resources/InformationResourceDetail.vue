<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;">
          <v-row>
            <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
            <v-col id="secondary_tabs_row" cols="12" md="9" order-sm="3" order-md="1" class="pb-10 container-side-padding">
            <v-btn-toggle
                v-model="toggle_position"
                borderless
                active-class="diia-secondary-tab-active"
                style="display: inherit;"
                mandatory
                v-if="!operator_readonly && !irs_archieved"
            >
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInformationResourceDetail"
                    :ripple="false"
                    id="secondary_tab_detail"
                >
                    <span>Деталі</span>
                </v-btn>
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInformationResourceEdit"
                    :ripple="false"
                    id="secondary_tab_edit"
                >
                    <span>Редагувати е-ресурс</span>
                </v-btn>
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInformationResourceAddOperator"
                    :ripple="false"
                    id="secondary_tab_addop"
                >
                    <span>Визначення операторів</span>
                </v-btn>
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInformationResourceDeleteOperator"
                    :ripple="false"
                    v-if="has_operators"
                    id="secondary_tab_deleteop"
                >
                    <span>Припинення повноважень операторів</span>
                </v-btn>
                <!-- <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInformationResourceArchieve"
                    :ripple="false"
                    v-if="!irs_archieved"
                    id="secondary_tab_archieve"
                >
                    <span>Архівувати (видалити) е-ресурс</span>
                </v-btn>
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInformationResourceUnarchieve"
                    :ripple="false"
                    v-if="irs_archieved"
                    id="secondary_tab_unarchieve"
                >
                    <span>Деархівувати е-ресурс</span>
                </v-btn> -->
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInformationResourceDepublish"
                    :ripple="false"
                    v-if="irs_published"
                    id="secondary_tab_depublish"
                >
                    <span>Зняти з публікації</span>
                </v-btn>
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInformationResourcePublish"
                    :ripple="false"
                    v-if="!irs_published"
                    id="secondary_tab_publish"
                >
                    <span>Опублікувати е-ресурс</span>
                </v-btn>
            </v-btn-toggle>
            <InformationResourceForm @on-irs-request="onInformationResourceRequest" @on-error-message-show="onErrorMessageShow" @on-success-submit="onSuccessSubmit" v-bind:eresource_detail_data="eresource_detail_data" v-bind:operators_list="operators_list" v-bind:selected_submenu_item="selected_submenu_item" v-show="selected_submenu_item == 'viewirs' || selected_submenu_item == 'editirs'"/>
            <v-container class="mt-10" v-if="selected_submenu_item == 'archieveirs' || selected_submenu_item == 'unarchieveirs' || selected_submenu_item == 'publishirs' || selected_submenu_item == 'depublishirs'">
                <v-row>
                    <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'archieveirs'">Архівування (видалення) е-ресурсу</h3>
                    <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'unarchieveirs'">Деархівування е-ресурсу</h3>
                    <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'depublishirs'">Зняття з публікації е-ресурсу</h3>
                    <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'publishirs'">Публікація е-ресурсу</h3>
                </v-row>
                <v-row>
                    <v-text-field dense required class="mt-5 diia-v-input"
                        :rules="[v => !!v || 'Обовязково до заповнення']"
                        v-model="crud_reason"
                        :label="crud_label"
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-btn
                        class="diia-button-style-3 mt-10"
                        elevation="0"
                        @click="submitCrudInformationResourceApplication"
                    >
                    Подати заявку
                    </v-btn>
                </v-row>
            </v-container>
            <InformationResourceOperatorAddForm @on-irs-request="onInformationResourceRequest" @on-error-message-show="onErrorMessageShow" @on-success-submit="onSuccessSubmit" v-bind:eresource_detail_data="eresource_detail_data" v-bind:operators_list="operators_list" v-bind:selected_submenu_item="selected_submenu_item" v-show="selected_submenu_item == 'addoperator'"/>
            <InformationResourceOperatorDeleteForm @on-irs-request="onInformationResourceRequest" @on-error-message-show="onErrorMessageShow" @on-success-submit="onSuccessSubmit" v-bind:eresource_detail_data="eresource_detail_data" v-bind:selected_submenu_item="selected_submenu_item" v-show="selected_submenu_item == 'deleteoperator'"/>
            </v-col>
            <v-col cols="12" md="3" order-sm="1" order-md="3" style="background-color: rgb(243 243 243);" class="d-none d-sm-none d-md-block">
              <v-expansion-panels multiple class="side-help-menu-expansion-panels mt-10 mb-10">
                    <v-expansion-panel class="side-help-menu-expansion-panel" v-for="item in $config.INFORMATION_RESOURCE_DETAIL_HELP[selected_submenu_item]" v-bind:key="item.title">
                        <v-expansion-panel-header class="side-help-menu-expansion-panel-header">
                            <div v-html="item.title">{{ item.title }}</div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content class="side-help-menu-expansion-panel-content" :key="item.title + 'keys'">
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
import InformationResourceForm from "./InformationResourceForm";
import InformationResourceOperatorAddForm from "./InformationResourceOperatorAddForm";
import InformationResourceOperatorDeleteForm from "./InformationResourceOperatorDeleteForm";
export default {
  name: "InformationResourceDetail",
  components: {
    InformationResourceForm,
    InformationResourceOperatorAddForm,
    InformationResourceOperatorDeleteForm,
  },
  data: () => ({
    selected_submenu_item: 'viewirs',
    crud_reason: '',
    crud_label: '',
    irs_archieved: false,
    irs_published: false,
    has_operators: false,
    operator_readonly: false,
    eresource_detail_data: null,

    toggle_position: 0,

    operators_list: [],
    own_operators_list: [],

    overlay: false,
    overlay_text: 'Зачекайте будь-ласка',
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.fetchOperatorsList();
    this.requestInformationResourceDetail();
  },

  watch: {
      $route(to, from) {
          if (to.name == 'information-resource-detail') {
            this.operators_list = [];
            this.own_operators_list = [];
            this.eresource_detail_data = null;
            this.selected_submenu_item = 'viewirs';
            this.toggle_position = 0;
            this.crud_reason = '';
            this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_detail");
            this.fetchOperatorsList();
            this.requestInformationResourceDetail();
          }
      }
  },

  methods: {
    submitCrudInformationResourceApplication() {
        if (!this.crud_reason) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля');
            return false
        }

        let app_type = '';
        let success_text = '';

        // if (this.selected_submenu_item == 'archieveirs') {
        //     app_type = "ARCHIVE";
        //     success_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.ARCHIVE;
        // } else if (this.selected_submenu_item == 'unarchieveirs') {
        //     app_type = "UNARCHIVE";
        //     success_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.UNARCHIVE;
        if (this.selected_submenu_item == 'publishirs') {
            app_type = "PUBLISH";
            success_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.PUBLISH;
        } else if (this.selected_submenu_item == 'depublishirs') {
            app_type = "DEPUBLISH";
            success_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.SUCCESS.DEPUBLISH;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.SEND_APPLICATION;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/information_resource_application/crud",
            data: {
                'application_type': app_type,
                'information_eresource': this.$route.params.id,
                'submitter_crud_reason': this.crud_reason,
            }
        })
        .then((response) => {
            this.onSuccessSubmit(success_text);
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
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

    requestInformationResourceDetail() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INFORMATION_RESOURCE.LOADING.LOAD_DETAIL;

        return this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/" + this.$route.params.id,
        })
        .then((response) => {
            this.eresource_detail_data = response.data;
            this.irs_archieved = response.data.is_deleted;
            this.irs_published = response.data.published;
            this.has_operators = response.data.operators.length > 0;
            this.operator_readonly = response.data.operator_readonly;
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.overlay = false;
        });
    },

    onErrorMessageShow(message) {
        this.$emit('on-error-message-show', message);
    },

    onSuccessSubmit(message) {
        this.$emit('on-info-message-show', message);
        this.$router.push({name: 'information-resource-applications-list', params: {'update_apps': true}});
    },

    onInformationResourceRequest(irs_archieved, irs_published, has_operators, operator_readonly) {
        this.irs_archieved = irs_archieved;
        this.irs_published = irs_published;
        this.has_operators = has_operators;
        this.operator_readonly = operator_readonly;
    },

    displayInformationResourceDetail(event) {
        this.selected_submenu_item = 'viewirs';

        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_detail");
    },
    displayInformationResourceEdit(event) {
        this.selected_submenu_item = 'editirs';

        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_edit");
    },
    // displayInformationResourceArchieve(event) {
    //     this.selected_submenu_item = 'archieveirs';
    //     this.crud_label = 'Причина/Підстава для видалення інформаційного е-ресурсу';

    //     this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_archieve");
    // },
    // displayInformationResourceUnarchieve(event) {
    //     this.selected_submenu_item = 'unarchieveirs';
    //     this.crud_label = 'Причина/Підстава для деархівування е-ресурсу';
        
    //     this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_unarchieve");
    // },
    displayInformationResourcePublish(event) {
        this.selected_submenu_item = 'publishirs';
        this.crud_label = 'Причина/Підстава для публікації е-ресурсу';
        
        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_publish");
    },
    displayInformationResourceDepublish(event) {
        this.selected_submenu_item = 'depublishirs';
        this.crud_label = 'Причина/Підстава для зняття з публікації е-ресурсу';
        
        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_depublish");
    },
    displayInformationResourceAddOperator(event) {
        this.selected_submenu_item = 'addoperator';
        
        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_addop");
    },
    displayInformationResourceDeleteOperator(event) {
        this.selected_submenu_item = 'deleteoperator';
        
        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_deleteop");
    },

  }
}
</script>