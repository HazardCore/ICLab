<template>
    <v-card elevation="0" class="mb-10">
        <v-container style="max-width: 1680px;" class="container-side-padding">
          <v-row>
            <a id="downloader" href="#" style="display: none;">efwe</a>
            <v-col cols="12" md="12" order-sm="3" order-md="1">
            <v-row>
                <v-text-field
                    v-model="manuals_list_search"
                    class="pl-3 pr-3 mt-15 v-colored-search"
                    label="Пошук по матеріалам"
                    append-icon="mdi-magnify"
                    single-line
                >
                </v-text-field>
            </v-row>
            <v-data-table
                locale="uk-UA"
                :headers="manuals_list_headers"
                :items="manuals_list"
                :items-per-page="10"
                :footer-props="{'items-per-page-options':[4, 10, 25, 50]}"
                mobile-breakpoint="1"
                :loading="manuals_list_loading"
                loading-text="Виконується запит..."
                class="elevation-0 pa-0 data-table-design mt-10"
            >
                <template v-slot:item.unique_uuid="{ item }">
                    <v-icon @click="requestManual(item.unique_uuid, item.file)" color="black">mdi-download</v-icon>
                </template>
            </v-data-table>
            </v-col>
          </v-row>
          </v-container>
          </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "MaterialsList",
  components: {},
  data: () => ({
    manuals_list_data: [],
    manuals_list_search: "",
    manuals_list_loading: false,
    manuals_list_headers: [
        {
            text: 'Назва документу',
            value: 'title',
            align: 'start',
            class: 'data-table-header',
        },
        {
            text: 'Дата оновлення',
            value: 'updated_at',
            align: 'start',
            class: 'data-table-header',
            width: '300px',
        },
        {
            text: 'Дії',
            value: 'unique_uuid',
            align: 'start',
            class: 'data-table-header',
            width: "50px"
        },
    ],
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestManualsList();
  },

  watch: {
      $route(to, from) {}
  },

  computed: {
    manuals_list: function() {
      return this.$clib.imprecizeComparison(
          this.manuals_list_search, 
          this.manuals_list_data, 
          ["main_file", "class"]);
    },
  },

  methods: {
    requestManualsList() {
        this.manuals_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/documents/internal/manuals",
        })
        .then((response) => {
            this.manuals_list_data = []
            for (let item in response.data) {
                this.manuals_list_data.push({
                    "unique_uuid": response.data[item].unique_uuid,
                    "file": response.data[item].file,
                    "title": response.data[item].title,
                    "updated_at": this.$clib.formatDateTimeWithMonthText(response.data[item].updated_at),
                })
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.manuals_list_loading = false;
        });
    },

    requestManual(uuid, name) {
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/manuals/" + uuid,
            responseType: 'blob', // Important
        })
        .then((response) => {
            let blob = new Blob([response.data], { type: "application/octet-stream" });
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = name.split('/').slice(-1);
            link.click()
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
        });
    },
  }
}
</script>

