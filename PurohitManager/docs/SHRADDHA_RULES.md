# Shraddha Determination Rules (ಶಾಸ್ತ್ರೋಕ್ತ ಶ್ರಾದ್ಧ ನಿರ್ಣಯ ನಿಯಮಗಳು)

This document details the Shastric rules and algorithms used by **PurohitManager** to calculate the correct day for **Pratyabdika Shraddha** (annual death ceremony) and **Mahalaya Shraddha** (Pitru Paksha), citing authoritative texts: *Dharma Sindhu*, *Nirnaya Sindhu*, *Smriti Muktavali*, and *Vaidyanatha Dikshitiyam*.

---

## 1. Fundamental Principle: Aparahna Vyapini

In all traditions of Sanatana Dharma, the primary qualification for the annual death ceremony is that the **death tithi must be active during Aparahna**:

$$\text{Aparahna} = \text{The 4th part of the 5-fold daytime division} \left(\frac{3}{5} \text{ to } \frac{4}{5} \text{ of Dinamana}\right)$$

Typically, if Sunrise is 6:00 AM and Sunset is 6:00 PM:
- Dinamana $= 12$ hours $= 720$ minutes.
- Each part $= 144$ minutes ($2$ hours $24$ minutes).
- **Aparahna Window**: $1:12 \text{ PM}$ to $3:36 \text{ PM}$.

### Kutapa & Rohina Muhurtas
- **Kutapa**: The 8th Muhurta of the day ($\approx 11:36 \text{ AM} - 12:24 \text{ PM}$). Regarded as the most sacred time for reciting Pitru mantras and offering Pinda.
- **Rohina**: The 9th Muhurta of the day ($\approx 12:24 \text{ PM} - 1:12 \text{ PM}$).

---

## 2. Resolving Candidate Days

When determining the date of the annual Shraddha in a given year, four primary scenarios arise:

### Case 1: Tithi touches Aparahna on exactly ONE day
- **Rule**: That day is unconditionally selected.

---

### Case 2: Tithi touches Aparahna on BOTH days (Dvyaparahniki)
The lunar tithi started during the afternoon of Day 1 and continues into the afternoon of Day 2.

#### A. Smartha Tradition (*Dharma Sindhu / Nirnaya Sindhu*)
1. **Adhika Vyapti (Significant Overlap Difference)**:
   - Calculate overlap minutes in Aparahna on Day 1 ($M_1$) vs Day 2 ($M_2$).
   - If $|M_1 - M_2| > 20 \text{ minutes}$, the day with greater overlap is chosen.
2. **Samya Vyapti (Equal Overlap)**:
   - If both days have approximately equal overlap ($|M_1 - M_2| \le 20 \text{ minutes}$), **Paraviddha (Day 2)** is chosen.
   - Textual authority: *"Ubhayatra aparaahna-vyaaptau samyena adhika-vyaaptyaa vaa parata eva"* (Dharma Sindhu).

#### B. Madhva Tradition (*Sumadhva / Uttaradi Matha*)
- Gives special prominence to Kutapa Kala. If the tithi is present during Kutapa on Day 2, **Day 2 (Paraviddha)** is chosen.
- If tithi touches Kutapa on Day 1 and expires before Kutapa on Day 2, Day 1 is evaluated.

#### C. Sri Vaishnava Tradition (*Ahobila Mutt / Munitraya*)
- Strongly emphasizes **Udaya Tithi** (the tithi prevailing at Sunrise). If the tithi exists at sunrise on Day 2 and continues into Aparahna, **Day 2** is chosen.

---

### Case 3: Kshaya Tithi (Tithi touches NEITHER Aparahna)
The tithi begins after Day 1 Aparahna has ended (e.g. in the evening) and ends before Day 2 Aparahna begins (e.g. at 11:00 AM).

- **Dharma Sindhu Rule**: **Day 2 (Paraviddha)** is recommended because the tithi exists during the daylight hours (Madhyahna / Sangava) of Day 2.
- **Madhva Rule**: Day 2 is chosen, especially if the tithi is active during Kutapa or morning hours.

---

### Case 4: Vriddhi Tithi (Tithi spans across two sunrises)
- The tithi begins before Day 1 Sunrise and ends after Day 2 Sunrise.
- **Rule**: If active in both Aparahnas, the day with greater presence or Day 2 is selected according to Sampradaya rules.

---

## 3. Special Death Circumstances

### Night Death (Ratri Marana)
If the person passed away during the night (between Sunset and Sunrise):
- Under *Dharma Sindhu*, the tithi active at the moment of death governs the annual shraddha, not the sunrise tithi of the following morning.
- If death occurred in the first three Prahars of night, it is associated with the preceding day's lunar date in certain traditions; if in the 4th Prahar (Brahma Muhurta / Arunodaya), it is associated with the rising day.

### Death in Adhika Masa (Intercalary Leap Month)
- If the ancestor died in an **Adhika Masa**:
  - In ordinary years (having only Nija Masa), the Shraddha is performed in the **Nija Masa** of that name.
  - When an **Adhika Masa** recurs in that specific month (every ~3 years), the Shraddha is performed in the **Adhika Masa**.
- If the ancestor died in a **Nija Masa**:
  - The Shraddha is **never performed in Adhika Masa**; it is always performed in the **Nija Masa**.

---

## 4. Mahalaya (Pitru Paksha) Special Observances

Mahalaya occurs during **Bhadrapada Krishna Paksha** (Amanta system) / **Ashvina Krishna Paksha** (Purnimanta system):

1. **Maha Bharani**:
   - Observed on the day when **Bharani Nakshatra** prevails during Aparahna of Pitru Paksha (usually Chaturthi or Panchami).
   - Equivalent in merit to performing Shraddha at Gaya Tirtha.
2. **Avidhava Navami**:
   - Observed on **Krishna Navami** (Tithi 24).
   - Dedicated exclusively to mothers and female ancestors who passed away while their husbands were alive (*Sumangalis / Suvasinis*).
3. **Yati Mahalaya**:
   - Observed on **Krishna Dvadashi** (Tithi 27).
   - Dedicated to Sanyasis, Swamijis, and ascetics.
4. **Ghata Chaturdashi**:
   - Observed on **Krishna Chaturdashi** (Tithi 29).
   - Dedicated to ancestors who passed away from sudden accidents, weapons, poisons, or unnatural deaths.
5. **Sarva Pitru Amavasya (Mahalaya Amavasya)**:
   - Observed on **Amavasya** (Tithi 30).
   - The culminating day on which all ancestors, forgotten souls, and family lines are propitiated with Tarpanam and Shraddha Bhojana.

