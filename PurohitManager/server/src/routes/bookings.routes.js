import { Router } from 'express';
import { bookingsRepo } from '../repositories/bookings.repo.js';
import { servicesRepo } from '../repositories/services.repo.js';
import { validate } from '../middleware/validate.js';
import { BookingSchema } from '@purohit-manager/shared';

const router = Router();

// GET all bookings
router.get('/', async (req, res, next) => {
  try {
    let bookings = await bookingsRepo.getAll();
    const { status, date, month } = req.query;

    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    if (date) {
      bookings = bookings.filter(b => b.date === date);
    }
    if (month) {
      bookings = bookings.filter(b => b.date && b.date.startsWith(month));
    }

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

// GET booking by ID
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await bookingsRepo.getById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

// POST new booking
router.post('/', validate(BookingSchema), async (req, res, next) => {
  try {
    const { date, time } = req.body;
    const existingBookings = await bookingsRepo.getAll();
    const services = await servicesRepo.getAll();
    const serviceMap = new Map(services.map(s => [s.id, s]));

    // Strictly prevent double-booking / overlapping appointments for the Poojari
    const toMinutes = (t) => {
      if (!t || typeof t !== 'string' || !t.includes(':')) return 0;
      const [h, m] = t.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const getDurationMins = (booking) => {
      if (booking.durationHours) return Number(booking.durationHours) * 60;
      const svc = serviceMap.get(booking.serviceId);
      return (svc?.durationHours ? Number(svc.durationHours) : 2.5) * 60;
    };

    const newStart = toMinutes(time);
    const newEnd = newStart + getDurationMins(req.body);

    const conflict = existingBookings.find(b => {
      if (b.status === 'cancelled') return false;
      if (b.date !== date) return false;
      const bStart = toMinutes(b.time);
      const bEnd = bStart + getDurationMins(b);
      return Math.max(newStart, bStart) < Math.min(newEnd, bEnd);
    });

    if (conflict) {
      const confStart = toMinutes(conflict.time);
      const confEnd = confStart + getDurationMins(conflict);
      const formatTimeHM = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      };

      return res.status(409).json({
        success: false,
        error: `Time conflict! You already have '${conflict.serviceName}' booked for client '${conflict.clientName}' on ${date} from ${formatTimeHM(confStart)} to ${formatTimeHM(confEnd)}. The Poojari cannot have overlapping appointments at the same time.`
      });
    }

    const newBooking = await bookingsRepo.create(req.body);
    res.status(201).json({ success: true, data: newBooking });
  } catch (err) {
    next(err);
  }
});

// PUT update booking
router.put('/:id', async (req, res, next) => {
  try {
    const { date, time } = req.body;
    if (date && time) {
      const existingBookings = await bookingsRepo.getAll();
      const services = await servicesRepo.getAll();
      const serviceMap = new Map(services.map(s => [s.id, s]));

      const toMinutes = (t) => {
        if (!t || typeof t !== 'string' || !t.includes(':')) return 0;
        const [h, m] = t.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
      };

      const getDurationMins = (booking) => {
        if (booking.durationHours) return Number(booking.durationHours) * 60;
        const svc = serviceMap.get(booking.serviceId);
        return (svc?.durationHours ? Number(svc.durationHours) : 2.5) * 60;
      };

      const newStart = toMinutes(time);
      const newEnd = newStart + getDurationMins(req.body);

      const conflict = existingBookings.find(b => {
        if (b.id === req.params.id) return false;
        if (b.status === 'cancelled') return false;
        if (b.date !== date) return false;
        const bStart = toMinutes(b.time);
        const bEnd = bStart + getDurationMins(b);
        return Math.max(newStart, bStart) < Math.min(newEnd, bEnd);
      });

      if (conflict) {
        const confStart = toMinutes(conflict.time);
        const confEnd = confStart + getDurationMins(conflict);
        const formatTimeHM = (mins) => {
          const h = Math.floor(mins / 60);
          const m = mins % 60;
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        return res.status(409).json({
          success: false,
          error: `Time conflict! You already have '${conflict.serviceName}' booked for client '${conflict.clientName}' on ${date} from ${formatTimeHM(confStart)} to ${formatTimeHM(confEnd)}. The Poojari cannot have overlapping appointments at the same time.`
        });
      }
    }

    const updated = await bookingsRepo.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Booking not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE booking
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await bookingsRepo.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Booking not found" });
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;

