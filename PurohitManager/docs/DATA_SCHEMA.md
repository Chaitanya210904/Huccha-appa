# Data Schema & File Structure

PurohitManager stores all data in human-readable, atomic JSON files inside the `data/` folder. This ensures offline autonomy, easy backup, and vendor independence.

---

## 1. `settings.json`
Stores the priest's profile, default location coordinates, and calculation preferences.

```json
{
  "purohitName": "Pandit Venkatesha Sharma",
  "title": "Rigveda Samhita / Smartha Purohit",
  "phone": "+91 98450 12345",
  "email": "venkatesh.purohit@example.com",
  "upiId": "venkatesh@upi",
  "cityId": "blr",
  "cityName": "Bengaluru",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "timezone": "Asia/Kolkata",
  "sampradaya": "Smartha",
  "ayanamsa": "Lahiri",
  "calendarSystem": "Amanta",
  "language": "en"
}
```

---

## 2. `clients.json`
Stores client (Yajamana) contact and genealogical details.

```json
[
  {
    "id": "c-001",
    "name": "K. Srinivas Murthy",
    "phone": "+91 98860 11223",
    "alternatePhone": "+91 94480 33445",
    "email": "murthy.srinivas@example.com",
    "address": "42, 4th Cross, Malleshwaram, Bengaluru 560003",
    "gotra": "Kashyapa",
    "nakshatra": "Rohini",
    "rashi": "Vrishabha",
    "community": "Smartha",
    "notes": "Regular client for 15 years.",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

## 3. `deceased.json`
Stores deceased ancestors for annual Shraddha and Mahalaya calculations.

```json
[
  {
    "id": "d-001",
    "clientId": "c-001",
    "clientName": "K. Srinivas Murthy",
    "name": "Late K. Ramachandra Murthy",
    "relation": "Father (Pitru)",
    "gotra": "Kashyapa",
    "deathDate": "2019-11-20",
    "deathTime": "14:35",
    "deathPlace": "Bengaluru",
    "masa": "Kartika",
    "paksha": "Krishna",
    "tithi": 24,
    "tithiName": "Navami",
    "nakshatra": "Purva Phalguni",
    "sampradaya": "Smartha",
    "notes": "Died in afternoon during Aparahna.",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## 4. `bookings.json`
Stores ceremony and ritual appointments.

```json
[
  {
    "id": "b-001",
    "clientId": "c-001",
    "clientName": "K. Srinivas Murthy",
    "serviceId": "satyanarayana",
    "serviceName": "Sri Satyanarayana Vrata Puja",
    "date": "2026-11-15",
    "time": "09:30",
    "venue": "42, 4th Cross, Malleshwaram, Bengaluru",
    "dakshina": 5000,
    "paidAmount": 5000,
    "status": "confirmed",
    "assistantIds": ["a-001"],
    "samagriChecklist": [
      { "item": "Turmeric powder", "qty": "100 g", "provided": true }
    ],
    "notes": "Kartika Purnima Puja",
    "createdAt": "2026-11-01T10:00:00.000Z"
  }
]
```

---

## 5. `payments.json`
Stores Dakshina receipts issued to clients.

```json
[
  {
    "id": "p-001",
    "bookingId": "b-001",
    "clientId": "c-001",
    "clientName": "K. Srinivas Murthy",
    "amount": 5000,
    "date": "2026-11-01",
    "mode": "UPI",
    "receiptNumber": "REC-2026-0001",
    "notes": "Full payment received",
    "createdAt": "2026-11-01T10:30:00.000Z"
  }
]
```

---

## 6. `expenses.json`
Stores outgoing expenses (samagri restock, assistant payouts, travel).

```json
[
  {
    "id": "e-001",
    "title": "Samidha & Pure Ghee restock",
    "category": "Samagri",
    "amount": 1850,
    "date": "2026-11-02",
    "paymentMode": "UPI",
    "notes": "Purchased from Veda Pathashala store"
  }
]
```

---

## 7. `inventory.json`
Tracks samagri stock levels and reorder thresholds.

```json
[
  {
    "id": "inv-001",
    "name": "Pure Cow Ghee (liters)",
    "quantity": 4.5,
    "unit": "liters",
    "minThreshold": 2,
    "costPerUnit": 700
  }
]
```

