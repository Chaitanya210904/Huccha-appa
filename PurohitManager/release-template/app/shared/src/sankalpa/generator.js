/**
 * Vedic Sankalpa Text Generator
 * Produces grammatically accurate Sanskrit (Devanagari), Kannada script, and English transliteration.
 */

import { getPanchang } from '../panchang/index.js';

export function generateSankalpa(params) {
  const {
    date,
    place,
    client, // { name, gotra, nakshatra, rashi }
    serviceType = 'satyanarayana', // 'satyanarayana', 'ganapati_homa', 'shraddha', 'navagraha_homa', 'vivaha', 'upanayana', 'general'
    ancestorName = '',
    customPurpose = ''
  } = params;

  // Calculate live panchang data for the day
  const panchang = getPanchang(date, place);
  const { calendar, angas, sunData } = panchang;

  const samvatsaraName = calendar.samvatsara.name;
  const ayanaName = calendar.ayana.sanskrit;
  const rituName = calendar.ritu.sanskrit;
  const masaName = calendar.masa.name;
  const pakshaName = angas.udayaTithi.paksha;
  const tithiName = angas.udayaTithi.name;
  const varaName = angas.vara.sanskrit;
  const nakshatraName = angas.nakshatra.name;
  const yogaName = angas.yoga.name;
  const karanaName = angas.karana.name;

  const gotra = client?.gotra || 'Kashyapa';
  const kartaName = client?.name || 'Yajamana';
  const riverContext = place?.riverContext || 'पुण्यदेशे';

  // Purpose clauses
  let purposeSanskrit = "";
  let purposeKannada = "";
  let purposeEnglish = "";

  if (serviceType === 'satyanarayana') {
    purposeSanskrit = "अस्माकं सहकुटुम्बानां सपरिवाराणां क्षेम-स्थैर्य-धैर्य-वीर्य-विजय-आयुर्-आरोग्य-ऐश्वर्याणां अभिवृद्ध्यर्थं श्री सत्यनारायण स्वामिनः प्रसादेन सर्वमनोरथसिद्ध्यर्थं श्री सत्यनारायण व्रतपूजनं करिष्ये।";
    purposeKannada = "ನಮ್ಮ ಸಮಸ್ತ ಕುಟುಂಬದ ಕ್ಷೇಮ, ಧೈರ್ಯ, ವಿಜಯ, ಆಯುಷ್ಯ, ಆರೋಗ್ಯ, ಐಶ್ವರ್ಯ ಅಭಿವೃದ್ಧಿಗಾಗಿ ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ ಸ್ವಾಮಿಯ ಪ್ರೀತ್ಯರ್ಥವಾಗಿ ಸತ್ಯನಾರಾಯಣ ವ್ರತ ಪೂಜೆಯನ್ನು ಆಚರಿಸುತ್ತೇವೆ.";
    purposeEnglish = "For the peace, prosperity, health, and fulfillment of all righteous desires of our family, by the grace of Lord Sri Satyanarayana, we perform this Satyanarayana Vrata Puja.";
  } else if (serviceType === 'ganapati_homa') {
    purposeSanskrit = "ममोपात्त-दुरितक्षयद्वारा श्री परमेश्वरप्रीत्यर्थं सर्वविघ्न-निवारणपूर्वक-सर्वकार्य-सिद्धिसिद्ध्यर्थं श्री महागणपति होमकर्म करिष्ये।";
    purposeKannada = "ಸರ್ವ ವಿಘ್ನ ನಿವಾರಣೆ ಹಾಗೂ ಸಕಲ ಕಾರ್ಯ ಸಿದ್ಧಿಗಾಗಿ ಶ್ರೀ ಮಹಾಗಣಪತಿ ಹೋಮವನ್ನು ನೆರವೇರಿಸುತ್ತೇವೆ.";
    purposeEnglish = "For the destruction of sins and removal of all obstacles, we perform Sri Maha Ganapati Homa.";
  } else if (serviceType === 'shraddha') {
    const pitruText = ancestorName ? `(स्वर्गीय ${ancestorName})` : "पितॄणां";
    purposeSanskrit = `अस्मत् ${pitruText} अक्षय्यपुण्यलोकावाप्त्यर्थं तृप्त्यर्थं च पिण्डदान-सहित-प्रत्यब्दिका-श्राद्धकर्म करिष्ये।`;
    purposeKannada = `ನಮ್ಮ ಪಿತೃಗಳಿಗೆ ${ancestorName ? `(${ancestorName})` : ''} ಅಕ್ಷಯ್ಯ ಪುಣ್ಯಲೋಕ ಪ್ರಾಪ್ತಿ ಹಾಗೂ ತೃಪ್ತಿಗಾಗಿ ಪ್ರತ್ಯಾಬ್ದಿಕ ಶ್ರಾದ್ಧ ಕರ್ಮವನ್ನು ನೆರವೇರಿಸುತ್ತೇವೆ.`;
    purposeEnglish = `For the eternal satisfaction and attainment of higher spiritual realms for our departed ancestors ${ancestorName ? `(${ancestorName})` : ''}, we perform this annual Shraddha ceremony.`;
  } else {
    purposeSanskrit = customPurpose || "ममोपात्त-दुरितक्षयद्वारा श्री परमेश्वरप्रीत्यर्थं शुभकार्यं करिष्ये।";
    purposeKannada = "ಸಕಲ ಶುಭಫಲ ಪ್ರಾಪ್ತಿಗಾಗಿ ಈ ಶುಭ ಕಾರ್ಯವನ್ನು ಆಚರಿಸುತ್ತೇವೆ.";
    purposeEnglish = "For the grace of the Almighty and attainment of righteous virtues, we perform this auspicious ceremony.";
  }

  // Build full Sanskrit Text
  const devanagariText = `ॐ हरिः ॐ तत् सत् श्री गोविन्द गोविन्द गोविन्द!
अद्य ब्रह्मणो द्वितीयपरार्धे श्रीश्वेतवराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे कलिप्रथमचरणे जम्बूद्वीपे भारतवर्षे भरतखण्डे दण्डकारण्ये ${riverContext} देशे,
शालिवाहन शके ${samvatsaraName} नाम संवत्सरे, ${ayanaName}, ${rituName} ऋतौ, ${masaName} मासे, ${pakshaName} पक्षे, ${tithiName} तिथौ, ${varaName} वासरे, ${nakshatraName} नक्षत्रयुक्तायां, ${yogaName} योगे, ${karanaName} करणे,
एवंगुण-विशेषण-विशिष्टायां शुभपुण्यतिथौ,
${gotra} गोत्रोत्पन्नस्य ${kartaName} शर्मणः (अहं) ममोपात्त-दुरितक्षयद्वारा
${purposeSanskrit}`;

  // Build Kannada Text
  const kannadaText = `ಓಂ ಹರಿಃ ಓಂ ತತ್ ಸತ್ ಶ್ರೀ ಗೋವಿಂದ ಗೋವಿಂದ ಗೋವಿಂದ!
ಅದ್ಯ ಬ್ರಹ್ಮಣಃ ದ್ವಿತೀಯ ಪರಾರ್ಧೇ ಶ್ರೀ ಶ್ವೇತವರಾಹ ಕಲ್ಪೇ ವೈವಸ್ವತ ಮನ್ವಂತರೇ ಅಷ್ಟಾವಿಂಶತಿತಮೇ ಕಲಿಯುಗೇ ಕಲಿಪ್ರಥಮಚರಣೇ ಜಂಬೂದ್ವೀಪೇ ಭಾರತವರ್ಷೇ ಭರತಖಂಡೇ ದಂಡಕಾರಣ್ಯೇ ${riverContext} ದೇಶೇ,
ಶಾಲಿವಾಹನ ಶಕೇ ${samvatsaraName} ನಾಮ ಸಂವತ್ಸರೇ, ${ayanaName}, ${rituName} ಋತೌ, ${masaName} ಮಾಸೇ, ${pakshaName} ಪಕ್ಷೇ, ${tithiName} ತಿಥೌ, ${varaName} ವಾಸರೇ, ${nakshatraName} ನಕ್ಷತ್ರಯುಕ್ತಾಯಾಂ,
${gotra} ಗೋತ್ರದ ${kartaName} (ನಾನು) ಕುಟುಂಬ ಸಮೇತರಾಗಿ,
${purposeKannada}`;

  // Build English Transliteration
  const englishText = `Harih Om Tat Sat Sri Govinda Govinda Govinda!
Adya Brahmano dvitiya-parardhe Sri Shweta-varaha kalpe Vaivasvata manvantare ashta-vimshatitame Kaliyuge Kali-prathama-charane Jambudvipe Bharata-varshe Bharata-khande,
Shalivahana Shake ${samvatsaraName} nama samvatsare, ${ayanaName}, ${rituName} ritau, ${masaName} mase, ${pakshaName} pakshe, ${tithiName} tithau, ${varaName} vasare, ${nakshatraName} nakshatre,
${gotra} gotrotpannasya ${kartaName} namadheyasya,
${purposeEnglish}`;

  return {
    devanagariText,
    kannadaText,
    englishText,
    panchangSummary: {
      samvatsara: samvatsaraName,
      ayana: ayanaName,
      ritu: rituName,
      masa: masaName,
      paksha: pakshaName,
      tithi: tithiName,
      vara: varaName,
      nakshatra: nakshatraName
    }
  };
}

