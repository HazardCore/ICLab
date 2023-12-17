<template>
    <v-card elevation="0" class="mb-10">
        <v-container style="max-width: 1680px;" class="container-side-padding">
          <v-row>
            <v-col cols="12" md="12" order-sm="3" order-md="1">

            <template>
                <v-row>
                    <v-text-field
                        v-model="intf_app_list_search"
                        class="pl-3 pr-3 mt-15 v-colored-search"
                        label="Пошук по заявкам"
                        append-icon="mdi-magnify"
                        single-line
                    >
                    </v-text-field>
                </v-row>
                <v-data-table
                    locale="uk-UA"
                    :headers="intf_app_list_headers"
                    :items="intf_app_list"
                    :items-per-page="10"
                    :footer-props="{'items-per-page-options':[4, 10, 25, 50]}"
                    mobile-breakpoint="1"
                    :loading="intf_app_list_loading"
                    loading-text="Виконується запит..."
                    @click:row="onClickInterfaceApplicationSelect"
                    class="elevation-0 pa-0 data-table-design mt-10"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                >
                    <template v-slot:item.status="{ item }">
                        <span v-if="item.status == 'Потребує погодження'" class="diia-list-badge-primary">{{ item.status }}</span>
                        <span v-else-if="item.status == 'Подана на виконання'" class="diia-list-badge-warning">{{ item.status }}</span>
                        <span v-else-if="item.status == 'Виконана'" class="diia-list-badge-success">{{ item.status }}</span>
                        <span v-else-if="item.status == 'Відхилена'" class="diia-list-badge-error">{{ item.status }}</span>
                        <span v-else-if="item.status == 'Скасована'" class="diia-list-badge-secondary">{{ item.status }}</span>
                        <span v-else class="diia-list-badge-secondary">{{ item.status }}</span>
                    </template>
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
  name: "InterfaceApplicationsList",
  components: {},
  data: () => ({
    sortBy: 'id',
    sortDesc: true,

    addData: {},

    instance_filter: '',

    intf_app_list_data: [],
    intf_app_list_search: '',
    intf_app_list_loading: false,
    intf_app_list_headers: [
        {
            text: '№',
            value: 'id',
            align: 'start',
            class: 'data-table-header',
            width: '50px'
        },
        { 
            text: 'Назва інтерфейсу е-ресурсу', 
            value: 'name', 
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Тип заявки',
            value: 'application_type',
            align: 'start',
            class: 'data-table-header',
            width: '220px'
        },
        { 
            text: 'Статус',
            value: 'status',
            align: 'start',
            class: 'data-table-header',
            width: '200px'
        }
    ],

    on_approval_count: 0,

  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestInterfaceApplicationList();
  },

  watch: {
      $route(to, from) {
        if (to.name == 'interface-applications-list' && this.$route.params && this.$route.params.update_apps) {
            this.requestInterfaceApplicationList();
        }
      }
  },

  computed: {
    intf_app_list: function() {
      return this.$clib.imprecizeComparison(
          this.intf_app_list_search, 
          this.intf_app_list_data, 
          ["id", "status", "application_type", "class"]);
    },
  },

  methods: {

    onClickInterfaceApplicationSelect(val) {
        this.$router.push({name: 'interface-application-detail', params: {'id': val.id}});
    },

    requestInterfaceApplicationList() {
        this.on_approval_count = 0;
        this.intf_app_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/interface_application",
        })
        .then((response) => {
            this.intf_app_list_data = [];
            for (let item in response.data) {
                if (response.data[item].status == 'Потребує погодження') {
                    this.on_approval_count += 1;
                }

                this.intf_app_list_data.push({
                    "id": response.data[item].id,
                    "name": response.data[item].name,
                    "status": response.data[item].status,
                    "application_type": response.data[item].application_type,
                    "class": 'data-table-header'
                })
            }

            if (this.$config.user_data.access && this.$config.user_data.access.p == 'ADMIN') {
                sessionStorage.setItem('information_resource_interface_application_approve', this.on_approval_count);
                this.$emit('on-counter-update');
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.intf_app_list_loading = false;
        });
      },
  }
}
</script>