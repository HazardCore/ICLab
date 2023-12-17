<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;">
          <v-row>
            <v-col id="secondary_tabs_row" cols="12" md="9" order-sm="3" order-md="1" class="pb-10 container-side-padding">
            <v-btn-toggle
                v-model="toggle_position"
                borderless
                style="display: inherit;"
                active-class="diia-secondary-tab-active"
                mandatory
                v-if="!interface_archieved"
            >
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInterfaceDetail"
                    id="secondary_tab_detail"
                    :ripple="false"
                >
                    <span>Деталі</span>
                </v-btn>
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayWebserviceEdit"
                    id="secondary_tab_edit"
                    :ripple="false"
                >
                    <span>Редагувати інтерфейс е-ресурсу</span>
                </v-btn>
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInterfaceArchieve"
                    v-if="!interface_archieved"
                    id="secondary_tab_archieve"
                >
                    <span>Архівувати (видалити) інтерфейс</span>
                </v-btn>
                <!-- <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInterfaceUnarchieve"
                    v-if="interface_archieved"
                    id="secondary_tab_unarchieve"
                >
                    <span>Деархівувати інтерфейс</span>
                </v-btn> -->
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInterfaceDepublish"
                    v-if="interface_published"
                    id="secondary_tab_depublish"
                >
                    <span>Зняти з публікації</span>
                </v-btn>
                <v-btn
                    class="diia-secondary-tab mt-10 mr-5"
                    elevation="0"
                    @click="displayInterfacePublish"
                    v-if="!interface_published"
                    id="secondary_tab_publish"
                >
                    <span>Опублікувати інтерфейс</span>
                </v-btn>
            </v-btn-toggle>
            <InterfaceForm @on-interface-request="onInterfaceRequest" @on-error-message-show="onErrorMessageShow" @on-success-submit="onSuccessSubmit" v-bind:selected_submenu_item="selected_submenu_item" v-show="selected_submenu_item == 'viewinterface' || selected_submenu_item == 'editinterface'"/>
            <v-container class="mt-10" v-if="selected_submenu_item == 'archieveinterface' || selected_submenu_item == 'unarchieveinterface' || selected_submenu_item == 'publishinterface' || selected_submenu_item == 'depublishinterface'">
                <v-row>
                    <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'archieveinterface'">Архівування (видалення) інтерфейсу е-ресурсу</h3>
                    <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'unarchieveinterface'">Деархівування інтерфейсу е-ресурсу</h3>
                    <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'depublishinterface'">Зняття з публікації інтерфейсу е-ресурсу</h3>
                    <h3 class="mb-10 diia-h3-header" v-if="selected_submenu_item == 'publishinterface'">Публікація інтерфейсу е-ресурсу</h3>
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
                        @click="submitCrudInformationResourceInterfaceApplication"
                    >
                    Подати заявку
                    </v-btn>
                </v-row>
            </v-container>
            
            </v-col>
            <v-col cols="12" md="3" order-sm="1" order-md="3" style="background-color: rgb(243 243 243);" class="d-none d-sm-none d-md-block">
              <v-expansion-panels multiple class="side-help-menu-expansion-panels mt-10">
                    <v-expansion-panel class="side-help-menu-expansion-panel" v-for="item in $config.INTERFACE_DETAIL_HELP[selected_submenu_item]" v-bind:key="item.title">
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
import InterfaceForm from "./InterfaceForm";
export default {
  name: "InterfaceDetail",
  components: {
    InterfaceForm,
  },
  data: () => ({
    selected_submenu_item: 'viewinterface',

    crud_reason: '',

    interface_archieved: false,
    interface_published: false,

    overlay: false,
    overlay_text: 'Зачекайте будь ласка',

    toggle_position: 0,
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
  },

  watch: {
      $route(to, from) {
          if (to.name == 'interface-detail') {
            this.selected_submenu_item = 'viewinterface';
            this.toggle_position = 0;
            this.crud_reason = '';
            this.overlay = false;
            this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_detail");
          }
      }
  },

  methods: {
    submitCrudInformationResourceInterfaceApplication() {
        if (!this.crud_reason) {
            this.$emit('on-error-message-show', 'Необхідно заповнити обов\'язкові поля');
            return false
        }

        let app_type = '';
        let success_text = '';

        if (this.selected_submenu_item == 'archieveinterface') {
            app_type = "ARCHIVE";
            success_text = this.$config.TRANSLATION.INTERFACE.SUCCESS.ARCHIVE;
        } else if (this.selected_submenu_item == 'unarchieveinterface') {
            app_type = "UNARCHIVE";
            success_text = this.$config.TRANSLATION.INTERFACE.SUCCESS.UNARCHIVE;
        } else if (this.selected_submenu_item == 'publishinterface') {
            app_type = "PUBLISH";
            success_text = this.$config.TRANSLATION.INTERFACE.SUCCESS.PUBLISH;
        } else if (this.selected_submenu_item == 'depublishinterface') {
            app_type = "DEPUBLISH";
            success_text = this.$config.TRANSLATION.INTERFACE.SUCCESS.DEPUBLISH;
        }

        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.INTERFACE.LOADING.SEND_APPLICATION;
        this.axios({
            method: "post",
            url: this.$config.backend_url + "/api/v1/internal/interface_application/crud",
            data: {
                'application_type': app_type,
                'interface': this.$route.params.id,
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

    onInterfaceRequest(interface_archieved, interface_published) {
        this.interface_archieved = interface_archieved;
        this.interface_published = interface_published;
    },

    onErrorMessageShow(message) {
        this.$emit('on-error-message-show', message);
    },
    onSuccessSubmit(message) {
        this.$emit('on-info-message-show', message);
        this.$router.push({name: 'interface-applications-list', params: {'update_apps': true}});
    },

    displayInterfaceDetail() {
        this.selected_submenu_item = 'viewinterface';
        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_detail");
    },
    displayWebserviceEdit() {
        this.selected_submenu_item = 'editinterface';
        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_edit");
    },
    displayInterfaceArchieve(event) {
        this.selected_submenu_item = 'archieveinterface';
        this.crud_label = 'Причина/Підстава для видалення інтерфейсу е-ресурсу';

        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_archieve");
    },
    // displayInterfaceUnarchieve(event) {
    //     this.selected_submenu_item = 'unarchieveinterface';
    //     this.crud_label = 'Причина/Підстава для деархівування інтерфейсу е-ресурсу';
        
    //     this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_unarchieve");
    // },
    displayInterfacePublish(event) {
        this.selected_submenu_item = 'publishinterface';
        this.crud_label = 'Причина/Підстава для публікації інтерфейсу е-ресурсу';
        
        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_publish");
    },
    displayInterfaceDepublish(event) {
        this.selected_submenu_item = 'depublishinterface';
        this.crud_label = 'Причина/Підстава для зняття з публікації інтерфейсу е-ресурсу';
        
        this.$clib.toggleSecondaryTabActiveClass("secondary_tabs_row", "secondary_tab_depublish");
    },
  }
}
</script>