export function emailContent(url) {
    return `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
  </head>

  <body style="margin:0; padding:0; background-color:#0b0b10; font-family:Inter, Arial, sans-serif;">
    <!-- Outer background -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b0b10; padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color:rgba(24,24,35,0.95);
              border-radius:16px;
              border:1px solid rgba(255,255,255,0.08);
              box-shadow:0 20px 40px rgba(0,0,0,0.4);
              overflow:hidden;
            "
          >
            <!-- Header -->
            <tr>
              <td style="padding:32px 32px 24px; text-align:center;">
                
                <h1 style="
                  margin:0;
                  font-size:28px;
                  font-weight:600;
                  color:#ffffff;
                ">
                  Reset your password
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:0 32px 32px;">
                <p style="
                  margin:0 0 16px;
                  font-size:16px;
                  line-height:1.6;
                  color:#cfcfe6;
                ">
                  We received a request to reset your Composter account password.
                  Click the button below to create a new one.
                </p>

                <p style="
                  margin:0 0 28px;
                  font-size:14px;
                  line-height:1.6;
                  color:#9a9ab5;
                ">
                  If you didn’t request this, you can safely ignore this email.
                </p>

                <!-- Button -->
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center">
                      <a
                        href="${url}"
                        style="
                          display:inline-block;
                          background:linear-gradient(135deg, #7c3aed, #a855f7);
                          color:#ffffff;
                          text-decoration:none;
                          font-size:16px;
                          font-weight:600;
                          padding:14px 28px;
                          border-radius:12px;
                        "
                      >
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- Fallback link -->
                <p style="
                  margin:28px 0 0;
                  font-size:13px;
                  color:#9a9ab5;
                  word-break:break-all;
                ">
                  Or copy and paste this link into your browser:<br />
                  <a href="${url}" style="color:#a855f7;">
                    ${url}
                  </a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                padding:24px 32px;
                background-color:rgba(255,255,255,0.02);
                border-top:1px solid rgba(255,255,255,0.06);
                text-align:center;
              ">
                <p style="
                  margin:0;
                  font-size:12px;
                  color:#7c7c9a;
                ">
                  © 2025 Composter. All rights reserved.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>
    `;
}