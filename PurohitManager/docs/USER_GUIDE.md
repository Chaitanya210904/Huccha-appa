# PurohitManager - User Guide (ಬಳಕೆದಾರರ ಕೈಪಿಡಿ / उपयोगकर्ता मार्गदर्शिका)

Welcome to **PurohitManager**, an offline-first desktop management application designed specifically for Vedic Purohits, Jyotishis, and religious scholars.

---

## 1. Quick Start

1. **Starting the App**:
   - Double-click `Start.bat` (on Windows) or run `./start.command` (on macOS) / `./start.sh` (on Linux).
   - Your browser will open to `http://127.0.0.1:3456`.
   - The app runs completely on your local computer. No internet connection is ever required.

2. **Language Toggle**:
   - In the top right corner, switch between **English**, **हिन्दी (Hindi)**, or **ಕನ್ನಡ (Kannada)** at any time.

---

## 2. Daily Workflow for the Priest

### Morning Routine: Checking the Panchang
- Click on **Panchang** in the left menu.
- Today's five limbs (**Tithi, Vara, Nakshatra, Yoga, Karana**) are displayed prominently.
- Check the **Udaya Tithi** (prevailing at sunrise), which governs today's ritual calendar.
- Review **Rahu Kala**, **Yamaganda**, and **Abhijit Muhurta** timings before scheduling ceremonies.
- Check **Day Choghadiyas** to select auspicious moments for travel or commencing rituals.

### Conducting Pujas: Instant Sankalpa Generation
- Click the **Generate Sankalpa** button on the Panchang page or within any booking.
- Select the ceremony (e.g., *Sri Satyanarayana Vrata*, *Maha Ganapati Homa*, *Vivaha*, *Shraddha*).
- Enter the Yajamana's name and Gotra.
- The system automatically inserts today's **Samvatsara, Ayana, Ritu, Masa, Paksha, Tithi, Vara, Nakshatra, and geographic river context**.
- Copy or read directly from the screen in **Sanskrit (Devanagari)**, **Kannada Script (ಕನ್ನಡ ಲಿಪಿ)**, or **English Transliteration**.

---

## 3. Shraddha Tracker (ವಾರ್ಷಿಕ ಶ್ರಾದ್ಧ ನಿರ್ವಹಣೆ)

One of the most important responsibilities of a Purohit is ensuring that a family's annual death ceremony (**Pratyabdika Shraddha**) is observed on the exact shastric day.

### Adding an Ancestor
1. Go to **Clients** and select or add a client.
2. Click **Add Ancestor**.
3. Enter the Gregorian date and time of death.
4. Click **Auto-Calculate Lunar Masa & Tithi**. The astronomical engine will determine the Vedic month, fortnight, and tithi.
5. Save the record.

### Viewing Upcoming Shraddhas
- The **Dashboard** and **Shraddha Tracker** automatically highlight all annual shraddhas occurring in the next 30 days.
- Each entry shows:
  - Exact scheduled date.
  - Days remaining.
  - Aparahna time window.
  - Shastric reasoning (e.g. *Smartha rule: Greater Aparahna overlap*).
- Click **Send Reminder** to open a ready-made WhatsApp or SMS message in English, Kannada, or Hindi.

### Candidate Date Calculator
- When a lunar tithi spans across two days or falls in the afternoon, priests often need to examine both days.
- In the **Annual Date Calculator** tab:
  - Select the ancestor and target year.
  - The system evaluates candidate days and displays a comparison table showing exact **Aparahna overlap in minutes**, **Kutapa overlap**, and **Udaya Tithi status**.
  - You can review the shastric justification according to your Sampradaya (**Smartha**, **Madhva**, or **Vaishnava**).

### Pitru Paksha (Mahalaya)
- View the complete 15-day calendar of Pitru Paksha for any year.
- Special days like **Maha Bharani**, **Avidhava Navami**, **Yati Mahalaya**, **Ghata Chaturdashi**, and **Sarva Pitru Amavasya** are clearly highlighted.

---

## 4. Bookings & Samagri Checklists

1. **Creating a Booking**:
   - Go to **Bookings** -> **New Ceremony Booking**.
   - Select client, ceremony, date, muhurta, and venue.
   - Enter agreed Dakshina amount.
   - Optionally assign assistant priests (Ritwiks).

2. **Samagri Checklist for Clients**:
   - Click **Samagri List** on any booking.
   - Pre-filled checklists are available for *Satyanarayana*, *Vivaha*, *Upanayana*, *Ganapati Homa*, and *Shraddha*.
   - Click **Print A4 Checklist** to hand over a clean printed list of required items to the client!

---

## 5. Finance & Official Dakshina Receipts

- Record payments (Cash, UPI, Bank Transfer).
- Generate and print official **A4 Dakshina Receipts** complete with your letterhead, receipt number, client gotra, ceremony name, amount in words, and the Vedic astrological date.
- Record expenses (samidha, pure cow ghee, travel, assistant remunerations).
- View the combined chronological ledger and annual reports.

---

## 6. Data Safety & Backup

- **Automatic Backups**: The system automatically saves rolling backups in the `backups/` folder.
- **Exporting Data**: Under **Backup & Restore**, click **Export All Data as ZIP** to download a single archive file to a USB pen drive or Google Drive.
- **Restoring**: You can restore from any previous backup with one click.

