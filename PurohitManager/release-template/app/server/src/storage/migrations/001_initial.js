import fs from 'fs';
import { ENTITY_FILES } from '../../config/paths.js';
import { jsonStore } from '../jsonStore.js';

export async function up() {
  // Ensure default services
  const defaultServices = [
    { id: 'satyanarayana', name: 'Sri Satyanarayana Vrata Puja', defaultDakshina: 5000, durationHours: 3 },
    { id: 'shraddha', name: 'Annual Pratyabdika Shraddha', defaultDakshina: 4000, durationHours: 3.5 },
    { id: 'mahalaya', name: 'Mahalaya Pitru Paksha Shraddha', defaultDakshina: 3000, durationHours: 2.5 },
    { id: 'ganapati_homa', name: 'Maha Ganapati Homa', defaultDakshina: 6000, durationHours: 2.5 },
    { id: 'navagraha_homa', name: 'Navagraha Homa & Shanti', defaultDakshina: 7500, durationHours: 3 },
    { id: 'vivaha', name: 'Vivaha Samskara (Wedding)', defaultDakshina: 25000, durationHours: 6 },
    { id: 'upanayana', name: 'Upanayana Samskara (Munjvi)', defaultDakshina: 15000, durationHours: 5 },
    { id: 'grihapravesha', name: 'Grihapravesha & Vastu Shanti', defaultDakshina: 10000, durationHours: 4 },
    { id: 'namakarana', name: 'Namakarana (Cradle / Naming)', defaultDakshina: 3500, durationHours: 2 }
  ];

  if (!fs.existsSync(ENTITY_FILES.services)) {
    await jsonStore.write(ENTITY_FILES.services, defaultServices);
  }

  // Ensure default settings
  const defaultSettings = {
    purohitName: "Pandit Venkatesha Sharma",
    title: "Vedic Purohit",
    phone: "",
    email: "",
    upiId: "",
    cityId: "blr",
    cityName: "Bengaluru",
    latitude: 12.9716,
    longitude: 77.5946,
    timezone: "Asia/Kolkata",
    sampradaya: "Smartha",
    ayanamsa: "Lahiri",
    calendarSystem: "Amanta",
    language: "en",
    pinAuthEnabled: false,
    pinHash: ""
  };

  if (!fs.existsSync(ENTITY_FILES.settings)) {
    await jsonStore.write(ENTITY_FILES.settings, defaultSettings);
  }

  // Ensure other files exist as empty arrays
  const arrayEntities = [
    'clients', 'familyMembers', 'deceased', 'bookings',
    'payments', 'expenses', 'inventory', 'assistants'
  ];

  for (const entity of arrayEntities) {
    if (!fs.existsSync(ENTITY_FILES[entity])) {
      await jsonStore.write(ENTITY_FILES[entity], []);
    }
  }
}

