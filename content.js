(() => {
  let observer = null;
  let enabled = true;

  const CARD_SELECTOR = '#divAllItems .list-group-item';

  const getCardText = (card) => {
    const titleLink = card.querySelector('.listing-element__title-block h3 a') || card.querySelector('a');
    const title = titleLink?.textContent?.trim() ?? '';

    // Walk text nodes individually to avoid word concatenation across elements
    const iter = document.createNodeIterator(card, NodeFilter.SHOW_TEXT);
    let textNodes = [];
    let node;
    while (node = iter.nextNode()) {
      const text = node.textContent.trim();
      if (text) textNodes.push(text);
    }

    // Grab badge/label text that may not appear as regular text nodes
    const labels = Array.from(card.querySelectorAll('.label, .badge, [class*="badge"], [class*="label"], [role="button"]'))
      .map(el => el.innerText.trim())
      .filter(t => t.length > 0);

    return [title, ...labels, ...textNodes].join(' ').replace(/\s+/g, ' ').trim();
  };

  const matchTags = (card) => {
    const tags = Array.from(card.querySelectorAll('span.label-tag'))
      .map(span => span.innerText.trim().toLowerCase());

    // Only tags that explicitly mean free food
    const HIGH_TAGS = ["free food!", "free food"];
    const MEDIUM_TAGS = ["catering", "catered"];

    const hasHigh = tags.some(t => HIGH_TAGS.includes(t));
    if (hasHigh) return { match: true, confidence: 'high' };

    const hasMedium = tags.some(t => MEDIUM_TAGS.includes(t));
    if (hasMedium) return { match: true, confidence: 'medium' };

    return { match: false };
  };

  const processCard = (card) => {
    if (!enabled) return;
    if (card.hasAttribute('data-nora-highlighted')) return;

    // 1. Tag-based detection (Primary)
    const tagResult = matchTags(card);
    if (tagResult.match) {
      NoraHighlight.highlightCard(card, tagResult.confidence);
      return;
    }

    // 2. Regex-based detection (Secondary)
    const text = getCardText(card);
    const result = NoraKeywords.matchText(text);

    if (result.match) {
      NoraHighlight.highlightCard(card, result.confidence);
    }
  };

  const scanPage = () => {
    const cards = document.querySelectorAll(CARD_SELECTOR);
    cards.forEach(processCard);
    notifyPopup();
  };

  const notifyPopup = () => {
    const count = NoraHighlight.countHighlighted();
    chrome.runtime.sendMessage({ type: 'nora-count', count }).catch(() => { });
  };

  const startObserver = () => {
    const target = document.querySelector('#divAllItems');
    if (!target) return;

    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          if (node.matches?.('.list-group-item')) {
            processCard(node);
          }

          const nested = node.querySelectorAll?.('.list-group-item');
          if (nested) nested.forEach(processCard);
        }
      }
      notifyPopup();
    });

    observer.observe(target, { childList: true, subtree: true });
  };

  const enable = () => {
    enabled = true;
    scanPage();
    if (!observer) startObserver();
  };

  const disable = () => {
    enabled = false;
    NoraHighlight.removeAllHighlights();
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    notifyPopup();
  };

  const init = () => {
    chrome.storage.local.get({ noraEnabled: true }, (data) => {
      enabled = data.noraEnabled;
      if (enabled) {
        scanPage();
        startObserver();
      }
    });

    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg.type === 'nora-toggle') {
        if (msg.enabled) {
          enable();
        } else {
          disable();
        }
        sendResponse({ ok: true });
      }

      if (msg.type === 'nora-get-count') {
        sendResponse({ count: NoraHighlight.countHighlighted() });
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
