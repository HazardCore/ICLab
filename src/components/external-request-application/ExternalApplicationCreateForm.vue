<template>
    <v-card elevation="0">
        <v-container style="max-width: 1680px;">
            <v-row>
                <v-col cols="12" md="9" order-sm="3" order-md="1"  class="mb-10 mt-10 container-side-padding">
                    <ExternalApplicationForm @on-template-request="onTemplateRequest" @on-error-message-show="onErrorMessageShow" @on-info-message-show="onSuccessSubmit" selected_submenu_item="requestapplication"/>
                </v-col>
                <v-col cols="12" md="3" order-sm="1" order-md="3" style="background-color: rgb(243 243 243);" class="d-none d-sm-none d-md-block">
                <v-expansion-panels multiple class="side-help-menu-expansion-panels mt-10">
                        <v-expansion-panel class="side-help-menu-expansion-panel" v-for="item in template_detail.qa" v-bind:key="item.question">
                            <v-expansion-panel-header class="side-help-menu-expansion-panel-header">
                                <div v-html="item.question">{{ item.question }}</div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="side-help-menu-expansion-panel-content">
                                <div v-html="item.answer">{{ item.answer }}</div>
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
    import ExternalApplicationForm from "./ExternalApplicationForm";
    export default {
        name: "ExternalApplicationCreateForm",
        components: {
            ExternalApplicationForm,
        },

        data: () => ({
            template_detail: {},
        }),
        created: function () {
            this.fetchTemplateInfo();
        },
        mounted: function() {
        },
        watch: {
            $route(to, from) {
                if (to.name == 'new-external-application') {
                    this.fetchTemplateInfo();
                }
            }
        },
        methods: {
            async fetchTemplateInfo() {
                this.template_detail = {};
            },
            onTemplateRequest(template_detail) {
                this.template_detail = template_detail;
            },
            onErrorMessageShow(message) {
                this.$emit('on-error-message-show', message);
            },
            onSuccessSubmit(message) {
                this.$emit('on-info-message-show', message);
            },
        }
    }
</script>