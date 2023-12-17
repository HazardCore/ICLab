<template>
<v-card
    fluid
    elevation="0"
    class=""
    style=""
>
    <v-container style="max-width: 1680px;" class="container-side-padding">
      <v-form ref="form" v-model="form_valid">
        <DiiaLoaderOverlay :show_overlay="overlay" :text="overlay_text"/>
        <v-row>
        <v-col cols="12" md="9" order-sm="3" order-md="1">
                <v-container style="margin-bottom: 48px;" class="ma-0 pa-0">
                    <h3 class="mb-10 mt-10 diia-h3-header">Загальна інформація</h3>
                    <v-row class="ma-0">
                        <v-col cols="12" class="pl-0">
                        <v-text-field
                            class="diia-v-input"
                            v-model="form_user_organization_name"
                            label="Назва організації" dense
                            readonly
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" class="pl-xs-0 pl-0">
                        <v-text-field
                            class="diia-v-input"
                            v-model="form_user_last_name"
                            :rules="textRules"
                            label="Прізвище" dense
                            clearable
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" class="pl-0">
                        <v-text-field
                            class="diia-v-input"
                            v-model="form_user_first_name"
                            :rules="textRules"
                            label="Власне ім'я" dense
                            clearable
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" class="pl-xs-0 pl-0">
                        <v-text-field
                            class="diia-v-input"
                            v-model="form_user_middle_name"
                            :rules="textRules"
                            label="По-батькові" dense
                            clearable
                            required
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="ma-0">
                        <v-col cols="12" md="12" class="pl-0">
                        <v-text-field
                            class="diia-v-input"
                            v-model="form_user_role"
                            :rules="textRules" dense
                            label="Посада (місце роботи)"
                            clearable
                            required
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="ma-0">
                        <v-col cols="12" md="12" class="pl-0">
                        <v-combobox
                            class="diia-v-input"
                            v-model="form_user_selected_skills"
                            :items="skills_list"
                            small-chips
                            :loading="account_skills_loading"
                            :rules="skillsRules"
                            label="Компетенції (Навички)" dense
                            multiple clearable
                            hide-no-data hide-selected
                            chips
                        ></v-combobox>
                        </v-col>
                    </v-row>
                    <v-row class="ma-0">
                        <v-col cols="12" md="12" class="pl-0">
                        <v-text-field
                            class="diia-v-input" dense
                            v-model="form_user_additional_skills"
                            label="Компетенції (Додаткові навички)"
                            clearable
                            required
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="ma-0">
                        <v-col cols="12" md="6" class="pl-0">
                        <v-text-field
                            class="diia-v-input" dense
                            v-model="form_user_phones"
                            :rules="phoneRules"
                            label="Контактні телефони"
                            hint="Формат: +380xxxxxxxxx. У випадку декількох номерів, перелічити через кому."
                            clearable
                            required
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6" class="pl-xs-0 pl-0">
                        <v-text-field
                            class="diia-v-input" dense
                            v-model="form_user_emails"
                            :rules="emailRules"
                            label="Електронні адреси (e-mail)"
                            hint="У випадку декількох адрес, перелічити через кому."
                            clearable
                            required
                        ></v-text-field>
                        </v-col>
                    </v-row>
                <br>
                <div style="margin: 0px;">
                <p><b>Ви надаєте:</b></p>
                <v-checkbox
                    v-model="new_statement_agree_data_process"
                    :off-icon="'mdi-checkbox-blank-outline'" :on-icon="'mdi-checkbox-outline'" color="black" :ripple="false"
                    label="Згоду на обробку персональних даних, викладених в цій формі з метою надання адміністратором системи електронної взаємодії державних електронних інформаційних ресурсів технічної пітримки та статистичної інформації, відповідно до Закону України «Про захист персональних даних»."
                    required
                ></v-checkbox>
                </div>
            </v-container>
            <v-card-actions class="justify-end pr-0">
                <v-btn 
                    class="mb-1 mt-1 diia-button-style-3"
                    color="black"
                    elevation="0"
                    style="letter-spacing: normal; text-transform: none;"
                    :disabled="!form_valid || !new_statement_agree_data_process"
                    @click="onRegister"
                >   
                    Зберегти
                </v-btn>
            </v-card-actions>
        </v-col>
        </v-row>
      </v-form>
    </v-container>
</v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "MyProfileDetail",
  components: {},
  data: () => ({
    nameRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => v && v.length >= 2 || "Не коректно заповнене поле.",
    ],
    edrpouRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => v && v.length == 8 || "Код ЄДРПОУ складається з 8 цифр",
      (v) => /^\d+$/.test(v) || "Не коректно заповнений ЄДРПОУ.",
    ],
    rnokppRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => v && v.length == 10 || "РПОКПП складається з 10 цифр",
      (v) => /^\d+$/.test(v) || "Не коректно заповнений РНОКПП.",
    ],
    passportOrganRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => v && v.length == 4 || "Поле має містити 4 цифри",
      (v) => /^\d+$/.test(v) || "Поле не відповідає формату.",
    ],
    textRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => v && v.length > 1 || "Довжина поля занадто маленька.",
    ],
    skillsRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => v && v.length >= 1 || "Виберіть хоча б одне значення.",
    ],
    phoneRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => {
        let arr = v.split(',')
        for (let i=0; i < arr.length; i++) {
          if (!(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{6}$/im.test(arr[i].trim()))) {
            return "Не корректний номер телефону"
          }
        }
        return true
      }
    ],
    emailRules: [
      (v) => !!v || "Поле обов'язкове",
      (v) => {
        let arr = v.split(',')
        for (let i=0; i < arr.length; i++) {
          if (!(/.+@.+/.test(arr[i].trim()))) {
            return "Не корректна e-mail адреса"
          }
        }
        return true
      },
    ],
    form_valid: false,

    overlay: false,
    overlay_text: 'Зачекайте будь ласка',
    new_statement_agree_data_process: false,

    skills_list: [],
    account_skills_loading: false,

    form_user_organization_name: "",
    form_user_first_name: "",
    form_user_last_name: "",
    form_user_middle_name: "",
    form_user_org_name: "",
    form_user_org_edrpou: "",
    form_user_role: "",
    form_user_selected_skills: [],
    form_user_additional_skills: "",
    form_user_phones: "",
    form_user_emails: "",

    redirect_to_profile: false,
  }),
  created: function () {
    document.title = this.$route.meta && this.$route.meta.title ? this.$route.meta.title : 'Особистий кабінет';
    this.requestAccountDetailInfo();
    this.requestAccountSkillsList();

    this.redirect_to_profile = localStorage.getItem('redirect_to_profile') || false;
  },
  watch: {
      $route(to, from) {
          if (to.name == 'me-detail') {
            this.clearForm();
            this.requestAccountDetailInfo();
            this.requestAccountSkillsList();
            this.redirect_to_profile = localStorage.getItem('redirect_to_profile') || false;
          }
      },
  },
  methods: {
    clearForm() {
      this.new_statement_agree_data_process = false;

      this.skills_list = [];

      this.form_user_organization_name = "";
      this.form_user_first_name = "";
      this.form_user_last_name = "";
      this.form_user_middle_name = "";
      this.form_user_org_name = "";
      this.form_user_org_edrpou = "";
      this.form_user_role = "";
      this.form_user_selected_skills = [];
      this.form_user_additional_skills = "";
      this.form_user_phones = "";
      this.form_user_emails = "";
    },
    requestAccountDetailInfo() {
      this.overlay = true;
      this.overlay_text = this.$config.TRANSLATION.PROFILE.LOADING.LOAD_PROFILE;

      return this.axios({
          method: "get",
          url: this.$config.backend_url + "/api/v1/account/internal/self_profile/detail",
      })
      .then((response) => {
          this.form_user_organization_name = response.data.organization_name || "";
          this.form_user_first_name = response.data.first_name || "";
          this.form_user_last_name = response.data.last_name || "";
          this.form_user_middle_name = response.data.middle_name || "";

          this.form_user_org_name = response.data.org_name || "";
          this.form_user_org_edrpou = response.data.org_edrpou || "";

          this.form_user_role = response.data.position || "";
          this.form_user_selected_skills = response.data.skills || [];
          this.form_user_additional_skills = response.data.additional_skills || "";

          this.form_user_phones = response.data.phone || "";
          this.form_user_emails = response.data.additional_email_addresses || "";
      })
      .catch((error) => {
          this.handleError(error);
      })
      .finally(() => {
          this.overlay = false;
      });
    },

    requestAccountSkillsList() {
      this.account_skills_loading = true;
      return this.axios({
          method: "get",
          url: this.$config.backend_url + "/api/v1/common/catalog/items/?code=account_skills",
      })
      .then((response) => {
          this.skills_list = response.data;
      })
      .catch((error) => {
          this.$emit('on-error-message-show', 'Виникла помилка при завантаженні списку ролей.');
      })
      .finally(() => {
          this.account_skills_loading = false;
      });
    },

    onRegister() {
      this.$refs.form.validate();

      let data = {
        first_name: this.form_user_first_name,
        last_name: this.form_user_last_name,
        middle_name: this.form_user_middle_name,
        position: this.form_user_role,
        skills: this.form_user_selected_skills,
        additional_skills: this.form_user_additional_skills,
        phone: this.form_user_phones,
        additional_email_addresses: this.form_user_emails,
      };

      this.overlay = true;
      this.overlay_text = this.$config.TRANSLATION.PROFILE.LOADING.LOAD_PROFILE;

      this.axios({
        method: "put",
        url: this.$config.backend_url + "/api/v1/account/internal/self_profile/detail",
        data: data,
      })
        .then((response) => {
          if (this.redirect_to_profile) {
            // remove option for data to be updated and force push user to materials list
            localStorage.removeItem('redirect_to_profile');
            this.$router.push({name: 'materials-list'});
          }

          this.$emit('on-info-message-show', this.$config.TRANSLATION.PROFILE.SUCCESS.UPDATE_PROFILE);
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