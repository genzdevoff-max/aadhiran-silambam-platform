import nodemailer from 'nodemailer';
import { query } from '../config/db';
import { AuditLogger } from './auditLogger';

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  fromName: string;
  adminNotificationEmail: string;
  enableAdminNotification: boolean;
  enableApplicantConfirmation: boolean;
}

const DEFAULT_SETTINGS: EmailSettings = {
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  fromEmail: process.env.SMTP_FROM_EMAIL || 'info@aadhiran.com',
  fromName: process.env.SMTP_FROM_NAME || 'Persatuan Aadhiran Silambam Pulau Pinang',
  adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'info@aadhiran.com',
  enableAdminNotification: true,
  enableApplicantConfirmation: true,
};

export const getEmailSettings = async (): Promise<EmailSettings> => {
  try {
    const res = await query("SELECT `value` FROM site_settings WHERE `key` = 'email'");
    if (res.rows && res.rows[0]?.value) {
      const val = typeof res.rows[0].value === 'string'
        ? JSON.parse(res.rows[0].value)
        : res.rows[0].value;
      return {
        ...DEFAULT_SETTINGS,
        ...val,
      };
    }
  } catch (error) {
    console.warn('Could not read email settings from database, falling back to environment defaults:', error);
  }
  return DEFAULT_SETTINGS;
};

export const saveEmailSettings = async (settings: Partial<EmailSettings>): Promise<EmailSettings> => {
  const current = await getEmailSettings();
  const updated: EmailSettings = {
    ...current,
    ...settings,
  };

  await query(`
    INSERT INTO site_settings (\`key\`, \`value\`, updated_at)
    VALUES ('email', $1, NOW())
    ON DUPLICATE KEY UPDATE
    \`value\` = VALUES(\`value\`), updated_at = NOW()
  `, [JSON.stringify(updated)]);

  AuditLogger.log({
    actorId: 'admin',
    action: 'UPDATE_EMAIL_SETTINGS',
    resourceType: 'site_settings',
    resourceId: 'email',
  });

  return updated;
};

export const createTransporter = (config?: Partial<EmailSettings>) => {
  const host = config?.smtpHost || process.env.SMTP_HOST;
  const port = config?.smtpPort || Number(process.env.SMTP_PORT) || 587;
  const secure = config?.smtpSecure ?? (port === 465);
  const user = config?.smtpUser || process.env.SMTP_USER;
  const pass = config?.smtpPass || process.env.SMTP_PASS;

  if (!host || !user) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
};

export const sendTestEmail = async (
  targetEmail: string,
  customConfig?: Partial<EmailSettings>
): Promise<{ success: boolean; message: string }> => {
  const settings = customConfig
    ? { ...(await getEmailSettings()), ...customConfig }
    : await getEmailSettings();

  const transporter = createTransporter(settings);

  if (!transporter) {
    throw new Error('SMTP host and username must be configured before sending test email.');
  }

  // Verify connection
  await transporter.verify();

  const fromAddress = `"${settings.fromName}" <${settings.fromEmail || settings.smtpUser}>`;

  const info = await transporter.sendMail({
    from: fromAddress,
    to: targetEmail,
    subject: '🗡️ Persatuan Aadhiran Silambam — SMTP Connection Test',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #070E24; color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #1E40AF;">
        <div style="background: linear-gradient(135deg, #0B1B3D 0%, #1E40AF 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #F5CF16;">
          <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: 0.05em;">AADHIRAN SILAMBAM</h1>
          <p style="margin: 6px 0 0; color: #F5CF16; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Persatuan Aadhiran Silambam Pulau Pinang</p>
        </div>
        <div style="padding: 32px 24px; line-height: 1.6; color: #E2E8F0;">
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #6EE7B7; font-weight: bold; font-size: 14px;">✅ SMTP Connection Verified Successfully!</p>
            <p style="margin: 6px 0 0; color: #D1FAE5; font-size: 13px;">This test email confirms that your outgoing mail server configuration is fully operational.</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #94A3B8; width: 140px;">SMTP Host:</td>
              <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${settings.smtpHost}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94A3B8;">SMTP Port:</td>
              <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${settings.smtpPort} (${settings.smtpSecure ? 'SSL' : 'TLS'})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94A3B8;">Sender:</td>
              <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${fromAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94A3B8;">Dispatched At:</td>
              <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${new Date().toUTCString()}</td>
            </tr>
          </table>
          <p style="font-size: 12px; color: #94A3B8; margin: 0; border-top: 1px solid #1E293B; pt-4;">
            Persatuan Aadhiran Silambam Pulau Pinang (PPM-014-07-25021975)<br/>
            Headquarters: Lebuh King, George Town, 10200 Penang, Malaysia.
          </p>
        </div>
      </div>
    `,
  });

  AuditLogger.log({
    actorId: 'admin',
    action: 'SEND_TEST_EMAIL',
    resourceType: 'smtp',
    resourceId: targetEmail,
  });

  return {
    success: true,
    message: `Test email dispatched successfully to ${targetEmail} (Message ID: ${info.messageId}).`,
  };
};

export const sendEnquiryNotification = async (enquiry: {
  id?: string;
  enquiry_type: string;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  age_group?: string;
  experience_level?: string;
  preferred_location?: string;
  created_at?: string;
}): Promise<void> => {
  try {
    const settings = await getEmailSettings();
    const transporter = createTransporter(settings);

    const isJoin = enquiry.enquiry_type === 'join_training';
    const enquiryTitle = isJoin
      ? '🥋 New Admission Application — Join Silambam Training'
      : '✉️ New Website Enquiry Received';

    const fromAddress = `"${settings.fromName}" <${settings.fromEmail || settings.smtpUser}>`;

    // 1. Send Notification Email to Association Admin
    if (transporter && settings.enableAdminNotification && settings.adminNotificationEmail) {
      await transporter.sendMail({
        from: fromAddress,
        to: settings.adminNotificationEmail,
        replyTo: enquiry.email,
        subject: `[Aadhiran Silambam] ${enquiryTitle}: ${enquiry.full_name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: 0 auto; background: #070E24; color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #1E40AF;">
            <div style="background: linear-gradient(135deg, #0B1B3D 0%, #1E40AF 100%); padding: 28px 24px; border-bottom: 2px solid #F5CF16;">
              <span style="display: inline-block; padding: 4px 10px; background: rgba(245, 207, 22, 0.2); border: 1px solid #F5CF16; border-radius: 9999px; color: #F5CF16; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
                ${isJoin ? 'Training Intake Application' : 'General Public Enquiry'}
              </span>
              <h2 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800;">${enquiryTitle}</h2>
              <p style="margin: 4px 0 0; color: #93C5FD; font-size: 13px;">Received via Aadhiran Official Platform</p>
            </div>

            <div style="padding: 28px 24px; color: #E2E8F0; line-height: 1.6;">
              <div style="background: #0B1B3D; border: 1px solid #1E3A8A; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8; width: 140px;">Applicant Name:</td>
                    <td style="padding: 6px 0; color: #FFFFFF; font-weight: 700;">${enquiry.full_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Email Address:</td>
                    <td style="padding: 6px 0;"><a href="mailto:${enquiry.email}" style="color: #60A5FA; text-decoration: none;">${enquiry.email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Phone / WhatsApp:</td>
                    <td style="padding: 6px 0;"><a href="tel:${enquiry.phone}" style="color: #34D399; text-decoration: none; font-weight: 600;">${enquiry.phone}</a></td>
                  </tr>
                  ${enquiry.age_group ? `
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Age Category:</td>
                    <td style="padding: 6px 0; color: #F59E0B; font-weight: 600;">${enquiry.age_group}</td>
                  </tr>` : ''}
                  ${enquiry.experience_level ? `
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Prior Experience:</td>
                    <td style="padding: 6px 0; color: #E2E8F0;">${enquiry.experience_level}</td>
                  </tr>` : ''}
                  ${enquiry.preferred_location ? `
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Preferred Venue:</td>
                    <td style="padding: 6px 0; color: #E2E8F0;">${enquiry.preferred_location}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Submitted At:</td>
                    <td style="padding: 6px 0; color: #94A3B8; font-size: 12px;">${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })} (MYT)</td>
                  </tr>
                </table>
              </div>

              <div style="margin-bottom: 24px;">
                <h4 style="margin: 0 0 8px; color: #F5CF16; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message / Details:</h4>
                <div style="background: #030712; border: 1px solid #1F2937; border-radius: 8px; padding: 16px; font-size: 13px; color: #F3F4F6; white-space: pre-wrap;">
                  ${enquiry.message}
                </div>
              </div>

              <div style="text-align: center; padding-top: 12px;">
                <a href="${process.env.APP_URL || 'https://aadhiran.com'}/admin/enquiries" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: #FFFFFF; font-weight: 700; font-size: 13px; text-decoration: none; border-radius: 8px; border: 1px solid #60A5FA;">
                  Open Enquiry in Admin Portal →
                </a>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`[EmailService] Admin notification dispatched for enquiry from ${enquiry.email}`);
    }

    // 2. Send Auto-Confirmation Email to Applicant
    if (transporter && settings.enableApplicantConfirmation && enquiry.email) {
      await transporter.sendMail({
        from: fromAddress,
        to: enquiry.email,
        subject: isJoin
          ? 'Persatuan Aadhiran Silambam — Admission Application Confirmation'
          : 'Persatuan Aadhiran Silambam — Enquiry Received',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #070E24; color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #1E40AF;">
            <div style="background: linear-gradient(135deg, #0B1B3D 0%, #1E40AF 100%); padding: 32px 24px; text-align: center; border-bottom: 2px solid #F5CF16;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: 0.05em;">AADHIRAN SILAMBAM</h1>
              <p style="margin: 6px 0 0; color: #F5CF16; font-size: 13px; font-weight: 600; text-transform: uppercase;">Persatuan Aadhiran Silambam Pulau Pinang</p>
              <p style="margin: 2px 0 0; color: #93C5FD; font-size: 11px;">Certified Oldest Silambam Association in Malaysia (Est. 1975)</p>
            </div>

            <div style="padding: 32px 24px; color: #E2E8F0; line-height: 1.6;">
              <h3 style="margin: 0 0 12px; color: #FFFFFF; font-size: 18px;">Vanakkam, ${enquiry.full_name}!</h3>
              <p style="margin: 0 0 16px; font-size: 14px; color: #CBD5E1;">
                Thank you for reaching out to Persatuan Aadhiran Silambam Pulau Pinang. We have successfully registered your ${isJoin ? 'intake application for traditional Silambam training' : 'enquiry'}.
              </p>

              <div style="background: rgba(30, 64, 175, 0.25); border: 1px solid #2563EB; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #93C5FD; font-weight: 600;">What happens next?</p>
                <p style="margin: 6px 0 0; font-size: 13px; color: #E2E8F0;">
                  Our administrative desk and Chief Instructors review applications regularly. A master will contact you via WhatsApp or phone at <strong style="color: #34D399;">${enquiry.phone}</strong> or reply to this email within 1–2 business days.
                </p>
              </div>

              <div style="border-top: 1px solid #1E293B; pt-4; font-size: 12px; color: #94A3B8;">
                <p style="margin: 0 0 4px; font-weight: 600; color: #FFFFFF;">Association Headquarters:</p>
                <p style="margin: 0;">Lebuh King, George Town, 10200 Penang, Malaysia</p>
                <p style="margin: 4px 0 0;">Phone: +60 16-414 7856 • WhatsApp: +974 3369 0769</p>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`[EmailService] Applicant confirmation email dispatched to ${enquiry.email}`);
    }
  } catch (error) {
    console.error('[EmailService] Failed to dispatch email notification:', error);
    // Non-fatal: Enquiry is already safely stored in DB
  }
};
