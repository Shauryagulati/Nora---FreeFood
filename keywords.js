const NoraKeywords = (() => {
  const HIGH_CONFIDENCE = [
    /\bfree\s+food\b/i,
    /\bfree\s+lunch\b/i,
    /\bfree\s+dinner\b/i,
    /\bfree\s+breakfast\b/i,
    /\bfree\s+pizza\b/i,
    /\bfree\s+snacks\b/i,
    /\bfree\s+refreshments\b/i,
    /\bfree\s+drinks\b/i,
    /\bfood\s+provided\b/i,
    /\blunch\s+provided\b/i,
    /\bdinner\s+provided\b/i,
    /\bbreakfast\s+provided\b/i,
    /\bmeals?\s+provided\b/i,
    /\bpizza\b/i,
    /\bcatered\b/i,
    /\bshabbat\b/i,
    /\bcatering\b/i,
    /\bbuffet\b/i,
  ];

  const MEDIUM_CONFIDENCE = [
    /\brefreshments\b/i,
    /\blight\s+refreshments\b/i,
    /\bsnacks\b/i,
    /\bbeverages\s+provided\b/i,
    /\bfood\s+and\s+drinks\b/i,
    /\bwe'?ll\s+feed\s+you\b/i,
    /\bcome\s+hungry\b/i,
    /\bgrab\s+a\s+bite\b/i,
    /\bboba\b/i,
    /\bbobba\b/i,
    /\brefreshments\s+provided\b/i,
    // Proximity: "free" within ~15 words of food-related terms
    /\bfree\b(?:\s+\S+){0,15}\s+\b(?:food|lunch|dinner|breakfast|meal|snack|drink|beverage)s?\b/i,
    /\b(?:food|lunch|dinner|breakfast|meal|snack|drink|beverage)s?\b(?:\s+\S+){0,15}\s+\bfree\b/i,
    // "provided" near food words
    /\b(?:lunch|dinner|breakfast)\b(?:\s+\S+){0,5}\s+\bprovided\b/i,
  ];

  const EXCLUSIONS = [
    /\bfood\s+drive\b/i,
    /\bfood\s+science\b/i,
    /\bfood\s+policy\b/i,
    /\bfood\s+systems?\b/i,
    /\bfood\s+bank\b/i,
    /\bfood\s+insecurity\b/i,
    /\bfood\s+desert\b/i,
    /\bfood\s+justice\b/i,
    /\bfood\s+pantry\b/i,
    /\bfood\s+waste\b/i,
    /\bfood\s+security\b/i,
    /\bfundraiser\b/i,
  ];

  const matchText = (text) => {
    if (!text || typeof text !== 'string') {
      return { match: false, confidence: null };
    }

    const normalized = text.replace(/\s+/g, ' ').trim();

    for (const pattern of EXCLUSIONS) {
      if (pattern.test(normalized)) {
        return { match: false, confidence: null };
      }
    }

    for (const pattern of HIGH_CONFIDENCE) {
      if (pattern.test(normalized)) {
        return { match: true, confidence: 'high' };
      }
    }

    for (const pattern of MEDIUM_CONFIDENCE) {
      if (pattern.test(normalized)) {
        return { match: true, confidence: 'medium' };
      }
    }

    return { match: false, confidence: null };
  };

  return { matchText };
})();
