<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;" v-if="selected_submenu_item == 'addirs'">
            <v-row>
                <v-col cols="12" md="9" order-sm="3" order-md="1" class="container-side-padding">
                    <InformationResourceForm selected_submenu_item="createirs" @on-error-message-show="onErrorMessageShow" @on-success-submit="onSuccessSubmit"/>
                </v-col>
                <v-col cols="12" md="3" order-sm="1" order-md="3" style="background-color: rgb(243 243 243);" class="d-none d-sm-none d-md-block">
                    <v-expansion-panels multiple class="side-help-menu-expansion-panels mt-10">
                        <v-expansion-panel class="side-help-menu-expansion-panel" v-for="item in $config.INFORMATION_RESOURCE_DETAIL_HELP['createirs']" v-bind:key="item.title">
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
        <v-container style="max-width: 1680px;" class="container-side-padding mb-10" v-if="selected_submenu_item == 'irslist'">
            <v-row>
                <v-col cols="12" md="12" order-sm="3" order-md="1">
                    <v-row>
                        <v-text-field
                            v-model="irs_list_search"
                            class="pl-3 pr-3 mt-15 v-colored-search"
                            label="Пошук е-ресурсів"
                            append-icon="mdi-magnify"
                            single-line
                        >
                        </v-text-field>
                        <v-spacer></v-spacer>
                        <v-btn
                            class="diia-button-style-create mt-15 mr-3"
                            elevation="0"
                            @click="displayNewInformationResource"
                        >
                            <v-icon class="mr-2">mdi-plus</v-icon>
                            <span>Приєднати е-ресурс</span>
                        </v-btn>
                    </v-row>
                    <v-data-table
                        locale="uk-UA"
                        :headers="irs_list_headers"
                        :items="irs_list"
                        :items-per-page="10"
                        :footer-props="{'items-per-page-options':[4, 10, 25, 50]}"
                        mobile-breakpoint="1"
                        @click:row="onClickInformationResourceSelect"
                        :loading="irs_list_loading"
                        loading-text="Виконується запит..."
                        class="elevation-0 pa-0 data-table-design mt-10"
                    >
                        <template v-slot:item.published="{ item }">
                            <v-chip v-if="!item.has_subsystems">Підсистеми відсутні</v-chip>
                            <v-chip v-else-if="item.published">Опублікований</v-chip>
                            <v-chip v-else>Не опублікований</v-chip>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
/* eslint-disable */
import InformationResourceForm from "./InformationResourceForm";
export default {
  name: "InformationResourcesList",
  components: {
      InformationResourceForm,
  },
  data: () => ({
    selected_submenu_item: 'irslist',
    sortBy: 'id',
    sortDesc: true,

    addData: {},

    irs_list_data: [],
    irs_list_search: "",
    irs_list_loading: false,
    irs_list_headers: [
        {
            text: 'Реєстраційний № (НРЕІР)',
            value: 'nreir_identifier',
            align: 'start',
            class: 'data-table-header',
            width: "150px",
        },
        {
            text: 'Назва е-ресурсу',
            value: 'name',
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Роль', 
            value: 'role', 
            align: 'start',
            class: 'data-table-header',
            width: "200px",
        },
        { 
            text: 'Статус публікації', 
            value: 'published', 
            align: 'start',
            class: 'data-table-header',
            width: "200px",
        },
        { 
            text: 'Статус активності', 
            value: 'is_deleted', 
            align: 'start',
            class: 'data-table-header',
            width: "160px",
        },
    ],
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestInformationResourceList();

    if (this.$route.name == 'new-information-resource') {
        this.selected_submenu_item = 'addirs';
    }
  },

  watch: {
      $route(to, from) {
        if (to.name == 'information-resources-list') {
            this.selected_submenu_item = 'irslist';
        }
        if (to.name == 'new-information-resource') {
            this.selected_submenu_item = 'addirs';
        }
      }
  },

  computed: {
    irs_list: function() {
      return this.$clib.imprecizeComparison(
          this.irs_list_search,
          this.irs_list_data,
          ["id", "published", "class"]);
    },
  },

  methods: {
      onClickInformationResourceSelect(val) {
        this.$router.push({name: 'information-resource-detail', params: {'id': val.id}});
      },

      onErrorMessageShow(message) {
          this.$emit('on-error-message-show', message);
      },
      onSuccessSubmit(message) {
          this.$emit('on-info-message-show', message);
          this.$router.push({name: 'information-resource-applications-list', params: {'update_apps': true}});
      },

      displayNewInformationResource() {
          this.selected_submenu_item = 'addirs';
          this.$router.push({name: 'new-information-resource'});
      },

      requestInformationResourceList() {
        this.irs_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/information_resource/",
        })
        .then((response) => {
            this.irs_list_data = [];
            for (let item in response.data) {
                this.irs_list_data.push({
                    "id": response.data[item].id,
                    "name": response.data[item].name,
                    "has_subsystems": response.data[item].has_subsystems,
                    "nreir_identifier": response.data[item].nreir_identifier,
                    "role": response.data[item].role,
                    "published": response.data[item].published,
                    "is_deleted": response.data[item].is_deleted,
                    "class": 'data-table-header'
                })
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.irs_list_loading = false;
        });
      },
  }
}
</script>