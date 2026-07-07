/**
 * Application constants.
 *
 * `Env` — the recognized NODE_ENV values, used for environment checks
 *   (e.g. `config.env === Env.production`) instead of magic strings.
 * `newsletterEmailContent` — HTML template of the welcome email sent to
 *   new newsletter subscribers.
 */
const Constant = {
    Env: {
        development: "development",
        test: "test",
        production: "production"
    },

    newsletterEmailContent: `<center>
    <div align="center">
      <table border="0" cellspacing="0" cellpadding="0" width="100%" class="aw-bgc" align="center" role="presentation" style="background-color: rgb(248, 248, 248); border-collapse: collapse; border-spacing: 0px; border-width: 0px; border-style: none; font-size: 18px;">
        <tbody>
          <tr>
            <td class="temp-wrapper" style="border-collapse: collapse; border-spacing: 0px; border-width: 0px; border-style: none; font-size: 18px;">
              <div align="center">
                <div class="temp-body" style="background-color:#ffffff; border-radius:10px; max-width: 600px; margin:60px 16px 200px; padding: 16px;">
                  <div class="temp-fullbleed contained" style="max-width: 600px; width: 100%;">
                    <div class="region">
                      <div>
                        <table class="row aw-stack" style="width: 100%; border-collapse: collapse; border-spacing: 0px; border-width: 0px; border-style: none; font-size: 18px;" role="presentation">
                          <tbody>
                            <tr>
                              <td class="container" style="padding: 0px; width: 100%; border-collapse: collapse; border-spacing: 0px; border-width: 0px; border-style: none; font-size: 18px;" width="100%" valign="top">
                                <div class="definition-parent"><span>
                                    <table align="center" width="100%" class="floated-none" style="float: none; text-align: center; border-collapse: collapse; border-spacing: 0px; border-width: 0px; border-style: none; font-size: 18px;" role="presentation">
                                      <tbody>
                                        <tr>
                                          <td align="center" style="padding: 0px; border-collapse: collapse; border-spacing: 0px; border-width: 0px; border-style: none; font-size: 18px;">
                                            <img class="model" src="https://media.istockphoto.com/id/1397892955/photo/thank-you-message-for-card-presentation-business-expressing-gratitude-acknowledgment-and.jpg?s=612x612&w=0&k=20&c=7Lyf2sRAJnX_uiDy3ZEytmirul8pyJWm4l2fxiUtdvk=" style="display: block; width: 600px; height: 283px; border-width: 0px; border-style: none; line-height: 100%; max-width: 100%; outline-width: medium; outline-style: none; text-decoration: none; color: rgb(51, 51, 51);font-size: 20px; font-weight: 700; border-radius: 10px;" alt="Image" width="600" height="283">
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </span></div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table class="row aw-stack" style="width: 100%; border-collapse: collapse; border-spacing: 0px; border-width: 0px; border-style: none; font-size: 18px;" role="presentation">
                          <tbody>
                            <tr>
                              <td class="container" style="padding: 30px; border-collapse: collapse; border-spacing: 0px; border-width: 0px; border-style: none; font-size: 18px;" width="100%" valign="top">
                                <div class="definition-parent">
                                  <div class="text-element paragraph">
                                    <div style="font-size: 19px; text-align: center; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-weight: 400; line-height: 125%;">
                                      <p>We're thrilled to welcome you to the GeekSouq community! Thank you for subscribing to our newsletter. We're excited to share exclusive updates, valuable insights, and special offers with you.</p>
                                      <p style="margin-top: 24px; font-weight: 700;">Enjoy diving in! &#10084;</p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </center>` ,
    emailContent: ``


}


module.exports = Constant