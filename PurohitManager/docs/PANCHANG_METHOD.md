# Panchang Calculation Methodology & Astronomical Algorithms

This document details the mathematical and astronomical algorithms employed by **PurohitManager**.

---

## 1. Celestial Coordinate Foundations

All calculations are based on high-precision planetary ephemeris (IAU SOFA / VSOP87 and Jean Meeus Astronomical Algorithms) wrapped via `astronomy-engine` with built-in standalone Meeus mathematical fallbacks.

### Apparent Tropical Coordinates (Sayana)
1. **Julian Day Number ($JD$)**:
   Computed from UTC timestamp $(Y, M, D, h, m, s)$:
   $$T = \frac{JD - 2451545.0}{36525.0} \quad \text{(Julian Centuries from J2000.0)}$$
2. **Apparent Solar Ecliptic Longitude ($\lambda_{\odot,\text{sayana}}$)**:
   Accounts for the Sun's mean anomaly, equation of center, true anomaly, aberration ($-20.4955''$), and nutation in longitude ($\Delta\psi$).
3. **Apparent Lunar Ecliptic Longitude ($\lambda_{\leftmoon,\text{sayana}}$)**:
   Calculated using geocentric apparent ecliptic coordinates including the evection, variation, annual equation, and reduction to the ecliptic.

---

## 2. Ayanamsa & Sidereal Conversion (Nirayana)

Indian Vedic astrology operates on the **Nirayana (Sidereal) Zodiac**, which is tied to the fixed stars (Spica / Chitra star at $180^\circ$ ecliptic longitude).

$$\lambda_{\text{nirayana}} = (\lambda_{\text{sayana}} - \text{Ayanamsa}) \pmod{360^\circ}$$

### Supported Ayanamsa Systems:
1. **Lahiri Ayanamsa (Chitra Paksha - Government of India Standard)**:
   $$A_{\text{Lahiri}}(T) = 23^\circ 51' 25.53'' + 5029.0966'' \cdot T + 1.112'' \cdot T^2$$
   At epoch J2000.0 ($JD = 2451545.0$), $A_{\text{Lahiri}} \approx 23.857092^\circ$.
2. **Raman Ayanamsa (B. V. Raman)**:
   Based on zero year 397 CE. In the current era, Raman Ayanamsa is approximately $1^\circ 27' 00''$ lower than Lahiri:
   $$A_{\text{Raman}} \approx A_{\text{Lahiri}} - 1.450^\circ$$
3. **KP Ayanamsa (Krishnamurti Paddhati)**:
   Based on zero year 291 CE. KP Ayanamsa is approximately $0^\circ 05' 56''$ lower than Lahiri:
   $$A_{\text{KP}} \approx A_{\text{Lahiri}} - 0.09889^\circ$$

---

## 3. The Five Angas (Limbs) of Panchang

### 1. Tithi (Lunar Phase Day)
A Tithi is defined by every $12^\circ$ increase in Moon-Sun elongation:
$$\Delta\lambda = (\lambda_{\leftmoon,\text{nirayana}} - \lambda_{\odot,\text{nirayana}}) \pmod{360^\circ}$$
$$\text{Tithi Index} = \left\lfloor \frac{\Delta\lambda}{12^\circ} \right\rfloor + 1 \quad (1 \le \text{Index} \le 30)$$
- **Indices 1 to 15**: Shukla Paksha (Prathama to Purnima)
- **Indices 16 to 30**: Krishna Paksha (Prathama to Amavasya)
- **Exact Start and End Times**: Solved using binary search root finding on $f(t) = \Delta\lambda(t) - \text{TargetAngle} = 0$, converging to $< 1$ second precision.

### 2. Nakshatra (Lunar Mansion)
Based on the Moon's Sidereal Longitude $\lambda_{\leftmoon,\text{nirayana}}$:
$$\text{Nakshatra Span} = \frac{360^\circ}{27} = 13^\circ 20' = 13.333333^\circ$$
$$\text{Nakshatra Index} = \left\lfloor \frac{\lambda_{\leftmoon,\text{nirayana}}}{13^\circ 20'} \right\rfloor + 1 \quad (1 \le \text{Index} \le 27)$$
- **Pada (Quarter)**: Each Nakshatra is divided into 4 equal quarters of $3^\circ 20'$ ($3.333333^\circ$):
  $$\text{Pada} = \left\lfloor \frac{\lambda_{\leftmoon} \pmod{13^\circ 20'}}{3^\circ 20'} \right\rfloor + 1 \quad (1 \le \text{Pada} \le 4)$$

### 3. Yoga
Based on the sum of Sun and Moon sidereal longitudes:
$$S = (\lambda_{\odot,\text{nirayana}} + \lambda_{\leftmoon,\text{nirayana}}) \pmod{360^\circ}$$
$$\text{Yoga Index} = \left\lfloor \frac{S}{13^\circ 20'} \right\rfloor + 1 \quad (1 \le \text{Index} \le 27)$$

### 4. Karana (Half-Tithi)
Each Karana spans $6^\circ$ of elongation (60 Karanas per lunar month):
- **4 Fixed (Sthira) Karanas**:
  - *Shakuni* (Krishna Chaturdashi 2nd half)
  - *Chatushpada* (Amavasya 1st half)
  - *Naga* (Amavasya 2nd half)
  - *Kimstughna* (Shukla Prathama 1st half)
- **7 Repeating (Chara) Karanas**:
  - *Bava, Balava, Kaulava, Taitila, Garija, Vanija, Vishti (Bhadra)* repeating 8 times.

### 5. Vara (Vedic Weekday)
The Vedic Vara begins at **local Sunrise** (not midnight). If a ritual is performed before sunrise, the prevailing Vara is that of the previous Gregorian day.

---

## 4. Solar Day & Dinamana Partitions

### Vedic Sunrise & Sunset
Defined as the moment when the **upper limb** of the Sun touches the true horizon:
- Standard zenith distance: $z_0 = 90^\circ 50'$ ($90.8333^\circ$), consisting of $34'$ atmospheric refraction $+ 16'$ semi-diameter of the solar disc.
- **Dinamana**: Total duration of daytime $= T_{\text{sunset}} - T_{\text{sunrise}}$.
- **Ratrimana**: Total duration of nighttime $= T_{\text{sunrise, next day}} - T_{\text{sunset}}$.

### Pancha-Bhaga (Five-fold Division of Daytime)
Essential for Puja and Shraddha timing:
1. **Pratah (Morning)**: $0$ to $\frac{1}{5}$ of Dinamana
2. **Sangava (Forenoon)**: $\frac{1}{5}$ to $\frac{2}{5}$ of Dinamana
3. **Madhyahna (Midday)**: $\frac{2}{5}$ to $\frac{3}{5}$ of Dinamana
4. **Aparahna (Afternoon)**: $\frac{3}{5}$ to $\frac{4}{5}$ of Dinamana *(Primary Shraddha Window)*
5. **Sayahna (Evening)**: $\frac{4}{5}$ to $1$ of Dinamana

### Muhurtas
Daytime is divided into 15 equal Muhurtas (each approximately 48 minutes when Dinamana is 12 hours):
- **Abhijit Muhurta**: The 8th Muhurta of the day (centered around local solar noon).
- **Kutapa Muhurta**: Synchronous with the 8th Muhurta, the principal moment for commencing Shraddha rites.
- **Rohina Muhurta**: The 9th Muhurta of the day.

---

## 5. Masa & Samvatsara Determinations

### Adhika & Kshaya Masa Rules
A lunar month is named after the Solar Sankranti (ingress into a zodiac sign) that takes place between two consecutive New Moons (Amavasya to Amavasya):
- **Normal (Nija) Masa**: Exactly one Solar Sankranti occurs within the lunar month.
- **Adhika Masa (Leap / Intercalary Month)**: No Solar Sankranti occurs between two consecutive Amavasyas.
- **Kshaya Masa (Suppressed Month)**: Two Solar Sankrantis occur within a single lunar month (occurs roughly once every 140 years).

### Samvatsara (60-Year Jovian Cycle)
Advanced at **Chaitra Shukla Pratipada (Ugadi)**:
$$\text{Index} = ((\text{Shaka Year} + 11) \pmod{60}) + 1$$
- 2024 CE / Shaka 1946: *Krodhi* (38)
- 2025 CE / Shaka 1947: *Vishvavasu* (39)
- 2026 CE / Shaka 1948: *Parabhava* (40)
- 2027 CE / Shaka 1949: *Plavanga* (41)

---

## 6. Precision & Limitations
- Planetary and lunar positions are accurate to within $\pm 1$ arcsecond for epochs between 1800 CE and 2200 CE.
- Sunrise/Sunset times match official almanacs to within $\pm 1$ minute, subject to local elevation and atmospheric pressure.

