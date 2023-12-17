import axios from 'axios';

/*eslint-disable*/

sessionStorage.removeItem('alert_show');


function onUploadProgress(progressEvent) {
    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(percentCompleted)
}

const token = localStorage.getItem('token') || '';
const authorization = `Token ${token}`;

const instance = axios.create({
    timeout: 60000 * 5,//5 min,
    onUploadProgress: onUploadProgress,
    headers: {
        'Authorization': authorization,
        //'Cache-Control': 'no-cache',
    },

});

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token') || '';
    if (token) {
        let decoded_token = JSON.parse(decodeURIComponent(escape(window.atob( token.split('.')[1] ))));
        var timeInMs = Date.now();
        if(timeInMs > decoded_token.exp * 1000) {
            console.log("Час дії токену вичерпано");
        }

        config.headers['Authorization'] = `Token ${token}`;
    }
    return config;

}, function (error) {
    return Promise.reject(error);
});


instance.interceptors.response.use(
    response => {
        sessionStorage.removeItem('alert_show');
        return response
    },
    error => {
        if (!error.response) {
            if (!sessionStorage.getItem('alert_show')) {
                console.log("Відсутній з'вязок з сервером");
                sessionStorage.setItem('alert_show', '1');
            }
        }
        return Promise.reject(error)
    }
);


export default {
    install(Vue, options) {
        Vue.prototype.axios = instance;
    }
}
