import { Router } from 'express';
import { backupEngine } from '../storage/backup.js';
import { cache } from '../storage/cache.js';

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

export default router;

