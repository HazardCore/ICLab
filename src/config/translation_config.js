let TRANSLATION = {
    INFORMATION_RESOURCE: {
        LOADING: {
            LOAD_DETAIL: 'Зачекайте будь ласка', // Завантаження сторінки
            GENERATE_DOCVIEW: 'Зачекайте будь ласка, йде генерація документу', // Генерація документу, при внесення змін
            MOVE_TO_AT_SIGN_STATE: 'Зачекайте будь ласка', // Відправка запиту з підписом, подача адміністратору на розгляд
            SEND_APPLICATION: 'Зачекайте будь ласка, йде обробка запиту', // Відправка запиту на видалення оператора, архівування, деархівування, публікацію, депублікацію.
            LOAD_APPLICATION_DETAIL: 'Зачекайте будь ласка',
            CANCEL_APPLICATION: 'Зачекайте будь ласка',
        },
        SUCCESS: {
            SIGNED: 'Заявку з приєднання/оновлення інформаційного е-ресурсу подано на розгляд держателю системи.',
            SIGNED_ADD_OPERATOR: 'Заявку визначення операторів інформаційного е-ресурсу подано на розгляд держателю системи.',
            SIGNED_DELETE_OPERATOR: 'Заявку припинення повноважень операторів інформаційного е-ресурсу подано на розгляд держателю системи.',
            CANCELED: 'Заявку скасовано.',
            SENT_EXTERNALLY: 'Статус заявки змінено на "Відправлена зовнішніми засобами".',
            UNSENT_EXTERNALLY: 'Статус заявки змінено на "Потребує підписання".',
            ARCHIVE: 'Заявку з архівування/видалення інформаційного е-ресурсу подано на розгляд держателю системи.',
            UNARCHIVE: 'Заявку з розархівування інформаційного е-ресурсу подано на розгляд держателю системи.',
            PUBLISH: 'Заявку з публікації інформаційного е-ресурсу подано на розгляд держателю системи.',
            DEPUBLISH: 'Заявку з зняття з публікації інформаційного е-ресурсу подано на розгляд держателю системи.',
        },
        BANNERS: {
            APPLICATION_APPLY: 'Прикріпіть підписану керівником або уповноваженою особою заявку та натисніть кнопку «Подати заявку онлайн». У випадку відправки заявки через СЕВ ОВВ або поштовим зв\'язком натисніть кнопку «Відправити зовнішніми засобами».'
        }
    },

    INTERFACE: {
        LOADING: {
            LOAD_DETAIL: 'Зачекайте будь ласка', // Завантаження сторінки
            SEND_APPLICATION: 'Зачекайте будь ласка, йде обробка запиту', // Відправка запиту на архівування, деархівування, публікацію, депублікацію.
            SEND_DOCUMENTS: 'Зачекайте будь ласка, йде збереження документів',
            LOAD_APPLICATION_DETAIL: 'Зачекайте будь ласка',
            CANCEL_APPLICATION: 'Зачекайте будь ласка',
            APPROVE_APPLICATION: 'Зачекайте будь ласка',
        },
        SUCCESS: {
            SEND_APPLICATION_UPDATE_INTERFACE_APPROVAL: 'Заявку з оновленою інформацією про інтерфейс е-ресурсу подано на розгляд відповідальній особі.',
            SEND_APPLICATION_UPDATE_INTERFACE: 'Заявку з оновленою інформацією про інтерфейс е-ресурсу подано на розгляд адміністратору.',
            SEND_APPLICATION_NEW_INTERFACE_APPROVAL: 'Заявку зі створення інтерфейсу е-ресурсу подано на розгляд відповідальній особі.',
            SEND_APPLICATION_NEW_INTERFACE: 'Заявку зі створення інтерфейсу е-ресурсу подано на розгляд адміністратору.',
            APPROVED: 'Заявка погоджена та подана на розгляд адміністратору.',
            CANCELED: 'Заявку скасовано.',
            ARCHIVE: 'Заявку з архівування/видалення інтерфейсу е-ресурсу подано на розгляд адміністратору СЕВДЕІР.',
            UNARCHIVE: 'Заявку з розархівування інтерфейсу е-ресурсу подано на розгляд адміністратору СЕВДЕІР.',
            PUBLISH: 'Заявку з публікації інтерфейсу е-ресурсу подано на розгляд адміністратору СЕВДЕІР.',
            DEPUBLISH: 'Заявку з зняття з публікації інтерфейсу е-ресурсу подано на розгляд адміністратору СЕВДЕІР.',
        },
        BANNERS: {
            SERVICES_EDIT: "Зверніть увагу!!! При додаванні до інтерфейсу е-ресурсу сервісів промислового середовища обов’язково повинні бути додані сервіси, що реалізують відповідний функціонал у тестовому середовищі.",
            DOCUMENTATION_EDIT: "Зверніть увагу!!! Адміністратор при обробці заявки перевіряє актуальність відомостей, що містяться у документації, тому функціоналу, що реально реалізує кожен із сервісів, що формує інтерфейс е-ресурсу. Окрім цього Адміністратор має право заблокувати доступ е-ресурсу до системи у випадку виявлення неактуальних відомостей.",
            APPLICATION_CANCEL_AGREEMENT: "Зверніть увагу!!! Якщо до інтерфейсу інформаційного е-ресурсу вже була подана заявка, яка досі не є обробленою адміністратором системи та є активною, вона буде скасована системою!"
        }
    },

    APPLICATIONS: {
        LOADING: {
            LOAD_APPLICATION_DETAIL: 'Зачекайте будь ласка',
            CANCEL_APPLICATION: 'Зачекайте будь ласка',
            APPROVE_APPLICATION: 'Зачекайте будь ласка',
        },
        SUCCESS: {
            SEND_APPLICATION_APPROVAL: 'Заявку подано на розгляд відповідальній особі.',
            SEND_APPLICATION: 'Заявку подано на розгляд адміністратору.',
            APPROVED: 'Заявка погоджена та подана на розгляд адміністратору.',
            CANCELED: 'Заявку скасовано.',
        },
        BANNERS: {
            ON_APPROVAL: "Зверніть увагу! При погодженні заявки вона буде подана на виконання до адміністратора системи.",
        }
    },

    EXTERNAL_APPLICATIONS: {
        LOADING: {
            LOAD_APPLICATION_DETAIL: 'Зачекайте будь ласка',
            CANCEL_APPLICATION: 'Зачекайте будь ласка',
            REJECT_APPLICATION: 'Зачекайте будь ласка',
            APPROVE_APPLICATION: 'Зачекайте будь ласка',
        },
        SUCCESS: {
            SEND_APPLICATION_APPROVAL: 'Запит подано на розгляд відповідальній особі.',
            SEND_APPLICATION: 'Запит подано на розгляд до обраної організації.',
            EXECUTED: 'Запит було виконано, відповідь направлена організації, що подала запит.',
            APPROVED: 'Запит погоджений та поданий на розгляд до обраної організації.',
            REJECTED: 'Запит відхилено.',
            CANCELED: 'Запит скасовано.',
        },
        BANNERS: {
            ON_APPROVAL: "Зверніть увагу! При погодженні запиту він буде поданий на виконання до обраної організації.",
        }
    },

    ORGANIZATION_DETAIL: {
        LOADING: {
            LOAD_DETAIL: 'Зачекайте будь ласка',
        }
    },

    PROFILE: {
        LOADING: {
            CREATE_PROFILE: 'Зачекайте будь ласка',
            LOAD_PROFILE: 'Зачекайте будь ласка',
            UPDATE_PROFILE: 'Зачекайте будь ласка',
            ACTIVATE_USER: 'Зачекайте будь ласка',
            CHANGE_ACCESS_PERMISSION: 'Зачекайте будь ласка',
            DEACTIVATE_USER: 'Зачекайте будь ласка',
            DELETE_USER: 'Зачекайте будь ласка',
        },
        SUCCESS: {
            UPDATE_PROFILE: 'Дані профіля успішно оновлені',
            CREATE_PROFILE: 'Нового користувача було додано до системи',
            ACTIVATE_USER: 'Користувача активовано',
            CHANGE_ACCESS_PERMISSION: 'Внесено зміни до дозволів користувача',
            DEACTIVATE_USER: 'Користувача деактивовано',
            DELETE_USER: 'Користувача видалено',
        }
    }
}

export default TRANSLATION;