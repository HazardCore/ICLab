<template v-if="info_alert || error_alert || warning_alert">
    <span>
        <v-alert
            color="#8ee19e"
            icon="mdi-checkbox-marked-outline"
            class="float-right" 
            elevation="10"
            dismissible
            close-icon="mdi-close"
            max-width="400px"
            max-height="200px"
            v-model="info_alert"
            style="position: absolute; right: 80px; top: 100px; z-index: 5;"
        >
            {{ info_message }}
        </v-alert>
        <v-alert
            color="#f7aaaa"
            icon="mdi-fire"
            class="float-right" 
            elevation="10"
            dismissible
            close-icon="mdi-close"
            max-width="400px"
            max-height="200px"
            v-model="error_alert"
            style="position: absolute; right: 80px; top: 100px; z-index: 5;"
        >
            {{ error_message }}
        </v-alert>
        <v-alert
            color="#FFD600"
            icon="mdi-alert-circle-outline"
            class="float-right" 
            elevation="10"
            dismissible
            close-icon="mdi-close"
            max-width="400px"
            max-height="200px"
            v-model="warning_alert"
            style="position: absolute; right: 80px; top: 100px; z-index: 5;"
        >
            {{ warning_message }}
        </v-alert>
    </span>
</template>
<script>
export default {
  name: "DiiaAlertNotification",
  props: ['info_alert', 'info_message', 'error_alert', 'error_message', 'warning_alert', 'warning_message'],
  watch: {
    // info_alert(new_value, old_value) {
    //     console.log(new_value);
    //     console.log(old_value);
    // },
    // error_alert(new_value, old_value) {
    //     console.log(new_value);
    //     console.log(old_value);
    // }
  }
}
</script>