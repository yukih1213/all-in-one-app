(() => {
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
    .quick-add-link{display:inline-flex!important;background:#e4f4fb!important;color:#39748b!important}
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
  document.querySelectorAll('.page-nav,.nav').forEach(nav => {
    if (!nav.querySelector('a[href="habit_manager.html"]')) {
      const link = document.createElement('a');
      link.href = 'habit_manager.html';
      link.textContent = '習慣';
      link.className = 'habit-page-link';
      nav.append(link);
    }
    if (!nav.querySelector('a[href="quick_add.html"]')) {
      const link = document.createElement('a');
      link.href = 'quick_add.html';
      link.textContent = 'クイック追加';
      link.className = 'quick-add-link';
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
    if (addCategory) { addCategory.style.cssText += ';display:inline-flex!important;align-items:center;justify-content:center'; }
  }
  if (current === 'study_time.html') {
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
  }
})();
