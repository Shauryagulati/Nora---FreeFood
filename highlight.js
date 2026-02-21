const NoraHighlight = (() => {
  const BADGE_CLASS = 'nora-badge';
  const ATTR = 'data-nora-highlighted';

  const highlightCard = (card, confidence) => {
    if (card.hasAttribute(ATTR)) return;

    card.setAttribute(ATTR, confidence);
    card.style.position = card.style.position || 'relative';

    if (confidence === 'high') {
      card.classList.add('nora-highlight-high');
    } else {
      card.classList.add('nora-highlight-medium');
    }

    const badge = document.createElement('span');
    badge.className = BADGE_CLASS;
    badge.textContent = 'Free Food';

    if (confidence === 'high') {
      badge.classList.add('nora-badge-high');
    } else {
      badge.classList.add('nora-badge-medium');
    }

    card.style.overflow = 'visible';
    card.appendChild(badge);
  };

  const removeHighlight = (card) => {
    if (!card.hasAttribute(ATTR)) return;

    card.removeAttribute(ATTR);
    card.classList.remove('nora-highlight-high', 'nora-highlight-medium');

    const badge = card.querySelector(`.${BADGE_CLASS}`);
    if (badge) badge.remove();
  };

  const removeAllHighlights = () => {
    const cards = document.querySelectorAll(`[${ATTR}]`);
    cards.forEach(removeHighlight);
  };

  const countHighlighted = () => {
    return document.querySelectorAll(`[${ATTR}]`).length;
  };

  return { highlightCard, removeHighlight, removeAllHighlights, countHighlighted };
})();
