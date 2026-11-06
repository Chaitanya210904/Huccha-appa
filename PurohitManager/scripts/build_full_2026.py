# -*- coding: utf-8 -*-
import json
import os

days_data = {}

# 1. JANUARY (31 days)
jan = [
    (1, "ಪೌ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ರೋಹಿಣಿ", "Rohini", ["ಪಕ್ಷಪ್ರದೋಷ"], ["Paksha Pradosha"], {}),
    (2, "ಪೌ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಮೃಗಶಿರಾ", "Mrigashira", ["ಶಾಕೋತ್ಸವ", "ಕುಮಾರವ್ಯಾಸ ಜಯಂತಿ (ಕೋಳಿವಾಡ)", "ಮಾಘಸ್ನಾನಾರಂಭಃ"], ["Shakotsava", "Kumaravyasa Jayanti (Kolivada)", "Magha Snanarambha"], {}),
    (3, "ಪೌ.ಶು.ಪೌರ್ಣಿಮೆ (ಬನದ)", "Purnima", 15, 15, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", ["ಬನದ ಹುಣ್ಣಿಮೆ", "ಶಾಕಂಭರೀ ರಥೋತ್ಸವ ಸಮಾಪ್ತಿ (ಬಾದಾಮಿ-ಹೆಬ್ಬಳ್ಳಿ)", "ಅರ್ಧಾಷ್ಟಮೀ"], ["Banada Hunnime", "Shakambhari Rathotsava (Badami-Hebballi)", "Ardhashtami"], {"hunnime": "ಬನದ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Banada Hunnime"}),
    (4, "ಪೌ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", ["ತಿಥಿದ್ವಯಮ್ (ಪ್ರತಿಪದ್ / ದ್ವಿತೀಯಾ ಶ್ರಾದ್ಧಮ್)"], ["Tithidvayam (Pratipada / Dvitiya Shraddham)"], {}),
    (5, "ಪೌ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಪುಷ್ಯ", "Pushya", ["ಇಷ್ಟಿ"], ["Ishti"], {}),
    (6, "ಪೌ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ (ಅಂಗಾರಕೀ) ಚಂ.ಉ.ರಾ 09-16 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Angaraki Sankashtahara Chaturthi (Moonrise 09:16 PM Hebballi)"], {"sankashti": {"moonrise": "09:16 PM", "isAngaraki": True}}),
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

# 2. FEBRUARY (28 days)
feb = [
    (1, "ಮಾ.ಶು.ಪೌರ್ಣಿಮೆ (ಭಾರತ)", "Purnima", 15, 15, "Shukla", "ಪುಷ್ಯ", "Pushya", ["ಭಾರತ ಹುಣ್ಣಿಮೆ", "ಕುಲಧರ್ಮ ಸೌಂದತ್ತಿಯಲ್ಲಮ್ಮ ಕ್ಷೇತ್ರಯಾತ್ರೆ", "ಮೈಲಾರ ರಥೋತ್ಸವ", "ಧನುರ್ಮಾಸ ಪೂಜಾ ಸಮಾಪ್ತಿ"], ["Bharata Hunnime", "Saundatti Yallamma Yatra", "Mailara Rathotsava", "Dhanurmasa Samapti"], {"hunnime": "ಭಾರತ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Bharata Hunnime"}),
    (2, "ಮಾ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಶ್ರೀ ಗುರುಪ್ರತಿಪದೆ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಇಷ್ಟಿ"], ["Sri Gurupratipada (Hebballi)", "Ishti"], {}),
    (3, "ಮಾ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಮಘಾ", "Magha", [], [], {}),
    (4, "ಮಾ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಪೂರ್ವಾ", "Purva Phalguni", ["ಮೈಲಾರ ಕಾರಣಿಕೋತ್ಸವ (ಮೈಲಾರ)"], ["Mailara Karanikotsava"], {}),
    (5, "ಮಾ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಉತ್ತರಾ", "Uttara Phalguni", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 09-43 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Sankashtahara Chaturthi (Moonrise 09:43 PM Hebballi)"], {"sankashti": {"moonrise": "09:43 PM", "isAngaraki": False}}),
    (6, "ಮಾ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಹಸ್ತಾ", "Hasta", ["ಶ್ರೀಪುರುಷೋತ್ತಮ ಸ್ವಾಮಿನಾಮಾರಾಧನಂ (ಧಾರವಾಡ)"], ["Sri Purushottama Swaminam Aradhanam (Dharwad)"], {}),
    (7, "ಮಾ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಚಿತ್ರಾ", "Chitra", [], [], {}),
    (8, "ಮಾ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಸ್ವಾತಿ", "Swati", [], [], {}),
    (9, "ಮಾ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ವಿಶಾಖಾ", "Vishakha", ["ಕಾಲಾಷ್ಟಮಿ"], ["Kalashtami"], {}),
    (10, "ಮಾ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ವಿಶಾಖಾ", "Vishakha", [], [], {}),
    (11, "ಮಾ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಅನುರಾಧಾ", "Anuradha", ["ದಾಸನವಮಿ", "ಸಮರ್ಥ ಶ್ರೀರಾಮದಾಸ ಸ್ವಾಮಿಗಳ ಪುಣ್ಯತಿಥಿ (ಸಜ್ಜನ್‌ಗಡ)", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (11.30 ರ ವರೆಗೆ)"], ["Dasa Navami", "Samartha Sri Ramadasa Swamigal Punyatithi", "Amritasiddhi Yoga (until 11:30)"], {}),
    (12, "ಮಾ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಸದ್ಗುರು ಶ್ರೀಬ್ರಹ್ಮಾನಂದ ಮಹಾರಾಜರ ಜಯಂತಿ (ತೊಟ್ಟಿಲೋತ್ಸವ ಜಾಲಿಹಾಳ - ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)"], ["Sadguru Sri Brahmananda Maharaj Jayanti (Jalihala-Hebballi)"], {}),
    (13, "ಮಾ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಮೂಲಾ", "Mula", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ವಿಜಯಾ)"], ["Sarvesham Ekadashi (Vijaya)"], {"ekadashi": "ವಿಜಯಾ", "ekadashi_en": "Vijaya"}),
    (14, "ಮಾ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಪೂ.ಷಾ", "Purvashadha", ["ಶನಿಪ್ರದೋಷ"], ["Shani Pradosha"], {}),
    (15, "ಮಾ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಉ.ಷಾ", "Uttarashadha", ["ಮಹಾಶಿವರಾತ್ರಿ (ಯಮಪೂಜಾ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)"], ["Mahashivaratri (Hebballi)"], {"holiday": "ಮಹಾಶಿವರಾತ್ರಿ", "holiday_en": "Mahashivaratri"}),
    (16, "ಮಾ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಶ್ರವಣ", "Shravana", ["ಮಹಾಶಿವರಾತ್ರಿ ಜಾಗರಣೆ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (21.22 ರವರೆಗೆ)"], ["Mahashivaratri Jagarane", "Amritasiddhi Yoga (until 21:22)"], {}),
    (17, "ಮಾ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಶಿವರಾತ್ರಿ)", "Amavasya", 30, 15, "Krishna", "ಧನಿಷ್ಠಾ", "Dhanishtha", ["ಶಿವರಾತ್ರಿ ಅಮಾವಾಸ್ಯೆ", "ದರ್ಶ"], ["Shivaratri Amavasya", "Darsha"], {"amavasya": "ಶಿವರಾತ್ರಿ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Shivaratri Amavasya"}),
    (18, "ಫಾ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಶತತಾರಾ", "Shatatara", ["ಇಷ್ಟಿ", "ಶ್ರೀಮಹಾಬಲೇಶ್ವರ ರಥೋತ್ಸವ (ಗೋಕರ್ಣ)"], ["Ishti", "Sri Mahabaleshwara Rathotsava (Gokarna)"], {}),
    (19, "ಫಾ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಪೂ.ಭಾ", "Purvabhadra", [], [], {}),
    (20, "ಫಾ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಉ.ಭಾ", "Uttarabhadra", ["ಅಮೃತಸಿದ್ಧಿಯೋಗ (21-13 ರ ನಂತರ)"], ["Amritasiddhi Yoga (after 21:13)"], {}),
    (21, "ಫಾ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ರೇವತೀ", "Revati", ["ವಿನಾಯಕ ಚತುರ್ಥಿ", "ತಿಥಿದ್ವಯಮ್ (ಚತುರ್ಥಿ-ಪಂಚಮೀ ಶ್ರಾದ್ಧಮ್)"], ["Vinayaka Chaturthi", "Tithidvayam (Chaturthi / Panchami Shraddham)"], {}),
    (22, "ಫಾ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಅಶ್ವಿನಿ", "Ashwini", [], [], {}),
    (23, "ಫಾ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಭರಣೀ", "Bharani", [], [], {}),
    (24, "ಫಾ.ಶು.ಸಪ್ತಮಿ / ಅಷ್ಟಮಿ", "Saptami", 7, 7, "Shukla", "ಕೃತ್ತಿಕಾ", "Krittika", [], [], {}),
    (25, "ಫಾ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ರೋಹಿಣಿ", "Rohini", [], [], {}),
    (26, "ಫಾ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಮೃಗಶಿರಾ", "Mrigashira", [], [], {}),
    (27, "ಫಾ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಆಮಲಕೀ)"], ["Sarvesham Ekadashi (Amalaki)"], {"ekadashi": "ಆಮಲಕೀ", "ekadashi_en": "Amalaki"}),
    (28, "ಫಾ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಪುನರ್ವಸು", "Punarvasu", ["ರುಕ್ಮಾಂಗದ ಪಂಡಿತರ ಪುಣ್ಯತಿಥಿ (ವಿಜಾಪುರ)"], ["Rukmangada Panditar Punyatithi (Bijapur)"], {})
]

# 3. MARCH (31 days)
mar = [
    (1, "ಫಾ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಪುಷ್ಯ", "Pushya", ["ಪಕ್ಷಪ್ರದೋಷ", "ಶ್ರೀಕೇಶವಮಹಾರಾಜ ಪುಣ್ಯತಿಥಿ (ಜಾಲಿಹಾಳ)"], ["Paksha Pradosha", "Sri Keshava Maharaj Punyatithi"], {}),
    (2, "ಫಾ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಹೋಲಿಕಾಷ್ಟಮೀ (ಹೋಳಿ)"], ["Holikashtami"], {}),
    (3, "ಫಾ.ಶು.ಪೌರ್ಣಿಮೆ (ಹೋಳಿ)", "Purnima", 15, 15, "Shukla", "ಮಘಾ", "Magha", ["ಹೋಳಿ ಹುಣ್ಣಿಮೆ", "ಗ್ರಸ್ತೋದಿತ ಖಂಡಗ್ರಾಸ ಚಂದ್ರಗ್ರಹಣ"], ["Holi Hunnime", "Lunar Eclipse (Chandra Grahana)"], {"hunnime": "ಹೋಳಿ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Holi Hunnime", "holiday": "ಹೋಳಿ ಹುಣ್ಣಿಮೆ", "holiday_en": "Holi Hunnime"}),
    (4, "ಫಾ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಪೂರ್ವಾ", "Purva Phalguni", ["ಇಷ್ಟಿ", "ವಸಂತೋತ್ಸವಾರಂಭ", "ಚೈತ್ರಲಕ್ಷ್ಮೀ ರಂಗಸ್ಥಾನಂ"], ["Ishti", "Vasantotsavarambha", "Chaitralakshmi Rangasthanam"], {}),
    (5, "ಫಾ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಉತ್ತರಾ", "Uttara Phalguni", ["ಕಲಸದ ಶ್ರೀ ಗುರುಗೋವಿಂದ ಧ್ವಜಾಗ್ರ ಪುಣ್ಯತಿಥಿ"], ["Sri Gurugovinda Dhvajagra Punyatithi"], {}),
    (6, "ಫಾ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಹಸ್ತಾ", "Hasta", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 09-06 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Sankashtahara Chaturthi (Moonrise 09:06 PM Hebballi)"], {"sankashti": {"moonrise": "09:06 PM", "isAngaraki": False}}),
    (7, "ಫಾ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಚಿತ್ರಾ", "Chitra", [], [], {}),
    (8, "ಫಾ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಸ್ವಾತಿ", "Swati", ["ರಂಗಪಂಚಮೀ"], ["Ranga Panchami"], {}),
    (9, "ಫಾ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ವಿಶಾಖಾ", "Vishakha", ["ಏಕನಾಥಷಷ್ಠಿ", "ಶ್ರೀ ಕೃಷ್ಣಾನಂದಸ್ವಾಮಿಗಳ ಆರಾಧನೆ (ಧಾರವಾಡ)"], ["Ekanatha Shashthi", "Sri Krishnananda Swamigal Aradhana"], {}),
    (10, "ಫಾ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಅನುರಾಧಾ", "Anuradha", [], [], {}),
    (11, "ಫಾ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಕಾಲಾಷ್ಟಮಿ"], ["Kalashtami"], {}),
    (12, "ಫಾ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಮೂಲಾ", "Mula", [], [], {}),
    (13, "ಫಾ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಪೂ.ಷಾ", "Purvashadha", [], [], {}),
    (14, "ಫಾ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಉ.ಷಾ", "Uttarashadha", ["ಶ್ರೀ ಸಚ್ಚಿದಾನಂದಭಾರತೀ ನರಸಿಂಹಭಾರತೀ ಸ್ವಾಮಿನಾಂ ಜಯಂತಿ (ಶೃಂಗೇರಿ)"], ["Sri Sachidananda Bharati Narasimha Bharati Jayanti (Sringeri)"], {}),
    (15, "ಫಾ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಶ್ರವಣ", "Shravana", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಪಾಪವಿಮೋಚನೀ)"], ["Sarvesham Ekadashi (Papamochani)"], {"ekadashi": "ಪಾಪವಿಮೋಚನೀ", "ekadashi_en": "Papamochani"}),
    (16, "ಫಾ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಧನಿಷ್ಠಾ", "Dhanishtha", ["ಸೋಮಪ್ರದೋಷ"], ["Soma Pradosha"], {}),
    (17, "ಫಾ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಶತತಾರಾ", "Shatatara", ["ಮಾಸಶಿವರಾತ್ರಿ"], ["Masashivaratri"], {}),
    (18, "ಫಾ.ಕೃ.ಅಮಾವಾಸ್ಯೆ", "Amavasya", 30, 15, "Krishna", "ಪೂ.ಭಾ", "Purvabhadra", ["ದರ್ಶ"], ["Darsha"], {}),
    (19, "ಯುಗಾದಿ ಪಾಡ್ಯ (ಫಾ.ಕೃ.ಅಮಾವಾಸ್ಯೆ / ಚೈ.ಶು.ಪ್ರತಿಪದೆ)", "Prathama", 1, 1, "Shukla", "ಉ.ಭಾ", "Uttarabhadra", ["ಯುಗಾದಿ ಅಮಾವಾಸ್ಯೆ / ಯುಗಾದಿ ಪಾಡ್ಯ", "ಪರಾಭವನಾಮ ನೂತನ ಸಂವತ್ಸರಾರಂಭಃ", "ಪಂಚಾಂಗ ಶ್ರವಣಂ", "ಶ್ರೀರಾಮ ನವರಾತ್ರಾರಂಭ"], ["Ugadi Padya / Yugadi Amavasya", "Parabhavanama Samvatsara Begins", "Panchanga Shravanam", "Sri Rama Navaratrarambha"], {"holiday": "ಯುಗಾದಿ ಪಾಡ್ಯ", "holiday_en": "Ugadi Padya", "amavasya": "ಯುಗಾದಿ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Yugadi Amavasya"}),
    (20, "ಚೈ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ರೇವತೀ", "Revati", ["ಇಷ್ಟಿ", "ದಮನಕೋತ್ಸವ", "ಶ್ರೀಗೌರೀ ಪೂಜನಮ್", "ಮತ್ಸ್ಯ ಜಯಂತಿ"], ["Ishti", "Damanotsava", "Sri Gauri Puja", "Matsya Jayanti"], {}),
    (21, "ಚೈ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಅಶ್ವಿನಿ", "Ashwini", ["ರಂಜಾನ್"], ["Ramzan"], {"holiday": "ರಂಜಾನ್", "holiday_en": "Ramzan"}),
    (22, "ಚೈ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಭರಣೀ", "Bharani", ["ವಿನಾಯಕ ಚತುರ್ಥಿ", "ಗಣೇಶಾಯ ದಮನಾರ್ಪಣಂ", "ಲಕ್ಷ್ಮೀದೇವಿ ನಮ್ಮ ಸೀಮಂತೋತ್ಸವ"], ["Vinayaka Chaturthi", "Ganesha Damanarpanam"], {}),
    (23, "ಚೈ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಕೃತ್ತಿಕಾ", "Krittika", [], [], {}),
    (24, "ಚೈ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ರೋಹಿಣಿ", "Rohini", [], [], {}),
    (25, "ಚೈ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಮೃಗಶಿರಾ", "Mrigashira", [], [], {}),
    (26, "ಚೈ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", ["ತಿಥಿದ್ವಯಮ್ (ಅಷ್ಟಮೀ - ನವಮೀ ಶ್ರಾದ್ಧಮ್)"], ["Tithidvayam (Ashtami / Navami Shraddham)"], {}),
    (27, "ಚೈ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಪುನರ್ವಸು", "Punarvasu", ["ಶ್ರೀರಾಮ ನವಮಿ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಶ್ರೀರಾಮಜನ್ಮೋತ್ಸವ ತೊಂಡಿಹಾಳ-ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Sri Rama Navami (Hebballi)", "Sri Ramajanmotsava"], {}),
    (28, "ಚೈ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಪುಷ್ಯ", "Pushya", ["ಶ್ರೀರಾಮನವಮಿ ವ್ರತಪಾರಣಂ"], ["Sri Ramanavami Vrataparanam"], {}),
    (29, "ಚೈ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಕಾಮದಾ)"], ["Sarvesham Ekadashi (Kamada)"], {"ekadashi": "ಕಾಮದಾ", "ekadashi_en": "Kamada"}),
    (30, "ಚೈ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಮಘಾ", "Magha", ["ಶ್ರೀಮಹಾರಾಜರ ದಿವ್ಯಸ್ಥಿರಪಾದುಕಾ 116 ನೇ ಪ್ರತಿಷ್ಠಾಪನಾ ವಾರ್ಷಿಕೋತ್ಸವ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಸೋಮಪ್ರದೋಷ"], ["Sri Maharajara Divyasthirapaduka 116th Pratishthapana Varshikotsava (Hebballi)", "Soma Pradosha"], {}),
    (31, "ಚೈ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಪೂರ್ವಾ", "Purva Phalguni", ["ಮಹಾವೀರ ಜಯಂತಿ"], ["Mahavira Jayanti"], {"holiday": "ಮಹಾವೀರ ಜಯಂತಿ", "holiday_en": "Mahavira Jayanti"})
]

# 4. APRIL (30 days)
apr = [
    (1, "ಚೈ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಉತ್ತರಾ", "Uttara Phalguni", [], [], {}),
    (2, "ಚೈ.ಶು.ಪೌರ್ಣಿಮೆ (ದವನದ)", "Purnima", 15, 15, "Shukla", "ಹಸ್ತಾ", "Hasta", ["ದವನದ ಹುಣ್ಣಿಮೆ", "ಶ್ರೀಹನುಮ ಜಯಂತಿ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಪಂಪಾ ವಿರೂಪಾಕ್ಷೇಶ್ವರ ರಥೋತ್ಸವ (ಹಂಪಿ)"], ["Davanada Hunnime", "Sri Hanuma Jayanti (Hebballi)", "Pampa Virupaksheshwara Rathotsava (Hampi)"], {"hunnime": "ದವನದ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Davanada Hunnime"}),
    (3, "ಚೈ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಚಿತ್ರಾ", "Chitra", ["ಇಷ್ಟಿ", "ಗುಡ್‌ಫ್ರೈಡೆ"], ["Ishti", "Good Friday"], {"holiday": "ಗುಡ್‌ಫ್ರೈಡೆ", "holiday_en": "Good Friday"}),
    (4, "ಚೈ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಸ್ವಾತಿ", "Swati", ["ವರದಹಳ್ಳಿ ಶ್ರೀ ಶ್ರೀಧರಸ್ವಾಮಿಗಳ ಆರಾಧನೆ", "ಸತಿ ಅನಸೂಯಾ ಜಯಂತಿ"], ["Sri Sridharaswamigal Aradhana (Varadahalli)", "Sati Anasuya Jayanti"], {}),
    (5, "ಚೈ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ವಿಶಾಖಾ", "Vishakha", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 09-31 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Sankashtahara Chaturthi (Moonrise 09:31 PM Hebballi)"], {"sankashti": {"moonrise": "09:31 PM", "isAngaraki": False}}),
    (6, "ಚೈ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಅನುರಾಧಾ", "Anuradha", ["ಪ.ಪೂ.ಶ್ರೀವಿದ್ಯಾವಾಚಸ್ಪತಿ ವಾಲವಲೇಕರ ಭಾರತೀ ಮಹಾಸ್ವಾಮಿನಾಂ ಆರಾಧನಮ್"], ["Sri Vidyavachaspati Bharati Mahaswamigal Aradhana"], {}),
    (7, "ಚೈ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಶ್ರೀಚಂದ್ರಲಾ ಪರಮೇಶ್ವರಿ ಉತ್ಸವ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ-ಸನ್ನತ್ತಿ)", "ಶ್ರೀಶೇಷಾಚಲ ಮಹಾರಾಜ ಜಯಂತಿ (ಅಗಡಿ)"], ["Sri Chandrala Parameshwari Utsava (Hebballi-Sannatti)", "Sri Sheshachala Maharaja Jayanti (Agadi)"], {}),
    (8, "ಚೈ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಮೂಲಾ", "Mula", [], [], {}),
    (9, "ಚೈ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಮೂಲಾ", "Mula", ["ಭೂಮೌ ವಹ್ನಿಃ"], ["Bhaumau Vahnih"], {}),
    (10, "ಚೈ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಪೂ.ಷಾ", "Purvashadha", ["ಕಾಲಾಷ್ಟಮಿ"], ["Kalashtami"], {}),
    (11, "ಚೈ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಉ.ಷಾ", "Uttarashadha", ["ಶ್ರೀಪ್ರಾಣೇಶದಾಸರ ಜನ್ಮೋತ್ಸವ", "ಶ್ರೀ ನಾರಾಯಣಾನಂದಸರಸ್ವತೀ ಸ್ವಾಮಿಗಳ ಆರಾಧನೆ"], ["Sri Praneshadasara Janmotsava"], {}),
    (12, "ಚೈ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಶ್ರವಣ", "Shravana", [], [], {}),
    (13, "ಚೈ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಧನಿಷ್ಠಾ", "Dhanishtha", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ವರೂಥಿನೀ)", "ಶ್ರೀ ಗೋವಿಂದಾನಂದತೀರ್ಥ ಸ್ವಾಮಿಗಳ ಆರಾಧನೆ (ಧಾರವಾಡ)"], ["Sarvesham Ekadashi (Varuthini)", "Sri Govindanandatirtha Swamigal Aradhana (Dharwad)"], {"ekadashi": "ವರೂಥಿನೀ", "ekadashi_en": "Varuthini"}),
    (14, "ಚೈ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಶತತಾರಾ", "Shatatara", ["ಡಾ|| ಅಂಬೇಡ್ಕರ್ ಜಯಂತಿ", "ಶ್ರೀನರಸಿಂಹಾಶ್ರಮಸ್ವಾಮಿಗಳ ಆರಾಧನೆ"], ["Dr. B. R. Ambedkar Jayanti", "Sri Narasimhashrama Swamigal Aradhana"], {"holiday": "ಡಾ|| ಅಂಬೇಡ್ಕರ್ ಜಯಂತಿ", "holiday_en": "Dr. Ambedkar Jayanti"}),
    (15, "ಚೈ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಪೂ.ಭಾ", "Purvabhadra", ["ಪಕ್ಷಪ್ರದೋಷ", "ಶ್ರೀ ಸಚ್ಚಿದಾನಂದೇಶ್ವರ ಪುಣ್ಯತಿಥಿ (ಅಕ್ಕಲಕೋಟೆ)"], ["Paksha Pradosha", "Sri Sachidanandeshwara Punyatithi (Akkalkot)"], {}),
    (16, "ಚೈ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಉ.ಭಾ", "Uttarabhadra", ["ಭೂಮೌ ವಹ್ನಿಃ", "ಮಾಸಶಿವರಾತ್ರಿ"], ["Bhaumau Vahnih", "Masashivaratri"], {}),
    (17, "ಚೈ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಅಕ್ಷತದವೀ)", "Amavasya", 30, 15, "Krishna", "ರೇವತೀ", "Revati", ["ಅಕ್ಷತದವೀ ಅಮಾವಾಸ್ಯೆ", "ದರ್ಶ", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (11.58 ರ ವರೆಗೆ)", "ಪ.ಪೂ.ಶ್ರೀನಾರಾಯಣಸ್ವಾಮಿನಾಮಾರಾಧನಂ (ನರಸೋಬಾವಾಡಿ)"], ["Akshatadavi Amavasya", "Darsha", "Amritasiddhi Yoga", "Sri Narayanaswami Aradhana (Narasobawadi)"], {"amavasya": "ಅಕ್ಷತದವೀ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Akshatadavi Amavasya"}),
    (18, "ವೈ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಅಶ್ವಿನಿ", "Ashwini", ["ಇಷ್ಟಿ"], ["Ishti"], {}),
    (19, "ವೈ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಭರಣೀ", "Bharani", ["ಶ್ರೀಛತ್ರಪತಿ ಶಿವಾಜಿ ಮಹಾರಾಜರ ಜಯಂತಿ", "ಪರಶುರಾಮ ಜಯಂತಿ"], ["Chatrapati Shivaji Maharaj Jayanti", "Parashurama Jayanti"], {}),
    (20, "ವೈ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಕೃತ್ತಿಕಾ / ರೋಹಿಣಿ", "Krittika / Rohini", ["ಅಕ್ಷಯ ತೃತೀಯಾ", "ವಿನಾಯಕ ಚತುರ್ಥಿ", "ಬಸವ ಜಯಂತಿ"], ["Akshaya Tritiya", "Vinayaka Chaturthi", "Basava Jayanti"], {"holiday": "ಬಸವ ಜಯಂತಿ / ಅಕ್ಷಯ ತೃತೀಯಾ", "holiday_en": "Basava Jayanti / Akshaya Tritiya"}),
    (21, "ವೈ.ಶು.ಚತುರ್ಥಿ / ಪಂಚಮಿ", "Chaturthi", 4, 4, "Shukla", "ಮೃಗಶಿರಾ", "Mrigashira", [], [], {}),
    (22, "ವೈ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", [], [], {}),
    (23, "ವೈ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಪುನರ್ವಸು", "Punarvasu", ["ಗಂಗೋತ್ಪತ್ತಿ"], ["Gangotpatti"], {}),
    (24, "ವೈ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಪುಷ್ಯ", "Pushya", ["ಜಗದ್ಗುರು ಶ್ರೀಶಂಕರಾಚಾರ್ಯ ಜಯಂತಿ ಉತ್ಸವಾರಂಭ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)"], ["Jagadguru Sri Shankaracharya Jayanti Utsavarambha (Hebballi)"], {}),
    (25, "ವೈ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಶ್ರೀ ಶಂಕರಾಚಾರ್ಯ ಜಯಂತಿ 2ನೇ ದಿನ"], ["Sri Shankaracharya Jayanti Day 2"], {}),
    (26, "ವೈ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಮಘಾ", "Magha", ["ಜಗದ್ಗುರು ಶ್ರೀಶಂಕರಭಗವತ್ಪಾದಾಚಾರ್ಯ ಜಯಂತಿ", "ಶ್ರೀವೆಂಕಟೇಶ್ವರ ಕಲ್ಯಾಣೋತ್ಸವ (ವೆಂಕಟಾಪೂರ)", "ಸೋಮೇಶ್ವರ ರಥೋತ್ಸವ (ಲಕ್ಷ್ಮೇಶ್ವರ)"], ["Jagadguru Sri Shankaracharya Jayanti", "Sri Venkateshwara Kalyanotsava", "Someshwara Rathotsava"], {}),
    (27, "ವೈ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಪೂರ್ವಾ", "Purva Phalguni", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಮೋಹಿನೀ)"], ["Sarvesham Ekadashi (Mohini)"], {"ekadashi": "ಮೋಹಿನೀ", "ekadashi_en": "Mohini"}),
    (28, "ವೈ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಉತ್ತರಾ", "Uttara Phalguni", [], [], {}),
    (29, "ವೈ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಹಸ್ತಾ", "Hasta", ["ಪಕ್ಷಪ್ರದೋಷ"], ["Paksha Pradosha"], {}),
    (30, "ವೈ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಚಿತ್ರಾ", "Chitra", ["ಶ್ರೀನೃಸಿಂಹ ಜಯಂತಿ", "ಶ್ರೀವೇದವ್ಯಾಸ ಜಯಂತಿ"], ["Sri Narasimha Jayanti", "Sri Vedavyasa Jayanti"], {})
]

# 5. MAY (31 days)
may = [
    (1, "ವೈ.ಶು.ಪೌರ್ಣಿಮೆ (ಅಗೀ)", "Purnima", 15, 15, "Shukla", "ಸ್ವಾತಿ", "Swati", ["ಅಗೀ ಹುಣ್ಣಿಮೆ", "ವೈಶಾಖ ಸ್ನಾನ ಸಮಾಪ್ತಿ", "ಶ್ರೀಶಂಕರಾಚಾರ್ಯ ಗುಹಾಪ‍್ರವೇಶ", "ಕೂರ್ಮ ಜಯಂತಿ", "ಕಾರ್ಮಿಕರ ದಿನಾಚರಣೆ"], ["Agi Hunnime", "Vaishakha Snana Samapti", "Kurma Jayanti", "Labour Day"], {"hunnime": "ಅಗೀ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Agi Hunnime", "holiday": "ಕಾರ್ಮಿಕರ ದಿನಾಚರಣೆ", "holiday_en": "Labour Day"}),
    (2, "ವೈ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ವಿಶಾಖಾ", "Vishakha", ["ಇಷ್ಟಿ", "ಶ್ರೀಲಕ್ಷ್ಮೀರಮಣಸ್ವಾಮಿ ರಥ (ಕಂಚಿ)"], ["Ishti", "Sri Lakshmiramanaswami Ratha"], {}),
    (3, "ವೈ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ವಿಶಾಖಾ", "Vishakha", ["ನಾರದ ಜಯಂತಿ"], ["Narada Jayanti"], {}),
    (4, "ವೈ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಅನುರಾಧಾ", "Anuradha", [], [], {}),
    (5, "ವೈ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ (ಅಂಗಾರಕೀ) ಚಂ.ಉ.ರಾ 10-01 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Angaraki Sankashtahara Chaturthi (Moonrise 10:01 PM Hebballi)"], {"sankashti": {"moonrise": "10:01 PM", "isAngaraki": True}}),
    (6, "ವೈ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಮೂಲಾ", "Mula", [], [], {}),
    (7, "ವೈ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಪೂ.ಷಾ", "Purvashadha", [], [], {}),
    (8, "ವೈ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಉ.ಷಾ", "Uttarashadha", [], [], {}),
    (9, "ವೈ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಶ್ರವಣ", "Shravana", ["ಶ್ರೀರಾಮ ಪಟ್ಟಾಭಿಷೇಕ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಕಾಲಾಷ್ಟಮಿ"], ["Sri Rama Pattabhisheka (Hebballi)", "Kalashtami"], {}),
    (10, "ವೈ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಧನಿಷ್ಠಾ", "Dhanishtha", [], [], {}),
    (11, "ವೈ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಶತತಾರಾ", "Shatatara", ["ಹುಲಗಮ್ಮ ರಥೋತ್ಸವ (ಹುಲಗಿ-ಮುನಿರಾಬಾದ)"], ["Hulagamma Rathotsava"], {}),
    (12, "ವೈ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಪೂ.ಭಾ", "Purvabhadra", ["ಕಡಲಸಂಗಮಧ್ವಜಾರೋಹಣ"], ["Kudalasangama Dhvajarohana"], {}),
    (13, "ವೈ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಉ.ಭಾ", "Uttarabhadra", ["ಅಗಸ್ತ್ಯುದ್ಯೋಗೋತ್ಸವ (ಹುಲಗಿ)", "ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಅಪರಾ)"], ["Sarvesham Ekadashi (Apara)"], {"ekadashi": "ಅಪರಾ", "ekadashi_en": "Apara"}),
    (14, "ವೈ.ಕೃ.ದ್ವಾದಶಿ / ತ್ರಯೋದಶಿ", "Dvadashi", 27, 12, "Krishna", "ರೇವತೀ", "Revati", ["ಪಕ್ಷಪ್ರದೋಷ"], ["Paksha Pradosha"], {}),
    (15, "ವೈ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಅಶ್ವಿನಿ", "Ashwini", ["ಮಾಸಶಿವರಾತ್ರಿ"], ["Masashivaratri"], {}),
    (16, "ವೈ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಬಾದಾಮಿ)", "Amavasya", 30, 15, "Krishna", "ಭರಣೀ", "Bharani", ["ಬಾದಾಮಿ ಅಮಾವಾಸ್ಯೆ", "ದರ್ಶ", "ಭಾವುಕಾಲಕರಿನಮ್", "ಶ್ರೀ ಶನೈಶ್ಚರ ಜಯಂತಿ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)"], ["Badami Amavasya", "Darsha", "Sri Shanaishchara Jayanti (Hebballi)"], {"amavasya": "ಬಾದಾಮಿ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Badami Amavasya"}),
    (17, "ಅ.ಜ್ಯೇ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಕೃತ್ತಿಕಾ", "Krittika", ["ಇಷ್ಟಿ", "ಅಧಿಕಮಾಸಾರಂಭಃ", "ದಶಹರಾವ್ರತಾರಂಭಃ"], ["Ishti", "Adhika Masa Begins (Adhika Jyeshtha)", "Dashaharavratarambha"], {}),
    (18, "ಅ.ಜ್ಯೇ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ರೋಹಿಣಿ", "Rohini", [], [], {}),
    (19, "ಅ.ಜ್ಯೇ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಮೃಗಶಿರಾ", "Mrigashira", [], [], {}),
    (20, "ಅ.ಜ್ಯೇ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", ["ವಿನಾಯಕ ಚತುರ್ಥಿ"], ["Vinayaka Chaturthi"], {}),
    (21, "ಅ.ಜ್ಯೇ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಪುನರ್ವಸು", "Punarvasu", ["ಗುರುಪುಷ್ಯಾರ್ತಾಮೃತಸಿದ್ಧಿಯೋಗಃ (09.39 ರ ನಂತರ)"], ["Gurupushyamritasiddhi Yoga"], {}),
    (22, "ಅ.ಜ್ಯೇ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಪುಷ್ಯ", "Pushya", [], [], {}),
    (23, "ಅ.ಜ್ಯೇ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಆಶ್ಲೇಷಾ", "Ashlesha", [], [], {}),
    (24, "ಅ.ಜ್ಯೇ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಮಘಾ", "Magha", [], [], {}),
    (25, "ಅ.ಜ್ಯೇ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಪೂರ್ವಾ", "Purva Phalguni", [], [], {}),
    (26, "ಅ.ಜ್ಯೇ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಉತ್ತರಾ", "Uttara Phalguni", ["ದಶಹರಾ ವ್ರತಸಮಾಪ್ತಿ", "ಗಂಗಾಪೂಜಾ"], ["Dashahara Vrata Samapti", "Ganga Puja"], {}),
    (27, "ಅ.ಜ್ಯೇ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಹಸ್ತಾ", "Hasta", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಪದ್ಮಾ / ಪದ್ಮಿನೀ)"], ["Sarvesham Ekadashi (Padmini)"], {"ekadashi": "ಪದ್ಮಾ (ಪದ್ಮಿನೀ)", "ekadashi_en": "Padmini"}),
    (28, "ಅ.ಜ್ಯೇ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಚಿತ್ರಾ", "Chitra", ["ಬಕ್ರೀದ್", "ಪಕ್ಷಪ್ರದೋಷ"], ["Bakrid", "Paksha Pradosha"], {"holiday": "ಬಕ್ರೀದ್", "holiday_en": "Bakrid"}),
    (29, "ಅ.ಜ್ಯೇ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಸ್ವಾತಿ", "Swati", [], [], {}),
    (30, "ಅ.ಜ್ಯೇ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ವಿಶಾಖಾ", "Vishakha", [], [], {}),
    (31, "ಅ.ಜ್ಯೇ.ಶು.ಪೌರ್ಣಿಮೆ (ಅಧಿಕ)", "Purnima", 15, 15, "Shukla", "ಅನುರಾಧಾ", "Anuradha", ["ಅಧಿಕ ಹುಣ್ಣಿಮೆ", "ತಿಥಿಕೂನ್ಯಮ್"], ["Adhika Hunnime"], {"hunnime": "ಅಧಿಕ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Adhika Hunnime"})
]

# 6. JUNE (30 days)
jun = [
    (1, "ಅ.ಜ್ಯೇ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಇಷ್ಟಿ"], ["Ishti"], {}),
    (2, "ಅ.ಜ್ಯೇ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಮೂಲಾ", "Mula", [], [], {}),
    (3, "ಅ.ಜ್ಯೇ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಪೂ.ಷಾ", "Purvashadha", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 09-34 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Sankashtahara Chaturthi (Moonrise 09:34 PM Hebballi)"], {"sankashti": {"moonrise": "09:34 PM", "isAngaraki": False}}),
    (4, "ಅ.ಜ್ಯೇ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಉ.ಷಾ", "Uttarashadha", [], [], {}),
    (5, "ಅ.ಜ್ಯೇ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಶ್ರವಣ", "Shravana", [], [], {}),
    (6, "ಅ.ಜ್ಯೇ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಧನಿಷ್ಠಾ", "Dhanishtha", [], [], {}),
    (7, "ಅ.ಜ್ಯೇ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಶತತಾರಾ", "Shatatara", [], [], {}),
    (8, "ಅ.ಜ್ಯೇ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಪೂ.ಭಾ", "Purvabhadra", ["ಕಾಲಾಷ್ಟಮಿ"], ["Kalashtami"], {}),
    (9, "ಅ.ಜ್ಯೇ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಉ.ಭಾ", "Uttarabhadra", [], [], {}),
    (10, "ಅ.ಜ್ಯೇ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ರೇವತೀ", "Revati", [], [], {}),
    (11, "ಅ.ಜ್ಯೇ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಅಶ್ವಿನಿ", "Ashwini", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಪದ್ಮಿನೀ)"], ["Sarvesham Ekadashi (Padmini)"], {"ekadashi": "ಪದ್ಮಿನೀ", "ekadashi_en": "Padmini"}),
    (12, "ಅ.ಜ್ಯೇ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಭರಣೀ", "Bharani", ["ಪಕ್ಷಪ್ರದೋಷ"], ["Paksha Pradosha"], {}),
    (13, "ಅ.ಜ್ಯೇ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಕೃತ್ತಿಕಾ", "Krittika", ["ಮಾಸಶಿವರಾತ್ರಿ", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (00-17 ಅನಂತರಮ್)", "ತಿಥಿದ್ವಯಮ್ (ತ್ರಯೋದಶಿ-ಚತುರ್ದಶಿ ಶ್ರಾದ್ಧಮ್)"], ["Masashivaratri", "Amritasiddhi Yoga", "Tithidvayam"], {}),
    (14, "ಅ.ಜ್ಯೇ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ರೋಹಿಣಿ", "Rohini", ["ದರ್ಶ"], ["Darsha"], {}),
    (15, "ಅ.ಜ್ಯೇ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಅಧಿಕ)", "Amavasya", 30, 15, "Krishna", "ಮೃಗಶಿರಾ", "Mrigashira", ["ಅಧಿಕ ಅಮಾವಾಸ್ಯೆ", "ಸೋಮವತೀ ಅಮಾವಾಸ್ಯೆ"], ["Adhika Amavasya", "Somavati Amavasya"], {"amavasya": "ಅಧಿಕ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Adhika Amavasya"}),
    (16, "ನಿ.ಜ್ಯೇ.ಶು.ಪ್ರತಿಪದೆ / ದ್ವಿತೀಯಾ", "Prathama", 1, 1, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", ["ಇಷ್ಟಿ", "ನಿಜ ಜ್ಯೇಷ್ಠ ಮಾಸಾರಂಭ"], ["Ishti", "Nija Jyeshtha Masa Begins"], {}),
    (17, "ನಿ.ಜ್ಯೇ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಪುನರ್ವಸು", "Punarvasu", ["ಶ್ರೀ ಅಭಿನವಸಚ್ಚಿದಾನಂದಭಾರತೀ ಸ್ವಾಮಿನಾಂ ಸಂನ್ಯಾಸ ದೀಕ್ಷಾದಿನಮ್ (ಕೂಡ್ಲಿ)"], ["Sri Abhinava Sachidananda Bharati Sannyasa Deekshadinam"], {}),
    (18, "ನಿ.ಜ್ಯೇ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಪುಷ್ಯ", "Pushya", ["ವಿನಾಯಕ ಚತುರ್ಥಿ", "ಉಮಾಅವತಾರವ್ರತಮ್", "ಗುರುಪುಷ್ಯಾರ್ತಾಮೃತಸಿದ್ಧಿಯೋಗಃ (16-35 ಪರ್ಯಂತಮ್)"], ["Vinayaka Chaturthi", "Uma Avataravratam", "Gurupushyamritasiddhi Yoga"], {}),
    (19, "ನಿ.ಜ್ಯೇ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಪ.ಪೂ. ರಾಮಾನಂದತೀರ್ಥಸ್ವಾಮಿವರಾಜನಾಮಾರಾಧನಮ್ (ಅಗ್ನಿಹೋತ್ರಿಬಾವಾ)"], ["Sri Ramanandatirtha Swamivarajaradhana"], {}),
    (20, "ನಿ.ಜ್ಯೇ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಮಘಾ", "Magha", [], [], {}),
    (21, "ನಿ.ಜ್ಯೇ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಪೂರ್ವಾ", "Purva Phalguni", [], [], {}),
    (22, "ನಿ.ಜ್ಯೇ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಉತ್ತರಾ", "Uttara Phalguni", ["ಶುಕ್ಲಾದೇವಿ ಪೂಜನಮ್"], ["Shukladevi Pujanam"], {}),
    (23, "ನಿ.ಜ್ಯೇ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಹಸ್ತಾ", "Hasta", [], [], {}),
    (24, "ನಿ.ಜ್ಯೇ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಚಿತ್ರಾ", "Chitra", ["ಶ್ರೀಯಾಜ್ಞವಲ್ಕ ಜಯಂತಿ", "ಶ್ರೀರಾಮೇಶ್ವರ ಪ್ರತಿಷ್ಠಾಪನಾದಿನಮ್"], ["Sri Yajnavalkya Jayanti", "Sri Rameshwara Pratishthapadina"], {}),
    (25, "ನಿ.ಜ್ಯೇ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಸ್ವಾತಿ", "Swati", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ನಿರ್ಜಲಾ)"], ["Sarvesham Ekadashi (Nirjala)"], {"ekadashi": "ನಿರ್ಜಲಾ", "ekadashi_en": "Nirjala"}),
    (26, "ನಿ.ಜ್ಯೇ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ವಿಶಾಖಾ", "Vishakha", ["ಮೊಹರಂ"], ["Moharram"], {"holiday": "ಮೊಹರಂ", "holiday_en": "Moharram"}),
    (27, "ನಿ.ಜ್ಯೇ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಅನುರಾಧಾ", "Anuradha", ["ಶನಿಪ್ರದೋಷ", "ವಟಸಾವಿತ್ರಿ ವ್ರತಾರಂಭಃ"], ["Shani Pradosha", "Vatasavitri Vratarambha"], {}),
    (28, "ನಿ.ಜ್ಯೇ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", [], [], {}),
    (29, "ನಿ.ಜ್ಯೇ.ಶು.ಪೌರ್ಣಿಮೆ (ಕಾರ)", "Purnima", 15, 15, "Shukla", "ಮೂಲಾ", "Mula", ["ಕಾರ ಹುಣ್ಣಿಮೆ", "ವಟಸಾವಿತ್ರೀವ್ರತಮ್", "ಕಬೀರದಾಸ ಜಯಂತಿ"], ["Kara Hunnime", "Vatasavitri Vrata", "Kabirdas Jayanti"], {"hunnime": "ಕಾರ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Kara Hunnime"}),
    (30, "ನಿ.ಜ್ಯೇ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಪೂ.ಷಾ", "Purvashadha", ["ಇಷ್ಟಿ"], ["Ishti"], {})
]

# 7. JULY (31 days)
jul = [
    (1, "ನಿ.ಜ್ಯೇ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಪೂ.ಷಾ", "Purvashadha", ["ಭೂಮೌ ವಹ್ನಿಃ"], ["Bhaumau Vahnih"], {}),
    (2, "ನಿ.ಜ್ಯೇ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಉ.ಷಾ", "Uttarashadha", [], [], {}),
    (3, "ನಿ.ಜ್ಯೇ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಶ್ರವಣ", "Shravana", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 09-38 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Sankashtahara Chaturthi (Moonrise 09:38 PM Hebballi)"], {"sankashti": {"moonrise": "09:38 PM", "isAngaraki": False}}),
    (4, "ನಿ.ಜ್ಯೇ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಧನಿಷ್ಠಾ", "Dhanishtha", [], [], {}),
    (5, "ನಿ.ಜ್ಯೇ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಶತತಾರಾ", "Shatatara", [], [], {}),
    (6, "ನಿ.ಜ್ಯೇ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಪೂ.ಭಾ", "Purvabhadra", [], [], {}),
    (7, "ನಿ.ಜ್ಯೇ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಉ.ಭಾ", "Uttarabhadra", ["ಕಾಲಾಷ್ಟಮಿ", "ಶ್ರೀ ರಾಮಾನಂದಸ್ವಾಮಿ ಸಮಾರಾಧನಮ್ (ಬಾಬಾನಗರ)"], ["Kalashtami", "Sri Ramanandaswami Samradhanam"], {}),
    (8, "ನಿ.ಜ್ಯೇ.ಕೃ.ಅಷ್ಟಮಿ / ನವಮಿ", "Ashtami", 23, 8, "Krishna", "ರೇವತೀ", "Revati", [], [], {}),
    (9, "ನಿ.ಜ್ಯೇ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಅಶ್ವಿನಿ", "Ashwini", [], [], {}),
    (10, "ನಿ.ಜ್ಯೇ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಭರಣೀ", "Bharani", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಯೋಗಿನೀ)"], ["Sarvesham Ekadashi (Yogini)"], {"ekadashi": "ಯೋಗಿನೀ", "ekadashi_en": "Yogini"}),
    (11, "ನಿ.ಜ್ಯೇ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಕೃತ್ತಿಕಾ", "Krittika", ["ಅಮೃತಸಿದ್ಧಿಯೋಗ (08-27 ರ ನಂತರ)"], ["Amritasiddhi Yoga (after 08:27)"], {}),
    (12, "ನಿ.ಜ್ಯೇ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ರೋಹಿಣಿ / ಮೃಗಶಿರಾ", "Rohini / Mrigashira", ["ಪಕ್ಷಪ್ರದೋಷ", "ಮಾಸಶಿವರಾತ್ರಿ", "ಶ್ರೀವಿದ್ಯಾರಣ್ಯಭಾರತೀ ಮಹಾಸ್ವಾಮಿ ಆರಾಧನಮ್"], ["Paksha Pradosha", "Masashivaratri", "Sri Vidyaranyabharati Swamigal Aradhana"], {}),
    (13, "ನಿ.ಜ್ಯೇ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಆರ್ದ್ರಾ", "Ardra", ["ಭೂಮೌ ವಹ್ನಿಃ"], ["Bhaumau Vahnih"], {}),
    (14, "ನಿ.ಜ್ಯೇ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಮಣ್ಣೆತ್ತಿನ)", "Amavasya", 30, 15, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", ["ಮಣ್ಣೆತ್ತಿನ ಅಮಾವಾಸ್ಯೆ", "ಮಣ್ಣೆತ್ತಿನ ಪೂಜೆ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ದರ್ಶ"], ["Mannettina Amavasya", "Mannettina Puja (Hebballi)", "Darsha"], {"amavasya": "ಮಣ್ಣೆತ್ತಿನ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Mannettina Amavasya"}),
    (15, "ಆ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಪುಷ್ಯ", "Pushya", ["ಇಷ್ಟಿ", "ಶ್ರೀ ಟೇಂಬೇಸ್ವಾಮಿ ಆರಾಧನಮ್"], ["Ishti", "Sri Tembe Swamiji Aradhana"], {}),
    (16, "ಆ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಆಶ್ಲೇಷಾ", "Ashlesha", [], [], {}),
    (17, "ಆ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಮಘಾ", "Magha", ["ದಕ್ಷಿಣಾಯನ ಪರ್ವ ಪುಣ್ಯಕಾಲ", "ದಕ್ಷಿಣಾಯನಾರಂಭಃ", "ವಿನಾಯಕ ಚತುರ್ಥಿ"], ["Dakshinayana Punyakala Begins", "Vinayaka Chaturthi"], {}),
    (18, "ಆ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಪೂರ್ವಾ", "Purva Phalguni", ["ಆಯನಕರಿನಮ್"], ["Ayana Karidinam"], {}),
    (19, "ಆ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಉತ್ತರಾ", "Uttara Phalguni", ["ಶ್ರೀಗೋವಿಂದಮಹಾರಾಜ ಪುಣ್ಯತಿಥಿ (ಮೆಹಂಗಾಂವ)", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (22-42 ರ ನಂತರ)"], ["Sri Govindamaharaja Punyatithi", "Amritasiddhi Yoga"], {}),
    (20, "ಆ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಹಸ್ತಾ", "Hasta", ["ಶ್ರೀ ಭಗವನ್ನಾರಾಯಣ ಜಯಂತಿ (ಅಗಡಿ)"], ["Sri Bhagavannarayana Jayanti (Agadi)"], {}),
    (21, "ಆ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಚಿತ್ರಾ", "Chitra", [], [], {}),
    (22, "ಆ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಸ್ವಾತಿ", "Swati", ["ಶ್ರೀ ಬ್ರಹ್ಮಾನಂದಸ್ವಾಮಿನಾಂ ಆರಾಧನಮ್ (ಸಿಂಧನಮಡು)"], ["Sri Brahmanandaswaminam Aradhanam"], {}),
    (23, "ಆ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ವಿಶಾಖಾ", "Vishakha", [], [], {}),
    (24, "ಆ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಅನುರಾಧಾ", "Anuradha", ["ವಿಠೋಬಾ ನವರಾತ್ರಾಮ್ (ಪಂಡರಪೂರ)"], ["Vithoba Navaratram (Pandharpur)"], {}),
    (25, "ಆ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಅನುರಾಧಾ", "Anuradha", ["ಚಾತುರ್ಮಾಸ್ಯ ವ್ರತಾರಂಭ", "ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಶಯನೀ)", "ಪಂಡರಪುರ ಯಾತ್ರೆ"], ["Chaturmasya Begins", "Sarvesham Ekadashi (Shayani)", "Pandharpur Yatra"], {"ekadashi": "ಶಯನೀ", "ekadashi_en": "Shayani"}),
    (26, "ಆ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಶಾಖ ವ್ರತಾರಂಭ", "ಶ್ರೀವಾಮನಪೂಜಾ"], ["Shakha Vratarambha", "Sri Vamana Puja"], {}),
    (27, "ಆ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಮೂಲಾ", "Mula", ["ಶ್ರೀ ಗುರುಪೌರ್ಣಿಮೆ ಉತ್ಸವ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ 1 ನೇ ದಿನ)"], ["Sri Guru Purnima Utsava Day 1 (Hebballi)"], {}),
    (28, "ಆ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಪೂ.ಷಾ", "Purvashadha", ["ಶ್ರೀ ಗುರುಪೌರ್ಣಿಮೆ ಉತ್ಸವ (2 ನೇ ದಿನ)"], ["Sri Guru Purnima Utsava Day 2 (Hebballi)"], {}),
    (29, "ಆ.ಶು.ಪೌರ್ಣಿಮೆ (ಕಡ್ಲಿಗರ)", "Purnima", 15, 15, "Shukla", "ಉ.ಷಾ", "Uttarashadha", ["ಕಡ್ಲಿಗರ ಹುಣ್ಣಿಮೆ", "ಗುರುಪೌರ್ಣಿಮಾ ಉತ್ಸವ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಸಂನ್ಯಾಸಿನಾಂ ಚಾತುರ್ಮಾಸ್ಯವ್ರತ ಆರಂಭ", "ಶ್ರೀವಿದ್ಯಾನಂದಸ್ವಾಮಿ ಆರಾಧನಂ"], ["Kadligara Hunnime (Guru Purnima)", "Guru Purnima Utsava (Hebballi)", "Sannyasinam Chaturmasya Begins"], {"hunnime": "ಕಡ್ಲಿಗರ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Kadligara Hunnime (Guru Purnima)"}),
    (30, "ಆ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಶ್ರವಣ", "Shravana", ["ಇಷ್ಟಿ", "ಲೋಕಮಾನ್ಯ ತಿಲಕರ ಪುಣ್ಯತಿಥಿ"], ["Ishti", "Lokamanya Tilak Punyatithi"], {}),
    (31, "ಆ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಧನಿಷ್ಠಾ", "Dhanishtha", [], [], {})
]

# 8. AUGUST (31 days)
aug = [
    (1, "ಆ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಶತತಾರಾ", "Shatatara", [], [], {}),
    (2, "ಆ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಪೂ.ಭಾ", "Purvabhadra", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 09-27 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Sankashtahara Chaturthi (Moonrise 09:27 PM Hebballi)"], {"sankashti": {"moonrise": "09:27 PM", "isAngaraki": False}}),
    (3, "ಆ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಉ.ಭಾ", "Uttarabhadra", [], [], {}),
    (4, "ಆ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ರೇವತೀ", "Revati", ["ಶ್ರೀ ತೋಟಕಾಚಾರ್ಯಾನಾಂ ಆರಾಧನಮ್"], ["Sri Totakacharyanam Aradhanam"], {}),
    (5, "ಆ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಅಶ್ವಿನಿ", "Ashwini", [], [], {}),
    (6, "ಆ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಭರಣೀ", "Bharani", ["ಕಾಲಾಷ್ಟಮಿ"], ["Kalashtami"], {}),
    (7, "ಆ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಕೃತ್ತಿಕಾ", "Krittika", [], [], {}),
    (8, "ಆ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ರೋಹಿಣಿ", "Rohini", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಕಾಮಿಕಾ) (ಸ್ಮಾರ್ತಾನಾಂ)", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (15-06 ರವರೆಗೆ)"], ["Sarvesham Ekadashi (Kamika)", "Amritasiddhi Yoga"], {"ekadashi": "ಕಾಮಿಕಾ", "ekadashi_en": "Kamika"}),
    (9, "ಆ.ಕೃ.ಏಕಾದಶಿ / ದ್ವಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಮೃಗಶಿರಾ", "Mrigashira", ["ಭಾಗವತ ಏಕಾದಶಿ"], ["Bhagavata Ekadashi"], {}),
    (10, "ಆ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಆರ್ದ್ರಾ", "Ardra", ["ಭಕ್ತನಾಮದೇವ ಪುಣ್ಯತಿಥಿ", "ಶ್ರೀಶಿವಾನಂದಸರಸ್ವತೀ ಸ್ವಾಮಿಗಳ ಆರಾಧನೆ (ಶಿಗ್ಗಾಂವ)", "ಸೋಮಪ್ರದೋಷ", "ಮಾಸಶಿವರಾತ್ರಿ"], ["Bhakta Namadeva Punyatithi", "Soma Pradosha", "Masashivaratri"], {}),
    (11, "ಆ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", ["ಶ್ರೀ ಶಿವಾನಂದ ತೀರ್ಥ ಸ್ವಾಮಿನಾಂ ಜಯಂತಿ"], ["Sri Shivananda Tirtha Swamigal Jayanti"], {}),
    (12, "ಆ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ನಾಗರ)", "Amavasya", 30, 15, "Krishna", "ಪುಷ್ಯ", "Pushya", ["ನಾಗರ ಅಮಾವಾಸ್ಯೆ", "ದರ್ಶ", "ಜ್ಯೋತಿರ್ಭೀಮ (ದಿವಸೀ) ಗೌರಿ ಪೂಜಾ"], ["Nagara Amavasya", "Darsha", "Jyotirbhima Gauri Puja"], {"amavasya": "ನಾಗರ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Nagara Amavasya"}),
    (13, "ಶ್ರಾ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಇಷ್ಟಿ"], ["Ishti"], {}),
    (14, "ಶ್ರಾ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಮಘಾ", "Magha", ["ಶ್ರೀಮಹಾಲಕ್ಷ್ಮಿ ಪೂಜಾ (ಸಂಪದ್ಗೌರಿ)"], ["Sri Mahalakshmi Puja (Sampadgauri)"], {}),
    (15, "ಶ್ರಾ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಪೂರ್ವಾ", "Purva Phalguni", ["ಸ್ವಾತಂತ್ರ್ಯೋತ್ಸವ"], ["Independence Day"], {"holiday": "ಸ್ವಾತಂತ್ರ್ಯೋತ್ಸವ", "holiday_en": "Independence Day"}),
    (16, "ಶ್ರಾ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಉತ್ತರಾ", "Uttara Phalguni", ["ನಾಗಚತುರ್ಥಿ", "ವಿನಾಯಕ-ನಾಗಚತುರ್ಥಿ", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (06-34 ರ ನಂತರ)"], ["Naga Chaturthi", "Vinayaka-Naga Chaturthi", "Amritasiddhi Yoga"], {}),
    (17, "ಶ್ರಾ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಹಸ್ತಾ", "Hasta", ["ನಾಗಪಂಚಮಿ", "ಶ್ರೀ ಶಂಕರಾಚಾರ್ಯ ಸಂಸ್ಕೃತ ಪಾಠಶಾಲಾ ವಾರ್ಷಿಕೋತ್ಸವ (ಧಾರವಾಡ)"], ["Naga Panchami", "Sri Shankaracharya Sanskrit Pathashala Utsava"], {}),
    (18, "ಶ್ರಾ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಚಿತ್ರಾ", "Chitra", ["ಮಂಗಳಗೌರಿ ಪೂಜಾ", "ಸಿರಿಯಾಳ ಷಷ್ಠಿ", "ಕಲ್ಕಿ ಜಯಂತಿ", "ಶೀತಲಾಷಷ್ಠಿ"], ["Mangalagauri Puja", "Siriyala Shashthi", "Kalki Jayanti"], {}),
    (19, "ಶ್ರಾ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಸ್ವಾತಿ", "Swati", ["ಶೀತಲಾಸಪ್ತಮಿ", "ಬುಧ ಬೃಹಸ್ಪತಿ ಪೂಜಾ"], ["Sheetalasaptami", "Budha Brihaspati Puja"], {}),
    (20, "ಶ್ರಾ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ವಿಶಾಖಾ", "Vishakha", [], [], {}),
    (21, "ಶ್ರಾ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಅನುರಾಧಾ", "Anuradha", ["ಸಂಪದ್ಗೌರಿ ಪೂಜಾ"], ["Sampadgauri Puja"], {}),
    (22, "ಶ್ರಾ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಶ್ರೀಪದ್ಮನಾಭ ಸ್ವಾಮಿನಾಮಾರಾಧನಮ್ (ಕಾರ್ವಾರ)"], ["Sri Padmanabha Swamigal Aradhana"], {}),
    (23, "ಶ್ರಾ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಮೂಲಾ", "Mula", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಪುತ್ರದಾ)"], ["Sarvesham Ekadashi (Putrada)"], {"ekadashi": "ಪುತ್ರದಾ", "ekadashi_en": "Putrada"}),
    (24, "ಶ್ರಾ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಪೂ.ಷಾ", "Purvashadha", [], [], {}),
    (25, "ಶ್ರಾ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಉ.ಷಾ", "Uttarashadha", ["ಭೌಮಪ್ರದೋಷ"], ["Bhauma Pradosha"], {}),
    (26, "ಶ್ರಾ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಶ್ರವಣ", "Shravana", ["ಋಗ್ವೇದಿನಾಂ ಉಪಾಕರ್ಮ", "ಈದ್ ಮಿಲಾದ್"], ["Rigvedinam Upakarma", "Eid Milad"], {"holiday": "ಈದ್ ಮಿಲಾದ್", "holiday_en": "Eid Milad"}),
    (27, "ಶ್ರಾ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಧನಿಷ್ಠಾ", "Dhanishtha", ["ಯಜುರ್ವೇದಿನಾಂ ಉಪಾಕರ್ಮ", "ಪವಿತ್ರಾರೋಪಣಮ್"], ["Yajurvedinam Upakarma", "Pavitraropanam"], {}),
    (28, "ಶ್ರಾ.ಶು.ಪೌರ್ಣಿಮೆ (ನೂಲ)", "Purnima", 15, 15, "Shukla", "ಶತತಾರಾ", "Shatatara", ["ನೂಲ ಹುಣ್ಣಿಮೆ", "ರಕ್ಷಾಬಂಧನ", "ಅಥರ್ವವೇದಿನಾಂ ಚ ಉಪಾಕರ್ಮ", "ಶ್ರೀವರಮಹಾಲಕ್ಷ್ಮೀ ವ್ರತಮ್"], ["Noola Hunnime", "Raksha Bandhana", "Atharvavedinam Upakarma", "Sri Varamahalakshmi Vrata"], {"hunnime": "ನೂಲ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Noola Hunnime (Raksha Bandhana)"}),
    (29, "ಶ್ರಾ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಪೂ.ಭಾ", "Purvabhadra", ["ಗುರುಸಾರ್ವಭೌಮ ಶ್ರೀರಾಘವೇಂದ್ರಸ್ವಾಮಿಗಳ ಆರಾಧನೆ ಆರಂಭ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ 1 ನೇ ದಿನ - ಪೂರ್ವಾರಾಧನೆ)"], ["Sri Raghavendra Swamiji Aradhana Day 1 (Hebballi)"], {}),
    (30, "ಶ್ರಾ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಉ.ಭಾ", "Uttarabhadra", ["ಶ್ರೀ ರಾಘವೇಂದ್ರಸ್ವಾಮಿಗಳ ಆರಾಧನೆ (2ನೇ ದಿನ - ಮಧ್ಯಾರಾಧನೆ)"], ["Sri Raghavendra Swamiji Aradhana Day 2 (Madhyaradhana)"], {}),
    (31, "ಶ್ರಾ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ರೇವತೀ", "Revati", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ (ವಾರ್ಷಿಕೀ) ಚಂ.ಉ.ರಾ 08-45 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ", "ಶ್ರೀ ರಾಘವೇಂದ್ರಸ್ವಾಮಿಗಳ ಆರಾಧನೆ (3ನೇ ದಿನ - ಉತ್ತರಾರಾಧನೆ)"], ["Varshiki Sankashtahara Chaturthi (Moonrise 08:45 PM Hebballi)", "Sri Raghavendra Swamiji Aradhana Day 3"], {"sankashti": {"moonrise": "08:45 PM", "isAngaraki": False}})
]

# 9. SEPTEMBER (30 days)
sep = [
    (1, "ಶ್ರಾ.ಕೃ.ಚತುರ್ಥಿ / ಪಂಚಮಿ", "Chaturthi", 19, 4, "Krishna", "ಅಶ್ವಿನಿ", "Ashwini", ["ಶ್ರೀ ಟೇಂಬೇ ಮಹಾಸ್ವಾಮಿಗಳ ಜನ್ಮದಿನಮ್"], ["Sri Tembe Mahaswamigal Janmadinam"], {}),
    (2, "ಶ್ರಾ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಭರಣೀ", "Bharani", [], [], {}),
    (3, "ಶ್ರಾ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಕೃತ್ತಿಕಾ", "Krittika", [], [], {}),
    (4, "ಶ್ರಾ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ರೋಹಿಣಿ", "Rohini", ["ಶ್ರೀಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಕಾಲಾಷ್ಟಮಿ"], ["Sri Krishna Janmashtami (Hebballi)", "Kalashtami"], {}),
    (5, "ಶ್ರಾ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಮೃಗಶಿರಾ", "Mrigashira", ["ಶ್ರೀಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿ ವ್ರತಪಾರಣಂ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)"], ["Sri Krishna Janmashtami Vrataparanam"], {}),
    (6, "ಶ್ರಾ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಆರ್ದ್ರಾ", "Ardra", [], [], {}),
    (7, "ಶ್ರಾ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಅಜಾ)"], ["Sarvesham Ekadashi (Aja)"], {"ekadashi": "ಅಜಾ", "ekadashi_en": "Aja"}),
    (8, "ಶ್ರಾ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಪುಷ್ಯ", "Pushya", ["ಶ್ರೀನಾರಾಯಣ ಮಹಾರಾಜ ಪುಣ್ಯತಿಥಿ", "ತಿಥಿದ್ವಯಮ್ (ದ್ವಾದಶಿ-ತ್ರಯೋದಶಿ ಶ್ರಾದ್ಧಮ್)", "ಭೌಮಪ್ರದೋಷ"], ["Sri Narayana Maharaj Punyatithi", "Tithidvayam", "Bhauma Pradosha"], {}),
    (9, "ಶ್ರಾ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಮಾಸಶಿವರಾತ್ರಿ"], ["Masashivaratri"], {}),
    (10, "ಶ್ರಾ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಮಘಾ", "Magha", ["ಪಿಠೋರಿವ್ರತಮ್"], ["Pithorivratam"], {}),
    (11, "ಶ್ರಾ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಬೆನಕನ)", "Amavasya", 30, 15, "Krishna", "ಪೂರ್ವಾ", "Purva Phalguni", ["ಬೆನಕನ ಅಮಾವಾಸ್ಯೆ", "ದರ್ಶ", "ಇಷ್ಟಿ"], ["Benakana Amavasya", "Darsha", "Ishti"], {"amavasya": "ಬೆನಕನ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Benakana Amavasya"}),
    (12, "ಭಾ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಉತ್ತರಾ", "Uttara Phalguni", [], [], {}),
    (13, "ಭಾ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಹಸ್ತಾ", "Hasta", ["ವರಾಹ ಜಯಂತಿ", "ಸಾಮಾನಾನಾಂ ಉಪಾಕರ್ಮ", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (14-36 ರ ವರೆಗೆ)"], ["Varaha Jayanti", "Amritasiddhi Yoga"], {}),
    (14, "ಭಾ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಚಿತ್ರಾ", "Chitra", ["ಗಣೇಶಚತುರ್ಥಿ ವ್ರತಂ", "ಸ್ವರ್ಣಗೌರಿ / ಹರಿತಾಲಿಕಾವ್ರತಂ", "ಚಂದ್ರದರ್ಶನ ನಿಷೇಧಃ"], ["Ganesha Chaturthi Vrata", "Swarnagauri / Haritalika Vrata", "Chandradarshana Nishedha"], {"holiday": "ಗಣೇಶಚತುರ್ಥಿ", "holiday_en": "Ganesha Chaturthi"}),
    (15, "ಭಾ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಸ್ವಾತಿ", "Swati", ["ಶ್ರೀಪಾದ ಶ್ರೀವಲ್ಲಭ ಜಯಂತಿ (ಕುರಂಗಡ್ಡಿ-ಶಿರೂರಾಪುರ)", "ಋಷಿಪಂಚಮಿ"], ["Sri Sripada Srivallabha Jayanti", "Rishi Panchami"], {}),
    (16, "ಭಾ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ವಿಶಾಖಾ", "Vishakha", ["ಶ್ರೀ ಗಜಾನನ ಮಹಾರಾಜ ಪುಣ್ಯತಿಥಿ (ಶೇಗಾಂವ)", "ಮಲ್ಲಿಕಾರ್ಜುನ ಜಯಂತಿ"], ["Sri Gajanana Maharaj Punyatithi", "Mallikarjuna Jayanti"], {}),
    (17, "ಭಾ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಅನುರಾಧಾ", "Anuradha", ["ಸೂರ್ಯಷಷ್ಠಿ", "ಕಾರ್ತಿಕೇಯಸ್ವಾಮಿ ದರ್ಶನ", "ಜ್ಯೇಷ್ಠಾದೇವಿ ಆವಾಹನಮ್"], ["Suryashashthi", "Kartikeyaswami Darshana", "Jyeshthadevi Avahanam"], {}),
    (18, "ಭಾ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಜ್ಯೇಷ್ಠಾದೇವಿ ಪೂಜನಮ್"], ["Jyeshthadevi Pujanam"], {}),
    (19, "ಭಾ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಮೂಲಾ", "Mula", ["ಜ್ಯೇಷ್ಠಾದೇವಿ ವಿಸರ್ಜನಮ್"], ["Jyeshthadevi Visarjanam"], {}),
    (20, "ಭಾ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಪೂ.ಷಾ", "Purvashadha", ["ಜ್ಯೇಷ್ಠಾದೇವಿ ವಿಸರ್ಜನಮ್", "ಭಾಗವತಸಪ್ತಾಹ ಪ್ರಾರಂಬ"], ["Bhagavata Saptaha Begins"], {}),
    (21, "ಭಾ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಉ.ಷಾ", "Uttarashadha", ["ಶ್ರೀರಾಮಕೃಷ್ಣಪರಮಹಂಸ ಪುಣ್ಯತಿಥಿ"], ["Sri Ramakrishna Paramahamsa Punyatithi"], {}),
    (22, "ಭಾ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಉ.ಷಾ", "Uttarashadha", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಪರಿವರ್ತಿನೀ)"], ["Sarvesham Ekadashi (Parivartini)"], {"ekadashi": "ಪರಿವರ್ತಿನೀ", "ekadashi_en": "Parivartini"}),
    (23, "ಭಾ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಶ್ರವಣ", "Shravana", ["ವಾಮನ ಜಯಂತಿ", "ಶ್ರೀ ಸದಾನಂದಯತಿ ಸಮಾರಾಧನಮ್"], ["Vamana Jayanti", "Sri Sadanandayati Samradhanam"], {}),
    (24, "ಭಾ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಧನಿಷ್ಠಾ", "Dhanishtha", ["ಪಕ್ಷಪ್ರದೋಷ"], ["Paksha Pradosha"], {}),
    (25, "ಭಾ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಶತತಾರಾ", "Shatatara", ["ಪಾರ್ಥಿವ ಗಣಪತಿ ವಿಸರ್ಜನಮ್ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಅನಂತಚತುರ್ದಶೀ ವ್ರತಮ್"], ["Parthiva Ganapati Visarjanam (Hebballi)", "Ananta Chaturdashi Vrata"], {}),
    (26, "ಭಾ.ಶು.ಪೌರ್ಣಿಮೆ (ಅನಂತನ)", "Purnima", 15, 15, "Shukla", "ಪೂ.ಭಾ", "Purvabhadra", ["ಅನಂತನ ಹುಣ್ಣಿಮೆ", "ಭಾಗವತಸಪ್ತಾಹ ಸಮಾಪ್ತಿ", "ಸಂನ್ಯಾಸಿನಾಂ ಚಾತುರ್ಮಾಸ್ಯ ಸಮಾಪ್ತಿ"], ["Anantana Hunnime", "Bhagavata Saptaha Samapti", "Chaturmasya Samapti"], {"hunnime": "ಅನಂತನ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Anantana Hunnime"}),
    (27, "ಭಾ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ಉ.ಭಾ", "Uttarabhadra", ["ಮಹಾಲಯ ಪಕ್ಷಮಾಸ ಆರಂಭ", "ಇಷ್ಟಿ", "ಗಜಗೌರೀವ್ರತಮ್"], ["Mahalaya Paksha Begins", "Ishti", "Gajagauri Vrata"], {}),
    (28, "ಭಾ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ರೇವತೀ", "Revati", [], [], {}),
    (29, "ಭಾ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಅಶ್ವಿನಿ", "Ashwini", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ (ಅಂಗಾರಕೀ) ಚಂ.ಉ.ರಾ 08-10 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ", "ಮಹಾಭರಣೀ ಶ್ರಾದ್ಧಮ್", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (11-10 ರ ವರೆಗೆ)"], ["Angaraki Sankashtahara Chaturthi (Moonrise 08:10 PM Hebballi)", "Mahabharani Shraddham", "Amritasiddhi Yoga"], {"sankashti": {"moonrise": "08:10 PM", "isAngaraki": True}}),
    (30, "ಭಾ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಭರಣೀ", "Bharani", [], [], {})
]

# 10. OCTOBER (31 days)
octo = [
    (1, "ಭಾ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಕೃತ್ತಿಕಾ", "Krittika", ["ತಿಥಿದ್ವಯಮ್ (ಪಂಚಮೀ-ಷಷ್ಠಿ ಶ್ರಾದ್ಧಮ್)"], ["Tithidvayam (Panchami / Shashthi Shraddham)"], {}),
    (2, "ಭಾ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ರೋಹಿಣಿ / ಮೃಗಶಿರಾ", "Rohini / Mrigashira", ["ಗಾಂಧಿ ಜಯಂತಿ", "ಶ್ರೀ ಶಿವಾನಂದಸರಸ್ವತೀ ಸ್ವಾಮಿಗಳ ಜಯಂತಿ"], ["Gandhi Jayanti", "Sri Shivanandasaraswati Jayanti"], {"holiday": "ಗಾಂಧಿ ಜಯಂತಿ", "holiday_en": "Gandhi Jayanti"}),
    (3, "ಭಾ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಆರ್ದ್ರಾ", "Ardra", ["ಕಾಲಾಷ್ಟಮಿ"], ["Kalashtami"], {}),
    (4, "ಭಾ.ಕೃ.ಅಷ್ಟಮಿ / ನವಮಿ", "Ashtami", 23, 8, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", ["ಅವಿಧವಾನವಮೀ ಶ್ರಾದ್ಧಮ್", "ಸರ್ವೇಷಾಂ ಅನ್ವಷ್ಟಕಾಶ್ರಾಧ್ದಮ್"], ["Avidhavanavami Shraddham", "Anvashtaka Shraddham"], {}),
    (5, "ಭಾ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಪುಷ್ಯ", "Pushya", ["ಸದ್ಗುರು ಶ್ರೀಬ್ರಹ್ಮಚೈತನ್ಯ ಮಹಾರಾಜರ ಮಹಾಲಯ ಪಕ್ಷ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)"], ["Sadguru Sri Brahmachaitanya Maharaj Mahalaya Paksha (Hebballi)"], {}),
    (6, "ಭಾ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಇಂದಿರಾ)"], ["Sarvesham Ekadashi (Indira)"], {"ekadashi": "ಇಂದಿರಾ", "ekadashi_en": "Indira"}),
    (7, "ಭಾ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಮಘಾ", "Magha", ["ಸಂನ್ಯಾಸಿನಾಂ ಮಹಾಲಯಃ"], ["Sannyasinam Mahalayah"], {}),
    (8, "ಭಾ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಪೂರ್ವಾ", "Purva Phalguni", ["ಶಸ್ತ್ರಾಹತಶ್ರಾದ್ಧಮ್", "ಮಘಾತ್ರಯೋದಶಿ"], ["Shastrahata Shraddham", "Magha Trayodashi"], {}),
    (9, "ಭಾ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಉತ್ತರಾ", "Uttara Phalguni", ["ಪಕ್ಷಪ್ರದೋಷ", "ಮಾಸಶಿವರಾತ್ರಿ"], ["Paksha Pradosha", "Masashivaratri"], {}),
    (10, "ಭಾ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಸರ್ವಪಿತೃ)", "Amavasya", 30, 15, "Krishna", "ಹಸ್ತಾ", "Hasta", ["ಸರ್ವಪಿತೃ ಅಮಾವಾಸ್ಯೆ (ಮಹಾಲಯ ಅಮಾವಾಸ್ಯೆ)", "ಸದ್ಗುರು ಶ್ರೀಬ್ರಹ್ಮಾನಂದ ಮಹಾರಾಜರ 108ನೇ ಪುಣ್ಯತಿಥಿ ಮಹೋತ್ಸವ (ಶ್ರೀಕ್ಷೇತ್ರ ವೆಂಕಟಾಪೂರ-ಹೆಬ್ಬಳ್ಳಿ)"], ["Sarvapitru Amavasya (Mahalaya Amavasya)", "Sri Brahmananda Maharaj 108th Punyatithi"], {"amavasya": "ಸರ್ವಪಿತೃ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Sarvapitru Amavasya (Mahalaya Amavasya)"}),
    (11, "ಆ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಚಿತ್ರಾ", "Chitra", ["ಶರನ್ನವರಾತ್ರಾರಂಭ", "ಘಟಸ್ಥಾಪನ", "ಶ್ರೀಜ್ಞಾನೇಶ್ವರ ಮಹಾರಾಜ ಜಯಂತಿ", "ಮಾತೃಮಾಹಾ ಶ್ರಾದ್ಧಮ್"], ["Sharannavaratri Begins", "Ghatasthapana", "Sri Dnyaneshwar Maharaj Jayanti", "Matrumaha Shraddham"], {}),
    (12, "ಆ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಸ್ವಾತಿ", "Swati", [], [], {}),
    (13, "ಆ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ವಿಶಾಖಾ", "Vishakha", ["ಸಪ್ತರಾತ್ರಾರಂಭಃ"], ["Saptaratrarambha"], {}),
    (14, "ಆ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಅನುರಾಧಾ", "Anuradha", ["ವಿನಾಯಕ ಚತುರ್ಥಿ", "ಅಮೃತಸಿದ್ಧಿಯೋಗ"], ["Vinayaka Chaturthi", "Amritasiddhi Yoga"], {}),
    (15, "ಆ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಉಪಾಂಗಲಲಿತಾವ್ರತಮ್", "ಪಂಚರಾತ್ರಾರಂಭಃ", "ಗರುಡಪಂಚಮೀ"], ["Upangalalita Vrata", "Garuda Panchami"], {}),
    (16, "ಆ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಪುಸ್ತಕೇಷು ಸರಸ್ವತ್ಯಾವಾಹನಮ್"], ["Saraswati Avahanam"], {}),
    (17, "ಆ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಮೂಲಾ", "Mula", ["ಸರಸ್ವತೀಪೂಜನ", "ತ್ರಿರಾತ್ರಾರಂಭಃ", "ಶ್ರೀರಾಮಕೃಷ್ಣ ಸ್ವಾಮಿಗಳ ಆರಾಧನೆ"], ["Saraswati Puja", "Triratrarambha"], {}),
    (18, "ಆ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಪೂ.ಷಾ", "Purvashadha", ["ದುರ್ಗಾಷ್ಟಮಿ", "ದುರ್ಗಾಪೂಜಾ", "ಪತ್ರಿಕಾಪೂಜನಮ್", "ಸರಸ್ವತೀ ಬಲಿದಾನಮ್"], ["Durgashtami", "Durga Puja", "Patrika Puja"], {}),
    (19, "ಆ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಉ.ಷಾ", "Uttarashadha", ["ಮಹಾನವಮಿ / ಆಯುಧಪೂಜಾ", "ಸರಸ್ವತೀ ವಿಸರ್ಜನ", "ಶಸ್ತ್ರಪೂಜಾ", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (14-05 ರ ನಂತರ)"], ["Mahanavami / Ayudha Puja", "Saraswati Visarjana", "Shastra Puja", "Amritasiddhi Yoga"], {"holiday": "ಆಯುಧಪೂಜೆ / ಮಹಾನವಮಿ", "holiday_en": "Ayudha Puja / Mahanavami"}),
    (20, "ಆ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಶ್ರವಣ", "Shravana", ["ವಿಜಯದಶಮಿ", "ಶಮೀಪೂಜಾ", "ಸೀಮೋಲ್ಲಂಘನಮ್", "ಶ್ರೀಲಕ್ಷ್ಮೀವೆಂಕಟೇಶ ರಥೋತ್ಸವ (ಕುಕನೂರು)"], ["Vijayadashami", "Shami Puja", "Simollanghanam"], {}),
    (21, "ಆ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಧನಿಷ್ಠಾ", "Dhanishtha", ["ವಿಜಯದಶಮಿ ಸರಕಾರಿ ರಜೆ"], ["Vijayadashami Govt Holiday"], {"holiday": "ವಿಜಯದಶಮಿ", "holiday_en": "Vijayadashami"}),
    (22, "ಆ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಶತತಾರಾ", "Shatatara", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಪಾಶಾಂಕುಶಾ)"], ["Sarvesham Ekadashi (Pashankusha)"], {"ekadashi": "ಪಾಶಾಂಕುಶಾ", "ekadashi_en": "Pashankusha"}),
    (23, "ಆ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಪೂ.ಭಾ", "Purvabhadra", ["ಪಕ್ಷಪ್ರದೋಷ", "ಶ್ರೀಪದ್ಮನಾಭತೀರ್ಥಾರಾಧನ", "ಶ್ರೀಖೇಡಾಲಾಮುಂಜಿ ರಥೋತ್ಸವ"], ["Paksha Pradosha", "Sri Padmanabhatirtharadhana"], {}),
    (24, "ಆ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಉ.ಭಾ", "Uttarabhadra", [], [], {}),
    (25, "ಆ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ರೇವತೀ", "Revati", ["ಕೋಜಾಗರೀ ವ್ರತಮ್", "ನಿಶೀಥೆ ಲಕ್ಷ್ಮೀಂದ್ರಯೋರ್ಪೂಜಾ"], ["Kojagari Vrata", "Lakshmindra Puja"], {}),
    (26, "ಆ.ಶು.ಪೌರ್ಣಿಮೆ (ಶೀಗಿ)", "Purnima", 15, 15, "Shukla", "ಅಶ್ವಿನಿ", "Ashwini", ["ಶೀಗಿ ಹುಣ್ಣಿಮೆ", "ಕಾರ್ತಿಕ ಸ್ನಾನಾರಂಭ"], ["Seegi Hunnime", "Kartika Snanarambha"], {"hunnime": "ಶೀಗಿ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Seegi Hunnime"}),
    (27, "ಆ.ಕೃ.ಪ್ರತಿಪದೆ / ದ್ವಿತೀಯಾ", "Prathama", 16, 1, "Krishna", "ಭರಣೀ", "Bharani", ["ಸದ್ಗುರು ಶ್ರೀಭೀಮಾಶಂಕರಸ್ವಾಮಿಗಳ ಆರಾಧನಾ (ಜಂಡೇಪೂಜಾ ಸಿಂಧಗಿ)"], ["Sri Bhimashankaraswamigal Aradhana"], {}),
    (28, "ಆ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಕೃತ್ತಿಕಾ", "Krittika", ["ಶ್ರೀ ಪಂಚಾಕ್ಷರಾಯ ಪುಣ್ಯತಿಥಿ (ಬಾಳಿಕುಂದ್ರಿ)"], ["Sri Panchaksharayya Punyatithi"], {}),
    (29, "ಆ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ರೋಹಿಣಿ", "Rohini", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 08-52 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ", "ಶ್ರೀಶಾಂತಾನಂದ ಸರಸ್ವತಿ ಸ್ವಾಮಿನಾಮಾರಾಧನಮ್"], ["Sankashtahara Chaturthi (Moonrise 08:52 PM Hebballi)"], {"sankashti": {"moonrise": "08:52 PM", "isAngaraki": False}}),
    (30, "ಆ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಮೃಗಶಿರಾ", "Mrigashira", ["ಶ್ರೀಕಾಡೀ ಮಹಾರಾಜ ಪುಣ್ಯತಿಥಿ (ಬೆಳಗಾವಿ)"], ["Sri Kadi Maharaja Punyatithi"], {}),
    (31, "ಆ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಆರ್ದ್ರಾ", "Ardra", [], [], {})
]

# 11. NOVEMBER (30 days)
nov = [
    (1, "ಆ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", ["ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ"], ["Karnataka Rajyotsava"], {"holiday": "ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ", "holiday_en": "Karnataka Rajyotsava"}),
    (2, "ಆ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಪುಷ್ಯ", "Pushya", ["ರಾಧಾಜಯಂತಿ", "ಕಾಲಾಷ್ಟಮಿ"], ["Radhashtami", "Kalashtami"], {}),
    (3, "ಆ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ತಿಥಿದ್ವಯಮ್ (ನವಮೀ-ದಶಮೀ ಶ್ರಾದ್ಧಮ್)"], ["Tithidvayam (Navami / Dashami Shraddham)"], {}),
    (4, "ಆ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಮಘಾ / ಪೂರ್ವಾ", "Magha / Purva Phalguni", ["ಶ್ರೀತುಕಾರಾಮ ಮಹಾರಾಜರ ಪುಣ್ಯತಿಥಿ"], ["Sri Tukaram Maharaj Punyatithi"], {}),
    (5, "ಆ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಉತ್ತರಾ", "Uttara Phalguni", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ರಮಾ)", "ಗೋವತ್ಸದ್ವಾದಶೀ"], ["Sarvesham Ekadashi (Rama)", "Govatsadwadashi"], {"ekadashi": "ರಮಾ", "ekadashi_en": "Rama"}),
    (6, "ಆ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಹಸ್ತಾ", "Hasta", ["ಗುರುದ್ವಾದಶಿ (ಕುರಂಗಡ್ಡಿ)", "ಯಮದೀಪದಾನಮ್", "ಧನ್ವಂತರಿ ಜಯಂತಿ"], ["Gurudvadashi", "Yamadipadanam", "Dhanvantari Jayanti"], {}),
    (7, "ಆ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಚಿತ್ರಾ", "Chitra", ["ಧನ್ವಂತರಿ ಜಯಂತಿ / ನೀರು ತುಂಬುವ ಹಬ್ಬ", "ಮಾಸಶಿವರಾತ್ರಿ", "ನರಕಚತುರ್ದಶೀ ಆರಂಭ"], ["Dhanvantari Jayanti / Neeru Tumbuwa Habba", "Masashivaratri"], {}),
    (8, "ಆ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ಸ್ವಾತಿ", "Swati", ["ನರಕ ಚತುರ್ದಶಿ", "ಅಭ್ಯಂಗಸ್ನಾನ", "ಯಮತರ್ಪಣಮ್", "ಲಕ್ಷ್ಮೀಪೂಜನಮ್"], ["Naraka Chaturdashi", "Abhyanga Snana", "Yamatarpana", "Lakshmi Puja"], {}),
    (9, "ಆ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ದೀಪಾವಳಿ)", "Amavasya", 30, 15, "Krishna", "ಸ್ವಾತಿ", "Swati", ["ದೀಪಾವಳಿ ಅಮಾವಾಸ್ಯೆ", "ಶ್ರೀ ಆಯೀಸಾಹೇಬರ ಪುಣ್ಯತಿಥಿ ಉತ್ಸವ", "ಸೋಮವತೀ ಅಮಾವಾಸ್ಯೆ", "ಶ್ರೀಲಕ್ಷ್ಮೀ ಕುಬೇರಪೂಜನ"], ["Deepavali Amavasya", "Sri Ayee Saheb Punyatithi", "Somavati Amavasya", "Sri Lakshmi Kubera Puja"], {"amavasya": "ದೀಪಾವಳಿ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Deepavali Amavasya"}),
    (10, "ಕಾ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ವಿಶಾಖಾ", "Vishakha", ["ಬಲಿಪಾಡ್ಯ", "ಭಾವಬಿದಿಗೆ", "ಯಮದ್ವಿತೀಯಾ (ತರ್ಪಣಂ)"], ["Bali Padyami", "Bhavabidige", "Yama Dvitiya"], {"holiday": "ಬಲಿಪಾಡ್ಯ", "holiday_en": "Bali Padyami"}),
    (11, "ಕಾ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಅನುರಾಧಾ", "Anuradha", ["ಅಮೃತಸಿದ್ಧಿಯೋಗ (11-20 ರ ವರೆಗೆ)", "ಭಗಿನೀ ತೃತೀಯಾ"], ["Amritasiddhi Yoga", "Bhagini Tritiya"], {}),
    (12, "ಕಾ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", [], [], {}),
    (13, "ಕಾ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಮೂಲಾ", "Mula", ["ವಿನಾಯಕ ಚತುರ್ಥಿ"], ["Vinayaka Chaturthi"], {}),
    (14, "ಕಾ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಪೂ.ಷಾ", "Purvashadha", ["ಪಾಂಡವಪಂಚಮೀ"], ["Pandava Panchami"], {}),
    (15, "ಕಾ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಉ.ಷಾ", "Uttarashadha", [], [], {}),
    (16, "ಕಾ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಶ್ರವಣ", "Shravana", ["ಅಮೃತಸಿದ್ಧಿಯೋಗ (23-29 ರವರೆಗೆ)"], ["Amritasiddhi Yoga"], {}),
    (17, "ಕಾ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಧನಿಷ್ಠಾ", "Dhanishtha", ["ಗೋಪಾಷ್ಟಮೀ", "ಗೋಪೂಜಾ"], ["Gopashtami", "Gopuja"], {}),
    (18, "ಕಾ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಶತತಾರಾ", "Shatatara", ["ಕೂಷ್ಮಾಂಡನವಮಿ"], ["Kushmanda Navami"], {}),
    (19, "ಕಾ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಪೂ.ಭಾ", "Purvabhadra", [], [], {}),
    (20, "ಕಾ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ಉ.ಭಾ", "Uttarabhadra", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಪ್ರಬೋಧಿನೀ)", "ಪಂಡರಪುರಯಾತ್ರಾ", "ಭೀಷ್ಮಪಂಚಕ ವ್ರತಾರಂಭ", "ಗಿರಿಜಾಕಲ್ಯಾಣೋತ್ಸವ (ಕಲಸ)"], ["Sarvesham Ekadashi (Prabodhini)", "Bhishma Panchaka Begins"], {"ekadashi": "ಪ್ರಬೋಧಿನೀ", "ekadashi_en": "Prabodhini"}),
    (21, "ಕಾ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ರೇವತೀ", "Revati", ["ತುಳಸೀ ವಿವಾಹ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಪ್ರಬೋಧನೋತ್ಸವ"], ["Tulasi Vivaha (Hebballi)", "Prabodhanotsava"], {}),
    (22, "ಕಾ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಅಶ್ವಿನಿ", "Ashwini", ["ಪಕ್ಷಪ್ರದೋಷ", "ಶ್ರೀಲಕ್ಷ್ಮೀಂದ್ರಸ್ವಾಮಿನಾಮಾರಾಧನಮ್ (ಹುಬ್ಬಳ್ಳಿ)", "ವೈಕುಂಠ ಚತುರ್ದಶಿ ಉಪವಾಸ", "ಧಾತ್ರಿಮೂಲೆ-ವಿಷ್ಣು ಪೂಜಾ"], ["Paksha Pradosha", "Vaikuntha Chaturdashi Upavasa"], {}),
    (23, "ಕಾ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಭರಣೀ", "Bharani", [], [], {}),
    (24, "ಕಾ.ಶು.ಪೌರ್ಣಿಮೆ (ಗೌರಿ)", "Purnima", 15, 15, "Shukla", "ಕೃತ್ತಿಕಾ", "Krittika", ["ಗೌರಿ ಹುಣ್ಣಿಮೆ", "ಚಾತುರ್ಮಾಸ್ಯವ್ರತ ಕಾರ್ತಿಕ ಸ್ನಾನ ಸಮಾಪ್ತಿ", "ಭೀಷ್ಮಪಂಚಕ ವ್ರತ ಸಮಾಪ್ತಿ", "ಕಾರ್ತಿಕೇಯ ಸ್ವಾಮಿ ದರ್ಶನಮ್"], ["Gauri Hunnime", "Kartika Snana Samapti", "Bhishma Panchaka Samapti"], {"hunnime": "ಗೌರಿ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Gauri Hunnime"}),
    (25, "ಕಾ.ಕೃ.ಪ್ರತಿಪದೆ", "Prathama", 16, 1, "Krishna", "ರೋಹಿಣಿ", "Rohini", ["ಇಷ್ಟಿ", "ಶ್ರೀ ಯೋಗೀಂದ್ರಸನ್ಯಾಸಿಭಾರತೀ ಸ್ವಾಮಿನಾಮಾರಾಧನಮ್ (ಬೆಂಗಳೂರು)"], ["Ishti", "Sri Yogindrasanyasibharati Swamigal Aradhana"], {}),
    (26, "ಕಾ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಮೃಗಶಿರಾ", "Mrigashira", [], [], {}),
    (27, "ಕಾ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಆರ್ದ್ರಾ", "Ardra", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 08-50 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ", "ಕನಕದಾಸ ಜಯಂತಿ", "ತಿಥಿದ್ವಯಮ್ (ತೃತೀಯಾ-ಚತುರ್ಥಿ ಶ್ರಾದ್ಧಮ್)"], ["Sankashtahara Chaturthi (Moonrise 08:50 PM Hebballi)", "Kanakadasa Jayanti", "Tithidvayam"], {"sankashti": {"moonrise": "08:50 PM", "isAngaraki": False}, "holiday": "ಕನಕದಾಸ ಜಯಂತಿ", "holiday_en": "Kanakadasa Jayanti"}),
    (28, "ಕಾ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", [], [], {}),
    (29, "ಕಾ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಪುಷ್ಯ", "Pushya", ["ಶಿವಾನಂದತೀರ್ಥ ಸ್ವಾಮಿನಾಮಾರಾಧನಂ (ಹರಿಹರ-ಕಾರವಾರ)"], ["Sri Shivanandatirtha Swaminam Aradhana"], {}),
    (30, "ಕಾ.ಕೃ.ಷಷ್ಠಿ / ಸಪ್ತಮಿ", "Shashthi", 21, 6, "Krishna", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಶ್ರೀ ಚಿದಂಬರ ಮಹಾಸ್ವಾಮಿ ಜಯಂತಿ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ತೊಟ್ಟಿಲೋತ್ಸವ"], ["Sri Chidambara Mahaswami Jayanti (Hebballi)", "Tottilotsava"], {})
]

# 12. DECEMBER (31 days)
dec = [
    (1, "ಕಾ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಮಘಾ", "Magha", ["ಕಾಲಾಷ್ಟಮಿ", "ಶ್ರೀಕಾಲಭೈರವ ಜಯಂತಿ"], ["Kalashtami", "Sri Kalabhairava Jayanti"], {}),
    (2, "ಕಾ.ಕೃ.ನವಮಿ", "Navami", 24, 9, "Krishna", "ಪೂರ್ವಾ", "Purva Phalguni", [], [], {}),
    (3, "ಕಾ.ಕೃ.ದಶಮಿ", "Dashami", 25, 10, "Krishna", "ಉತ್ತರಾ", "Uttara Phalguni", [], [], {}),
    (4, "ಕಾ.ಕೃ.ಏಕಾದಶಿ", "Ekadashi", 26, 11, "Krishna", "ಹಸ್ತಾ", "Hasta", ["ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಉತ್ಪತ್ತಿ)"], ["Sarvesham Ekadashi (Utpatti)"], {"ekadashi": "ಉತ್ಪತ್ತಿ", "ekadashi_en": "Utpatti"}),
    (5, "ಕಾ.ಕೃ.ದ್ವಾದಶಿ", "Dvadashi", 27, 12, "Krishna", "ಚಿತ್ರಾ", "Chitra", [], [], {}),
    (6, "ಕಾ.ಕೃ.ತ್ರಯೋದಶಿ", "Trayodashi", 28, 13, "Krishna", "ಸ್ವಾತಿ", "Swati", ["ಸಂತಶ್ರೇಷ್ಠ ಶ್ರೀಜ್ಞಾನೇಶ್ವರ ಮಹಾರಾಜರ ಪುಣ್ಯತಿಥಿ (ಆಳಂದಿ)", "ಪಕ್ಷಪ್ರದೋಷ"], ["Santa Dnyaneshwar Maharaj Punyatithi (Alandi)", "Paksha Pradosha"], {}),
    (7, "ಕಾ.ಕೃ.ಚತುರ್ದಶಿ", "Chaturdashi", 29, 14, "Krishna", "ವಿಶಾಖಾ", "Vishakha", ["ಮಾಸಶಿವರಾತ್ರಿ", "ಶ್ರೀಮದ್ಯೋಗೀಂದ್ರ ಯೋಗಿರಾಜ ಮಹಾರಾಜ ಪುಣ್ಯತಿಥಿ"], ["Masashivaratri", "Sri Yogindra Yogi Raja Maharaj Punyatithi"], {}),
    (8, "ಕಾ.ಕೃ.ಅಮಾವಾಸ್ಯೆ (ಭಟ್ಟೀ)", "Amavasya", 30, 15, "Krishna", "ಅನುರಾಧಾ", "Anuradha", ["ಭಟ್ಟೀ ಅಮಾವಾಸ್ಯೆ", "ದರ್ಶ", "ಇಷ್ಟಿ"], ["Bhatti Amavasya", "Darsha", "Ishti"], {"amavasya": "ಭಟ್ಟೀ ಅಮಾವಾಸ್ಯೆ", "amavasya_en": "Bhatti Amavasya"}),
    (9, "ಮಾರ್ಗ.ಶು.ಪ್ರತಿಪದೆ", "Prathama", 1, 1, "Shukla", "ಜ್ಯೇಷ್ಠಾ", "Jyeshtha", ["ಮೈಲಾರ ನವರಾತ್ರಾರಂಭಃ", "ಚಂಪಾಷಷ್ಠಿ ವ್ರತಾರಂಭ"], ["Mailara Navaratrarambha", "Champashashthi Vratarambha"], {}),
    (10, "ಮಾರ್ಗ.ಶು.ದ್ವಿತೀಯಾ", "Dvitiya", 2, 2, "Shukla", "ಮೂಲಾ", "Mula", ["ಶ್ರೀಭಾಲಚಂದ್ರಶಾಸ್ತ್ರಿಗಳ ಪುಣ್ಯತಿಥಿ (ಧಾರವಾಡ)"], ["Sri Bhalachandrashastrigala Punyatithi"], {}),
    (11, "ಮಾರ್ಗ.ಶು.ತೃತೀಯಾ", "Tritiya", 3, 3, "Shukla", "ಪೂ.ಷಾ", "Purvashadha", [], [], {}),
    (12, "ಮಾರ್ಗ.ಶು.ಚತುರ್ಥಿ", "Chaturthi", 4, 4, "Shukla", "ಉ.ಷಾ", "Uttarashadha", ["ವಿನಾಯಕ ಚತುರ್ಥಿ"], ["Vinayaka Chaturthi"], {}),
    (13, "ಮಾರ್ಗ.ಶು.ಪಂಚಮಿ", "Panchami", 5, 5, "Shukla", "ಶ್ರವಣ", "Shravana", [], [], {}),
    (14, "ಮಾರ್ಗ.ಶು.ಷಷ್ಠಿ", "Shashthi", 6, 6, "Shukla", "ಶ್ರವಣ", "Shravana", ["ಚಂಪಾಷಷ್ಠಿ / ಸ್ಕಂದಷಷ್ಠಿ", "ಮೈಲಾರ ನವರಾತ್ರಿ ಸಮಾಪ್ತಿ", "ಅಮೃತಸಿದ್ಧಿಯೋಗ (06-54 ರ ವರೆಗೆ)", "ಶ್ರೀ ಚಿದಂಬರ ರಥೋತ್ಸವ (ಮುರಗೋಡ)", "ಕುಕ್ಕೆಸುಬ್ರಹ್ಮಣ್ಯ ಲಕ್ಷಣಿದ್ರೋಪೋತ್ಸವ"], ["Champa Shashthi / Skanda Shashthi", "Mailara Navaratri Samapti", "Amritasiddhi Yoga", "Sri Chidambara Rathotsava", "Kukke Subramanya Lakshadipotsava"], {}),
    (15, "ಮಾರ್ಗ.ಶು.ಸಪ್ತಮಿ", "Saptami", 7, 7, "Shukla", "ಧನಿಷ್ಠಾ", "Dhanishtha", ["ಸೂರ್ಯವ್ರತಂ"], ["Surya Vratam"], {}),
    (16, "ಮಾರ್ಗ.ಶು.ಅಷ್ಟಮಿ", "Ashtami", 8, 8, "Shukla", "ಶತತಾರಾ", "Shatatara", [], [], {}),
    (17, "ಮಾರ್ಗ.ಶು.ನವಮಿ", "Navami", 9, 9, "Shukla", "ಪೂ.ಭಾ", "Purvabhadra", [], [], {}),
    (18, "ಮಾರ್ಗ.ಶು.ದಶಮಿ", "Dashami", 10, 10, "Shukla", "ಉ.ಭಾ", "Uttarabhadra", ["ಅಮೃತಸಿದ್ಧಿಯೋಗ (11-35 ರ ನಂತರ)"], ["Amritasiddhi Yoga"], {}),
    (19, "ಮಾರ್ಗ.ಶು.ಏಕಾದಶಿ", "Ekadashi", 11, 11, "Shukla", "ರೇವತೀ", "Revati", [], [], {}),
    (20, "ಮಾರ್ಗ.ಶು.ದ್ವಾದಶಿ", "Dvadashi", 12, 12, "Shukla", "ಅಶ್ವಿನಿ", "Ashwini", ["ಗೀತಾ ಜಯಂತಿ", "ಸರ್ವೇಷಾಂ ಏಕಾದಶಿ (ಮೋಕ್ಷದಾ)", "ಶ್ರೀ ಮಾಣಿಕಪ್ರಭು ಜಯಂತಿ (ಹುಮನಾಬಾದ)"], ["Gita Jayanti", "Sarvesham Ekadashi (Mokshada)", "Sri Manikaprabhu Jayanti"], {"ekadashi": "ಮೋಕ್ಷದಾ", "ekadashi_en": "Mokshada"}),
    (21, "ಮಾರ್ಗ.ಶು.ತ್ರಯೋದಶಿ", "Trayodashi", 13, 13, "Shukla", "ಭರಣೀ", "Bharani", ["ಮುಕುಟ ದ್ವಾದಶಿ", "ತಿಥಿದ್ವಯಮ್ (ದ್ವಾದಶಿ-ತ್ರಯೋದಶಿ ಶ್ರಾದ್ಧಮ್)", "ಸೋಮಪ್ರದೋಷ"], ["Mukuta Dvadashi", "Tithidvayam", "Soma Pradosha"], {}),
    (22, "ಮಾರ್ಗ.ಶು.ಚತುರ್ದಶಿ", "Chaturdashi", 14, 14, "Shukla", "ಕೃತ್ತಿಕಾ", "Krittika", ["ಶ್ರೀಹನುಮದ್ ವ್ರತಮ್ (ಶ್ರೀಕ್ಷೇತ್ರ ಬೆಲಗೂರು-ಹೊಸಕತ್ತಿ)"], ["Sri Hanumad Vratam"], {}),
    (23, "ಮಾರ್ಗ.ಶು.ಪೌರ್ಣಿಮೆ (ಹೊಸ್ತಿಲ)", "Purnima", 15, 15, "Shukla", "ರೋಹಿಣಿ / ಮೃಗಶಿರಾ", "Rohini / Mrigashira", ["ಶ್ರೀದತ್ತ ಜಯಂತಿ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಶ್ರೀದತ್ತಾತ್ರೇಯ ಜಯಂತಿ ತೊಟ್ಟಿಲೋತ್ಸವ"], ["Sri Datta Jayanti (Hebballi)", "Tottilotsava"], {}),
    (24, "ಮಾರ್ಗ.ಶು.ಪೌರ್ಣಿಮೆ / ಮಾರ್ಗ.ಕೃ.ಪ್ರತಿಪದೆ", "Purnima", 15, 15, "Shukla", "ಆರ್ದ್ರಾ", "Ardra", ["ಹೊಸ್ತಿಲ ಹುಣ್ಣಿಮೆ", "ಸದ್ಗುರು ಶ್ರೀಬ್ರಹ್ಮಚೈತನ್ಯ ಮಹಾರಾಜರ 113 ನೇ ಪುಣ್ಯತಿಥಿ ಉತ್ಸವಾರಂಭ (ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ)", "ಶ್ರೀ ಅಚ್ಯುತೇಶ್ವರ ರಥೋತ್ಸವ (ಅಣ್ಣಿಗೇರಿ)"], ["Hostila Hunnime", "Sadguru Sri Brahmachaitanya Maharaj 113th Punyatithi Utsavarambha (Hebballi)"], {"hunnime": "ಹೊಸ್ತಿಲ ಹುಣ್ಣಿಮೆ", "hunnime_en": "Hostila Hunnime (Datta Jayanti)"}),
    (25, "ಮಾರ್ಗ.ಕೃ.ದ್ವಿತೀಯಾ", "Dvitiya", 17, 2, "Krishna", "ಪುನರ್ವಸು", "Punarvasu", ["ಕ್ರಿಸ್‌ಮಸ್", "ಶ್ರೀವಿರೂಪಾಕ್ಷೇಶ್ವರ ಫಲಪೂಜೋತ್ಸವ (ಹಂಪಿ)"], ["Christmas", "Sri Virupaksheshwara Phalapujotsava (Hampi)"], {"holiday": "ಕ್ರಿಸ್‌ಮಸ್", "holiday_en": "Christmas"}),
    (26, "ಮಾರ್ಗ.ಕೃ.ತೃತೀಯಾ", "Tritiya", 18, 3, "Krishna", "ಪುಷ್ಯ", "Pushya", [], [], {}),
    (27, "ಮಾರ್ಗ.ಕೃ.ಚತುರ್ಥಿ", "Chaturthi", 19, 4, "Krishna", "ಆಶ್ಲೇಷಾ", "Ashlesha", ["ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ಚಂ.ಉ.ರಾ 09-43 ಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಹೆಬ್ಬಳ್ಳಿ"], ["Sankashtahara Chaturthi (Moonrise 09:43 PM Hebballi)"], {"sankashti": {"moonrise": "09:43 PM", "isAngaraki": False}}),
    (28, "ಮಾರ್ಗ.ಕೃ.ಪಂಚಮಿ", "Panchami", 20, 5, "Krishna", "ಮಘಾ", "Magha", [], [], {}),
    (29, "ಮಾರ್ಗ.ಕೃ.ಷಷ್ಠಿ", "Shashthi", 21, 6, "Krishna", "ಪೂರ್ವಾ", "Purva Phalguni", [], [], {}),
    (30, "ಮಾರ್ಗ.ಕೃ.ಸಪ್ತಮಿ", "Saptami", 22, 7, "Krishna", "ಉತ್ತರಾ", "Uttara Phalguni", ["ಕಾಲಾಷ್ಟಮಿ"], ["Kalashtami"], {}),
    (31, "ಮಾರ್ಗ.ಕೃ.ಅಷ್ಟಮಿ", "Ashtami", 23, 8, "Krishna", "ಹಸ್ತಾ", "Hasta", ["ಭೂಮೌ ವಹ್ನಿಃ"], ["Bhaumau Vahnih"], {})
]

months = [
    (1, "January", jan),
    (2, "February", feb),
    (3, "March", mar),
    (4, "April", apr),
    (5, "May", may),
    (6, "June", jun),
    (7, "July", jul),
    (8, "August", aug),
    (9, "September", sep),
    (10, "October", octo),
    (11, "November", nov),
    (12, "December", dec)
]

def get_masa(m, d):
    # Returns (kannada, english, isAdhika)
    if m == 1:
        return ("ಪೌಷ", "Pausha", False) if d <= 18 else ("ಮಾಘ", "Magha", False)
    elif m == 2:
        return ("ಮಾಘ", "Magha", False) if d <= 17 else ("ಫಾಲ್ಗುಣ", "Phalguna", False)
    elif m == 3:
        return ("ಫಾಲ್ಗುಣ", "Phalguna", False) if d <= 18 else ("ಚೈತ್ರ", "Chaitra", False)
    elif m == 4:
        return ("ಚೈತ್ರ", "Chaitra", False) if d <= 17 else ("ವೈಶಾಖ", "Vaishakha", False)
    elif m == 5:
        return ("ವೈಶಾಖ", "Vaishakha", False) if d <= 16 else ("ಅಧಿಕ ಜ್ಯೇಷ್ಠ", "Adhika Jyeshtha", True)
    elif m == 6:
        return ("ಅಧಿಕ ಜ್ಯೇಷ್ಠ", "Adhika Jyeshtha", True) if d <= 15 else ("ನಿಜ ಜ್ಯೇಷ್ಠ", "Nija Jyeshtha", False)
    elif m == 7:
        return ("ನಿಜ ಜ್ಯೇಷ್ಠ", "Nija Jyeshtha", False) if d <= 14 else ("ಆಷಾಢ", "Ashadha", False)
    elif m == 8:
        return ("ಆಷಾಢ", "Ashadha", False) if d <= 12 else ("ಶ್ರಾವಣ", "Shravana", False)
    elif m == 9:
        return ("ಶ್ರಾವಣ", "Shravana", False) if d <= 11 else ("ಭಾದ್ರಪದ", "Bhadrapada", False)
    elif m == 10:
        return ("ಭಾದ್ರಪದ", "Bhadrapada", False) if d <= 10 else ("ಆಶ್ವಿನ", "Ashvina", False)
    elif m == 11:
        return ("ಆಶ್ವಿನ", "Ashvina", False) if d <= 9 else ("ಕಾರ್ತಿಕ", "Kartika", False)
    elif m == 12:
        return ("ಕಾರ್ತಿಕ", "Kartika", False) if d <= 8 else ("ಮಾರ್ಗಶೀರ್ಷ", "Margashirsha", False)

def get_samvatsara(m, d):
    # March 19 starts Parabhava
    if m < 3 or (m == 3 and d < 19):
        return {"kannada": "ವಿಶ್ವಾವಸು", "english": "Vishvavasu", "shaka": 1947, "number": 39}
    else:
        return {"kannada": "ಪರಾಭವ", "english": "Parabhava", "shaka": 1948, "number": 40}

def get_ayana(m, d):
    # Jan 15 to Jul 16: Uttarayana; Jul 17 onwards: Dakshinayana
    if (m == 1 and d < 15):
        return {"kannada": "ದಕ್ಷಿಣಾಯನ", "english": "Dakshinayana"}
    elif (m < 7) or (m == 7 and d <= 16):
        return {"kannada": "ಉತ್ತರಾಯಣ", "english": "Uttarayana"}
    else:
        return {"kannada": "ದಕ್ಷಿಣಾಯನ", "english": "Dakshinayana"}

def get_ritu(m, d):
    if (m == 1 and d <= 18):
        return {"kannada": "ಹೇಮಂತ", "english": "Hemanta"}
    elif (m == 1 and d > 18) or (m == 2) or (m == 3 and d <= 18):
        return {"kannada": "ಶಿಶಿರ", "english": "Shishira"}
    elif (m == 3 and d >= 19) or (m == 4) or (m == 5 and d <= 16):
        return {"kannada": "ವಸಂತ", "english": "Vasanta"}
    elif (m == 5 and d >= 17) or (m == 6) or (m == 7 and d <= 16):
        return {"kannada": "ಗ್ರೀಷ್ಮ", "english": "Grishma"}
    elif (m == 7 and d >= 17) or (m == 8) or (m == 9 and d <= 26):
        return {"kannada": "ವರ್ಷ", "english": "Varsha"}
    elif (m == 9 and d >= 27) or (m == 10) or (m == 11 and d <= 24):
        return {"kannada": "ಶರದ", "english": "Sharad"}
    else:
        return {"kannada": "ಹೇಮಂತ", "english": "Hemanta"}

import datetime
dow_names = [
    ("Monday", "ಸೋಮವಾರ", "ಸೋಮ", "ಇಂದುವಾಸರಃ"),
    ("Tuesday", "ಮಂಗಳವಾರ", "ಮಂಗಳ", "ಭೌಮವಾಸರಃ"),
    ("Wednesday", "ಬುಧವಾರ", "ಬುಧ", "ಸೌಮ್ಯವಾಸರಃ"),
    ("Thursday", "ಗುರುವಾರ", "ಗುರು", "ಬೃಹಸ್ಪತಿವಾಸರಃ"),
    ("Friday", "ಶುಕ್ರವಾರ", "ಶುಕ್ರ", "ಭಾರ್ಗವವಾಸರಃ"),
    ("Saturday", "ಶನಿವಾರ", "ಶನಿ", "ಮಂದವಾಸರಃ"),
    ("Sunday", "ಭಾನುವಾರ", "ರವಿ", "ಭಾನುವಾಸರಃ")
]

for m_num, m_name, days_list in months:
    for item in days_list:
        d = item[0]
        t_str = item[1]
        t_name = item[2]
        t_idx = item[3]
        pk_idx = item[4]
        pk = item[5]
        n_kn = item[6]
        n_en = item[7]
        f_kn = item[8]
        f_en = item[9]
        sp = item[10]

        dt_str = f"2026-{m_num:02d}-{d:02d}"
        dt_obj = datetime.date(2026, m_num, d)
        dow_idx = dt_obj.weekday() # 0 = Monday
        dow_en, dow_kn, dow_short, dow_sk = dow_names[dow_idx]

        m_kn, m_en, is_adhika = get_masa(m_num, d)
        samv = get_samvatsara(m_num, d)
        ayn = get_ayana(m_num, d)
        rt = get_ritu(m_num, d)

        # Build clean festival list combining sp and f_kn
        all_f_kn = list(f_kn)
        all_f_en = list(f_en)

        days_data[dt_str] = {
            "date": dt_str,
            "dayOfMonth": d,
            "month": m_num,
            "year": 2026,
            "vara": {
                "english": dow_en,
                "kannada": dow_kn,
                "kannadaShort": dow_short,
                "sanskrit": dow_sk
            },
            "samvatsara": samv,
            "ayana": ayn,
            "ritu": rt,
            "masa": {
                "kannada": m_kn,
                "english": m_en,
                "isAdhika": is_adhika
            },
            "paksha": {
                "kannada": "ಶುಕ್ಲ" if pk == "Shukla" else "ಕೃಷ್ಣ",
                "english": pk
            },
            "tithi": {
                "name": t_name,
                "kannada": t_name,
                "fullKannada": t_str,
                "index": t_idx,
                "pakshaTithi": pk_idx,
                "isPurnima": (t_idx == 15),
                "isAmavasya": (t_idx == 30)
            },
            "nakshatra": {
                "kannada": n_kn,
                "english": n_en
            },
            "festivals": all_f_kn,
            "festivalsEn": all_f_en,
            "sankashtahara": sp.get("sankashti", None),
            "ekadashi": {"name": sp["ekadashi"], "englishName": sp["ekadashi_en"]} if "ekadashi" in sp else None,
            "hunnime": {"name": sp["hunnime"], "englishName": sp["hunnime_en"]} if "hunnime" in sp else None,
            "amavasya": {"name": sp["amavasya"], "englishName": sp["amavasya_en"]} if "amavasya" in sp else None,
            "isGovtHoliday": "holiday" in sp,
            "holidayName": sp.get("holiday", None),
            "holidayNameEn": sp.get("holiday_en", None)
        }

print(f"Total dates built: {len(days_data)}")
assert len(days_data) == 365, f"Expected 365 days, got {len(days_data)}"

# Save to resources/thoogu_panchanga_2026.json
out_json_path = "/Users/chaitanyaprasadkulkarni/Downloads/hucccha app 2/PurohitManager/resources/thoogu_panchanga_2026.json"
with open(out_json_path, "w", encoding="utf-8") as f:
    json.dump(days_data, f, ensure_ascii=False, indent=2)

print(f"Written JSON to: {out_json_path}")

# Write to shared/src/panchang/thooguPanchanga2026.js
out_js_path = "/Users/chaitanyaprasadkulkarni/Downloads/hucccha app 2/PurohitManager/shared/src/panchang/thooguPanchanga2026.js"
js_content = f"""/**
 * Shri Chaitanyashrama Thoogu Panchanga 2026 (Hebballi / Dharwad)
 * Official Ground-Truth Calendar Dataset for Year 2026
 * Contains all 365 days of 2026 with exact Tithi, Nakshatra, Masa, Paksha, Samvatsara,
 * Ayana, Ritu, Ekadashi, Sankashtahara Chaturthi (with moonrise), Hunnime, Amavasya,
 * Government Holidays, and Festival events.
 */

export const THOOGU_PANCHANGA_2026 = {json.dumps(days_data, ensure_ascii=False, indent=2)};

/**
 * Looks up the authoritative Thoogu Panchanga 2026 record for a given date
 * @param {{Date|string}} dateInput
 * @returns {{object|null}}
 */
export function getThooguPanchanga2026(dateInput) {{
  if (!dateInput) return null;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  
  // Format as YYYY-MM-DD
  const year = d.getFullYear();
  if (year !== 2026) return null;
  
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const key = `${{year}}-${{month}}-${{day}}`;
  
  return THOOGU_PANCHANGA_2026[key] || null;
}}
"""

with open(out_js_path, "w", encoding="utf-8") as f:
    f.write(js_content)

print(f"Written JS module to: {out_js_path}")
