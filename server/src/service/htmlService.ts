export const generateConfirmationEmailHtml = (name: string, confirmationUrl: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
          }
          table {
            border-spacing: 0;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }
          h1 {
            color: #333333;
            font-size: 24px;
            margin: 20px;
          }
          p {
            color: #555555;
            font-size: 16px;
            line-height: 24px;
            margin: 0 20px 20px 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px auto;
            display: block;
            text-align: center;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin: 20px;
          }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td>
              <h1>Confirm Your Account</h1>
              <p>Hey ${name},</p>
              <p>Thank you for signing up for Task Forge. To complete your registration, please confirm your account by clicking the button below.</p>
              <p><a href="${confirmationUrl}" class="button">Confirm Your Account</a></p>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p>${confirmationUrl}</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>&copy; ${new Date().getFullYear()} Task Forge. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

export const generatePasswordResetHtml = (name: string): string => {
return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
        -ms-text-size-adjust: none;
        }
        table {
        border-spacing: 0;
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        }
        h1 {
        color: #333333;
        font-size: 24px;
        margin: 20px;
        }
        p {
        color: #555555;
        font-size: 16px;
        line-height: 24px;
        margin: 0 20px 20px 20px;
        }
        .footer {
        text-align: center;
        font-size: 12px;
        color: #888888;
        margin: 20px;
        }
    </style>
    </head>
    <body>
    <table>
        <tr>
        <td>
            <h1>Password Reset Successful</h1>
            <p>Hey ${name},</p>
            <p>Your account password has been reset successfully. If you didn't initiate this reset, please contact our support team immediately.</p>
        </td>
        </tr>
        <tr>
        <td class="footer">
            <p>&copy; ${new Date().getFullYear()} Task Forge. All rights reserved.</p>
        </td>
        </tr>
    </table>
    </body>
    </html>
`;
};

export const generateAccountConfirmedHtml = (): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
          }
          table {
            border-spacing: 0;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }
          h1 {
            color: #333333;
            font-size: 24px;
            margin: 20px;
          }
          p {
            color: #555555;
            font-size: 16px;
            line-height: 24px;
            margin: 0 20px 20px 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin: 20px;
          }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td>
              <h1>Account Confirmed</h1>
              <p>Your account has been successfully confirmed.</p>
              <p>Thank you for confirming your account. You can now log in and enjoy all the features of Task Forge.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>&copy; ${new Date().getFullYear()} Task Forge. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  export const generatePasswordResetRequestHtml = (name: string, resetUrl: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
          }
          table {
            border-spacing: 0;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }
          h1 {
            color: #333333;
            font-size: 24px;
            margin: 20px;
          }
          p {
            color: #555555;
            font-size: 16px;
            line-height: 24px;
            margin: 0 20px 20px 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px auto;
            display: block;
            text-align: center;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin: 20px;
          }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td>
              <h1>Password Reset Requested</h1>
              <p>Hey ${name},</p>
              <p>You requested to reset your password. Please click the button below to reset your password. This link will expire in 15 minutes.</p>
              <p><a href="${resetUrl}" class="button">Reset Your Password</a></p>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p>${resetUrl}</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>&copy; ${new Date().getFullYear()} Task Forge. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

export const generatePasswordChangedHtml = (name: string): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
          }
          table {
            border-spacing: 0;
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
          }
          h1 {
            color: #333333;
            font-size: 24px;
            margin: 20px;
          }
          p {
            color: #555555;
            font-size: 16px;
            line-height: 24px;
            margin: 0 20px 20px 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin: 20px;
          }
        </style>
      </head>
      <body>
        <table>
          <tr>
            <td>
              <h1>Password Changed Successfully</h1>
              <p>Hey ${name},</p>
              <p>Your account password has been successfully changed. If you did not initiate this change, please contact our support team immediately.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>&copy; ${new Date().getFullYear()} Task Forge. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };
  