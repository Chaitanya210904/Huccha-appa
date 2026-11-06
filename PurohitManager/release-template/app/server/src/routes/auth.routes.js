import { Router } from 'express';
import { settingsRepo } from '../repositories/settings.repo.js';

const router = Router();

// GET auth status
router.get('/status', async (req, res, next) => {
  try {
    const settings = await settingsRepo.get();
    res.json({
      success: true,
      data: {
        pinAuthEnabled: Boolean(settings.pinAuthEnabled)
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST verify PIN
router.post('/verify', async (req, res, next) => {
  try {
    const { pin } = req.body;
    const settings = await settingsRepo.get();

    if (!settings.pinAuthEnabled) {
      return res.json({ success: true, verified: true });
    }

    if (settings.pinCode === pin || !settings.pinCode) {
      return res.json({ success: true, verified: true });
    }

    res.status(401).json({ success: false, error: "Incorrect PIN" });
  } catch (err) {
    next(err);
  }
});

// POST set/update PIN
router.post('/set-pin', async (req, res, next) => {
  try {
    const { pin, enabled } = req.body;
    await settingsRepo.update({
      pinAuthEnabled: Boolean(enabled),
      pinCode: pin || ''
    });
    res.json({ success: true, message: "Security PIN updated" });
  } catch (err) {
    next(err);
  }
});

export default router;

