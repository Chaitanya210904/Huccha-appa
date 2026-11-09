import tls from 'tls';
import net from 'net';
import { logger } from '../utils/logger.js';

/**
 * Robust, zero-dependency SMTP client for sending emails with attachments.
 * Works seamlessly with Gmail, Outlook, Zoho, and custom SMTP servers.
 */
export const smtpService = {
  /**
   * Sends an email with optional attachments.
   * @param {Object} options
   * @param {string} options.host - SMTP server host (e.g. smtp.gmail.com)
   * @param {number} options.port - SMTP port (465 for SSL/TLS, 587 for STARTTLS)
   * @param {boolean} options.secure - True for port 465 SSL/TLS
   * @param {string} options.user - SMTP username / email
   * @param {string} options.pass - SMTP password / App Password
   * @param {string} [options.from] - Sender address (defaults to user)
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} [options.text] - Plain text body
   * @param {string} [options.html] - HTML body
   * @param {Array<{ filename: string, content: Buffer|string, contentType?: string }>} [options.attachments]
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async sendMail({
    host = 'smtp.gmail.com',
    port = 465,
    secure = true,
    user,
    pass,
    from,
    to,
    subject = 'PurohitManager Backup',
    text = '',
    html = '',
    attachments = []
  }) {
    if (!to) {
      throw new Error('Recipient email (to) is required');
    }
    if (!user || !pass) {
      throw new Error('SMTP user and password (or App Password) are required');
    }

    const senderEmail = from || user;
    const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    // Build MIME message
    const mimeParts = [];
    mimeParts.push(`From: ${senderEmail}`);
    mimeParts.push(`To: ${to}`);
    mimeParts.push(`Subject: =?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`);
    mimeParts.push('MIME-Version: 1.0');
    mimeParts.push(`Date: ${new Date().toUTCString()}`);

    if (attachments.length > 0) {
      mimeParts.push(`Content-Type: multipart/mixed; boundary="${boundary}"\r\n`);

      // Body part
      mimeParts.push(`--${boundary}`);
      if (html) {
        mimeParts.push('Content-Type: text/html; charset=UTF-8');
        mimeParts.push('Content-Transfer-Encoding: base64\r\n');
        mimeParts.push(Buffer.from(html, 'utf-8').toString('base64'));
      } else {
        mimeParts.push('Content-Type: text/plain; charset=UTF-8');
        mimeParts.push('Content-Transfer-Encoding: base64\r\n');
        mimeParts.push(Buffer.from(text, 'utf-8').toString('base64'));
      }

      // Attachments
      for (const att of attachments) {
        const cType = att.contentType || 'application/octet-stream';
        const buf = Buffer.isBuffer(att.content)
          ? att.content
          : Buffer.from(att.content, typeof att.content === 'string' && att.encoding === 'base64' ? 'base64' : 'utf-8');

        mimeParts.push(`--${boundary}`);
        mimeParts.push(`Content-Type: ${cType}; name="${att.filename}"`);
        mimeParts.push('Content-Transfer-Encoding: base64');
        mimeParts.push(`Content-Disposition: attachment; filename="${att.filename}"\r\n`);
        
        // Chunk base64 into 76-character lines (RFC 2045)
        const b64 = buf.toString('base64');
        const chunked = b64.match(/.{1,76}/g)?.join('\r\n') || b64;
        mimeParts.push(chunked);
      }

      mimeParts.push(`--${boundary}--\r\n`);
    } else {
      if (html) {
        mimeParts.push('Content-Type: text/html; charset=UTF-8');
        mimeParts.push('Content-Transfer-Encoding: base64\r\n');
        mimeParts.push(Buffer.from(html, 'utf-8').toString('base64'));
      } else {
        mimeParts.push('Content-Type: text/plain; charset=UTF-8');
        mimeParts.push('Content-Transfer-Encoding: base64\r\n');
        mimeParts.push(Buffer.from(text, 'utf-8').toString('base64'));
      }
    }

    const mimeMessage = mimeParts.join('\r\n');

    return new Promise((resolve, reject) => {
      let socket;
      let buffer = '';
      let isUpgraded = false;

      const cleanup = () => {
        if (socket && !socket.destroyed) {
          socket.destroy();
        }
      };

      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error(`SMTP connection timed out to ${host}:${port}`));
      }, 30000);

      const readReply = () => {
        return new Promise((res, rej) => {
          const check = () => {
            const lines = buffer.split('\r\n');
            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i];
              // Last line in multiline SMTP response has space at char 3 (e.g. "250 OK")
              if (line.length >= 4 && line.charAt(3) === ' ') {
                const fullResponse = lines.slice(0, i + 1).join('\n');
                buffer = lines.slice(i + 1).join('\r\n');
                const code = parseInt(line.substring(0, 3), 10);
                return res({ code, message: fullResponse });
              }
            }
          };

          const onData = (chunk) => {
            buffer += chunk.toString('utf-8');
            check();
          };

          const onError = (err) => rej(err);

          socket.on('data', onData);
          socket.once('error', onError);

          check();
        });
      };

      const sendCommand = async (cmd, expectedCodes = [250]) => {
        socket.write(cmd + '\r\n');
        const reply = await readReply();
        if (!expectedCodes.includes(reply.code)) {
          throw new Error(`SMTP Error [${reply.code}]: ${reply.message} (Command: ${cmd.split(' ')[0]})`);
        }
        return reply;
      };

      const runSession = async () => {
        try {
          // 1. Initial greeting
          const greeting = await readReply();
          if (greeting.code !== 220) {
            throw new Error(`Unexpected greeting: ${greeting.message}`);
          }

          // 2. EHLO
          await sendCommand('EHLO localhost', [250]);

          // STARTTLS upgrade if needed on port 587
          if (!secure && port === 587 && !isUpgraded) {
            await sendCommand('STARTTLS', [220]);
            isUpgraded = true;
            socket = tls.connect({
              socket,
              host,
              rejectUnauthorized: false
            });
            await sendCommand('EHLO localhost', [250]);
          }

          // 3. AUTH LOGIN
          await sendCommand('AUTH LOGIN', [334]);
          await sendCommand(Buffer.from(user).toString('base64'), [334]);
          await sendCommand(Buffer.from(pass).toString('base64'), [235]);

          // 4. MAIL FROM
          await sendCommand(`MAIL FROM:<${senderEmail}>`, [250]);

          // 5. RCPT TO
          await sendCommand(`RCPT TO:<${to}>`, [250]);

          // 6. DATA
          await sendCommand('DATA', [354]);

          // 7. Send message body followed by .\r\n
          socket.write(mimeMessage + '\r\n.\r\n');
          await readReply(); // Expect 250

          // 8. QUIT
          try {
            await sendCommand('QUIT', [221, 250]);
          } catch (_) {}

          clearTimeout(timeout);
          cleanup();
          logger.info(`Email successfully sent via SMTP to: ${to}`);
          resolve({ success: true, message: `Email sent successfully to ${to}` });
        } catch (err) {
          clearTimeout(timeout);
          cleanup();
          logger.error(`SMTP session failed: ${err.message}`);
          reject(err);
        }
      };

      // Connect
      if (secure || port === 465) {
        socket = tls.connect({
          host,
          port,
          minVersion: 'TLSv1.2',
          rejectUnauthorized: false
        }, runSession);
      } else {
        socket = net.connect({ host, port }, runSession);
      }

      socket.once('error', (err) => {
        clearTimeout(timeout);
        cleanup();
        reject(err);
      });
    });
  }
};
