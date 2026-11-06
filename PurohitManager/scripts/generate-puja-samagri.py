# -*- coding: utf-8 -*-
import json
import os

pujas = [
    {
        "id": "satyanarayana",
        "name": "Sri Satyanarayana Vrata Puja",
        "kannadaName": "ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ ವ್ರತ ಪೂಜೆ",
        "category": "ವ್ರತ / ಪೂಜೆ (Vrata / Puja)",
        "description": "ಸತ್ಯನಾರಾಯಣ ವ್ರತಕ್ಕೆ ಯಜಮಾನರು ಸಿದ್ಧಪಡಿಸಬೇಕಾದ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ",
        "items": [
            { "id": "sn_1", "item": "Turmeric powder", "kannada": "ಅರಿಶಿನ ಪುಡಿ", "qty": "100 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_2", "item": "Kumkuma (Vermilion)", "kannada": "ಕುಂಕುಮ", "qty": "100 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_3", "item": "Sandalwood paste / Chandana", "kannada": "ಗಂಧದ ಪುಡಿ / ಚಂದನ", "qty": "1 box", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_4", "item": "Betel leaves (Vilyada ele)", "kannada": "ವೀಳ್ಯದೆಲೆ", "qty": "50 leaves", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "sn_5", "item": "Betel nuts (Adike / Supari)", "kannada": "ಅಡಿಕೆ", "qty": "25 pieces", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "sn_6", "item": "Coconuts (Tenginakayi)", "kannada": "ತೆಂಗಿನಕಾಯಿ", "qty": "5 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "sn_7", "item": "Raw Rice (Akki)", "kannada": "ಅಕ್ಕಿ", "qty": "2 kg", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "sn_8", "item": "Flowers & Garlands", "kannada": "ಹೂವು ಮತ್ತು 2 ಹಾರಗಳು", "qty": "2 bunches + 2 garlands", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_9", "item": "Tulasi leaves", "kannada": "ತುಳಸಿ ದಳ", "qty": "1 bowl", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_10", "item": "Panchamrita (Milk, Curd, Ghee, Honey, Sugar)", "kannada": "ಪಂಚಾಮೃತ (ಹಾಲು, ಮೊಸರು, ತುಪ್ಪ, ಜೇನುತುಪ್ಪ, ಸಕ್ಕರೆ)", "qty": "1 small cup each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_11", "item": "Fruits (5 varieties including bananas)", "kannada": "ಪಂಚ ಫಲಗಳು (ಬಾಳೆಹಣ್ಣು ಇತ್ಯಾದಿ)", "qty": "1 basket", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "sn_12", "item": "Sapaada Naivedya / Sheera (Rava, Sugar, Ghee, Banana)", "kannada": "ಸಪಾದ ನೈವೇದ್ಯ (ರವೆ, ಸಕ್ಕರೆ, ತುಪ್ಪ, ಬಾಳೆಹಣ್ಣು ಶಿರಾ)", "qty": "ಯಥಾಶಕ್ತಿ", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_13", "item": "Dry fruits (Cashews, Almonds, Raisins, Cardamom)", "kannada": "ಗೋಡಂಬಿ, ದ್ರಾಕ್ಷಿ, ಬಾದಾಮಿ, ಏಲಕ್ಕಿ", "qty": "50 g each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": False },
            { "id": "sn_14", "item": "Camphor (Karpura) & Incense (Agarbatti)", "kannada": "ಕರ್ಪೂರ ಮತ್ತು ಊದಿನಕಡ್ಡಿ", "qty": "1 packet each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_15", "item": "Oil lamps, cotton wicks, oil/ghee", "kannada": "ದೀಪಗಳು, ಬತ್ತಿ, ಎಣ್ಣೆ / ತುಪ್ಪ", "qty": "2 pairs", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sn_16", "item": "Blouse pieces / Vastra", "kannada": "ರವಿಕೆ ಬಟ್ಟೆ / ವಸ್ತ್ರ (ಕೆಂಪು / ಹಳದಿ)", "qty": "2 nos", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": False },
            { "id": "sn_17", "item": "Kalasha pot (Copper / Silver / Brass)", "kannada": "ಕಲಶ ಚೊಂಬು", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "sn_18", "item": "Coins for Dakshina", "kannada": "ದಕ್ಷಿಣೆಯ ನಾಣ್ಯಗಳು", "qty": "21 coins", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True }
        ]
    },
    {
        "id": "ganapati_homa",
        "name": "Maha Ganapati Homa",
        "kannadaName": "ಮಹಾಗಣಪತಿ ಹೋಮ",
        "category": "ಹೋಮ / ಹವನ (Homa / Havana)",
        "description": "ಸರ್ವ ವಿಘ್ನ ನಿವಾರಣೆಗಾಗಿ ಮಹಾಗಣಪತಿ ಹೋಮಕ್ಕೆ ಬೇಕಾಗುವ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "gh_1", "item": "Dry Coconut Halves (Kobbari)", "kannada": "ಕೊಬ್ಬರಿ ಚೂರುಗಳು", "qty": "1 kg (ತುಂಡು ಮಾಡಿದ್ದು)", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_2", "item": "Pure Cow Ghee (Homa Tuppa)", "kannada": "ಹೋಮದ ಹಸುವಿನ ತುಪ್ಪ", "qty": "1 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_3", "item": "Sugarcane pieces (Kabbu)", "kannada": "ಕಬ್ಬಿನ ತುಂಡುಗಳು", "qty": "1 ಕಟ್ಟು", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_4", "item": "Modaka / Ladu", "kannada": "ಮೋದಕ / ಲಾಡು", "qty": "21 nos", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_5", "item": "Havan Samagri herbs mixture", "kannada": "ಹವನ ಸಾಮಗ್ರಿ", "qty": "250 g", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_6", "item": "Samidha sticks", "kannada": "ಸಮಿತ್ತು (ಅಶ್ವತ್ಥ / ಪಲಾಶ / ಅರ್ಕ)", "qty": "2 bundles", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_7", "item": "Puffed rice (Aralu)", "kannada": "ಅರಳು", "qty": "250 g", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_8", "item": "Jaggery (Bella)", "kannada": "ಬೆಲ್ಲ", "qty": "250 g", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_9", "item": "White sesame (Bili Ellu)", "kannada": "ಬಿಳಿ ಎಳ್ಳು", "qty": "100 g", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_10", "item": "Durva grass (Garike)", "kannada": "ಗರಿಕೆ ಹುಲ್ಲು", "qty": "3 bundles", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_11", "item": "Red flowers (Hibiscus / Dasavala)", "kannada": "ಕೆಂಪು ದಾಸವಾಳ ಹೂವು", "qty": "21 flowers", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_12", "item": "Turmeric, Kumkuma, Sandalwood paste", "kannada": "ಅರಿಶಿನ, ಕುಂಕುಮ, ಗಂಧ", "qty": "50 g each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gh_13", "item": "Betel leaves & nuts", "kannada": "ವೀಳ್ಯದೆಲೆ, ಅಡಿಕೆ", "qty": "30 leaves, 15 nuts", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "gh_14", "item": "Coconuts", "kannada": "ತೆಂಗಿನಕಾಯಿ", "qty": "4 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "gh_15", "item": "Homa Kunda + sand + bricks", "kannada": "ಹೋಮ ಕುಂಡ, ಮರಳು ಮತ್ತು ಇಟ್ಟಿಗೆ", "qty": "1 set", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True }
        ]
    },
    {
        "id": "grihapravesha",
        "name": "Grihapravesha & Vastu Shanti",
        "kannadaName": "ಗೃಹಪ್ರವೇಶ ಮತ್ತು ವಾಸ್ತು ಶಾಂತಿ",
        "category": "ಸಂಸ್ಕಾರ (Samskara)",
        "description": "ನೂತನ ಗೃಹಪ್ರವೇಶ, ಗಣಪತಿ ಪೂಜೆ, ಪುಣ್ಯಾಹವಾಚನ, ವಾಸ್ತು ಹೋಮ, ನವಗ್ರಹ ಹೋಮ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "gp_1", "item": "Turmeric & Kumkuma", "kannada": "ಅರಿಶಿನ ಮತ್ತು ಕುಂಕುಮ", "qty": "250 g each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gp_2", "item": "Betel leaves & nuts", "kannada": "ವೀಳ್ಯದೆಲೆ ಮತ್ತು ಅಡಿಕೆ", "qty": "100 leaves, 50 nuts", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "gp_3", "item": "Coconuts", "kannada": "ತೆಂಗಿನಕಾಯಿ", "qty": "11 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "gp_4", "item": "Raw Rice (Akki)", "kannada": "ಅಕ್ಕಿ", "qty": "5 kg", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "gp_5", "item": "Navadhanya set", "kannada": "ನವಧಾನ್ಯ ಸೆಟ್", "qty": "1 packet (9 grains)", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "gp_6", "item": "Pure Cow Ghee", "kannada": "ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪ", "qty": "1.5 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gp_7", "item": "Homa Samidha bundles", "kannada": "ಸಮಿತ್ತು ಕಟ್ಟುಗಳು", "qty": "4 bundles", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gp_8", "item": "Dry Coconut Halves (Kobbari)", "kannada": "ಕೊಬ್ಬರಿ ಗಿಣ್ಣು", "qty": "1.5 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gp_9", "item": "Navagraha vastra (9 colored cloths)", "kannada": "ನವಗ್ರಹ ವಸ್ತ್ರಗಳು (೯ ಬಣ್ಣ)", "qty": "1 set", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "gp_10", "item": "Vastu Yantra / Pratima", "kannada": "ವಾಸ್ತು ಯಂತ್ರ / ಪ್ರತಿಮೆ", "qty": "1 no", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gp_11", "item": "Milk (for boiling milk ceremony)", "kannada": "ಹಸುವಿನ ಹಾಲು (ಹಾಲು ಉಕ್ಕಿಸಲು)", "qty": "1 liter", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gp_12", "item": "New milk vessel (silver/brass/steel)", "kannada": "ಹಾಲು ಉಕ್ಕಿಸುವ ಹೊಸ ಪಾತ್ರೆ", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "gp_13", "item": "Mango leaves (Mavina ele)", "kannada": "ಮಾವಿನ ಎಲೆಗಳು (ತೋರಣಕ್ಕೆ)", "qty": "2 bundles", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "gp_14", "item": "Flowers & Garlands", "kannada": "ಹೂವುಗಳು ಮತ್ತು ದ್ವಾರಕ್ಕೆ ಹಾರಗಳು", "qty": "3 bunches + 4 garlands", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "gp_15", "item": "Ash gourd (Budu kumbalakayi)", "kannada": "ಬೂದು ಕುಂಬಳಕಾಯಿ (ದೃಷ್ಟಿಗೆ)", "qty": "1 no", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "gp_16", "item": "Camphor, Incense, Dhoop", "kannada": "ಕರ್ಪೂರ, ಊದಿನಕಡ್ಡಿ, ದೂಪ", "qty": "1 box each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True }
        ]
    },
    {
        "id": "rudrabhisheka",
        "name": "Rudrabhisheka & Shiva Puja",
        "kannadaName": "ಶ್ರೀ ರುದ್ರಾಭಿಷೇಕ ಮತ್ತು ಶಿವಪೂಜೆ",
        "category": "ವ್ರತ / ಪೂಜೆ (Vrata / Puja)",
        "description": "ಮಹಾಲಿಂಗಾರ್ಚನೆ, ಏಕಾದಶ ರುದ್ರಾಭಿಷೇಕ, ಬಿಲ್ವಪತ್ರೆ ಅರ್ಚನೆಗೆ ಬೇಕಾಗುವ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "rb_1", "item": "Bilva leaves (Bilvapatre)", "kannada": "ಬಿಲ್ವಪತ್ರೆ", "qty": "108 leaves (3-leaf sprigs)", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_2", "item": "Cow Milk (Hasuvina Halu)", "kannada": "ಹಸುವಿನ ಹಾಲು", "qty": "1 liter", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_3", "item": "Cow Curd (Hasuvina Mosaru)", "kannada": "ಹಸುವಿನ ಮೊಸರು", "qty": "250 ml", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_4", "item": "Pure Cow Ghee (Tuppa)", "kannada": "ಹಸುವಿನ ಶುದ್ಧ ತುಪ್ಪ", "qty": "100 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_5", "item": "Pure Honey (Jenutuppa)", "kannada": "ಶುದ್ಧ ಜೇನುತುಪ್ಪ", "qty": "100 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_6", "item": "Sugar / Sugar cane juice", "kannada": "ಸಕ್ಕರೆ / ಕಬ್ಬಿನ ಹಾಲು", "qty": "100 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_7", "item": "Tender Coconut water (Elaneeru)", "kannada": "ಎಳನೀರು", "qty": "2 nos", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_8", "item": "Vibhuti (Bhasma)", "kannada": "ವಿಭೂತಿ (ಭಸ್ಮ)", "qty": "1 packet", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_9", "item": "White flowers / Dhatura", "kannada": "ಬಿಳಿ ಹೂವುಗಳು, ಧತ್ತೂರ", "qty": "1 bunch", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_10", "item": "Sandalwood paste (Chandana)", "kannada": "ಶ್ರೀಗಂಧ", "qty": "1 box", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "rb_11", "item": "Coconuts, Betel leaves, Betel nuts", "kannada": "ತೆಂಗಿನಕಾಯಿ 3, ವೀಳ್ಯದೆಲೆ 30, ಅಡಿಕೆ 15", "qty": "1 set", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "rb_12", "item": "Camphor and Deepa wicks", "kannada": "ಕರ್ಪೂರ ಮತ್ತು ದೀಪದ ಬತ್ತಿ", "qty": "1 packet each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True }
        ]
    },
    {
        "id": "navagraha_homa",
        "name": "Navagraha Homa & Shanti",
        "kannadaName": "ನವಗ್ರಹ ಹೋಮ ಮತ್ತು ಶಾಂತಿ",
        "category": "ಹೋಮ / ಹವನ (Homa / Havana)",
        "description": "ನವಗ್ರಹ ದೋಷ ನಿವಾರಣೆ ಹಾಗೂ ಗ್ರಹ ಪ್ರೀತ್ಯರ್ಥ ಹೋಮ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "ng_1", "item": "Navadhanya (9 sacred grains)", "kannada": "ನವಧಾನ್ಯ (ಗೋಧಿ, ಭತ್ತ, ತೊಗರಿ, ಹೆಸರು, ಕಡಲೆ, ಅವರೆ, ಎಳ್ಳು, ಉದ್ದು, ಹುರುಳಿ)", "qty": "1 kg (9 packets)", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "ng_2", "item": "Navagraha Vastra (9 colored cloths)", "kannada": "ನವಗ್ರಹ ವಸ್ತ್ರಗಳು (೯ ಬಣ್ಣದ ಬಟ್ಟೆ)", "qty": "9 pieces", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "ng_3", "item": "Navagraha Samidha (9 planetary sticks: Arka, Palasha, Khadira, Apamarga, Pippala, Udumbara, Shami, Durva, Kusha)", "kannada": "ನವಗ್ರಹ ಸಮಿತ್ತು (ಅರ್ಕ, ಪಲಾಶ, ಖದಿರ, ಅಪಾಮಾರ್ಗ, ಅಶ್ವತ್ಥ, ಔದುಂಬರ, ಶಮೀ, ಗರಿಕೆ, ದರ್ಭೆ)", "qty": "1 set", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ng_4", "item": "Pure Cow Ghee", "kannada": "ಹಸುವಿನ ಶುದ್ಧ ತುಪ್ಪ", "qty": "1 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ng_5", "item": "Dry Coconut Halves (Kobbari)", "kannada": "ಕೊಬ್ಬರಿ ತುಂಡುಗಳು", "qty": "1 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ng_6", "item": "Black Sesame (Kari Ellu)", "kannada": "ಕರಿ ಎಳ್ಳು", "qty": "200 g", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ng_7", "item": "Coconuts", "kannada": "ತೆಂಗಿನಕಾಯಿ", "qty": "9 + 2 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "ng_8", "item": "Betel leaves & nuts", "kannada": "ವೀಳ್ಯದೆಲೆ ಮತ್ತು ಅಡಿಕೆ", "qty": "60 leaves, 30 nuts", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True }
        ]
    },
    {
        "id": "shraddha",
        "name": "Annual Pratyabdika Shraddha",
        "kannadaName": "ಪ್ರತ್ಯಾಬ್ದಿಕ ಶ್ರಾದ್ಧ (ವಾರ್ಷಿಕ ಪಿತೃ ಕಾರ್ಯ)",
        "category": "ಪಿತೃ ಕಾರ್ಯ (Pitru Karya)",
        "description": "ಶಾಸ್ತ್ರೋಕ್ತ ವಾರ್ಷಿಕ ಶ್ರಾದ್ಧ ಕರ್ಮಕ್ಕೆ ಬೇಕಾಗುವ ಪವಿತ್ರ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "sh_1", "item": "Black Sesame seeds (Krishna Tila)", "kannada": "ಕರಿ ಎಳ್ಳು", "qty": "200 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sh_2", "item": "Darbha grass with Pavitra", "kannada": "ದರ್ಭೆ (ಪವಿತ್ರ ಸಮೇತ)", "qty": "1 bunch", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sh_3", "item": "Raw Rice (Akki - for Pinda)", "kannada": "ಅಕ್ಕಿ (ಪಿಂಡ ಪ್ರದಾನಕ್ಕೆ)", "qty": "2 kg", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "sh_4", "item": "Barley (Yava / Javegodhi)", "kannada": "ಜವೆಗೋಧಿ / ಯಾವ", "qty": "100 g", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "sh_5", "item": "Cow Ghee (Hasuvina Tuppa)", "kannada": "ಹಸುವಿನ ತುಪ್ಪ", "qty": "250 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sh_6", "item": "Pure Honey (Jenutuppa)", "kannada": "ಶುದ್ಧ ಜೇನುತುಪ್ಪ", "qty": "50 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sh_7", "item": "Cow Milk & Curd", "kannada": "ಹಸುವಿನ ಹಾಲು ಮತ್ತು ಮೊಸರು", "qty": "500 ml each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "sh_8", "item": "Plantain leaves (Uncut tip)", "kannada": "ತುದಿ ಬಾಳೆ ಎಲೆಗಳು", "qty": "5 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "sh_9", "item": "Betel leaves & nuts", "kannada": "ವೀಳ್ಯದೆಲೆ ಮತ್ತು ಅಡಿಕೆ", "qty": "20 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "sh_10", "item": "White sacred thread (Janivara)", "kannada": "ಜನಿವಾರ (ಜೋಡಿ)", "qty": "4 pairs", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "sh_11", "item": "Dhothi & Angavastra (Vastra dāna)", "kannada": "ಧೋತಿ ಮತ್ತು ಶಲ್ಯ", "qty": "1 set", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "sh_12", "item": "White flowers (no smelling, no red)", "kannada": "ಬಿಳಿ ಹೂವುಗಳು", "qty": "1 packet", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True }
        ]
    },
    {
        "id": "mahalaya",
        "name": "Mahalaya Pitru Paksha Shraddha",
        "kannadaName": "ಮಹಾಲಯ ಪಿತೃಪಕ್ಷ ಶ್ರಾದ್ಧ",
        "category": "ಪಿತೃ ಕಾರ್ಯ (Pitru Karya)",
        "description": "ಭಾದ್ರಪದ ಕೃಷ್ಣ ಪಕ್ಷದ ಮಹಾಲಯ ತರ್ಪಣ ಹಾಗೂ ಪಾರ್ವಣ ಶ್ರಾದ್ಧ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "mh_1", "item": "Black Sesame seeds (Kari Ellu)", "kannada": "ಕರಿ ಎಳ್ಳು", "qty": "250 g", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "mh_2", "item": "Darbha grass (Kusha grass)", "kannada": "ದರ್ಭೆ (ಪವಿತ್ರ ಸಮೇತ)", "qty": "1 bunch", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "mh_3", "item": "Raw Rice (Akki)", "kannada": "ಅಕ್ಕಿ", "qty": "2 kg", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "mh_4", "item": "Cow Ghee and Honey", "kannada": "ಹಸುವಿನ ತುಪ್ಪ ಮತ್ತು ಜೇನುತುಪ್ಪ", "qty": "200 g each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "mh_5", "item": "Plantain leaves", "kannada": "ಬಾಳೆ ಎಲೆಗಳು", "qty": "6 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "mh_6", "item": "Yajnopavita (Sacred threads)", "kannada": "ಜನಿವಾರ", "qty": "4 pairs", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "mh_7", "item": "Dakshina coins and Vastra", "kannada": "ದಕ್ಷಿಣೆಯ ನಾಣ್ಯಗಳು ಮತ್ತು ಶಲ್ಯ", "qty": "1 set", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True }
        ]
    },
    {
        "id": "vivaha",
        "name": "Vivaha Samskara (Wedding)",
        "kannadaName": "ವಿವಾಹ ಸಂಸ್ಕಾರ (ಮದುವೆ)",
        "category": "ಸಂಸ್ಕಾರ (Samskara)",
        "description": "ಶಾಸ್ತ್ರೋಕ್ತ ವಿವಾಹ ಹೋಮ, ಲಜ್ಜಾ ಹೋಮ, ಸಪ್ತಪದಿ, ಕನ್ಯಾದಾನಕ್ಕೆ ಬೇಕಾಗುವ ಸಂಪೂರ್ಣ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "vv_1", "item": "Mangalasutra (Taali) with black beads", "kannada": "ಮಾಂಗಲ್ಯ ಸೂತ್ರ (ಕರಿಮಣಿ ತಾಳಿ)", "qty": "1 set", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "vv_2", "item": "Jaggery & Cumin seed paste (Jirige-Bella)", "kannada": "ಜೀರಿಗೆ ಮತ್ತು ಬೆಲ್ಲ", "qty": "100 g each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "vv_3", "item": "Garlands for Varamale (Rose / Jasmine)", "kannada": "ವರಮಾಲೆಗಳು (ಗುಲಾಬಿ / ಮಲ್ಲಿಗೆ ಹಾರಗಳು)", "qty": "2 pairs", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "vv_4", "item": "Pure Cow Ghee for Vivaha Homa", "kannada": "ಹೋಮದ ಹಸುವಿನ ತುಪ್ಪ", "qty": "2 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "vv_5", "item": "Puffed rice (Laja / Aralu for Laja Homa)", "kannada": "ಅರಳು (ಲಾಜಾ ಹೋಮಕ್ಕೆ)", "qty": "500 g", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "vv_6", "item": "Samidha bundles (Sacred firewood)", "kannada": "ಸಮಿತ್ತು ಕಟ್ಟುಗಳು", "qty": "4 bundles", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "vv_7", "item": "Coconuts (Tenginakayi)", "kannada": "ತೆಂಗಿನಕಾಯಿ", "qty": "15 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "vv_8", "item": "Betel leaves & nuts", "kannada": "ವೀಳ್ಯದೆಲೆ ಮತ್ತು ಅಡಿಕೆ", "qty": "150 leaves, 75 nuts", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "vv_9", "item": "Raw Rice (Akki - for Akshata)", "kannada": "ಅಕ್ಕಿ (ಅಕ್ಷತೆಗೆ)", "qty": "5 kg", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "vv_10", "item": "Turmeric powder & Kumkuma", "kannada": "ಅರಿಶಿನ ಮತ್ತು ಕುಂಕುಮ", "qty": "500 g each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "vv_11", "item": "Grindstone (Ammi kal) for Ashmarohana", "kannada": "ರುಬ್ಬುವ ಕಲ್ಲು (ಅಶ್ಮಾರೋಹಣಕ್ಕೆ)", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "vv_12", "item": "Kankana threads (Cotton thread with turmeric)", "kannada": "ಕಂಕಣ ದಾರ (ಅರಿಶಿನ ದಾರ)", "qty": "2 nos", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "vv_13", "item": "Antarpata (Curtain cloth with Swastika)", "kannada": "ಅಂತರಪಟ (ಸ್ವಸ್ತಿಕ್ ಸಮೇತ ಬಟ್ಟೆ)", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True }
        ]
    },
    {
        "id": "upanayana",
        "name": "Upanayana Samskara (Munjvi)",
        "kannadaName": "ಉಪನಯನ ಸಂಸ್ಕಾರ / ಮುಂಜಿವೆ",
        "category": "ಸಂಸ್ಕಾರ (Samskara)",
        "description": "ಬ್ರಹ್ಮೋಪದೇಶ, ಗಾಯತ್ರೀ ಉಪದೇಶ, ಸಮಿದಾಧಾನ, ಭಿಕ್ಷಾಚರಣೆಗೆ ಬೇಕಾಗುವ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "up_1", "item": "Yajnopavita (Sacred threads)", "kannada": "ಜನಿವಾರ", "qty": "6 pairs", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "up_2", "item": "Mekhala (Munja grass belt)", "kannada": "ಮೌಂಜೀ ಮೇಖಲೆ (ದರ್ಭೆ ಪಟ್ಟಿ)", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "up_3", "item": "Danda (Palasha / Bilva wooden staff)", "kannada": "ದಂಡ (ಪಲಾಶ / ಬಿಲ್ವ ದಂಡ)", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "up_4", "item": "Ajina (Deer skin piece)", "kannada": "ಕೃಷ್ಣಾಜಿನ ತುಂಡು", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "up_5", "item": "Kaupina & Langoti (Kashaya vastra)", "kannada": "ಕೌಪೀನ ಮತ್ತು ವಸ್ತ್ರ", "qty": "2 sets", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "up_6", "item": "Palasha Samidha sticks", "kannada": "ಪಲಾಶ ಸಮಿತ್ತು", "qty": "4 bundles", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "up_7", "item": "Pure Cow Ghee", "kannada": "ಹಸುವಿನ ಶುದ್ಧ ತುಪ್ಪ", "qty": "1.5 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "up_8", "item": "Bhiksha bowl & Laddu/Rice for Bhiksha", "kannada": "ಭಿಕ್ಷಾ ಪಾತ್ರೆ ಮತ್ತು ಭಿಕ್ಷಾ ದ್ರವ್ಯ", "qty": "1 set", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "up_9", "item": "Coconuts, Betel leaves, Betel nuts", "kannada": "ತೆಂಗಿನಕಾಯಿ 10, ವೀಳ್ಯದೆಲೆ 100, ಅಡಿಕೆ 50", "qty": "1 set", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True }
        ]
    },
    {
        "id": "namakarana",
        "name": "Namakarana (Naming & Cradle)",
        "kannadaName": "ನಾಮಕರಣ ಮತ್ತು ತೊಟ್ಟಿಲೋತ್ಸವ",
        "category": "ಸಂಸ್ಕಾರ (Samskara)",
        "description": "ಮಗುವಿನ ನಾಮಕರಣ ಹಾಗೂ ತೊಟ್ಟಿಲು ಶಾಂತಿ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "nk_1", "item": "Bronze / Silver plate (for writing name in rice)", "kannada": "ಕಂಚಿನ / ಬೆಳ್ಳಿಯ ತಟ್ಟೆ (ಅಕ್ಕಿಯಲ್ಲಿ ಹೆಸರು ಬರೆಯಲು)", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "nk_2", "item": "Raw Rice (Akki)", "kannada": "ಅಕ್ಕಿ", "qty": "2 kg", "category": "ಧಾನ್ಯಗಳು", "essential": True },
            { "id": "nk_3", "item": "Gold ring (for writing in honey)", "kannada": "ಚಿನ್ನದ ಉಂಗುರ", "qty": "1 no", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "nk_4", "item": "Pure Honey & Ghee", "kannada": "ಜೇನುತುಪ್ಪ ಮತ್ತು ಹಸುವಿನ ತುಪ್ಪ", "qty": "50 g each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "nk_5", "item": "Betel leaves & nuts", "kannada": "ವೀಳ್ಯದೆಲೆ 30, ಅಡಿಕೆ 15", "qty": "1 set", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "nk_6", "item": "Coconuts", "kannada": "ತೆಂಗಿನಕಾಯಿ", "qty": "4 nos", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "nk_7", "item": "New baby dress / cradle cloth", "kannada": "ಹೊಸ ಬಟ್ಟೆ / ತೊಟ್ಟಿಲು ಬಟ್ಟೆ", "qty": "1 set", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "nk_8", "item": "Flowers & Sweets for Prasada", "kannada": "ಹೂವು ಮತ್ತು ಪ್ರಸಾದಕ್ಕೆ ಸಿಹಿ", "qty": "ಯಥಾಶಕ್ತಿ", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True }
        ]
    },
    {
        "id": "ayushya_homa",
        "name": "Ayushya / Mrityunjaya Homa",
        "kannadaName": "ಆಯುಷ್ಯ ಹೋಮ / ಮಹಾಮೃತ್ಯುಂಜಯ ಹೋಮ",
        "category": "ಹೋಮ / ಹವನ (Homa / Havana)",
        "description": "ದೀರ್ಘಾಯುಷ್ಯ, ಆರೋಗ್ಯ ವೃದ್ಧಿಗಾಗಿ ಆಯುಷ್ಯ ಹೋಮ ಹಾಗೂ ಮೃತ್ಯುಂಜಯ ಹೋಮ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "ay_1", "item": "Pure Cow Ghee (Tuppa)", "kannada": "ಹಸುವಿನ ಶುದ್ಧ ತುಪ್ಪ", "qty": "1.5 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ay_2", "item": "Amrita Valli (Guduchi sticks)", "kannada": "ಅಮೃತ ಬಳ್ಳಿ ತುಂಡುಗಳು", "qty": "1 bundle", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ay_3", "item": "Durva grass (Garike)", "kannada": "ಗರಿಕೆ ಹುಲ್ಲು", "qty": "4 bundles", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ay_4", "item": "Dry Coconut Halves (Kobbari)", "kannada": "ಕೊಬ್ಬರಿ ಚೂರುಗಳು", "qty": "1 kg", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ay_5", "item": "Samidha bundles (Palasha / Khadira)", "kannada": "ಸಮಿತ್ತು ಕಟ್ಟುಗಳು", "qty": "3 bundles", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ay_6", "item": "Sesame seeds (Bili / Kari Ellu)", "kannada": "ಎಳ್ಳು", "qty": "250 g", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ay_7", "item": "Milk & Honey for Ahuti", "kannada": "ಹಾಲು ಮತ್ತು ಜೇನುತುಪ್ಪ", "qty": "250 ml each", "category": "ಹೋಮ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "ay_8", "item": "Coconuts, Betel leaves, Betel nuts", "kannada": "ತೆಂಗಿನಕಾಯಿ 5, ವೀಳ್ಯದೆಲೆ 50, ಅಡಿಕೆ 25", "qty": "1 set", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True }
        ]
    },
    {
        "id": "punyaha_vachana",
        "name": "Punyaha Vachana (Purification)",
        "kannadaName": "ಪುಣ್ಯಾಹ ವಾಚನ / ಶುದ್ಧಿ ಕರ್ಮ",
        "category": "ವ್ರತ / ಪೂಜೆ (Vrata / Puja)",
        "description": "ಗೃಹ ಶುದ್ಧಿ, ಜಾತ ಕರ್ಮ ಹಾಗೂ ಶಾಂತಿ ಕರ್ಮಗಳಿಗೆ ಪುಣ್ಯಾಹ ವಾಚನ ಸಾಮಗ್ರಿಗಳು",
        "items": [
            { "id": "pv_1", "item": "Kalasha Chembu (Brass/Copper pot)", "kannada": "ಕಲಶ ಚೊಂಬು", "qty": "1 no", "category": "ವಸ್ತ್ರ ಮತ್ತು ಇತರ", "essential": True },
            { "id": "pv_2", "item": "Coconut with fiber (Shendi Tenge)", "kannada": "ಶೆಂಡಿ ತೆಂಗಿನಕಾಯಿ", "qty": "1 no", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "pv_3", "item": "Mango leaves (Mavina ele)", "kannada": "ಮಾವಿನ ಎಲೆಗಳು (ಕಲಶಕ್ಕೆ)", "qty": "5 leaves", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True },
            { "id": "pv_4", "item": "Panchagavya items (Milk, Curd, Ghee, Gomutra, Gomaya)", "kannada": "ಪಂಚಗವ್ಯ (ಹಾಲು, ಮೊಸರು, ತುಪ್ಪ, ಗೋಮೂತ್ರ, ಗೋಮಯ)", "qty": "ಸ್ವಲ್ಪ", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "pv_5", "item": "Darbha grass (Kusha grass with pavitra)", "kannada": "ದರ್ಭೆ (ಕೂರ್ಚ ಮತ್ತು ಪವಿತ್ರ)", "qty": "1 bunch", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "pv_6", "item": "Turmeric, Kumkuma, Chandana", "kannada": "ಅರಿಶಿನ, ಕುಂಕುಮ, ಗಂಧ", "qty": "50 g each", "category": "ಪೂಜಾ ದ್ರವ್ಯಗಳು", "essential": True },
            { "id": "pv_7", "item": "Betel leaves & nuts", "kannada": "ವೀಳ್ಯದೆಲೆ 20, ಅಡಿಕೆ 10", "qty": "1 set", "category": "ಹಣ್ಣು-ಕಾಯಿ-ಎಲೆ", "essential": True }
        ]
    }
]

out_file = "/Users/chaitanyaprasadkulkarni/Downloads/hucccha app 2/PurohitManager/data/pujaSamagri.json"
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(pujas, f, ensure_ascii=False, indent=2)

print(f"Generated {len(pujas)} Pujas in {out_file}")
