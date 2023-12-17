<template v-if="info_alert || error_alert || warning_alert">
    <span style="position: absolute; right: calc(max((100% - 1680px) / 2, 0px) + 80px); top: 100px; z-index: 5;">
        <v-row v-for="item in active_alerts" :key="item.id">
            <v-alert
                color="#8ee19e"
                icon="mdi-checkbox-marked-outline"
                class="float-right" 
                elevation="10"
                dismissible
                close-icon="mdi-close"
                max-width="400px"
                v-if="item.type == 'info'"
            >
                {{ item.message }}
            </v-alert>
            <v-alert
                color="#f7aaaa"
                icon="mdi-fire"
                class="float-right" 
                elevation="10"
                dismissible
                close-icon="mdi-close"
                max-width="400px"
                v-if="item.type == 'error'"
            >
                {{ item.message }}
            </v-alert>
            <v-alert
                color="#FFD600"
                icon="mdi-alert-circle-outline"
                class="float-right" 
                elevation="10"
                dismissible
                close-icon="mdi-close"
                max-width="400px"
                v-if="item.type == 'warning'"
            >
                {{ item.message }}
            </v-alert>
        </v-row>
    </span>
</template>
<script>
export default {
  name: "DiiaAlertNotification",
  data: () => ({
    active_alerts: [],
  }),
  methods: {
    pushNotification(type, message) {
        if (message) {
            let event_id = this.$clib.uuidv4();
            this.active_alerts.push({
                id: event_id,
                message: message,
                type: type,
            });

            setTimeout(this.removeItemOnTimeout(event_id), this.$config.notification_duration);
        }
    },

    removeNotifications() {
        this.active_alerts = [];
    },

    removeItemOnTimeout(id) {
        let global_scope = this;
        return function() {
            global_scope.active_alerts = global_scope.active_alerts.filter(x => x.id !== id);
        };
    },
  }
}
</script>