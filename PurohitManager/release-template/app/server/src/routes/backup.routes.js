import { Router } from 'express';
import { backupEngine } from '../storage/backup.js';
import { cache } from '../storage/cache.js';
import { settingsRepo } from '../repositories/settings.repo.js';
import { smtpService } from '../services/smtp.service.js';

const router = Router();

// GET list of snapshots
router.get('/snapshots', (req, res) => {
  const list = backupEngine.listSnapshots();
  res.json({ success: true, data: list });
});

// POST create snapshot now
router.post('/create', (req, res, next) => {
  try {
    const dir = backupEngine.createSnapshot();
    res.json({ success: true, message: "Backup snapshot created successfully", path: dir });
  } catch (err) {
    next(err);
  }
});

// GET export all data as ZIP download
router.get('/export', async (req, res, next) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `PurohitManager-Backup-${timestamp}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await backupEngine.exportZip(res);
  } catch (err) {
    next(err);
  }
});

// POST restore snapshot
router.post('/restore/:id', (req, res, next) => {
  try {
    backupEngine.restoreSnapshot(req.params.id);
    cache.clear(); // invalidate in-memory cache
    res.json({ success: true, message: "Data restored successfully from snapshot" });
  } catch (err) {
    next(err);
  }
});

// POST email backup ZIP to assigned email (or specified email)
router.post('/email', async (req, res, next) => {
  try {
    const settings = await settingsRepo.get();
    const recipient = (req.body.to || req.body.email || settings.email || '').trim();

    if (!recipient) {
      return res.status(400).json({
        success: false,
        error: "ನಿಯೋಜಿತ ಇಮೇಲ್ ವಿಳಾಸ ಸಿಕ್ಕಿಲ್ಲ. ದಯವಿಟ್ಟು ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಅಥವಾ ಇಲ್ಲಿ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ. (Assigned email address is required)"
      });
    }

    // If user asked to update the assigned email in settings
    if (req.body.saveAsDefault && req.body.email && req.body.email !== settings.email) {
      await settingsRepo.update({ email: req.body.email });
    }

    const extraFiles = req.body.extraFiles || [];
    const zipBuffer = await backupEngine.createZipBuffer(extraFiles);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `ChaitanyaKrupaMukthiDham-Backup-${timestamp}.zip`;

    const subject = req.body.subject || `ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ - ಸಂಪೂರ್ಣ ಡೇಟಾ ಬ್ಯಾಕಪ್ (${new Date().toLocaleDateString('kn-IN')})`;
    const plainText = req.body.text || `ನಮಸ್ಕಾರ,\n\nಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ ನಿರ್ವಹಣಾ ತಂತ್ರಾಂಶದ ಎಲ್ಲಾ ಡೇಟಾ ಫೈಲ್‌ಗಳ (${new Date().toLocaleString()}) ಸಂಪೂರ್ಣ ಬ್ಯಾಕಪ್ ZIP ಫೈಲ್ ಅನ್ನು ಲಗತ್ತಿಸಲಾಗಿದೆ.\n\nಕಡತ: ${filename}\nಗಾತ್ರ: ${(zipBuffer.length / 1024).toFixed(1)} KB\n\nಧನ್ಯವಾದಗಳು.`;
    const htmlBody = req.body.html || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #b45309; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #9a3412; color: #fff; padding: 16px; text-align: center;">
          <h2 style="margin: 0; font-size: 20px;">॥ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ ॥</h2>
          <h3 style="margin: 4px 0 0 0; font-size: 18px;">ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ - ಡೇಟಾ ಬ್ಯಾಕಪ್</h3>
        </div>
        <div style="padding: 20px; background-color: #fffbeb; color: #451a03; line-height: 1.6;">
          <p><strong>ದಿನಾಂಕ:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>ಬ್ಯಾಕಪ್ ಕಡತ:</strong> ${filename}</p>
          <p><strong>ಫೈಲ್ ಗಾತ್ರ:</strong> ${(zipBuffer.length / 1024).toFixed(1)} KB</p>
          <p>ಈ ಇಮೇಲ್‌ನೊಂದಿಗೆ ಮುಕ್ತಿ ಧಾಮದ ಎಲ್ಲಾ ಗ್ರಾಹಕರು, ಬುಕಿಂಗ್ಸ್, ಪೂಜೆಗಳು, ಲೆಕ್ಕಪತ್ರಗಳು ಮತ್ತು ಸೆಟ್ಟಿಂಗ್ಸ್‌ಗಳ ಸಂಪೂರ್ಣ ಜಿಪ್ (ZIP) ಕಡತವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಲಗತ್ತಿಸಲಾಗಿದೆ.</p>
        </div>
      </div>
    `;

    // Check for SMTP configuration (from request body or settings)
    const smtpConfig = req.body.smtpConfig || settings.smtp || null;
    const hasSmtpCreds = smtpConfig && smtpConfig.user && smtpConfig.pass;

    if (hasSmtpCreds) {
      await smtpService.sendMail({
        host: smtpConfig.host || 'smtp.gmail.com',
        port: Number(smtpConfig.port) || (smtpConfig.secure !== false ? 465 : 587),
        secure: smtpConfig.secure !== false,
        user: smtpConfig.user,
        pass: smtpConfig.pass,
        from: smtpConfig.from || smtpConfig.user,
        to: recipient,
        subject,
        text: plainText,
        html: htmlBody,
        attachments: [{
          filename,
          content: zipBuffer,
          contentType: 'application/zip'
        }]
      });

      return res.json({
        success: true,
        method: 'smtp',
        message: `ಬ್ಯಾಕಪ್ ZIP ಫೈಲ್ (${filename}) ಅನ್ನು ${recipient} ಇಮೇಲ್‌ಗೆ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!`,
        recipient,
        filename,
        fileSize: zipBuffer.length
      });
    } else {
      // Client assist mode (open mail with pre-filled content + download ZIP)
      return res.json({
        success: true,
        method: 'client',
        message: `ಬ್ಯಾಕಪ್ ZIP ಸಿದ್ಧವಾಗಿದೆ. ಇಮೇಲ್ ಕಳುಹಿಸಲು ಸಿದ್ಧಗೊಳಿಸಲಾಗಿದೆ.`,
        recipient,
        filename,
        fileSize: zipBuffer.length,
        subject,
        bodyText: plainText,
        downloadUrl: `/api/backup/export`
      });
    }
  } catch (err) {
    next(err);
  }
});

// POST restore from uploaded files
router.post('/upload-restore', async (req, res, next) => {
  try {
    const { files } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ success: false, error: "ಯಾವುದೇ ಫೈಲ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ (No files provided)" });
    }

    const result = backupEngine.restoreFromFiles(files);
    cache.clear();
    res.json({
      success: true,
      message: `${result.restoredCount} ಬ್ಯಾಕಪ್ ಫೈಲ್‌ಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ (Restored successfully)!`,
      count: result.restoredCount
    });
  } catch (err) {
    next(err);
  }
});

export default router;

