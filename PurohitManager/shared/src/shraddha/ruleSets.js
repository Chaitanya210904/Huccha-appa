/**
 * Shraddha Rule Sets: Smartha, Madhva, and Vaishnava traditions
 * References: Dharma Sindhu, Nirnaya Sindhu, Smriti Muktavali, Vaidyanatha Dikshitiyam
 */

export const SAMPRADAYAS = {
  SMARTHA: 'Smartha',
  MADHVA: 'Madhva',
  VAISHNAVA: 'Vaishnava'
};

export const RULE_EXPLANATIONS = {
  SMARTHA: {
    primaryWindow: "Aparahna (3/5 to 4/5 of daytime)",
    tieBreaker: "Greater Aparahna overlap (Adhika Vyapti). If equal, Day 2 (Paraviddha).",
    kshayaRule: "Day 2 is preferred if tithi exists in second half of Day 1 and morning of Day 2.",
    reference: "Dharma Sindhu / Nirnaya Sindhu"
  },
  MADHVA: {
    primaryWindow: "Kutapa Muhurta (8th Muhurta) and Aparahna",
    tieBreaker: "Paraviddha (Day 2) preferred if tithi exists during Kutapa.",
    kshayaRule: "Day 2 with Kutapa / Sangava overlap.",
    reference: "Sumadhva / Smriti Muktavali / Matha Panchanga"
  },
  VAISHNAVA: {
    primaryWindow: "Aparahna with Udaya Tithi association",
    tieBreaker: "Day with Udaya Tithi touching Aparahna.",
    kshayaRule: "Strict Udaya tithi or Purvaviddha avoidance.",
    reference: "Sri Vaishnava Ahobila / Munitraya tradition"
  }
};

/**
 * Evaluates candidate days for annual Shraddha according to chosen tradition
 * @param {Array} candidates Array of candidate evaluation objects
 * @param {string} [sampradaya='Smartha'] 
 * @returns {object} { recommendedIndex: number, reason: string }
 */
export function resolveTraditionRule(candidates, sampradaya = SAMPRADAYAS.SMARTHA) {
  if (!candidates || candidates.length === 0) {
    return { recommendedIndex: 0, reason: "No candidate dates found" };
  }

  if (candidates.length === 1) {
    return {
      recommendedIndex: 0,
      reason: "Tithi touches Aparahna uniquely on this single day."
    };
  }

  const [c1, c2] = candidates;

  // Case 1: Tithi touches Aparahna on both days (Vyapini on both)
  if (c1.overlapMs > 0 && c2.overlapMs > 0) {
    const diffMins = Math.round((c1.overlapMs - c2.overlapMs) / 60000);

    if (sampradaya === SAMPRADAYAS.MADHVA) {
      if (c2.kutapaOverlapMs > 0) {
        return {
          recommendedIndex: 1,
          reason: `Madhva rule: Tithi touches Kutapa on Day 2 (${c2.date}). Paraviddha preferred.`
        };
      }
      return {
        recommendedIndex: diffMins >= 15 ? 0 : 1,
        reason: `Madhva rule: Overlap comparison (Day 1: ${Math.round(c1.overlapMs/60000)}m, Day 2: ${Math.round(c2.overlapMs/60000)}m).`
      };
    }

    if (sampradaya === SAMPRADAYAS.VAISHNAVA) {
      if (c2.isUdayaTithi) {
        return {
          recommendedIndex: 1,
          reason: `Sri Vaishnava rule: Tithi is Udaya Tithi on Day 2 (${c2.date}) and extends into Aparahna.`
        };
      }
      return {
        recommendedIndex: 0,
        reason: `Sri Vaishnava rule: Day 1 has primary presence without next-day contamination.`
      };
    }

    // Default Smartha (Dharma Sindhu / Nirnaya Sindhu):
    // If one day has significantly greater Aparahna overlap, choose it; if almost equal, choose Day 2.
    if (diffMins > 20) {
      return {
        recommendedIndex: 0,
        reason: `Smartha rule (Adhika Vyapti): Day 1 has ${diffMins} minutes greater overlap in Aparahna.`
      };
    } else if (diffMins < -20) {
      return {
        recommendedIndex: 1,
        reason: `Smartha rule (Adhika Vyapti): Day 2 has ${Math.abs(diffMins)} minutes greater overlap in Aparahna.`
      };
    } else {
      return {
        recommendedIndex: 1,
        reason: `Smartha rule (Samya Vyapti): Both days have nearly equal Aparahna overlap. Dharma Sindhu dictates Paraviddha (Day 2).`
      };
    }
  }

  // Case 2: One touches Aparahna and the other doesn't
  if (c1.overlapMs > 0 && c2.overlapMs === 0) {
    return {
      recommendedIndex: 0,
      reason: `Tithi touches Aparahna only on Day 1 (${c1.date}).`
    };
  }
  if (c2.overlapMs > 0 && c1.overlapMs === 0) {
    return {
      recommendedIndex: 1,
      reason: `Tithi touches Aparahna only on Day 2 (${c2.date}).`
    };
  }

  // Case 3: Kshaya Tithi (Neither touches Aparahna!)
  // Tithi started after Day 1 Aparahna and ended before Day 2 Aparahna
  if (c1.overlapMs === 0 && c2.overlapMs === 0) {
    if (sampradaya === SAMPRADAYAS.MADHVA) {
      return {
        recommendedIndex: 1,
        reason: `Kshaya Tithi (Madhva rule): Day 2 (${c2.date}) chosen as tithi is active during morning hours.`
      };
    }
    return {
      recommendedIndex: 1,
      reason: `Kshaya Tithi (Dharma Sindhu): Tithi touches neither Aparahna. Paraviddha Day 2 (${c2.date}) is recommended.`
    };
  }

  return { recommendedIndex: 0, reason: "Standard recommendation" };
}

