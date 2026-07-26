(() => {
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.error), {once:true});
  }
  const current = location.pathname.split('/').filter(Boolean).pop() || 'task_manager.html';
  const style = document.createElement('style');
  style.textContent = `
    .app{width:min(100%,1200px)!important;margin-left:auto!important;margin-right:auto!important;padding:44px 22px 70px!important}
    .top{position:relative!important;width:100%!important;min-height:48px!important;margin-bottom:28px!important}
    .top .page-nav,.top .nav{
      position:absolute!important;top:7px!important;right:0!important;
      display:flex!important;align-items:center!important;justify-content:flex-end!important;
      gap:7px!important;height:34px!important;margin:0!important;white-space:nowrap!important
    }
    .top .page-nav a,.top .nav a{
      display:inline-flex!important;align-items:center!important;justify-content:center!important;
      height:34px!important;margin:0!important;padding:0 12px!important;box-sizing:border-box!important;
      border-radius:10px!important;text-decoration:none!important;font-size:11px!important;
      font-weight:500!important;line-height:1!important;transform:none!important
    }
    .page-nav a:not(.current-page),.nav a:not(.current-page){opacity:.38!important;filter:saturate(.65)}
    .page-nav a.current-page,.nav a.current-page{opacity:1!important;filter:none!important;box-shadow:0 4px 12px #1d1d1f14!important}
    .top .page-nav a[href="habit_manager.html"],.top .nav a[href="habit_manager.html"]{background:#ddd5f3!important;color:#5c5278!important}
    .top .page-nav a[href="reports.html"],.top .nav a[href="reports.html"]{background:#eadcae!important;color:#6f6244!important}
    body.study-gradient-page{background:linear-gradient(145deg,#f1faf5 0,#f6fbf8 30%,#f1f7fb 68%,#f7f8f6 100%) fixed!important}
    body.study-gradient-page .panel,body.study-gradient-page .summary-card{box-shadow:0 14px 34px #44715a10!important}
    body.habit-gradient-page{background:linear-gradient(145deg,#f5f1fb 0,#faf7fc 34%,#f0f8f5 72%,#f7f6fb 100%) fixed!important}
    body.habit-gradient-page .panel{box-shadow:0 15px 38px #62578312!important}
    @media(max-width:700px){
      .app{padding:32px 18px 56px!important}
      .top .page-nav,.top .nav{position:static!important;justify-content:flex-start!important;margin-top:10px!important;overflow-x:auto!important;max-width:100%!important}
    }
  `;
  document.head.append(style);
  if (current === 'study_time.html') document.body.classList.add('study-gradient-page');
  if (current === 'habit_manager.html') document.body.classList.add('habit-gradient-page');
  if (current === 'habit_manager.html') {
    const reminderSetting = document.getElementById('habitReminder')?.closest('label');
    if (reminderSetting) reminderSetting.style.display = 'none';
  }
  document.querySelectorAll('.page-nav,.nav').forEach(nav => {
    if (!nav.querySelector('a[href="habit_manager.html"]')) {
      const link = document.createElement('a');
      link.href = 'habit_manager.html';
      link.textContent = '習慣';
      link.className = 'habit-page-link';
      nav.append(link);
    }
    ['task_manager.html', 'study_time.html', 'habit_manager.html', 'reports.html'].forEach(href => {
      const link = nav.querySelector(`a[href="${href}"]`);
      if (link) nav.append(link);
    });
  });
  document.querySelectorAll('.page-nav a,.nav a').forEach(link => {
    if (link.getAttribute('href') === 'reports.html') link.textContent = '日記';
    if (link.getAttribute('href') === current) link.classList.add('current-page');
  });

  const categoryInput = document.getElementById('categoryInput');
  if (categoryInput && typeof customCategories !== 'undefined') {
    const addCategory = document.getElementById('addCategory');
    const refreshOnly = () => { categoryInput.innerHTML = customCategories.length ? customCategories.map(([id,label]) => `<option value="${id}">${label}</option>`).join('') : '<option value="">属性なし</option>'; categoryInput.value = customCategories[0]?.[0] || ''; };
    refreshCategories = refreshOnly;
    refreshOnly();
    categoryInput.value = customCategories[0]?.[0] || '';
    if (addCategory) addCategory.remove();
  }

  function enhanceSelect(select, accent = '#5d9fbd') {
    if (!select || select.dataset.cutePicker === 'yes') return;
    select.dataset.cutePicker = 'yes';
    select.classList.add('cute-picker-native');
    const shell = document.createElement('div');
    shell.className = 'cute-picker';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cute-picker-button';
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    const menu = document.createElement('div');
    menu.className = 'cute-picker-menu';
    menu.setAttribute('role', 'listbox');
    const close = () => { shell.classList.remove('open'); button.setAttribute('aria-expanded', 'false'); };
    const render = () => {
      const selected = select.selectedOptions?.[0];
      button.textContent = selected?.textContent || '選択してください';
      menu.innerHTML = '';
      [...select.options].forEach(option => {
        const choice = document.createElement('button');
        choice.type = 'button';
        choice.setAttribute('role', 'option');
        choice.textContent = option.textContent;
        choice.classList.toggle('selected', option.selected);
        choice.disabled = option.disabled;
        choice.onclick = () => {
          select.value = option.value;
          select.dispatchEvent(new Event('change', {bubbles:true}));
          render();
          close();
        };
        menu.append(choice);
      });
    };
    button.onclick = event => {
      event.stopPropagation();
      const open = shell.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    };
    shell.onclick = event => event.stopPropagation();
    document.addEventListener('click', close);
    select.addEventListener('change', render);
    new MutationObserver(render).observe(select, {childList:true, subtree:true, attributes:true});
    shell.append(button, menu);
    select.after(shell);
    render();
    const style = document.getElementById('cutePickerStyle') || document.head.appendChild(document.createElement('style'));
    style.id = 'cutePickerStyle';
    style.textContent = '.cute-picker-native{display:none!important}.cute-picker{position:relative;flex:1;min-width:0;--picker-accent:'+accent+'}.cute-picker-button{position:relative;width:100%;min-height:40px;padding:10px 34px 10px 12px;border:1px solid #e1e6e3;border-radius:12px;background:#fff;color:#4d5952;font:500 12px/1.2 -apple-system,BlinkMacSystemFont,sans-serif;text-align:left;cursor:pointer}.cute-picker-button:after{content:"⌄";position:absolute;right:12px;top:50%;transform:translateY(-54%);color:#98a19b;font-size:15px}.cute-picker-menu{position:absolute;z-index:1500;top:calc(100% + 7px);left:0;display:none;width:max-content;min-width:100%;max-width:min(280px,calc(100vw - 36px));padding:6px;border:1px solid #e3e8e5;border-radius:14px;background:#fff;box-shadow:0 14px 34px #26332c1c}.cute-picker.open .cute-picker-menu{display:grid;gap:3px}.cute-picker-menu button{padding:9px 11px;border:0;border-radius:9px;background:transparent;color:#5b655f;font:500 12px/1.2 -apple-system,BlinkMacSystemFont,sans-serif;text-align:left;white-space:nowrap;cursor:pointer}.cute-picker-menu button:hover,.cute-picker-menu button.selected{background:color-mix(in srgb,var(--picker-accent) 15%,#fff);color:color-mix(in srgb,var(--picker-accent) 78%,#26332c)}.cute-picker-menu button:disabled{opacity:.45;cursor:default}@media(max-width:620px){.cute-picker-menu{position:fixed;left:18px;right:18px;top:auto;bottom:18px;width:auto;max-width:none;padding:9px;border-radius:18px}.cute-picker-menu button{padding:13px 14px;font-size:14px}}';
  }

  enhanceSelect(categoryInput, '#8a70b2');
  enhanceSelect(document.getElementById('materialSelect'), '#4e9b70');
  const positionCategoryManager = () => {
    const categoryManageButton = document.querySelector('.category-manage');
    const categoryPicker = document.querySelector('.cute-picker');
    if (!categoryManageButton || !categoryPicker) return;
    categoryManageButton.textContent = '⚙︎';
    categoryManageButton.title = '属性を管理';
    categoryManageButton.setAttribute('aria-label', '属性を管理');
    if (categoryManageButton.previousElementSibling !== categoryPicker) categoryPicker.after(categoryManageButton);
    const gearStyle = document.getElementById('categoryManageGearStyle') || document.head.appendChild(document.createElement('style'));
    gearStyle.id = 'categoryManageGearStyle';
    gearStyle.textContent = '.category-manage{flex:none!important;display:inline-grid!important;place-items:center!important;width:36px!important;height:36px!important;margin-left:5px!important;padding:0!important;border:0!important;border-radius:11px!important;background:transparent!important;color:#a1aaa4!important;font-size:21px!important;line-height:1!important;cursor:pointer!important}.category-manage:hover{background:#f1f4f2!important;color:#637169!important}';
  };
  positionCategoryManager();
  setTimeout(positionCategoryManager, 0);
  document.getElementById('composer') && new MutationObserver(positionCategoryManager).observe(document.getElementById('composer'), {childList:true});
  if (current === 'study_time.html') {
    const primaryStudyButtonStyle = document.getElementById('studyPrimaryButtonStyle') || document.head.appendChild(document.createElement('style'));
    primaryStudyButtonStyle.id = 'studyPrimaryButtonStyle';
    primaryStudyButtonStyle.textContent = '#saveLog,.timer-row button.primary,#studyTimerApply,.study-alarm button,.new-material-form button,.study-log-actions button:not(.cancel-log):not(.delete-log){background:#8ec9e4!important;color:#1e5870!important;box-shadow:0 3px 10px #5ca9cd2b!important}.study-alarm #studyAlarmExtend{background:#eef8fc!important;color:#3e7891!important;box-shadow:inset 0 0 0 1px #b9ddec!important}#saveLog:hover,.timer-row button.primary:hover,#studyTimerApply:hover,.study-alarm button:hover,.new-material-form button:hover,.study-log-actions button:not(.cancel-log):not(.delete-log):hover{background:#7dbddd!important;color:#174d64!important}';
    const positionMaterialManager = () => {
      const manageButton = document.getElementById('manageMaterials');
      const materialsHeading = document.querySelector('.layout > .panel:first-child .panel-title');
      if (!manageButton || !materialsHeading) return false;
      manageButton.textContent = '⚙︎';
      manageButton.title = '教材を管理';
      manageButton.setAttribute('aria-label', '教材を管理');
      materialsHeading.append(manageButton);
      const materialGearStyle = document.getElementById('materialManageGearStyle') || document.head.appendChild(document.createElement('style'));
      materialGearStyle.id = 'materialManageGearStyle';
      materialGearStyle.textContent = '.layout>.panel:first-child .panel-title{display:flex!important;align-items:center!important;gap:5px}.layout>.panel:first-child .panel-title #manageMaterials{position:static!important;display:inline-grid!important;place-items:center!important;align-self:center!important;width:36px!important;height:36px!important;margin:0 0 0 auto!important;padding:0!important;border:0!important;border-radius:11px!important;background:transparent!important;color:#a1aaa4!important;font-size:21px!important;line-height:1!important;box-shadow:none!important;cursor:pointer!important}.layout>.panel:first-child .panel-title #manageMaterials:hover{background:#f1f4f2!important;color:#637169!important}';
      return true;
    };
    if (!positionMaterialManager()) {
      const materialObserver = new MutationObserver(() => {
        if (positionMaterialManager()) materialObserver.disconnect();
      });
      materialObserver.observe(document.body, {childList:true, subtree:true});
    }
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    if (hours && minutes && !document.querySelector('.study-time-field')) {
      function wrapTimeInput(input, labelText) {
        const field = document.createElement('label');
        field.className = 'study-time-field';
        input.before(field);
        field.append(input);
        const label = document.createElement('span');
        label.textContent = labelText;
        field.append(label);
        input.placeholder = '';
      }
      wrapTimeInput(hours, '時間');
      wrapTimeInput(minutes, '分');
      const timeStyle = document.createElement('style');
      timeStyle.textContent = '.study-time-field{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:7px;min-width:0;color:#68766e;font-size:12px}.study-time-field .input{min-width:0;width:100%}';
      document.head.append(timeStyle);
    }
    const recordGrid = document.querySelector('.form-grid');
    const materialSelect = document.getElementById('materialSelect');
    const materialPicker = materialSelect?.nextElementSibling;
    const hourField = document.getElementById('hours')?.closest('.study-time-field');
    const minuteField = document.getElementById('minutes')?.closest('.study-time-field');
    if (recordGrid && materialSelect && materialPicker && hourField && minuteField && !recordGrid.classList.contains('study-record-grid')) {
      recordGrid.classList.add('study-record-grid');
      const materialRow = document.createElement('div');
      materialRow.className = 'study-record-row study-record-material-row';
      materialRow.innerHTML = '<span class="study-record-label">教材</span>';
      const durationRow = document.createElement('div');
      durationRow.className = 'study-record-row study-record-duration-row';
      durationRow.innerHTML = '<span class="study-record-label">学習時間</span><div class="study-duration-inputs"></div>';
      materialRow.append(materialSelect, materialPicker);
      durationRow.querySelector('.study-duration-inputs').append(hourField, minuteField);
      recordGrid.prepend(durationRow);
      recordGrid.prepend(materialRow);
      const rowStyle = document.createElement('style');
      rowStyle.textContent = '.form-grid.study-record-grid{grid-template-columns:1fr 1fr!important;gap:10px!important}.study-record-row{grid-column:1/-1;display:grid;gap:6px}.study-record-label{color:#7c8880;font-size:11px;font-weight:700}.study-record-material-row .cute-picker{width:100%}.study-duration-inputs{display:grid;grid-template-columns:1fr 1fr;gap:9px}.study-duration-inputs .study-time-field{min-height:40px;padding:0 11px;border:1px solid #e1e6e3;border-radius:12px;background:#fff}.study-duration-inputs .study-time-field .input{padding:9px 0!important;border:0!important;background:transparent!important}@media(max-width:520px){.study-duration-inputs{grid-template-columns:1fr 1fr}}';
      document.head.append(rowStyle);
    }
  }
})();
