export default () => {
    
    console.log(process.env.NODE_ENV);

    return ({
    port: parseInt(process.env.PORT || '3000'),
    prefix: process.env.GLOBAL_PREFIX || 'api',
    swaggerHabilitado: process.env.SWAGGER_HABILITADO === 'true',
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        password: process.env.DB_PASSWORD,
        username: process.env.DB_USER,
        name: process.env.DB_NAME,
        logging: process.env.DB_LOGGING || 'true',
        logger: process.env.DB_LOGGER,
    },
    mail: {
        emailHost: process.env.MAIL_HOST,
        user: process.env.MAIL_USER,
        emailPassword: process.env.MAIL_PASSWORD
    }
})}