<template>
    <v-card fluid elevation=0 style="" height="100%" class="background-diia">
        <div style='position: absolute; left: 0; right: 0; top: 30%'>
        <v-container>
            <v-row style="height: 30%"></v-row>
            <v-row class="justify-center">
                <span style="font-size: 96px; font-weight: 200; line-height: 1.2;">404</span>
            </v-row>
            <v-row class="justify-center mt-5">
                <span style="font-size: 28px; word-break: word-wrap;" >Такої сторінки не існує</span>
            </v-row>
            <v-row class="justify-center ma-2 mt-8" style="word-break: word-wrap;">
                Схоже, це неправильна адреса або елемент було видалено
            </v-row>
            <v-row class="justify-center mt-8">
                <a href="/" class="view-href-a"> На головну</a>
            </v-row>
        </v-container>
        </div>
    </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "NotFound404",
  components: {},
  data: () => ({}),

  mounted: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
  }
}
</script>