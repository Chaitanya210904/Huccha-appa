# -*- coding: utf-8 -*-
import json
import datetime

# Master dictionary for 2026 Chaitanyashrama Thoogu Panchanga (Hebballi)

data_2026 = {}

# Month 1: January 2026
jan_days = [
    # (day, tithi_str, tithi_name, tithi_idx, paksha_tithi, paksha, nakshatra_kn, nakshatra_en, festivals_kn, festivals_en, special)
    (1, "ಪೌ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ರೋಹಿಣಿ", "Rohini", ["ಪಕ್ಷಪ್ರದೋಷ"], ["Paksha Pradosha"], {}),
    (2, "ಪೌ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಮೃಗಶಿರಾ", "Mrigashira", ["ಶಾಕೋತ್ಸವ", "ಕುಮಾರವ್ಯಾಸ ಜಯಂತಿ (ಕೋಳಿವಾಡ)", "ಮಾಘಸ್ನಾನಾರಂಭಃ"], ["Shakotsava", "Kumaravyasa Jayanti (Kolivada)", "Magha Snanarambha"], {}),
    (3, "ಪೌ.ಶು.ಪೌರ್ಣಿಮೆ (ಬನದ)", "Purnima", 15, 15, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", ["ಬನದ ಹುಣ್ಣಿಮೆ", "ಶಾಕಂಭರೀ ರಥೋತ್ಸವ ಸಮಾಪ್ತಿ (ಬಾದಾಮಿ-ಹೆಬ್ಬಳ್ಳಿ)", "ಅರ್ಧಾಷ್ಟಮೀ"], ["Banada Hunnime", "Shakambhari Rathotsava (Badami-Hebballi)", "Ardhashtami"], {"hunnime": "ಬನದ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Banada Hunnime"}),
    (4, "ಪೌ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", ["ತಿಥಿದ್ವಯಮ್ (ಪ್ರತಿಪದ್ / ದ್ವಿತೀಯಾ ಶ್ರಾದ್ಧಮ್)"], ["Tithidvayam (Pratipada / Dvitiya Shraddham)"], {}),
    (5, "ಪೌ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಪುಷ್ಯ", "Pushya", ["ಇಷ್ಟಿ"], ["Ishti"], {}),
    (6, "ಪೌ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ (ಅಂಗಾರಕೀ) ಚಂ.ಉ.ರಾ 09-16 ಕ್ಕೆ"], ["Angaraki Sankashtahara Chaturthi (Moonrise 09:16 PM)"], {"sankashti": {"moonrise": "09:16 PM", "isAngaraki": True}}),
    (7, "ಪೌ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಮಘಾ", "Magha", [], [], {}),
    (8, "ಪೌ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಪೂರ್ವಾ", "Purva Phalguni", [], [], {}),
    (9, "ಪೌ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಉತ್ತರಾ", "Uttara Phalguni", ["ಶ್ರೀಶಿವಿದ್ಯಾನರಸಿಂಹಭಾರತೀಸ್ವಾಮಿಗಳ ಆರಾಧನೆ"], ["Sri Shivavidya Narasimha Bharati Swamiji Aradhana"], {}),
    (10, "ಪೌ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಹಸ್ತಾ", "Hasta", ["ಕಾಲಾಷ್ಟಮಿ"], ["Kalashtami"], {}),
    (11, "ಪೌ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಚಿತ್ರಾ", "Chitra", [], [], {}),
    (12, "ಪೌ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಸ್ವಾತಿ", "Swati", [], [], {}),
    (13, "ಪೌ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ವಿಶಾಖಾ", "Vishakha", [], [], {}),
    (14, "ಪೌ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಅನುರಾಧಾ", "Anuradha", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಷಟ್‌ತಿಲಾ)", "ಭೋಗಿ", "ಪ.ಪೂ.ಶ್ರೀಕೃಷ್ಣಾನಂದಸ್ವಾಮಿಗಳ ಜಯಂತಿ (ಧಾರವಾಡ)"], ["Sarvesham Ekadashi (Shat-tila)", "Bhogi", "Sri Krishnananda Swamigal Jayanti (Dharwad)"], {"ekadashi": "ಷಟ್‌ತಿಲಾ", "ekadashi_en": "Shat-tila"}),
    (15, "ಪೌ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಮಕರಸಂಕ್ರಾಂತಿ", "ಉತ್ತರಾಯಣಾರಂಭಃ ಪರ್ವಕಾಲ"], ["Makara Sankranti", "Uttarayana Parvakala"], {"holiday": "ಮಕರ ಸಂಕ್ರಮಣ", "holiday_en": "Makara Sankranti"}),
    (16, "ಪೌ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಮೂಲಾ", "Mula", ["ಆಯನ ಕರಿಕರಿನಮ್", "ಶ್ರೀಕೃಷ್ಣಾವಧೂತಸ್ವಾಮಿನಾಂ ಜಯಂತಿ (ಮುನವಳ್ಳಿ)", "ಪಕ್ಷಪ್ರದೋಷ", "ಮಾಸಶಿವರಾತ್ರಿ"], ["Ayana Karidinam", "Sri Krishnavadhuta Swamigal Jayanti", "Paksha Pradosha", "Masashivaratri"], {}),
    (17, "ಪೌ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಮೂಲಾ", "Mula", [], [], {}),
    (18, "ಪೌ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಅವರಾತ್ರಿ)", "Amavasya", 30, 15, "Krishna", "ಪೂ.ಷಾ", "Purvashadha", ["ಅವರಾತ್ರಿ ಅಮಾವಾಸ್ಯೆ", "ದರ್ಶ", "ದಾಸವರೇಣ್ಯ ಶ್ರೀ ಪುರಂದರದಾಸರ ಪುಣ್ಯತಿಥಿ"], ["Avaratri Amavasya", "Darsha", "Sri Purandaradasara Punyatithi"], {"amavasya": "ಅವರಾತ್ರಿ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Avaratri Amavasya"}),
    (19, "ಮಾ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಉ.ಷಾ", "Uttarashadha", ["ಇಷ್ಟಿ", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (12-39 ರ ನಂತರ)"], ["Ishti", "Amritasiddhi Yoga (after 12:39)"], {}),
    (20, "ಮಾ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಶ್ರವಣ", "Shravana", [], [], {}),
    (21, "ಮಾ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಧನಿಷ್ಠಾ", "Dhanishtha", [], [], {}),
    (22, "ಮಾ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಶತತಾರಾ", "Shatatara", ["ವಿನಾಯಕ ಚತುರ್ಥಿ", "ಶ್ರೀಗಣೇಶ ಜಯಂತಿ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ತೊಟ್ಟಿಲೋತ್ಸವ"], ["Vinayaka Chaturthi", "Sri Ganesha Jayanti (Hebballi)", "Tottilotsava"], {}),
    (23, "ಮಾ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಪೂ.ಭಾ", "Purvabhadra", ["ವಸಂತಪಂಚಮೀ", "ಕುಂದಪಂಚಮೀ"], ["Vasanta Panchami", "Kunda Panchami"], {}),
    (24, "ಮಾ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಉ.ಭಾ", "Uttarabhadra", ["ಭೋಗೀ"], ["Bhogi"], {}),
    (25, "ಮಾ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ರೇವತೀ", "Revati", ["ರಥಸಪ್ತಮೀ", "ಸೂರ್ಯಪೂಜಾ"], ["Ratha Saptami", "Surya Puja"], {}),
    (26, "ಮಾ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಅಶ್ವಿನಿ", "Ashwini", ["ಭೀಷ್ಮಾಷ್ಟಮಿ", "42ನೇ ಉಪಾಸನಾ ವಾರ್ಷಿಕೋತ್ಸವ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಗಣರಾಜ್ಯೋತ್ಸವ"], ["Bhishmashtami", "42nd Upasana Varshikotsava (Hebballi)", "Republic Day"], {"holiday": "ಗಣರಾಜ್ಯೋತ್ಸವ", "holiday_en": "Republic Day"}),
    (27, "ಮಾ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಭರಣೀ", "Bharani", [], [], {}),
    (28, "ಮಾ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಕೃತ್ತಿಕಾ / ರೋಹಿಣಿ", "Krittika / Rohini", ["ತಿಥಿದ್ವಯಮ್ (ದಶಮಿ / ಏಕಾದಶಿ ಶ್ರಾದ್ಧಮ್)"], ["Tithidvayam (Dashami / Ekadashi Shraddham)"], {}),
    (29, "ಮಾ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಮೃಗಶಿರಾ", "Mrigashira", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಜಯಾ)"], ["Sarvesham Ekadashi (Jaya)"], {"ekadashi": "ಜಯಾ", "ekadashi_en": "Jaya"}),
    (30, "ಮಾ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", ["ಸದ್ಗುರು ಶ್ರೀ ಬ್ರಹ್ಮಚೈತನ್ಯ ಮಹಾರಾಜರ ಜಯಂತಿ ಉತ್ಸವ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ತೊಟ್ಟಿಲೋತ್ಸವ", "ಪಕ್ಷಪ್ರದೋಷ"], ["Sadguru Sri Brahmachaitanya Maharaj Jayanti (Hebballi)", "Tottilotsava", "Paksha Pradosha"], {}),
    (31, "ಮಾ.ಶು.ತ್ರಯೋದಶಿ / ಚತುರ್ದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಪುನರ್ವಸು", "Punarvasu", [], [], {})
]

for d, t_str, t_name, t_idx, pk_idx, pk, n_kn, n_en, f_kn, f_en, sp in jan_days:
    dt = f"2026-01-{d:02d}"
    masa_kn = "ಪೌಷ" if d <= 18 else "ಮಾಘ"
    masa_en = "Pausha" if d <= 18 else "Magha"
    data_2026[dt] = {
        "date": dt, "dayOfMonth": d, "month": 1, "year": 2026,
        "samvatsara": {"kannada": "ವಿಶ್ವಾವಸು", "english": "Vishvavasu", "shaka": 1947},
        "ayana": {"kannada": "ದಕ್ಷಿಣಾಯನ" if d < 15 else "ಉತ್ತರಾಯಣ", "english": "Dakshinayana" if d < 15 else "Uttarayana"},
        "ritu": {"kannada": "ಹೇಮಂತ" if d <= 18 else "ಶಿಶಿರ", "english": "Hemanta" if d <= 18 else "Shishira"},
        "masa": {"kannada": masa_kn, "english": masa_en, "isAdhika": False},
        "paksha": {"kannada": pk, "english": pk},
        "tithi": {"name": t_name, "kannada": t_name, "fullKannada": t_str, "index": t_idx, "pakshaTithi": pk_idx},
        "nakshatra": {"kannada": n_kn, "english": n_en},
        "festivals": f_kn, "festivalsEn": f_en, "special": sp
    }

print("January parsed: 31 days")
