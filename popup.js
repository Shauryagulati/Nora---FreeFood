const toggle = document.getElementById('toggle');
const countEl = document.getElementById('count');

chrome.storage.local.get({ noraEnabled: true }, (data) => {
  toggle.checked = data.noraEnabled;
});

const updateCount = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) return;
    chrome.tabs.sendMessage(tabs[0].id, { type: 'nora-get-count' }, (response) => {
      if (chrome.runtime.lastError) return;
      countEl.textContent = response?.count ?? 0;
    });
  });
};

toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ noraEnabled: enabled });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) return;
    chrome.tabs.sendMessage(tabs[0].id, { type: 'nora-toggle', enabled }, () => {
      if (chrome.runtime.lastError) return;
      setTimeout(updateCount, 300);
    });
  });
});

updateCount();

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'nora-count') {
    countEl.textContent = msg.count;
  }
});
