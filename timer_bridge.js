(() => {
  const timerKey = 'hibi-study-timer-v1';
  const dismissedKey = 'hibi-study-timer-dismissed-v1';
  let activeDeadline = 0;
  let alarmTimer = null;
  let audioContext = null;

  function unlockAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = audioContext || new AudioCtx();
      audioContext.resume?.();
    } catch (_) {}
  }

  function chime() {
    unlockAudio();
    if (!audioContext) return;
    const now = audioContext.currentTime;
    [659, 784, 988].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = now + index * .13;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(.001, start);
      gain.gain.exponentialRampToValueAtTime(.17, start + .015);
      gain.gain.exponentialRampToValueAtTime(.001, start + .24);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + .26);
    });
  }

  function stopAlarm(deadline = activeDeadline) {
    if (alarmTimer) clearInterval(alarmTimer);
    alarmTimer = null;
    activeDeadline = 0;
    if (deadline) localStorage.setItem(dismissedKey, String(deadline));
    document.getElementById('globalStudyAlarm')?.remove();
  }

  function showAlarm(state) {
    if (activeDeadline === state.deadline) return;
    stopAlarm(0);
    activeDeadline = state.deadline;
    const message = state.phase === 'break' ? '休憩時間が終わりました' : '学習時間が終わりました';
    const toast = document.createElement('aside');
    toast.id = 'globalStudyAlarm';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = '<strong>'+message+'</strong><div><a href="study_time.html">タイマーを開く</a><button type="button">音を止める</button></div>';
    toast.querySelector('button').onclick = () => stopAlarm(state.deadline);
    document.body.append(toast);
    chime();
    alarmTimer = setInterval(chime, 1500);
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        navigator.serviceWorker?.ready.then(registration => registration.showNotification('Hibi 学習タイマー', {
          body: message,
          icon: 'app-icon-192.png',
          badge: 'app-icon-192.png',
          tag: 'hibi-study-timer',
          renotify: true
        })).catch(() => new Notification('Hibi 学習タイマー', {body:message,icon:'app-icon-192.png'}));
      } catch (_) {}
    }
  }

  function checkTimer() {
    if (location.pathname.endsWith('/study_time.html') || location.pathname.endsWith('/study_time')) return;
    let state;
    try { state = JSON.parse(localStorage.getItem(timerKey) || 'null'); } catch (_) { return; }
    if (!state?.running || !state.deadline || Date.now() < state.deadline) return;
    if (localStorage.getItem(dismissedKey) === String(state.deadline)) return;
    showAlarm(state);
  }

  async function requestPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    return Notification.requestPermission();
  }

  window.HibiTimerBridge = { requestPermission, stopAlarm, unlockAudio };
  document.addEventListener('pointerdown', unlockAudio, {once:true,passive:true});
  window.addEventListener('storage', event => { if (event.key === timerKey) checkTimer(); });
  setInterval(checkTimer, 500);
  checkTimer();

  const style = document.createElement('style');
  style.textContent = '#globalStudyAlarm{position:fixed;right:18px;bottom:18px;z-index:100005;width:min(340px,calc(100% - 36px));padding:14px;border:1px solid #cfe4d6;border-radius:16px;background:#f7fff9;color:#355d43;box-shadow:0 18px 50px #1d30233b;font:500 12px/1.4 -apple-system,BlinkMacSystemFont,sans-serif}#globalStudyAlarm strong{display:block;margin-bottom:10px;font-size:14px}#globalStudyAlarm div{display:flex;justify-content:flex-end;gap:7px}#globalStudyAlarm a,#globalStudyAlarm button{padding:8px 10px;border:0;border-radius:9px;background:#e4f3e8;color:#3d7250;text-decoration:none;font:700 11px/1 -apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer}#globalStudyAlarm button{background:#579c6f;color:#fff}';
  document.head.append(style);
})();
