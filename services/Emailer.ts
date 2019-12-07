const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const key = require('../config/keys');

class Emailer extends helper.Mail {
    constructor( { subject, recipients }: any, body: string) {
      super();

      this.sendGridApi = sendgrid(key.sendGridKey);
      this.from_email = new helper.Email('bobadevteam+noreply@gmail.com');
      this.subject = subject;
      this.recipients = this.formatEmails(recipients);
      this.body = new helper.Content('text/html', body);
      this.addContent(this.body);
      this.addRecipients();
    }

    formatEmails(recipients: any) {
      return recipients.map(({ email }: any) => {
        return new helper.Email(email);
      })
    }

    addRecipients() {
      const personalize = new helper.Personalization();
      this.recipients.forEach((recipient: any) => {
        personalize.addTo(recipient);
      });
      this.addPersonalization(personalize);
    }

    async send() {
      const request = this.sendGridApi.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: this.toJSON()
      });
    
      const response = await this.sendGridApi.API(request);
      return response;
    }
}

module.exports = Emailer;
