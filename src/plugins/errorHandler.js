export default {
    install(Vue, options) {
        Vue.prototype.handleError = function (error) {
            if (error.code === 'ECONNABORTED' || (error.response && [504].indexOf(error.response.status) !== -1)) {
                this.$emit('on-error-message-show', 'Вибачте, запит виконується занадто довго. Спробуйте ще раз');
                return;
            }
            
            if(error.message==='Network Error'){
                // this.$router.push({ name: 'error',
                //     params: {
                //         title: 'Помилка мережі',
                //         message: 'Не вдалося завантажити дані з сервера',
                //     }
                // });

                this.$emit('on-error-message-show', 'Помилка мережі. Не вдалося завантажити дані з сервера');
                return;
            }

            // let message = '';
            // if (error.response) {
            //     message = error.response.data
            // } else {
            //     message = error.message
            // }
     
            // if (error.response && [401].indexOf(error.response.status) !== -1) {
            //     this.$router.push({
            //         title: 'Токен авторизації не дійсний',
            //         message: 'Не вдалося завантажити дані з сервера',
            //         on_close_redirect: '/login'
            //     });

            //     return

            // }
            // if (error.response && [413].indexOf(error.response.status) !== -1) {
            //     this.$router.push({
            //         title: 'Перевищено максимальний розмір файлу',
            //         message: 'Розмір файлу, який Ви намагаєтесь завантажити перевищує встановлений ліміт.',
            //     });

            //     return

            // }
            if (error.response && [409].indexOf(error.response.status) !== -1) {
                let message = error.response.data;

                this.$emit('on-error-message-show', message);
                return
            }
            if (error.response && [502].indexOf(error.response.status) !== -1) {
                this.$router.push({
                    name: 'error',
                    params: {
                        title: 'Помилка серверу.', message: 'Сервер не доступний.'
                    }
                });
                return
            }
            if (error.response && [403].indexOf(error.response.status) !== -1) {
                let forbidden = 'У Вас недостатньо прав для відвідання сторінки або виконання даної операції.';
                let session_is_expired = 'Час дії сессії завершився. Для продовження роботи, увійдіть знову до особистого кабінету.';

                if (error.response.data && error.response.data.detail) {
                    let message = '';
                    if (error.response.data.detail === "Authentication error. Unable to decode token") {
                        message = session_is_expired;
                        this.$router.push({
                            name: 'error',
                            params: {
                                title: 'Помилка',
                                message: message,
                                auth_button: true,
                                session_expired: true, 
                            }
                        });
                    }
                    else {
                        message = forbidden;
                        this.$router.push({
                            name: 'error',
                            params: {
                                title: 'Помилка',
                                message: message,
                                return_button: true,
                            }
                        });
                    }
                } else {
                    this.$router.push({
                        name: 'error',
                        params: {
                            title: 'Помилка',
                            message: 'Помилка авторизації/доступу.'
                        }
                    });
                }

                return
            }
            if (error.response && [500, 400].indexOf(error.response.status) !== -1) {
                let message = "Сталась помилка при обробці даних сервером, зверніться до адміністратора системи.";
                //debugger
                // this.$router.push({
                //     name: 'error',
                //     params: {
                //         title: error.response.statusText, 
                //         message: message
                //     }});
                
                this.$emit('on-error-message-show', message);

                return
            }
            // if (error.response && [400].indexOf(error.response.status) !== -1) {
            //     if (this.form_errors && error.response && error.response.data) {
            //         this.form_errors = error.response.data;
            //     } else {
            //         this.$router.push({title: error.name, message: message});
            //     }
            //     return
            // }
            if (error.response && [404].indexOf(error.response.status) !== -1) {
                this.$router.push({
                    name: 'error',
                    params: {
                        title: 'Такої сторінки не існує', message: 'Схоже, це неправильна адреса або елемент було видалено', return_button: true,
                    }
                });
                return
            }



            // if (error.response) {
            //     console.log(error.response.data);
            //     console.log(error.response.status);
            //     console.log(error.response.headers);
            // } else if (error.request) {
            //     console.log(error.request);
            // } else {
            //     console.log('Error', error.message);
            // }
            // console.log(error.config);


            // if (error.response && [409].indexOf(error.response.status) !== -1) {
            //     this.$router.push({title: 'Увага', message: error.response.data.detail});
            //     return
            // }
            // if (message) {
            //     this.$router.push({title: error.name, message: message});

            // }
        };
    }
};
