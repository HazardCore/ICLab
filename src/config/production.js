import etc_config from "./other_configuration";

let config = {
    website_url: 'https://trembita.gov.ua',
    catalog_url: 'https://catalog.trembita.gov.ua',
    backend_url: 'https://portal.trembita.gov.ua',
    IDGOVUA: {
        url: 'https://id.gov.ua',
        client_id: '9220324487666ee3736e46d4b1bb0658',
        state: 'catalog_auth',
        redirect_uri: 'https://cabinet.trembita.gov.ua/redirect_auth',
    },
                 
    notification_duration: 10000,
    query_params: {},
    decoded_token: {},
    user_data: {},

    INFORMATION_RESOURCE_MAX_HEAD_PERSON_DOCUMENT_SIZE: 20000000,
    INFORMATION_RESOURCE_INTERFACE_DOCUMENTATION_MAX_FILE_SIZE: 20000000,

    INFORMATION_RESOURCE_HEAD_PERSON_ALLOWED_FORMATS: '.pdf, .jpg, .jpeg, .png',
    INFORMATION_RESOURCE_OPERATOR_LEGAL_BASIS_ALLOWED_FORMATS: '.pdf, .jpg, .jpeg, .png',
    INFORMATION_RESOURCE_INTERFACE_DOCUMENTATION_ALLOWED_FORMATS: '.pdf, .jpg, .jpeg, .png, .zip, .doc, .docx, .xlsx, .ppt',
};

Object.assign(config, etc_config);

export default config;