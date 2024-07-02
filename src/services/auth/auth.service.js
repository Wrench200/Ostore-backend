const BaseService = require("../base.service");
const { User } = require("../../models/user.model");
const mailService = require("../mail.service");

class AuthService extends BaseService {
  constructor() {
    super(User);
  }

  generateOTP(token = { type: "numeric", length: 6 }) {
    const keys = {
      numeric: "0123456789",
      alphabet: "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN",
    };

    const database = keys[token.type] ?? keys.alphabet;
    let result = "";
    for (let i = 0; i < token.length; i++) {
      result += database.charAt(Math.floor(Math.random() * database.length));
    }

    return result;
  }

  async login(data, active = false) {
    let find_user = await super.findOne(
      { email: new RegExp(data.email, "i") },
      {
        select:
          "last_name, first_name, username, email, password, role, confirmed_at",
      }
    );
    if (find_user.error || !find_user.data)
      return { error: true, message: "This account not found" };

    const user = find_user.data;
    const hash = await super.hashCompare(data.password, user.password);
    console.log(hash);
    if (!hash) return { error: true, message: "Password does not match" };

    if (active && !user.confirmed_at)
      return { error: true, message: "Account is not yet activated" };
    console.log(user._id, user.role);
    const token = super.token({ id: user._id, role: user.role });
    const refreshToken = super.refreshToken({ id: user._id, role: user.role });
    return {
      error: false,
      data: {
        token,
        refreshToken,
        expiresIn: 86400000,
        user: {
          id: user._id,
          last_name: user.last_name,
          first_name: user.first_name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    };
  }
  async refresh_Token(token) {
    const verified = super.tokenVerify(token, true);
    console.log(verified);
    if (!verified) return { error: true, message: "Incorrect token" };

    const user = await super.findOne(
      { _id: verified.id },
      { select: "last_name, first_name,username, email, role" }
    );
    if (user.error || !user.data)
      return { error: true, message: "User not found" };

    const newtoken = super.token({ id: verified._id, role: user.role });
    const refreshToken = super.refreshToken({
      id: verified._id,
      role: user.role,
    });

    return {
      error: false,
      data: {
        token: newtoken,
        refreshToken: refreshToken,
        expiresIn: 86400000,
        user: {
          id: user._id,
          last_name: user.last_name,
          first_name: user.first_name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  async register(data, token = { type: "numeric", length: 6 }) {
    try {
      console.log(data);
      const findUser = await User.find({ email: data.email });
      if (findUser.length > 0) {
        console.log(findUser);
        return { error: true, message: "This email is already in use" };
      }
      const password = await super.hash(data.password);
      const confirmation_token = this.generateOTP(token);

      data.confirmation_token = confirmation_token;
      data.password = password;

      const content = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Ensure emails are responsive */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        
                html {
                    font-family: "Inter", sans-serif;
                    font-optical-sizing: auto;
                    font-weight: 600;
                    font-style: normal;
                    font-variation-settings:
                        "slnt" 0;
                        background-color: rgba(22, 22, 22, 0.87);
                }
        
                body,
                table,
                td,
                a {
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
        
                table,
                td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                }
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    height: 100% !important;
                }
        
                table {
                    border-collapse: collapse !important;
                }
        
                a {
                    color: inherit;
                    text-decoration: none;
                }
        
                .logo {
                    color: #f43f5e;
                    font-size: 30px;
                }
        
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: rgba(22, 22, 22, 0.87);
                }
        
                .email-content {
                    background-color: rgba(0, 0, 0, 0.349);
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                .email-header {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #fff;
                    margin: 20px 0px;
                }
        
                .email-body {
                    font-size: 16px;
                    color: #fff;
                    line-height: 1.5;
                    
                }
        
                .otp-code {
                    display: inline-block;
                    background-color: #e0e0e0;
                    padding: 10px 20px;
                    font-size: 25px;
                    font-weight: bold;
                    color: #333333;
                    letter-spacing: 2px;
                    border-radius: 4px;
                    margin: 20px 0;
                    align-self: center;
                    width: fit-content;
                    text-align: center;
                }
        
                .email-footer {
                    text-align: center;
                    font-size: 14px;
                    color: #888888;
                    margin-top: 20px;
                }
        
                @media screen and (max-width: 600px) {
                    .email-container {
                        padding: 10px;
                       
                    }
        
                    .email-content {
                        padding: 10px;
                    }
        
                    .email-header {
                        font-size: 20px;
                    }
        
                    .email-body {
                        font-size: 14px;
                       
        
                    }
        
                    .otp-code {
                        align-self: center;
                        width: fit-content;
                        text-align: center;
                        font-size: 25px;
                        padding: 8px 16px;
                    }
                }
            </style>
        </head>
        
        <body>
            <div class="email-container">
                <div class="email-content">
                    <div class="email-header">
                        <p class="logo">Ostore</p>
                        Verify Your Email Address
                    </div>
                    <div class="email-body">
                        <p>Hello ${data.username},</p>
                        <p>Thank you for registering with us. Please use the following One-Time Password (OTP) to verify your
                            email address:</p>
                        <div class="otp-code">${data.confirmation_token}</div>
                        <p> If you did not request this code, please ignore this
                            email.</p>
                        <p>Best regards,<br>Ostore</p>
                    </div>
                    <div class="email-footer">
                        &copy; 2024 Ostore. All rights reserved.
                    </div>
                </div>
            </div>
        </body>
        
        </html>`;

      const sendMail = await mailService.mail(
        data.email,
        "Email Verification",
        content,
        true
      );
      const user = await this.create(data);
      console.log(sendMail);
      return {
        error: false,
        data: data.email,
        message: "registered successfully ",
      };
    } catch (err) {
      return { error: true, message: "Something went wrong" };
    }
  }

  async activateAccount(data) {
    const response = { error: true, message: "Code is incorrect" };
    const where = {
      email: new RegExp(data.email, "i"),
      confirmation_token: data.code,
    };
    const find_user = await super.findOne(where);
    if (find_user.error || !find_user.data) return response;

    const update = await super.update(where, {
      confirmation_token: null,
      confirmed_at: new Date(),
    });

    response.message = "An error occurred, please try again later !!!";
    return update.error ? response : { error: false };
  }
  async getUser(auth) {
    console.log('user', auth);
    return {
      error: false,
      data:auth
   }
  }
  async forgotPassword(email) {
    
      
      const user = await super.findOne({ 'email': email.email });
      
      if (user.error || !user.data)
        return { error: true, message: "User not found" };
      const token = this.generateOTP({ type: "numeric", length: 6 });
      await super.update(
        { _id: user.data._id },
        { reset_password_token: token }
      );
      console.log(user.data.email);
      const content = `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                /* Ensure emails are responsive */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        
                html {
                    font-family: "Inter", sans-serif;
                    font-optical-sizing: auto;
                    font-weight: 600;
                    font-style: normal;
                    font-variation-settings:
                        "slnt" 0;
                        background-color: rgba(22, 22, 22, 0.87);
                }
        
                body,
                table,
                td,
                a {
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
        
                table,
                td {
                    mso-table-rspace: 0pt;
                    mso-table-lspace: 0pt;
                }
        
                img {
                    -ms-interpolation-mode: bicubic;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                    width: 100% !important;
                    height: 100% !important;
                }
        
                table {
                    border-collapse: collapse !important;
                }
        
                a {
                    color: inherit;
                    text-decoration: none;
                }
        
                .logo {
                    color: #f43f5e;
                    font-size: 30px;
                }
        
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: rgba(22, 22, 22, 0.87);
                }
        
                .email-content {
                    background-color: rgba(0, 0, 0, 0.349);
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                .email-header {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #fff;
                    margin: 20px 0px;
                }
        
                .email-body {
                    font-size: 16px;
                    color: #fff;
                    line-height: 1.5;
                    
                }
        
                .otp-code {
                    display: inline-block;
                    background-color: #e0e0e0;
                    padding: 10px 20px;
                    font-size: 25px;
                    font-weight: bold;
                    color: #333333;
                    letter-spacing: 2px;
                    border-radius: 4px;
                    margin: 20px 0;
                    align-self: center;
                    width: fit-content;
                    text-align: center;
                }
        
                .email-footer {
                    text-align: center;
                    font-size: 14px;
                    color: #888888;
                    margin-top: 20px;
                }
        
                @media screen and (max-width: 600px) {
                    .email-container {
                        padding: 10px;
                       
                    }
        
                    .email-content {
                        padding: 10px;
                    }
        
                    .email-header {
                        font-size: 20px;
                    }
        
                    .email-body {
                        font-size: 14px;
                       
        
                    }
        
                    .otp-code {
                        align-self: center;
                        width: fit-content;
                        text-align: center;
                        font-size: 25px;
                        padding: 8px 16px;
                    }
                }
            </style>
        </head>
        
        <body>
            <div class="email-container">
                <div class="email-content">
                    <div class="email-header">
                        <p class="logo">Ostore</p>
                        Reset your password
                    </div>
                    <div class="email-body">
                        <p>Hello ${user.data.username},</p>
                        <p> Please use the following One-Time Password (OTP) to reset your Password:</p>
                        <div class="otp-code">${token}</div>
                        <p> If you did not request this code, please ignore this
                            email.</p>
                        <p>Best regards,<br>Ostore</p>
                    </div>
                    <div class="email-footer">
                        &copy; 2024 Ostore. All rights reserved.
                    </div>
                </div>
            </div>
            </body>
            
            </html>`;
            
            const sendMail = await mailService.mail(
        user.data.email,
        "Password Reset",
        content,
        true
            );
      console.log(sendMail);
    if (sendMail.error == false) {
      
      return {
        error: false,
        data: user.data.email,
        message: "Email sent successfully",
      };
    
    } else {
      
      return {
        error: true,
        message: "something went wrong",
      };
    }
    
  }
  async verifyReset(data) {
    const response = { error: true, message: "Code is incorrect" };
    const where = {
      email: new RegExp(data.email, "i"),
      reset_password_token: data.code,
    };
    const find_user = await super.findOne(where);
    if (find_user.error || !find_user.data) return response;

    response.message = "An error occurred, please try again later !!!";
    return find_user.error ? response : { error: false };
  }
  async updatePassword(data) {
    const response = { error: true, message: "Code is incorrect" };
    const where = {
      email: new RegExp(data.email, "i"),
      reset_password_token: data.code,
    };
    const find_user = await super.findOne(where);
    if (find_user.error || !find_user.data) return response;
    const password = await super.hash(data.password);
    const update = await super.update(where, {
      reset_password_token: null,
      reset_password_at: new Date(),
      password: password,
    });

    response.message = "An error occurred, please try again later !!!";
    return update.error ? response : { error: false };
  }
}

module.exports = new AuthService();
