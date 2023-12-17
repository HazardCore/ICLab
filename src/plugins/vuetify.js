import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

import uk from 'vuetify/lib/locale/uk'

const opts = {
    lang: {
        locales: { uk },
        current: 'uk',
    },
    theme: {
        themes: {
            light: {
                primary: '#000000',
            },
        },
    },
}

export default new Vuetify(opts);
