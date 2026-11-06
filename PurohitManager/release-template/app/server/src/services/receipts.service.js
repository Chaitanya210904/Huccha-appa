import { paymentsRepo } from '../repositories/payments.repo.js';
import { bookingsRepo } from '../repositories/bookings.repo.js';
import { clientsRepo } from '../repositories/clients.repo.js';
import { settingsRepo } from '../repositories/settings.repo.js';
import { getPanchang } from '@purohit-manager/shared';

function numberToWords(num) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
             'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + a[num % 10] : '');
  if (num < 1000) return a[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' and ' + numberToWords(num % 100) : '');
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
  return num.toString();
}

export const receiptsService = {
  async getReceiptDetails(paymentId) {
    const payment = await paymentsRepo.getById(paymentId);
    if (!payment) return null;

    const settings = await settingsRepo.get();
    const client = await clientsRepo.getById(payment.clientId);
    const booking = payment.bookingId ? await bookingsRepo.getById(payment.bookingId) : null;

    // Get Vedic date details for receipt
    const place = { lat: settings.latitude, lon: settings.longitude, name: settings.cityName };
    const panchang = getPanchang(payment.date || new Date(), place);

    return {
      receiptNumber: payment.receiptNumber,
      paymentDate: payment.date,
      amount: payment.amount,
      amountInWords: `Rupees ${numberToWords(payment.amount)} Only`,
      paymentMode: payment.mode,
      notes: payment.notes,
      institution: {
        kannada: "ಚೈತನ್ಯ ಕೃಪಾ ಮುಕ್ತಿ ಧಾಮ",
        english: "Chaitanya Krupa Mukthi Dham",
        subtitle: "ವೈದಿಕ ಸೇವೆಗಳು, ಪೂಜೆಗಳು ಮತ್ತು ಸಂಸ್ಕಾರ ಕೇಂದ್ರ"
      },
      purohit: {
        name: settings.purohitName,
        title: settings.title,
        phone: settings.phone,
        email: settings.email,
        upiId: settings.upiId,
        city: settings.cityName
      },
      client: {
        name: client ? client.name : payment.clientName,
        gotra: client?.gotra || '',
        phone: client?.phone || '',
        address: client?.address || ''
      },
      ceremony: booking ? {
        name: booking.serviceName,
        date: booking.date,
        venue: booking.venue
      } : null,
      vedicDate: {
        samvatsara: panchang.calendar.samvatsara.name,
        ayana: panchang.calendar.ayana.sanskrit,
        ritu: panchang.calendar.ritu.sanskrit,
        masa: panchang.calendar.masa.name,
        paksha: panchang.angas.udayaTithi.paksha,
        tithi: panchang.angas.udayaTithi.name,
        vara: panchang.angas.vara.sanskrit
      }
    };
  }
};

