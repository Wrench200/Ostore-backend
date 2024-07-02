require('dotenv').config();

class Config {


    static instance;
    env;
    constructor(env) {

      if (Config.instance) return Config.instance;

      this.env = env;
      Config.instance = this;
    }

    /**
     * @returns { Config }
     */
    static getInstance(env) {

      if (!Config.instance) Config.instance = new Config(env);

      return Config.instance;
    }

    getValue(key, throwOnMissing = true) {

        const value = this.env[key];
        if (!value && throwOnMissing) {

            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    ensureValues(keys) {

        keys.forEach((k) => this.getValue(k, true));
        return this;
    }

    getName() {

        return this.getValue('APP_NAME');
    }

    getMode() {

        return this.getValue('APP_MODE');
    }

    getPort() {

        return this.getValue('APP_PORT');
    }

    getUrl() {

        return this.getValue('APP_URL');
    }

    getMailSettings() {

        if (this.use('mail')) {

            console.log(this.getValue("MAIL_HOST"));
            const data = {

                host: this.getValue('MAIL_HOST'),
                port: this.getValue('MAIL_PORT'),
                user: this.getValue('MAIL_USER'),
                senderName: this.getValue('MAIL_SENDER_NAME'),
                senderEmail: this.getValue('MAIL_SENDER_EMAIL'),
                secure: this.getValue('MAIL_SECURE')
            };

            const secure = data.secure 
            if (secure) {
                data['service'] = this.getValue('MAIL_SERVICE');
                data['auth'] = {
                    user: this.getValue('MAIL_USER'),
                    pass: this.getValue('MAIL_PASSWORD')
                };
            }
        
            return data;
        }

        return {};
    }
    
    getAppInfo() {
        return {
            name: this.getName(),
            url: this.getUrl(),
            version: this.getValue('APP_VERSION', false),
        };
    }

    getPrefixRoutes() {

        let prefix = this.getValue('APP_PREFIX_ROUTES', false) ?? '';
        if (prefix && (prefix.slice(-1) == '/')) {

            prefix = prefix.slice(0, -1);
        }
        return prefix;
    }

    getDatabase() {

        return this.getValue('DATABASE_URL');
    }

    getRedis() {

        return this.getValue('REDIS_URL');
    }

    getSecret() {
        return this.getValue('SECRET_TOKEN');
    }

    use(key) {

        const value = this.getValue(`USE_${key.toUpperCase()}`, false);
        return value && value == 'yes';
    }

    isProduction() {

        const mode = this.getValue('APP_MODE', false);
        return mode == 'PRODUCTION';
    }
}

module.exports = Config.getInstance(process.env).ensureValues([
    'APP_MODE',
]);
