document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle');
  const closeBtn = document.getElementById('closeBtn');
  const exampleBox = document.getElementById('exampleBox');
  const modeText = document.getElementById('modeText');
  const hint = document.getElementById('hint');

  function updatePreview(enabled) {
    exampleBox.classList.toggle('example-player', enabled);
    exampleBox.classList.toggle('example-all', !enabled);
    modeText.textContent = enabled ? 'Player only' : 'All YouTube';
    hint.textContent = enabled
      ? 'On: the player is square, while the small page cards stay rounded.'
      : 'Off: the player and the small page cards are all square.';
  }

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get({ playerOnly: false }, (res) => {
      toggle.checked = Boolean(res.playerOnly);
      updatePreview(toggle.checked);
    });
  } else {
    toggle.checked = false;
    updatePreview(false);
  }

  toggle.addEventListener('change', () => {
    const enabled = !!toggle.checked;
    updatePreview(enabled);

    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.sync) return;

    chrome.storage.sync.set({ playerOnly: enabled }, () => {

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs.length) return;
        for (const t of tabs) {
          try {
            chrome.tabs.sendMessage(t.id, { action: 'apply', enabled }, () => {});
          } catch (e) {

          }
        }
      });
    });
  });

  closeBtn.addEventListener('click', () => {
    window.close();
  });
});
