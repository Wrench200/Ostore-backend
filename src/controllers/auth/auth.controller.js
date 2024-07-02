const Controller = require('../controller');
const authService = require('../../services/auth/auth.service');

class AuthController extends Controller {

    static instance;
    constructor() {

      if (AuthController.instance) return AuthController.instance;

      super();
      AuthController.instance = this;
    }

    /**
     * @returns { AuthController }
     */
    static getInstance() {

      if (!AuthController.instance) AuthController.instance = new AuthController();

      return AuthController.instance;
    }

    async register (req, res, next) {

        const data = await authService.register(req.body);
        if (data.error) return super.failed(res, data.message);
    
        return super.success(res, 'User created successfully', data.data, 201);
    };
    
    async activate_account (req, res, next) {
    
        const data = await authService.activateAccount(req.body);
        if (data.error) return super.failed(res, data.message);
    
        return super.success(res, 'Account successfully activated');
    };
    
    async login (req, res, next) {
    
        const data = await authService.login(req.body, true);
        if (data.error) return super.failed(res, data.message);

        return super.success(res, 'Connection completed successfully', data.data);
  };
  
  async refresh_token(req, res, next) {
    const data = await authService.refresh_Token(req.body.token)
     if (data.error) return super.failed(res, data.message);

     return super.success(res, "Connection completed successfully", data.data);
  }
  async getUser(req, res, next) { 
    const data = await authService.getUser(req.auth);
    if (data.error) return super.failed(res, data.message);

    return super.success(res, "User returned successfully", data.data);
  }
  async forgotPassword(req, res, next) {
    const data = await authService.forgotPassword(req.body);
    if (data.error) return super.failed(res, data.message);

    return super.success(res, "Email sent successfully", data.data);
  }
  async verifyCode(req, res, next) {
    const data = await authService.verifyReset(req.body);
    if (data.error) return super.failed(res, data.message);

    return super.success(res, "Code verified successfully", data.data);
  }
  async updatePassword(req, res, next) {
    const data = await authService.updatePassword(req.body);
    if (data.error) return super.failed(res, data.message);

    return super.success(res, "Password updated successfully", data.data);
  }
}

module.exports = AuthController.getInstance();
