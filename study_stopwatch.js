(() => {
  if (document.getElementById('studyStopwatch')) return;

  const panel = document.createElement('section');
  panel.id = 'studyStopwatch';
  panel.className = 'panel';
  panel.innerHTML = `
    <div class="study-timer-head">
      <h2 class="panel-title">学習タイマー</h2>
      <div class="study-timer-head-actions">
        <div class="study-timer-tabs">
          <button class="active" data-timer-tab="stopwatch">ストップウォッチ</button>
          <button data-timer-tab="pomodoro">セットタイマー</button>
        </div>
        <button id="studyTimerExpand" class="study-timer-expand" type="button">拡大</button>
      </div>
    </div>
    <div id="timerMaterial" class="timer-material" aria-live="polite"></div>
    <div class="study-timer-view active" data-timer-view="stopwatch">
      <div class="timer-row"><strong id="stopwatchClock">00:00:00</strong><button id="stopwatchStart" class="primary">開始</button><button id="stopwatchReset">リセット</button></div>
    </div>
    <div class="study-timer-view" data-timer-view="pomodoro">
      <div class="custom-timer-settings">
        <label>学習時間<div><input id="studyWorkMinutes" type="number" min="1" max="180" step="1" value="25"><span>分</span></div></label>
        <label>休憩時間<div><input id="studyBreakMinutes" type="number" min="1" max="60" step="1" value="5"><span>分</span></div></label>
        <label>セット数<div><input id="studySetCount" type="number" min="1" max="20" step="1" value="4"><span>回</span></div></label>
      </div>
      <div class="pomo-status"><span id="studyPomoPhase">学習</span><span id="studySetProgress">1 / 4 セット</span></div>
      <div class="timer-row"><div id="studyPomoDial" class="timer-dial"><strong id="studyPomoClock">25:00</strong></div><button id="studyPomoStart" class="primary">開始</button><button id="studyPomoReset">リセット</button></div>
      <div id="studyAlarm" class="study-alarm" role="alert" aria-live="assertive">
        <span id="studyAlarmMessage">時間になりました</span>
        <div class="study-alarm-actions"><button id="studyAlarmExtend">3分延長</button><button id="studyAlarmStop">アラームを止める</button></div>
      </div>
    </div>
    <p>計測した学習時間は、秒を切り捨てて記録欄に反映します。</p>
    <button id="studyTimerApply">学習を終える</button>`;
  document.querySelector('.layout > div:last-child')?.prepend(panel);

  const style = document.createElement('style');
  style.textContent = `
    #studyStopwatch{margin-bottom:16px}.study-timer-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.study-timer-head .panel-title{margin:0}.study-timer-head-actions{display:flex;align-items:center;gap:6px}.study-timer-tabs{display:flex;gap:3px;padding:3px;border-radius:10px;background:#f0f2ef}.study-timer-tabs button{padding:6px 8px;border:0;border-radius:7px;background:transparent;color:#7c8880;font:inherit;font-size:10px;cursor:pointer}.study-timer-tabs button.active{background:#fff;color:#395f47;box-shadow:0 1px 5px #23351d12}.study-timer-expand{padding:6px 9px;border:1px solid #dce7de;border-radius:8px;background:#f8fbf8;color:#5f7767;font:inherit;font-size:10px;font-weight:700;cursor:pointer}.study-timer-view{display:none}.study-timer-view.active{display:block}.timer-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.timer-row strong{min-width:102px;font-size:25px;letter-spacing:.03em;font-variant-numeric:tabular-nums}.timer-row button,#studyTimerApply{border:0;border-radius:9px;padding:8px 11px;background:#eef4ef;color:#477a58;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.timer-row button.primary{background:#4e9b70;color:#fff}.custom-timer-settings{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-bottom:9px}.custom-timer-settings label{display:grid;gap:4px;color:#7c8880;font-size:9px}.custom-timer-settings label>div{display:flex;align-items:center;gap:4px;padding:5px 7px;border:1px solid #dfe6e0;border-radius:9px;background:#fff}.custom-timer-settings input{width:100%;min-width:0;padding:0;border:0;outline:0;background:transparent;color:#35463c;font:inherit;font-size:13px;font-weight:700}.custom-timer-settings span{color:#98a29b;font-size:9px}.custom-timer-settings input:disabled{color:#9ca49f}.pomo-status{display:flex;align-items:center;gap:6px;margin-bottom:9px}.pomo-status span{padding:4px 7px;border-radius:999px;background:#e8f4ec;color:#477a58;font-size:10px;font-weight:700}.pomo-status span:last-child{background:#f0f2ef;color:#748078}.study-alarm{display:none;align-items:center;justify-content:space-between;gap:10px;margin-top:11px;padding:10px 11px;border:1px solid #d9e8dc;border-radius:12px;background:#f2faf4;color:#42644c;font-size:12px;font-weight:700;box-shadow:0 5px 18px #315d3f12}.study-alarm.active{display:flex}.study-alarm-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.study-alarm button{flex:none;padding:8px 11px;border:0;border-radius:9px;background:#4e9b70;color:#fff;font:inherit;font-size:11px;font-weight:750;cursor:pointer}.study-alarm #studyAlarmExtend{background:#fff;color:#4e7e5d;box-shadow:inset 0 0 0 1px #cfe0d3}#studyStopwatch p{margin:10px 0;color:#7c8880;font-size:11px;line-height:1.6}#studyStopwatch.timer-expanded{position:fixed!important;inset:0!important;z-index:99999!important;display:flex!important;flex-direction:column!important;justify-content:center!important;width:100vw!important;height:100vh!important;margin:0!important;padding:clamp(24px,6vw,80px)!important;border-radius:0!important;background:#f8fcf9!important;overflow:auto!important}#studyStopwatch.timer-expanded .study-timer-head{position:absolute;top:clamp(20px,4vw,48px);left:clamp(22px,5vw,64px);right:clamp(22px,5vw,64px)}#studyStopwatch.timer-expanded .study-timer-view.active{width:min(100%,760px);margin:0 auto}#studyStopwatch.timer-expanded .timer-row{justify-content:center;gap:14px}#studyStopwatch.timer-expanded .timer-row strong{width:100%;margin-bottom:18px;text-align:center;font-size:clamp(72px,15vw,180px);line-height:1;font-weight:650}#studyStopwatch.timer-expanded .timer-row button{padding:12px 20px;font-size:14px}#studyStopwatch.timer-expanded .custom-timer-settings{width:min(100%,620px);margin:0 auto 22px}#studyStopwatch.timer-expanded .pomo-status{justify-content:center;margin-bottom:20px}#studyStopwatch.timer-expanded>p,#studyStopwatch.timer-expanded>#studyTimerApply{display:none}@media(max-width:520px){.study-timer-head{align-items:flex-start;flex-direction:column}.study-timer-head-actions{width:100%;justify-content:space-between}.custom-timer-settings{grid-template-columns:1fr}.study-alarm{align-items:stretch;flex-direction:column}.study-alarm-actions{justify-content:stretch}.study-alarm-actions button{flex:1}#studyStopwatch.timer-expanded .study-timer-head{align-items:center;flex-direction:row}#studyStopwatch.timer-expanded .study-timer-tabs{display:none}#studyStopwatch.timer-expanded .timer-row strong{font-size:clamp(58px,20vw,100px)}}
  `;
  style.textContent += `
    .timer-dial{display:contents}
    #studyStopwatch.timer-expanded [data-timer-view="pomodoro"] .timer-row{display:grid;grid-template-columns:auto auto;justify-content:center;justify-items:center}
    #studyStopwatch.timer-expanded .timer-dial{--ring-progress:0deg;--ring-color:#67b488;position:relative;grid-column:1/-1;display:grid;place-items:center;width:clamp(280px,52vw,520px);height:clamp(280px,52vw,520px);margin:0 0 clamp(22px,4vh,38px);border-radius:50%;background:conic-gradient(var(--ring-color) var(--ring-progress),#e4ebe6 0);box-shadow:0 22px 70px #355b4314;transition:background .35s linear}
    #studyStopwatch.timer-expanded .timer-dial::before{content:'';position:absolute;inset:clamp(13px,2.2vw,22px);border-radius:50%;background:#f8fcf9;box-shadow:inset 0 0 0 1px #ffffff}
    #studyStopwatch.timer-expanded .timer-dial strong{position:relative;z-index:1;width:auto!important;min-width:0!important;margin:0!important;font-size:clamp(62px,11vw,126px)!important;color:#35463c}
    #studyStopwatch.timer-expanded .timer-dial.break-ring{--ring-color:#dfbd68}
    @media(max-width:520px){#studyStopwatch.timer-expanded .timer-dial{width:min(76vw,350px);height:min(76vw,350px)}#studyStopwatch.timer-expanded .timer-dial strong{font-size:clamp(52px,17vw,82px)!important}}
  `;
  style.textContent += `
    .timer-material{display:flex;align-items:center;gap:7px;width:max-content;max-width:100%;margin:0 0 12px;padding:6px 10px;border-radius:999px;background:#f2f6f3;color:#627068;font-size:10px;font-weight:700}.timer-material::before{content:'';width:8px;height:8px;flex:none;border-radius:50%;background:var(--material-color,#7c8880)}
    #studyStopwatch.timer-expanded .timer-material{position:absolute;left:clamp(22px,5vw,64px);bottom:clamp(22px,5vw,58px);transform:none;font-size:13px;padding:9px 14px}
    .layout>.panel:first-child{position:relative;padding-bottom:62px!important}.layout>.panel:first-child>.materials{display:flex!important;gap:9px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:4px 3px 12px!important;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}.layout>.panel:first-child>.materials::-webkit-scrollbar{display:none}.layout>.panel:first-child>.materials{scrollbar-width:none}.layout>.panel:first-child .material{position:relative;display:grid!important;grid-template-columns:auto 1fr;align-content:center;flex:0 0 calc((100% - 27px)/4);min-width:0;min-height:92px;padding:12px!important;border:1px solid #e5e9e5!important;border-radius:17px!important;background:#fbfcfb;cursor:grab;scroll-snap-align:start;user-select:none;transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease,opacity .15s ease}.layout>.panel:first-child .material:active{cursor:grabbing}.layout>.panel:first-child .material:hover{transform:translateY(-1px);box-shadow:0 7px 18px #23351d0d}.layout>.panel:first-child .material.selected-material{border-color:var(--material-color)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--material-color) 18%,transparent),0 7px 18px #23351d0c}.layout>.panel:first-child .material.material-dragging{opacity:.42}.layout>.panel:first-child .material.material-drop-before{box-shadow:inset 4px 0 #4e9b70}.layout>.panel:first-child .material.material-drop-after{box-shadow:inset -4px 0 #4e9b70}.layout>.panel:first-child .material .dot{grid-row:1/3}.layout>.panel:first-child .material-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px!important}.layout>.panel:first-child .material-time{grid-column:2;font-size:11px!important}.layout>.panel:first-child #manageMaterials{position:absolute!important;right:18px!important;bottom:17px!important;width:auto!important;margin:0!important;padding:7px 10px!important;border-radius:9px!important;background:#f0f4f1!important;color:#66766c!important;font-size:10px!important;box-shadow:none!important}.layout>.panel:first-child .log{margin-top:20px}.new-material-form{display:none;grid-template-columns:1fr auto;gap:7px;margin-top:10px;padding:10px;border-radius:11px;background:#f4f8f5}.new-material-form.open{display:grid}.new-material-form input{min-width:0;padding:9px 10px;border:1px solid #dfe7e1;border-radius:9px;font:inherit;font-size:12px}.new-material-form button{padding:9px 12px;border:0;border-radius:9px;background:#4e9b70;color:#fff;font:inherit;font-size:11px;font-weight:700;cursor:pointer}
    @media(max-width:520px){#studyStopwatch.timer-expanded .timer-material{left:20px;bottom:22px;max-width:calc(100% - 40px)}.layout>.panel:first-child .material{flex-basis:calc((100% - 9px)/2)}}
  `;
  document.head.append(style);

  let activeTimer = 'stopwatch';
  let elapsed = 0, startedAt = 0, stopwatchRunning = false;
  let pomoPhase = 'work', pomoRemaining = 25 * 60, pomoRunning = false, pomoStarted = false;
  let pomoWorkSeconds = 0, currentSet = 1, targetSets = 4, workMinutes = 25, breakMinutes = 5;
  let audioContext = null, alarmInterval = null, ringProgressOverride = null, ringPhaseOverride = null, currentAlarmKind = null, extensionDuration = null;
  const materialTimerKey = 'study-timer-material-v1';
  const materialRemainderKey = 'study-timer-remainders-v1';
  let activeMaterialId = localStorage.getItem(materialTimerKey) || state?.materials?.[0]?.id || '';
  let materialRemainders = JSON.parse(localStorage.getItem(materialRemainderKey) || '{}');
  let capturedStopwatch = 0, capturedPomodoro = 0;
  let previousStopwatchRunning = false, previousPomodoroRunning = false;
  const pad = value => String(value).padStart(2, '0');
  const stopwatchTotal = () => elapsed + (stopwatchRunning ? Math.floor((Date.now() - startedAt) / 1000) : 0);
  const settingInputs = ['studyWorkMinutes', 'studyBreakMinutes', 'studySetCount'].map(id => document.getElementById(id));

  function ensureActiveMaterial() {
    if (!state?.materials?.some(material => material.id === activeMaterialId)) activeMaterialId = state?.materials?.[0]?.id || '';
    if (activeMaterialId) localStorage.setItem(materialTimerKey, activeMaterialId);
  }
  function timerTotals() { return {stopwatch:stopwatchTotal(), pomodoro:pomoWorkSeconds}; }
  function captureMaterialTime() {
    ensureActiveMaterial();
    const totals = timerTotals();
    const delta = Math.max(0, totals.stopwatch - capturedStopwatch) + Math.max(0, totals.pomodoro - capturedPomodoro);
    capturedStopwatch = totals.stopwatch;
    capturedPomodoro = totals.pomodoro;
    if (activeMaterialId && delta > 0) {
      materialRemainders[activeMaterialId] = (Number(materialRemainders[activeMaterialId]) || 0) + delta;
      localStorage.setItem(materialRemainderKey, JSON.stringify(materialRemainders));
    }
  }
  function flushMaterial(materialId) {
    if (!materialId) return;
    const seconds = Number(materialRemainders[materialId]) || 0;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 1) return;
    state.logs.push({id:Date.now(),materialId,minutes,date:iso(new Date()),note:'タイマーから自動記録',createdAt:Date.now()});
    materialRemainders[materialId] = seconds - minutes * 60;
    localStorage.setItem(materialRemainderKey, JSON.stringify(materialRemainders));
    save();
    render();
  }
  function paintSelectedMaterial() {
    ensureActiveMaterial();
    const material = state?.materials?.find(item => item.id === activeMaterialId);
    const badge = document.getElementById('timerMaterial');
    badge.textContent = material ? '計測中の教材：' + material.name : '教材を選択してください';
    badge.style.setProperty('--material-color', material?.color || '#7c8880');
    const select = document.getElementById('materialSelect');
    if (select && activeMaterialId) select.value = activeMaterialId;
    document.querySelectorAll('#materials .material').forEach((card,index) => {
      const item = state.materials[index];
      if (!item) return;
      card.dataset.materialId = item.id;
      card.draggable = true;
      card.style.setProperty('--material-color', item.color);
      card.classList.toggle('selected-material', item.id === activeMaterialId);
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.setAttribute('aria-pressed',String(item.id === activeMaterialId));
      const pendingMinutes = Math.floor((Number(materialRemainders[item.id]) || 0) / 60);
      const time = card.querySelector('.material-time');
      if (time && pendingMinutes) time.textContent = minText(total(log => log.materialId === item.id) + pendingMinutes);
    });
  }
  function selectMaterial(materialId) {
    if (!materialId || materialId === activeMaterialId) return;
    if ((stopwatchRunning || pomoRunning) && !window.confirm('タイマーを計測中です。教材を変更しますか？\n変更前までの時間は現在の教材へ自動保存されます。')) {
      paintSelectedMaterial();
      return;
    }
    captureMaterialTime();
    flushMaterial(activeMaterialId);
    activeMaterialId = materialId;
    localStorage.setItem(materialTimerKey, activeMaterialId);
    capturedStopwatch = stopwatchTotal();
    capturedPomodoro = pomoWorkSeconds;
    paintSelectedMaterial();
  }

  function readSettings() {
    workMinutes = Math.min(180, Math.max(1, Number(document.getElementById('studyWorkMinutes').value) || 25));
    breakMinutes = Math.min(60, Math.max(1, Number(document.getElementById('studyBreakMinutes').value) || 5));
    targetSets = Math.min(20, Math.max(1, Number(document.getElementById('studySetCount').value) || 1));
  }
  function unlockSettings(unlocked) { settingInputs.forEach(input => input.disabled = !unlocked); }
  function prepareAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = audioContext || new AudioCtx();
      audioContext.resume?.();
    } catch (error) {}
  }
  function ring(kind) {
    if (!audioContext) return;
    const now = audioContext.currentTime;
    const notes = kind === 'breakEnd' ? [660, 880] : kind === 'complete' ? [660, 880, 1100] : [880, 660];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = now + index * .12;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(.001, start);
      gain.gain.exponentialRampToValueAtTime(.16, start + .012);
      gain.gain.exponentialRampToValueAtTime(.001, start + .18);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + .2);
    });
  }
  function stopAlarm(resumeNextPhase = false) {
    if (alarmInterval) clearInterval(alarmInterval);
    alarmInterval = null;
    currentAlarmKind = null;
    ringProgressOverride = null;
    ringPhaseOverride = null;
    document.getElementById('studyAlarm').classList.remove('active');
    if (resumeNextPhase && pomoPhase !== 'complete') pomoRunning = true;
    drawPomodoro();
  }
  function startAlarm(kind, message) {
    stopAlarm(false);
    pomoRunning = false;
    currentAlarmKind = kind;
    ringProgressOverride = 1;
    ringPhaseOverride = kind === 'breakEnd' ? 'break' : 'work';
    document.getElementById('studyAlarmMessage').textContent = message;
    document.getElementById('studyAlarmExtend').textContent = kind === 'breakEnd' ? '休憩を1分延長' : '学習を3分延長';
    document.getElementById('studyAlarm').classList.add('active');
    ring(kind);
    alarmInterval = setInterval(() => ring(kind), 1400);
  }
  function drawStopwatch() {
    const total = stopwatchTotal();
    document.getElementById('stopwatchClock').textContent = [Math.floor(total/3600), Math.floor(total%3600/60), total%60].map(pad).join(':');
    document.getElementById('stopwatchStart').textContent = stopwatchRunning ? '停止' : '開始';
  }
  function drawPomodoro() {
    document.getElementById('studyPomoClock').textContent = pad(Math.floor(pomoRemaining/60))+':'+pad(pomoRemaining%60);
    document.getElementById('studyPomoPhase').textContent = pomoPhase === 'work' ? '学習' : pomoPhase === 'break' ? '休憩' : '完了';
    document.getElementById('studySetProgress').textContent = Math.min(currentSet,targetSets)+' / '+targetSets+' セット';
    document.getElementById('studyPomoStart').textContent = pomoRunning ? '一時停止' : pomoPhase === 'complete' ? 'もう一度' : pomoStarted ? '再開' : '開始';
    const dial = document.getElementById('studyPomoDial');
    const ringPhase = ringPhaseOverride || pomoPhase;
    const total = extensionDuration || (ringPhase === 'break' ? breakMinutes * 60 : workMinutes * 60);
    const progress = ringProgressOverride == null ? Math.max(0, Math.min(1, (total - pomoRemaining) / Math.max(1, total))) : ringProgressOverride;
    dial.style.setProperty('--ring-progress', (progress * 360) + 'deg');
    dial.classList.toggle('break-ring', ringPhase === 'break');
  }
  function resetPomodoro() {
    stopAlarm(false);
    readSettings();
    pomoRunning = false;
    pomoStarted = false;
    pomoPhase = 'work';
    pomoRemaining = workMinutes * 60;
    pomoWorkSeconds = 0;
    extensionDuration = null;
    currentSet = 1;
    unlockSettings(true);
    drawPomodoro();
  }
  function nextPhase() {
    extensionDuration = null;
    if (pomoPhase === 'work') {
      if (currentSet >= targetSets) {
        pomoPhase = 'complete';
        pomoRemaining = 0;
        pomoRunning = false;
        startAlarm('complete', 'すべてのセットが終わりました');
        return;
      }
      pomoPhase = 'break';
      pomoRemaining = breakMinutes * 60;
      startAlarm('breakStart', '学習終了。休憩の時間です');
    } else {
      currentSet++;
      pomoPhase = 'work';
      pomoRemaining = workMinutes * 60;
      startAlarm('breakEnd', '休憩終了。次の学習を始めましょう');
    }
  }

  document.querySelectorAll('[data-timer-tab]').forEach(button => button.onclick = () => {
    activeTimer = button.dataset.timerTab;
    document.querySelectorAll('[data-timer-tab]').forEach(item => item.classList.toggle('active', item === button));
    document.querySelectorAll('[data-timer-view]').forEach(view => view.classList.toggle('active', view.dataset.timerView === activeTimer));
  });
  const materialsRoot = document.getElementById('materials');
  let materialDragId = null, materialDropId = null, materialDropAfter = false, suppressMaterialClick = false;
  function clearMaterialDrop() {
    materialsRoot?.querySelectorAll('.material-drop-before,.material-drop-after').forEach(card => card.classList.remove('material-drop-before','material-drop-after'));
    materialDropId = null;
    materialDropAfter = false;
  }
  materialsRoot?.addEventListener('click', event => {
    if (suppressMaterialClick) return;
    const card = event.target.closest('.material');
    if (card?.dataset.materialId) selectMaterial(card.dataset.materialId);
  });
  materialsRoot?.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.material');
    if (!card?.dataset.materialId) return;
    event.preventDefault();
    selectMaterial(card.dataset.materialId);
  });
  materialsRoot?.addEventListener('dragstart', event => {
    const card = event.target.closest('.material');
    if (!card?.dataset.materialId) return;
    materialDragId = card.dataset.materialId;
    suppressMaterialClick = true;
    card.classList.add('material-dragging');
    event.dataTransfer?.setData('text/plain', materialDragId);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  });
  materialsRoot?.addEventListener('dragover', event => {
    if (!materialDragId) return;
    event.preventDefault();
    clearMaterialDrop();
    const card = event.target.closest('.material');
    if (!card || card.dataset.materialId === materialDragId) return;
    const rect = card.getBoundingClientRect();
    materialDropId = card.dataset.materialId;
    materialDropAfter = event.clientX > rect.left + rect.width / 2;
    card.classList.add(materialDropAfter ? 'material-drop-after' : 'material-drop-before');
  });
  materialsRoot?.addEventListener('drop', event => {
    if (!materialDragId) return;
    event.preventDefault();
    const movedId = materialDragId, targetId = materialDropId, after = materialDropAfter;
    clearMaterialDrop();
    materialDragId = null;
    const from = state.materials.findIndex(material => material.id === movedId);
    if (from < 0) return;
    const [moved] = state.materials.splice(from,1);
    if (targetId) {
      const target = state.materials.findIndex(material => material.id === targetId);
      state.materials.splice(Math.max(0,target) + (after ? 1 : 0),0,moved);
    } else state.materials.push(moved);
    save();
    render();
    setTimeout(() => { suppressMaterialClick = false; }, 0);
  });
  materialsRoot?.addEventListener('dragend', () => {
    materialDragId = null;
    clearMaterialDrop();
    materialsRoot.querySelectorAll('.material-dragging').forEach(card => card.classList.remove('material-dragging'));
    setTimeout(() => { suppressMaterialClick = false; }, 0);
  });
  new MutationObserver(paintSelectedMaterial).observe(materialsRoot, {childList:true});
  document.getElementById('materialSelect')?.addEventListener('change', event => selectMaterial(event.target.value));
  const newMaterialButton = document.getElementById('newMaterialRow');
  if (newMaterialButton && !document.getElementById('newMaterialForm')) {
    const newMaterialForm = document.createElement('form');
    newMaterialForm.id = 'newMaterialForm';
    newMaterialForm.className = 'new-material-form';
    newMaterialForm.innerHTML = '<input id="managedNewMaterialName" maxlength="50" required placeholder="教材名を入力"><button type="submit">追加する</button>';
    newMaterialButton.before(newMaterialForm);
    newMaterialButton.onclick = () => {
      newMaterialForm.classList.toggle('open');
      if (newMaterialForm.classList.contains('open')) document.getElementById('managedNewMaterialName').focus();
    };
    newMaterialForm.onsubmit = event => {
      event.preventDefault();
      const input = document.getElementById('managedNewMaterialName'), name = input.value.trim();
      if (!name) return;
      const palette = ['#ac725e','#d06b64','#ffad46','#42d692','#16a765','#7bd148','#fbe983','#92e1c0','#9fe1e7','#9fc6e7','#4986e7','#9a9cff','#b99aff','#f691b2'];
      state.materials.push({id:'m_'+Date.now(),name,color:palette[state.materials.length % palette.length]});
      save();
      render();
      input.value = '';
      newMaterialForm.classList.remove('open');
      document.getElementById('manageMaterials')?.click();
    };
  }

  const studyExtrasStyle = document.createElement('style');
  studyExtrasStyle.textContent = `
    #logs .log-row{cursor:pointer;border-radius:9px;padding-left:6px;padding-right:6px;transition:background .14s ease}#logs .log-row:hover{background:#f5f8f5}#logs .log-row:focus-visible{outline:2px solid #8fc3a1;outline-offset:2px}
    .study-log-overlay{display:none;position:fixed;inset:0;z-index:100000;align-items:center;justify-content:center;padding:20px;background:#1f2b2457}.study-log-overlay.open{display:flex}.study-log-dialog{position:relative;width:min(100%,440px);padding:22px;border-radius:20px;background:#fff;box-shadow:0 24px 70px #1f2b2438}.study-log-dialog h2{margin:0 0 15px;font-size:17px}.study-log-dialog label{display:grid;gap:5px;margin:10px 0;color:#778078;font-size:11px}.study-log-dialog input,.study-log-dialog select{width:100%;padding:10px;border:1px solid #e1e7e2;border-radius:10px;background:#fff;color:#35423a;font:inherit}.study-log-time{display:grid;grid-template-columns:1fr 1fr;gap:8px}.study-log-actions{display:flex;justify-content:flex-end;gap:7px;margin-top:16px}.study-log-actions button,.study-log-close{padding:9px 12px;border:0;border-radius:9px;font:inherit;font-size:11px;font-weight:700;cursor:pointer}.study-log-actions button{background:#4e9b70;color:#fff}.study-log-actions .cancel-log{background:#eef2ef;color:#68746c}.study-log-actions .delete-log{display:grid;place-items:center;width:36px;margin-right:auto;padding:0;background:#f8e9e9;color:#b65757;font-size:16px}.study-log-close{position:absolute;top:12px;right:12px;width:30px;height:30px;padding:0;border-radius:50%;background:#eef2ef;color:#758078;font-size:18px}
    .chart-heading{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.chart-expand{margin-left:auto;padding:6px 9px;border:1px solid #dce7de;border-radius:8px;background:#f8fbf8;color:#5f7767;font:inherit;font-size:10px;font-weight:700;cursor:pointer}.chart-period-nav{display:grid;grid-template-columns:30px minmax(0,1fr) 30px;align-items:center;gap:8px;margin:12px 0 0;padding:7px;border-radius:11px;background:#f4f7f4}.chart-period-nav button{display:grid;place-items:center;width:30px;height:30px;padding:0;border:0;border-radius:8px;background:#fff;color:#5f6d63;font-size:18px;cursor:pointer}.chart-period-label{text-align:center;color:#59675e;font-size:11px;font-weight:700;font-variant-numeric:tabular-nums}.bar-total{height:12px;color:#66736c;font-size:8px;line-height:12px;white-space:nowrap;font-variant-numeric:tabular-nums}.bar-detail{display:none;color:#89928b;font-size:8px;white-space:nowrap}#chart{height:190px!important;align-items:stretch!important;overflow:hidden!important}#chart .bar-wrap{display:grid!important;grid-template-rows:minmax(0,1fr) 44px!important;height:100%!important;min-width:0!important;align-items:stretch!important}#chart .bar-plot{display:flex;align-items:flex-end;justify-content:center;width:100%;min-height:0;height:100%;overflow:hidden}#chart .bar-meta{height:44px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;flex:none}#chart .stack-bar{width:min(34px,85%)!important;max-height:100%!important;flex:none}.chart-expanded{position:fixed!important;inset:0!important;z-index:99999!important;width:100vw!important;height:100vh!important;margin:0!important;padding:clamp(24px,5vw,62px)!important;border-radius:0!important;background:#f8fcf9!important;overflow:auto!important}.chart-expanded .chart-heading{font-size:clamp(18px,3vw,28px)!important}.chart-expanded .chart-period-nav{width:min(100%,760px);margin:24px auto 0;padding:9px}.chart-expanded .chart-period-label{font-size:clamp(13px,1.8vw,17px)}.chart-expanded #chart{box-sizing:border-box!important;width:100%!important;height:min(65vh,650px)!important;margin:clamp(22px,4vh,42px) auto 0!important;gap:clamp(8px,1.8vw,24px)!important;padding:24px clamp(28px,6vw,92px) 0!important}.chart-expanded #chart .bar-label{height:auto!important;font-size:clamp(11px,1.5vw,15px)!important}.chart-expanded #chart .bar-total{height:auto;font-size:clamp(9px,1.15vw,12px);line-height:1.3}.chart-expanded #chart .bar-detail{display:block;font-size:clamp(8px,1vw,11px)}.chart-expanded #chart .stack-bar,.chart-expanded #chart .bar{width:min(64px,72%)!important}.chart-expanded #chart .bar-wrap{min-width:0!important;gap:7px!important}.study-undo-toast{position:fixed;right:20px;bottom:20px;z-index:100002;display:flex;align-items:center;gap:14px;padding:11px 12px 11px 15px;border-radius:13px;background:#26332cf2;color:#fff;font-size:12px;box-shadow:0 12px 35px #17201933;opacity:0;transform:translateY(14px);pointer-events:none;transition:opacity .18s ease,transform .18s ease}.study-undo-toast.show{opacity:1;transform:none;pointer-events:auto}.study-undo-toast button{padding:7px 10px;border:0;border-radius:8px;background:#e3f2e7;color:#356248;font:inherit;font-size:11px;font-weight:800;cursor:pointer}
  `;
  document.head.append(studyExtrasStyle);

  const logOverlay = document.createElement('div');
  logOverlay.className = 'study-log-overlay';
  logOverlay.innerHTML = `<form class="study-log-dialog"><button class="study-log-close" type="button" aria-label="閉じる">×</button><h2>学習記録を編集</h2><label>教材<select id="editLogMaterial"></select></label><label>日付<input id="editLogDate" type="date" required></label><div class="study-log-time"><label>時間<input id="editLogHours" type="number" min="0" step="1"></label><label>分<input id="editLogMinutes" type="number" min="0" max="59" step="1"></label></div><label>メモ<input id="editLogNote" maxlength="80"></label><div class="study-log-actions"><button class="delete-log" type="button" aria-label="この学習記録を削除" title="削除">🗑</button><button class="cancel-log" type="button">キャンセル</button><button type="submit">保存する</button></div></form>`;
  document.body.append(logOverlay);
  const undoToast = document.createElement('div');
  undoToast.className = 'study-undo-toast';
  undoToast.setAttribute('aria-live','polite');
  undoToast.innerHTML = '<span>学習記録を削除しました</span><button type="button">元に戻す</button>';
  document.body.append(undoToast);
  let deletedLog = null, deletedLogIndex = -1, undoLogTimer = null;
  function showLogUndo(log,index) {
    deletedLog = log;
    deletedLogIndex = index;
    clearTimeout(undoLogTimer);
    undoToast.classList.add('show');
    undoLogTimer = setTimeout(() => { undoToast.classList.remove('show'); deletedLog=null; deletedLogIndex=-1; },10000);
  }
  undoToast.querySelector('button').onclick = () => {
    if (!deletedLog) return;
    state.logs.splice(Math.max(0,Math.min(deletedLogIndex,state.logs.length)),0,deletedLog);
    save();
    render();
    deletedLog = null;
    deletedLogIndex = -1;
    clearTimeout(undoLogTimer);
    undoToast.classList.remove('show');
  };
  let editingLogId = null;
  function closeLogEditor() { logOverlay.classList.remove('open'); editingLogId = null; }
  function openLogEditor(id) {
    const log = state.logs.find(item => String(item.id) === String(id));
    if (!log) return;
    editingLogId = log.id;
    document.getElementById('editLogMaterial').innerHTML = state.materials.map(material => '<option value="'+material.id+'">'+esc(material.name)+'</option>').join('');
    document.getElementById('editLogMaterial').value = log.materialId;
    document.getElementById('editLogDate').value = log.date;
    document.getElementById('editLogHours').value = Math.floor(Number(log.minutes || 0) / 60);
    document.getElementById('editLogMinutes').value = Number(log.minutes || 0) % 60;
    document.getElementById('editLogNote').value = log.note || '';
    logOverlay.classList.add('open');
  }
  function decorateLogs() {
    const recent = [...state.logs].sort((a,b) => b.createdAt - a.createdAt).slice(0,7);
    document.querySelectorAll('#logs .log-row').forEach((row,index) => {
      if (!recent[index]) return;
      row.dataset.logId = recent[index].id;
      row.tabIndex = 0;
      row.title = 'タップして編集';
    });
  }
  const logsRoot = document.getElementById('logs');
  logsRoot?.addEventListener('click', event => openLogEditor(event.target.closest('.log-row')?.dataset.logId));
  logsRoot?.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('.log-row')) { event.preventDefault(); openLogEditor(event.target.closest('.log-row').dataset.logId); } });
  new MutationObserver(decorateLogs).observe(logsRoot, {childList:true});
  logOverlay.addEventListener('click', event => { if (event.target === logOverlay || event.target.closest('.study-log-close,.cancel-log')) closeLogEditor(); });
  logOverlay.querySelector('.delete-log').onclick = () => {
    const log = state.logs.find(item => String(item.id) === String(editingLogId));
    if (!log || !window.confirm('この学習記録を本当に削除しますか？')) return;
    const deletedIndex = state.logs.findIndex(item => String(item.id) === String(editingLogId));
    state.logs = state.logs.filter(item => String(item.id) !== String(editingLogId));
    save();
    closeLogEditor();
    render();
    showLogUndo(log,deletedIndex);
  };
  logOverlay.querySelector('form').onsubmit = event => {
    event.preventDefault();
    const log = state.logs.find(item => String(item.id) === String(editingLogId));
    if (!log) return closeLogEditor();
    const minutes = Math.max(0,Number(document.getElementById('editLogHours').value)||0) * 60 + Math.max(0,Number(document.getElementById('editLogMinutes').value)||0);
    if (minutes < 1) return;
    log.materialId = document.getElementById('editLogMaterial').value;
    log.date = document.getElementById('editLogDate').value;
    log.minutes = Math.round(minutes);
    log.note = document.getElementById('editLogNote').value.trim();
    save();
    closeLogEditor();
    render();
  };
  decorateLogs();

  const chart = document.getElementById('chart');
  const chartPanel = chart?.closest('.panel');
  const chartHeading = chartPanel?.querySelector('.panel-title');
  const chartExpand = document.createElement('button');
  chartExpand.type = 'button';
  chartExpand.className = 'chart-expand';
  chartExpand.textContent = '拡大';
  chartHeading?.classList.add('chart-heading');
  chartHeading?.append(chartExpand);
  const chartPeriodNav = document.createElement('div');
  chartPeriodNav.className = 'chart-period-nav';
  chartPeriodNav.innerHTML = '<button id="chartPeriodPrev" type="button" aria-label="前の期間">‹</button><div id="chartPeriodLabel" class="chart-period-label"></div><button id="chartPeriodNext" type="button" aria-label="次の期間">›</button>';
  chartHeading?.after(chartPeriodNav);
  let detailedChartRange = 'week', detailedChartOffset = 0;
  const chartRangeButtons = [...document.querySelectorAll('#rangeTabs3 button')];
  function startOfMonday(date) {
    const result = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    result.setDate(result.getDate() - ((result.getDay()+6)%7));
    return result;
  }
  function shortDate(date) { return (date.getMonth()+1)+'/'+date.getDate(); }
  function detailedBuckets() {
    const now = new Date(), buckets = [];
    if (detailedChartRange === 'week') {
      const start = startOfMonday(now); start.setDate(start.getDate()+detailedChartOffset*7);
      for (let i=0;i<7;i++) { const from=new Date(start); from.setDate(start.getDate()+i); const to=new Date(from); to.setDate(to.getDate()+1); buckets.push({label:shortDate(from),detail:['日','月','火','水','木','金','土'][from.getDay()]+'曜日',from:iso(from),to:iso(to)}); }
      const end = new Date(start); end.setDate(end.getDate()+6);
      return {buckets,label:start.getFullYear()+'年 '+shortDate(start)+' 〜 '+shortDate(end)+' の週'};
    }
    if (detailedChartRange === 'month') {
      const first = new Date(now.getFullYear(),now.getMonth()+detailedChartOffset,1), last = new Date(first.getFullYear(),first.getMonth()+1,0);
      let cursor = new Date(first), number = 1;
      while (cursor <= last) { const end = new Date(cursor); end.setDate(Math.min(last.getDate()+1,cursor.getDate()+7)); buckets.push({label:'第'+number+'週',detail:shortDate(cursor)+'〜'+shortDate(new Date(end.getFullYear(),end.getMonth(),end.getDate()-1)),from:iso(cursor),to:iso(end)}); cursor=end; number++; }
      return {buckets,label:first.getFullYear()+'年 '+shortDate(first)+' 〜 '+shortDate(last)+' の月'};
    }
    const year = now.getFullYear()+detailedChartOffset;
    for (let monthIndex=0;monthIndex<12;monthIndex++) { const from=new Date(year,monthIndex,1),to=new Date(year,monthIndex+1,1); buckets.push({label:(monthIndex+1)+'月',detail:year+'年'+(monthIndex+1)+'月',from:iso(from),to:iso(to)}); }
    return {buckets,label:year+'年 1月 〜 12月'};
  }
  function renderDetailedStudyChart() {
    const period = detailedBuckets();
    const items = period.buckets.map(bucket => {
      const parts = state.materials.map(material => ({color:material.color,value:total(log => log.materialId===material.id&&log.date>=bucket.from&&log.date<bucket.to)})).filter(part => part.value>0);
      return {...bucket,parts,value:parts.reduce((sum,part)=>sum+part.value,0)};
    });
    const max = Math.max(...items.map(item=>item.value),1), sum = items.reduce((value,item)=>value+item.value,0);
    document.getElementById('chartPeriodLabel').textContent = period.label;
    const totalNode = document.getElementById('chartTotal'); if (totalNode) totalNode.textContent = '合計 '+minText(sum);
    chart.innerHTML = items.map(item => '<div class="bar-wrap"><div class="bar-plot"><div class="stack-bar" style="height:'+(item.value?Math.max(5,item.value/max*100):2)+'%" title="'+minText(item.value)+'">'+item.parts.map(part=>'<span class="stack-segment" style="height:'+(part.value/item.value*100)+'%;background:'+part.color+'"></span>').join('')+'</div></div><div class="bar-meta"><span class="bar-label">'+item.label+'</span><span class="bar-detail">'+item.detail+'</span>'+(detailedChartRange==='week'?'<span class="bar-total">'+Math.floor(item.value/60)+'時間'+(item.value%60)+'分</span>':'')+'</div></div>').join('');
    chartRangeButtons.forEach(button => { const active=button.dataset.r===detailedChartRange; button.style.cssText='border:0;border-radius:7px;padding:4px 7px;background:'+(active?'#4e9b70':'#f0f0f2')+';color:'+(active?'#fff':'#777')+';font-size:11px;cursor:pointer'; });
  }
  chartRangeButtons.forEach(button => button.onclick = () => { detailedChartRange=button.dataset.r; detailedChartOffset=0; renderDetailedStudyChart(); });
  document.getElementById('chartPeriodPrev').onclick = () => { detailedChartOffset--; renderDetailedStudyChart(); };
  document.getElementById('chartPeriodNext').onclick = () => { detailedChartOffset++; renderDetailedStudyChart(); };
  renderChart = renderDetailedStudyChart;
  renderDetailedStudyChart();
  function syncChartExpanded(expanded) { chartPanel?.classList.toggle('chart-expanded',expanded); chartExpand.textContent = expanded ? '縮小' : '拡大'; }
  chartExpand.onclick = async () => {
    const expanded = chartPanel.classList.contains('chart-expanded');
    if (expanded) { if (document.fullscreenElement) await document.exitFullscreen?.(); syncChartExpanded(false); }
    else { syncChartExpanded(true); try { await chartPanel.requestFullscreen?.(); } catch (error) {} }
  };
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) syncChartExpanded(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && chartPanel?.classList.contains('chart-expanded') && !document.fullscreenElement) syncChartExpanded(false); });
  function minutesFromText(text) {
    const hour = Number((text.match(/(\d+)時間/)||[])[1]||0), minute = Number((text.match(/(\d+)分/)||[])[1]||0);
    return hour * 60 + minute;
  }
  function decorateWeekTotals() {
    const wraps = [...document.querySelectorAll('#chart .bar-wrap')];
    const weekly = wraps.length === 7 && wraps.every(wrap => /\d+\/\d+/.test(wrap.querySelector('.bar-label')?.textContent || ''));
    wraps.forEach(wrap => {
      const existing = wrap.querySelector('.bar-total');
      if (!weekly) { existing?.remove(); return; }
      const value = minutesFromText(wrap.querySelector('.stack-bar,.bar')?.getAttribute('title') || '0分');
      const totalLabel = existing || document.createElement('span');
      if (!existing) totalLabel.className = 'bar-total';
      totalLabel.textContent = Math.floor(value/60)+'時間'+(value%60)+'分';
      if (!existing) wrap.append(totalLabel);
    });
  }
  new MutationObserver(decorateWeekTotals).observe(chart, {childList:true,subtree:false});
  decorateWeekTotals();
  const expandButton = document.getElementById('studyTimerExpand');
  function syncExpanded(expanded) {
    panel.classList.toggle('timer-expanded', expanded);
    expandButton.textContent = expanded ? '縮小' : '拡大';
    expandButton.setAttribute('aria-label', expanded ? '全画面表示を終了' : 'タイマーを全画面表示');
  }
  expandButton.onclick = async () => {
    if (panel.classList.contains('timer-expanded')) {
      if (document.fullscreenElement) await document.exitFullscreen?.();
      syncExpanded(false);
      return;
    }
    syncExpanded(true);
    try { await panel.requestFullscreen?.(); } catch (error) {}
  };
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) syncExpanded(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('timer-expanded') && !document.fullscreenElement) syncExpanded(false);
  });
  document.getElementById('stopwatchStart').onclick = () => {
    if (stopwatchRunning) { elapsed = stopwatchTotal(); stopwatchRunning = false; }
    else { startedAt = Date.now(); stopwatchRunning = true; }
    drawStopwatch();
  };
  document.getElementById('stopwatchReset').onclick = () => { elapsed = 0; stopwatchRunning = false; drawStopwatch(); };
  settingInputs.forEach(input => input.onchange = resetPomodoro);
  document.getElementById('studyPomoStart').onclick = () => {
    prepareAudio();
    if (alarmInterval) return;
    if (pomoPhase === 'complete') resetPomodoro();
    if (!pomoStarted) { readSettings(); pomoRemaining = workMinutes * 60; pomoStarted = true; unlockSettings(false); }
    pomoRunning = !pomoRunning;
    drawPomodoro();
  };
  document.getElementById('studyPomoReset').onclick = resetPomodoro;
  document.getElementById('studyAlarmStop').onclick = () => stopAlarm(true);
  document.getElementById('studyAlarmExtend').onclick = () => {
    const kind = currentAlarmKind;
    if (!kind) return;
    stopAlarm(false);
    pomoStarted = true;
    unlockSettings(false);
    if (kind === 'breakEnd') {
      currentSet = Math.max(1, currentSet - 1);
      pomoPhase = 'break';
      pomoRemaining = 60;
      extensionDuration = 60;
    } else {
      pomoPhase = 'work';
      pomoRemaining = 3 * 60;
      extensionDuration = 3 * 60;
    }
    pomoRunning = true;
    drawPomodoro();
  };
  ['stopwatchReset','studyPomoReset'].forEach(id => document.getElementById(id)?.addEventListener('click', () => {
    captureMaterialTime();
    flushMaterial(activeMaterialId);
    setTimeout(() => {
      capturedStopwatch = stopwatchTotal();
      capturedPomodoro = pomoWorkSeconds;
      paintSelectedMaterial();
    }, 0);
  }, true));
  document.getElementById('studyTimerApply').onclick = () => {
    if (activeTimer === 'stopwatch' && stopwatchRunning) {
      elapsed = stopwatchTotal();
      stopwatchRunning = false;
    }
    if (activeTimer === 'pomodoro') {
      pomoRunning = false;
      stopAlarm(false);
    }
    captureMaterialTime();
    flushMaterial(activeMaterialId);
    if (activeTimer === 'stopwatch') elapsed = 0;
    else resetPomodoro();
    capturedStopwatch = stopwatchTotal();
    capturedPomodoro = pomoWorkSeconds;
    paintSelectedMaterial();
    document.getElementById('logs')?.scrollIntoView({behavior:'smooth', block:'center'});
  };
  document.getElementById('studyTimerApply').textContent = '学習を終える';
  document.getElementById('saveLog')?.addEventListener('click', () => {
    const hours = Number(document.getElementById('hours')?.value || 0);
    const minutes = Number(document.getElementById('minutes')?.value || 0);
    const materialId = document.getElementById('materialSelect')?.value;
    const date = document.getElementById('studyDate')?.value;
    if (!materialId || !date || hours * 60 + minutes <= 0) return;
    const sound = new Audio('completion-sound.wav');
    sound.volume = .65;
    sound.play().catch(() => {});
  }, true);
  setInterval(() => {
    drawStopwatch();
    if (!pomoRunning) return;
    if (pomoRemaining > 0) {
      pomoRemaining--;
      if (pomoPhase === 'work') pomoWorkSeconds++;
    }
    if (pomoRemaining === 0) nextPhase();
    drawPomodoro();
  }, 1000);

  setInterval(() => {
    captureMaterialTime();
    if ((previousStopwatchRunning && !stopwatchRunning) || (previousPomodoroRunning && !pomoRunning)) flushMaterial(activeMaterialId);
    previousStopwatchRunning = stopwatchRunning;
    previousPomodoroRunning = pomoRunning;
    paintSelectedMaterial();
  }, 1000);

  drawStopwatch();
  resetPomodoro();
  ensureActiveMaterial();
  capturedStopwatch = stopwatchTotal();
  capturedPomodoro = pomoWorkSeconds;
  paintSelectedMaterial();
})();
