# 🪔 PurohitManager (पुरोहित व्यवस्थापक - ಪುರೋಹಿತ ವ್ಯವಸ್ಥಾಪಕ)

**PurohitManager** is a comprehensive, offline-first desktop management application created for Vedic Purohits (priests), Jyotishis, and religious scholars. It streamlines client management, ceremony scheduling, samagri inventory, Dakshina receipts, and most importantly, computes high-precision **Vedic Panchang** and **Shraddha dates (Annual & Mahalaya)** according to Dharma Shastra principles.

---

## ✨ Key Capabilities

- **100% Offline Astronomical Engine**:
  - Implements **Lahiri (Chitra Paksha)**, **Raman**, and **KP** ayanamsas.
  - Calculates the five limbs: **Tithi** (with exact start/end via root finding, Udaya tithi, Kshaya & Vriddhi), **Nakshatra** & Pada, **Yoga**, **Karana** (including Vishti / Bhadra), and **Vara** (sunrise-based weekday).
  - Determines **Amanta & Purnimanta Masa** with **Adhika Masa** and **Kshaya Masa** detection.
  - Calculates the **60-year Jovian Samvatsara cycle**, **Shaka Samvat**, **Vikram Samvat**, and **Kali Yuga**.
  - Precise solar timings: **Sunrise**, **Sunset**, **Solar Noon**, **Dinamana**, **Ratrimana**, and the **5-fold daytime division (Pancha-Bhaga)**: *Pratah, Sangava, Madhyahna, Aparahna, Sayahna*.
  - Essential Muhurtas: **Rahu Kala**, **Gulika Kala**, **Yamaganda**, **Abhijit Muhurta**, **Brahma Muhurta**, and **Day Choghadiya**.
  - **Sankranti** ingress into 12 Rashis with **Punya Kala** & **Maha Punya Kala**.
  - **Eclipse** detection and Sutak timings.

- **Vedic Shraddha Engine (Dharma Shastra Compliant)**:
  - **Death Date to Lunar Coordinates**: Converts Gregorian death date/time to exact Vedic Masa, Paksha, and Tithi.
  - **Aparahna & Kutapa Evaluation**: Accurately computes the Aparahna window ($\frac{3}{5}$ to $\frac{4}{5}$ of daytime) and Kutapa Muhurta for any latitude and longitude.
  - **Candidate Resolution**: Evaluates candidate days when a tithi touches two afternoons, handling **Adhika Vyapti vs Samya Vyapti**, **Kshaya tithi** (touching neither Aparahna), and **Vriddhi tithi**.
  - **Tradition Rules**: Supports specific nuances for **Smartha** (*Dharma Sindhu / Nirnaya Sindhu*), **Madhva** (*Sumadhva tradition*), and **Vaishnava** (*Ahobila / Munitraya*).
  - **Mahalaya (Pitru Paksha)**: Complete 15-day schedule highlighting *Maha Bharani, Avidhava Navami, Yati Mahalaya, Ghata Chaturdashi*, and *Sarva Pitru Amavasya*.
  - **One-Click Reminder Generator**: Generates WhatsApp/SMS reminder messages for Yajamanas in **English, Kannada, or Hindi**.

- **Vedic Sankalpa Generator**:
  - Automatically synthesizes authentic, grammatically correct Sankalpa text with today's *Samvatsara, Ayana, Ritu, Masa, Paksha, Tithi, Vara, Nakshatra, Yoga, Karana*, geographic river context, Gotra, and ritual purpose.
  - Output formats in **Sanskrit (Devanagari)**, **Kannada Script (ಕನ್ನಡ ಲಿಪಿ)**, and **English Transliteration**.

- **Client & Family Management**:
  - Full client profile with Gotra, Nakshatra, Rashi, and Sampradaya.
  - Family tree and linked deceased ancestors.
  - Complete history of conducted pujas.

- **Ceremony Bookings & Samagri Checklists**:
  - Schedule pujas (*Satyanarayana, Vivaha, Upanayana, Ganapati Homa, Navagraha Homa, Shraddha, Grihapravesha*).
  - Manage and print standard **A4 Samagri Checklists** for Yajamanas.
  - Assign assistant priests (Ritwiks) and track remuneration.

- **Finance & Official Dakshina Receipts**:
  - Record Dakshina received and outgoing expenses.
  - Print beautiful **A4 Dakshina Receipts** with your official Purohit letterhead, receipt number, client gotra, ceremony, amount in words, and Vedic date.

- **Atomic JSON Storage & Automated Backups**:
  - Writes data atomically (*temp file $\rightarrow$ fsync $\rightarrow$ atomic rename*) to prevent corruption even during unexpected power loss.
  - Mutex write queue prevents concurrency collisions.
  - Automatic rolling snapshots in `backups/`, plus one-click **ZIP export and restore**.

- **Multilingual Support**:
  - Native instant toggle between **English**, **ಕನ್ನಡ (Kannada)**, and **हिन्दी (Hindi)**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; portable runtime included in release).

### Installation & Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   # Starts both backend server and client UI
   npm run dev
   ```

3. **Or run server only**:
   ```bash
   npm start
   ```
   Open your browser to: `http://127.0.0.1:3456`

4. **Seed Sample Demo Data**:
   To immediately explore with realistic clients, ancestors, bookings, and payments:
   ```bash
   npm run seed
   ```

5. **Run Verification & Tests**:
   ```bash
   npm test
   npm run verify
   ```

---

## 📁 Project Architecture

```
PurohitManager/
├── shared/           # Pure calculation logic (Panchang, Shraddha, Sankalpa, Zod schemas)
├── server/           # Local Express server with atomic JSON storage & REST API
├── client/           # Offline React + Vite client with i18n and print stylesheets
├── resources/        # Offline cities, festival rules, samagri checklists, names, demo data
├── tests/            # Test suite for Panchang, Shraddha, storage, and e2e offline
├── docs/             # Comprehensive guides: User Guide, Panchang Method, Shraddha Rules, Data Schema
├── scripts/          # Release build, offline verification, demo seed scripts
└── release-template/ # Portable Windows, macOS, and Linux standalone distribution package
```

---

## 📜 Shastric References
- *Dharma Sindhu* by Kashinatha Upadhyaya
- *Nirnaya Sindhu* by Bhattoji Dikshita / Kamalakara Bhatta
- *Smriti Muktavali* (Madhva tradition)
- *Vaidyanatha Dikshitiyam*
- *Government of India Rashtriya Panchang* / Indian Astronomical Ephemeris

---

## ⚖️ License
ISC License. Designed for Vedic scholars and priests worldwide.

