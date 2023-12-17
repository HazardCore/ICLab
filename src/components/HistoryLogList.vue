<template>
    <v-card elevation="0" class="mb-10">
        <v-container style="max-width: 1680px;" class="container-side-padding">
          <v-row>
            <v-col cols="12" md="12" order-sm="3" order-md="1">
            <v-row>
                <v-text-field
                    v-model="history_list_search"
                    class="pl-3 pr-3 mt-15 v-colored-search"
                    label="Пошук по історії"
                    append-icon="mdi-magnify"
                    single-line
                >
                </v-text-field>
                <v-select
                    v-model="event_group_filter"
                    class="pl-3 pr-3 mt-15 v-colored-search"
                    label="За типом події"
                    :items="event_group_list"
                    item-text="text" item-value="value"
                    single-line
                    clearable
                    hide-no-data hide-selected
                    :loading="event_group_list_loading"
                >
                </v-select>
            </v-row>
            <template>
                <v-data-table
                    locale="uk-UA"
                    :headers="history_list_headers"
                    :items="history_list"
                    :items-per-page="10"
                    :footer-props="{'items-per-page-options':[4, 10, 25, 50]}"
                    mobile-breakpoint="1"
                    :loading="history_list_loading"
                    loading-text="Виконується запит..."
                    class="elevation-0 pa-0 data-table-design mt-10"
                >
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
  name: "HistoryLogList",
  components: {},
  data: () => ({
    history_list_search: '',
    history_list_loading: false,
    history_list_headers: [
        {
            text: 'Користувач',
            value: 'actor',
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Подія', 
            value: 'event_type', 
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Об\'єкт',
            value: 'object_repr',
            align: 'start',
            class: 'data-table-header',
        },
        { 
            text: 'Дата та час',
            value: 'timestamp',
            align: 'start',
            class: 'data-table-header',
        },
    ],
    history_list_data: [],
    event_group_list: [],
    event_group_list_loading: false,
    event_group_filter: null,
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestHistory();
    this.fetchEventGroupFilterValues();
  },

  computed: {
    history_list: function() {
      let logs = this.$clib.imprecizeComparison(
          this.history_list_search, 
          this.history_list_data, 
          ["timestamp"]);

        if (this.event_group_filter) {
            let result_array = [];
            for (let log in logs) {
                if (this.event_group_filter == logs[log].event_group)
                    result_array.push(logs[log]);
            }
            logs = result_array;
        }

        return logs;
    },
  },

  methods: {
    requestHistory() {
        this.history_list_loading = true;
        this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/account/internal/profiles/permissions/history",
        })
        .then((response) => {
            this.history_list_data = [];
            for (let item in response.data) {
                this.history_list_data.push({
                    "event_type": response.data[item].event_type,
                    "event_group": response.data[item].event_group,
                    "timestamp": response.data[item].timestamp ? this.$clib.formatDateTimeWithMonthText(response.data[item].timestamp) : '',
                    "object_repr": response.data[item].object_repr,
                    "actor": response.data[item].actor,
                })
            }
        })
        .catch((error) => {
            this.handleError(error);
        })
        .finally(() => {
            this.history_list_loading = false;
        });
    },

    async fetchEventGroupFilterValues() {
        this.event_group_list_loading = true;
        return this.axios({
            method: "get",
            url: this.$config.backend_url + "/api/v1/internal/filters/?filter_name=history_event_group",
        })
        .then((response) => {
            this.event_group_list = [];
            for (let item in response.data) {
                this.event_group_list.push({
                    'value': item,
                    'text': response.data[item]
                });
            }
        })
        .catch((error) => {
            this.handleError(error);
            this.$emit('on-error-message-show', 'Виникла помилка при спробі завантаження списку доступних груп подій.');
        })
        .finally(() => {
            this.event_group_list_loading = false;
        });
    }
  }
}
</script>