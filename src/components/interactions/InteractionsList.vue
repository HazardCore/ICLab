<template>
    <v-card elevation="0">
        <!-- <v-container style="max-width: 1680px;" v-if="selected_submenu_item == 'addinterface'">
            <v-row>
                <v-col cols="12" md="9" order-sm="3" order-md="1" class="container-side-padding">
                    <InterfaceForm selected_submenu_item="addinterface" @on-error-message-show="onErrorMessageShow" @on-success-submit="onSuccessSubmit" v-if="selected_submenu_item == 'addinterface'"/>
                </v-col>
                <v-col cols="12" md="3" order-sm="1" order-md="3" style="background-color: rgb(243 243 243);" class="d-none d-sm-none d-md-block">
                    <v-expansion-panels multiple class="side-help-menu-expansion-panels mt-10">
                        <v-expansion-panel class="side-help-menu-expansion-panel" v-for="item in $config.INTERFACE_DETAIL_HELP" v-bind:key="item.title">
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
        </v-container> -->
        <v-container style="max-width: 1680px;" class="container-side-padding mb-10" v-if="selected_submenu_item == 'interfaceslist'">
            <v-row>
                <v-col cols="12" md="12" order-sm="3" order-md="1">
                    <template v-if="selected_submenu_item == 'interfaceslist'">
                        <v-row class="justify-space-between">
                            <v-text-field
                                v-model="interactions_list_search"
                                class="pl-3 pr-3 mt-15 v-colored-search"
                                label="Пошук взаємодій"
                                append-icon="mdi-magnify"
                                single-line
                            >
                            </v-text-field>
                            <!-- <v-btn
                                class="diia-button-style-create mt-15 mr-3"
                                elevation="0"
                                @click="displayNewWebservice"
                            >
                                <v-icon class="mr-2">mdi-plus</v-icon>
                                <span>Створити інтрефейс е-ресурсу</span>
                            </v-btn> -->
                        </v-row>
                        <v-data-table
                            locale="uk-UA"
                            :headers="interactions_list_headers"
                            :items="interactions_list"
                            :items-per-page="10"
                            :footer-props="{'items-per-page-options':[4, 10, 25, 50]}"
                            mobile-breakpoint="1"
                            @click:row="onClickWebserviceSelect"
                            :loading="interactions_list_loading"
                            loading-text="Виконується запит..."
                            class="elevation-0 pa-0 data-table-design mt-10"
                        >           
                            <!-- <template v-slot:item.published="{ item }">
                                <v-chip v-if="item.published">Опублікований</v-chip>
                                <v-chip v-else>Не опублікований</v-chip>
                            </template>      -->
                        </v-data-table>
                    </template>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "InteractionsList",
  components: {
  },
  data: () => ({
    selected_submenu_item: 'interfaceslist',

    interactions_list_data: [],
    interactions_list_search: "",
    interactions_list_loading: false,
    interactions_list_headers: [
        {
            text: 'Назва організації (вебклієнт)',
            align: 'start',
            value: 'consumer_organization__name',
            class: 'data-table-header',
        },
        {
            text: 'Код ЄДРПОУ (вебклієнт)',
            align: 'start',
            value: 'consumer_organization__member_code',
            class: 'data-table-header',
        },
        {
            text: 'Е-ресурс (вебклієнт)',
            align: 'start',
            value: 'consumer_information_resource__name',
            class: 'data-table-header',
        },
        {
            text: 'Назва організації (вебсервіс)',
            align: 'start',
            value: 'producer_organization__name',
            class: 'data-table-header',
        },
        {
            text: 'Код ЄДРПОУ (вебсервіс)',
            align: 'start',
            value: 'producer_organization__member_code',
            class: 'data-table-header',
        },
        { 
            text: 'Е-ресурс (вебсервіс)', 
            value: 'producer_information_resource__name', 
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Інтерфейс е-ресурсу (вебсервіс)', 
            value: 'producer_interface__name', 
            align: 'start',
            class: 'data-table-header',
        },
        {
            text: 'Статус', 
            value: 'is_deleted', 
            align: 'start',
            class: 'data-table-header data-table-date-col-width',
        },
    ],
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestInterfaceList();

    if (this.$route.name == 'new-interface') {
        this.selected_submenu_item = 'addinterface';
    }
  },

  watch: {
      $route(to, from) {
        if (to.name == 'interfaces-list') {
            this.selected_submenu_item = 'interfaceslist';
        }
        if (to.name == 'new-interface') {
            this.selected_submenu_item = 'addinterface';
        }
      }
  },

  computed: {
    interactions_list: function() {
      return this.$clib.imprecizeComparison(
          this.interactions_list_search, 
          this.interactions_list_data, 
          ["id", "published", "description", "information_resource", "published", "class"]);
    },
  },

  methods: {
    onErrorMessageShow(message) {
        this.$emit('on-error-message-show', message);
    },
    onSuccessSubmit(message) {
        this.$emit('on-info-message-show', message);
        this.$router.push({name: 'interface-applications-list', params: {'update_apps': true}});
    },

    onClickWebserviceSelect(val) {
        this.$router.push({name: 'interaction-detail', params: {'id': val.id}});
    },

    displayWebserviceList() {
        this.selected_submenu_item = 'interfaceslist';
    },
    displayNewWebservice() {
        this.selected_submenu_item = 'addinterface';
        this.$router.push({name: 'new-interface'});
    },

    requestInterfaceList() {
        this.interactions_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/interaction/",
        })
        .then((response) => {
            this.interactions_list_data = [];
            for (let item in response.data) {
                response.data[item].is_deleted = response.data[item].is_deleted ? 'В архіві' : 'Активний(-на)';
                this.interactions_list_data.push(response.data[item]);
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.interactions_list_loading = false;
        });
    },
  }
}
</script>

















