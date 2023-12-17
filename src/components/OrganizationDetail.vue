<template>
    <v-card fluid elevation="0">
        <v-container style="max-width: 1680px;">
          <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
          <v-row class="mb-10">
            <v-col cols="12" md="9" order="3" order-sm="3" order-md="1" class="container-side-padding">
              <h3 class="mb-10 mt-10 diia-h3-header">Деталі організації</h3>
              <v-data-table
                  dense
                  locale="uk-UA"
                  :headers="detail_headers"
                  :items="detail_data"
                  disable-pagination
                  disable-sort
                  disable-filtering
                  hide-default-footer
                  hide-default-header
                  :loading="detail_loading"
                  mobile-breakpoint="1"
                  class="elevation-0 pa-0 data-table-detail-design fifty-table"
              >
                <template v-slot:item.value="{ item }">
                    <a v-if="item.route_type == 'FILE' && item.value" :href="$config.backend_url + item.value" style="view-href-a">Завантажити</a>
                    <span v-if="item.route_type == 'FILE' && !item.value"></span>
                    <span v-if="item.route_type != 'FILE'">{{ item.value }}</span>
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
  name: "OrganizationDetail",
  components: {},
  data: () => ({
    overlay: false,
    overlay_text: 'Зачекайте будь ласка',
    detail_headers: [
        {
        align: 'start',
        value: 'field',
        class: 'data-table-header fifty-width',
      },
      {
        align: 'start',
        value: 'value', 
        class: 'data-table-header fifty-width',
      },
    ],
    detail_data: [],
    detail_loading: false,
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';

    this.requestOrganizationDetail();
  },
  methods: {
    requestOrganizationDetail() {
        this.overlay = true;
        this.overlay_text = this.$config.TRANSLATION.ORGANIZATION_DETAIL.LOADING.LOAD_DETAIL;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/organization_detail/",
        })
        .then((response) => {
            this.detail_data = [];
            for (let item in response.data) {
                this.user_detail = response.data;

                let route_type = ""
                let id = ""
                let field = ""
                let value = response.data[item]

                if (item == "name")
                    field = "Назва";
                if (item == "short_name")
                    field = "Коротка назва";
                if (item == "name_eng")
                    field = "Назва англійською";
                if (item == "short_name_eng")
                    field = "Коротка назва англійською";
                if (item == "agreement_full_name")
                    field = "Тип документу на підключення";
                if (item == "agreement_url") {
                    field = "Угода/Повідомлення-приєднання на підключення до СЕВДЕІР";
                    route_type = "FILE";
                }
                if (item == "org_type")
                    field = "Центальний/Місцевий";
                if (item == "org_executive_authority_type")
                    field = "Тип виконавчого органу";
                if (item == "address_full")
                    field = "Юридична адреса";
                
                if (item != "id")
                    this.detail_data.push({
                        "field": field,
                        "value": value,
                        "route_type": route_type,
                        "id": id
                    })
            }
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