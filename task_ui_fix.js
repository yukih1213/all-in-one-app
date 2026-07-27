(() => {
  if (window.__taskUiFixLoaded) return;
  window.__taskUiFixLoaded = true;
  const style = document.createElement('style');
  style.textContent = `
    .lane-add,.week-add{display:none!important}
    .board{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important}
    .lane-body{min-height:120px!important;padding:7px!important}
    .lane-head{padding-bottom:7px!important}
    .task{grid-template-columns:22px minmax(0,1fr) auto!important;gap:7px!important;padding:10px!important;margin-bottom:7px!important}
    .check{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:22px!important;height:22px!important;margin:0!important;padding:0!important;font-size:14px!important;font-weight:800!important;line-height:1!important;text-align:center!important;vertical-align:middle!important;transition:transform .16s ease,box-shadow .16s ease!important}
    .check.check-completing{background:#397f9a!important;border-color:#397f9a!important;color:#fff!important;box-shadow:0 3px 8px #397f9a44!important}
    .check.check-completing:after{content:none!important}
    .check-pop{animation:taskCheckPop .28s cubic-bezier(.2,.9,.25,1.35) both!important}@keyframes taskCheckPop{0%{transform:scale(.76)}60%{transform:scale(1.18)}100%{transform:scale(1)}}
    .task-title{min-height:18px!important;font-size:13px!important;line-height:1.35!important}
    .meta{display:grid!important;grid-template-columns:minmax(0,1fr) max-content max-content!important;align-items:center!important;gap:6px!important;min-width:0!important;white-space:nowrap!important;overflow:visible!important}
    .meta{margin-top:5px!important;font-size:9px!important}
    .meta .category{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;padding:2px 5px!important;font-size:9px!important}
    .meta .priority{font-size:9px!important}
    .meta .priority:before{width:5px!important;height:5px!important;margin-right:3px!important}
    .meta .spent{font-size:10px!important}
    .meta .spent{justify-self:end!important}
    .lane[data-lane="now"] .meta{display:flex!important;flex-direction:row!important;align-items:center!important;gap:6px!important;margin-top:4px!important}
    .lane[data-lane="now"] .meta .due.overdue{display:inline-flex!important;align-items:center!important;color:#e5484d!important}
    .lane[data-lane="now"] .lane-body{min-height:190px!important;padding:8px!important}
    .lane[data-lane="now"] .task{padding:8px 9px!important;gap:6px!important}
    .lane[data-lane="now"] .task-title{font-size:12px!important;line-height:1.35!important}
    .lane[data-lane="now"] .meta .category{display:inline-block!important}
    .lane[data-lane="now"] .meta .due{display:none!important}
    .lane[data-lane="now"] .meta .priority{order:1!important}
    .lane[data-lane="now"] .meta .spent{order:2!important;justify-self:auto!important;font-size:11px!important}
    .lane:not([data-lane="now"]) .spent,.lane:not([data-lane="now"]) .play,.lane:not([data-lane="now"]) .time-reset{display:none!important}
    .lane:not([data-lane="now"]) .task{padding:8px 9px!important;gap:6px!important}
    .lane:not([data-lane="now"]) .task-title{font-size:12px!important}
    .lane:not([data-lane="now"]) .meta{margin-top:4px!important}
    .lane-body,.lane[data-lane="now"] .lane-body{min-height:86px!important;padding:8px!important;background:#e9e9ec!important}
    .lane[data-lane="now"] .lane-body{min-height:0!important}
    .lane .empty{padding:13px 7px!important}
    .lane .task{margin-bottom:5px!important}
    .task .priority,.composer select[name="priority"]{display:none!important}
    .task-title{display:inline-block!important;padding-bottom:0!important;border-bottom:0!important}
    .task-editor label:has(select[name="priority"]){display:none!important}
    .lane[data-lane="now"] .lane-title{font-size:14px!important;color:var(--text)!important}
    .lane[data-lane="now"] .lane-body{background:#e9e9ec!important}
    .board{grid-template-rows:300px 210px!important;align-items:stretch!important}
    .lane{min-height:0!important;display:flex!important;flex-direction:column!important}
    .lane[data-lane="now"],.lane[data-lane="next"]{align-self:stretch!important}
    .lane[data-lane="now"] .lane-body,.lane[data-lane="next"] .lane-body,.lane[data-lane="overdue"] .lane-body,.lane[data-lane="inbox"] .lane-body,.lane[data-lane="waiting"] .lane-body{height:auto!important;min-height:0!important;flex:1!important;overflow-y:auto!important}
    .lane[data-lane="inbox"]{grid-row:span 2!important}
    .lane[data-lane="waiting"]{grid-column:span 2!important}
    .task .edit{display:none!important}
    .task .remove{font-size:22px!important;line-height:1!important;padding:2px 6px!important}
    .time-reset{font-size:15px!important;color:#8d9aa0!important}
    .task-no{display:none!important}
    .composer select[name="lane"]{display:none!important}
    @media(max-width:900px){.board{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
    @media(max-width:620px){.board{grid-template-columns:1fr!important}.lane-body{min-height:82px!important}}
  `;
  document.head.append(style);

  document.querySelectorAll('.lane-add,.week-add').forEach(button => button.remove());
  const board = document.getElementById('board');
  const weeklyBoardSection = document.getElementById('weeklyBoard');
  if (board && weeklyBoardSection && !document.getElementById('taskBoardSectionTitle')) {
    const sectionDivider = document.createElement('div');
    sectionDivider.className = 'notion-section-divider';
    const taskBoardTitle = document.createElement('h2');
    taskBoardTitle.id = 'taskBoardSectionTitle';
    taskBoardTitle.className = 'task-board-section-title';
    taskBoardTitle.textContent = 'タスクボード';
    board.before(sectionDivider, taskBoardTitle);
    const sectionStyle = document.createElement('style');
    sectionStyle.textContent = '.weekly-wrap{margin-bottom:14px!important}.notion-section-divider{width:100%;height:1px;margin:0 0 20px;background:#cfe5ef}.task-board-section-title{margin:0 0 11px;color:#497f96;font-size:16px;font-weight:700;letter-spacing:.01em}';
    document.head.append(sectionStyle);
  }
  if (board) new MutationObserver(() => document.querySelectorAll('.lane-add,.week-add').forEach(button => button.remove()))
    .observe(board, {childList:true, subtree:true});

  const form = document.getElementById('composer');
  const laneSelect = form?.querySelector('select[name="lane"]');
  if (form && laneSelect) {
    const dueInput = form.querySelector('input[name="due"]');
    const todayValue = () => { const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
    laneSelect.hidden = true;
    laneSelect.tabIndex = -1;
    if (dueInput && !dueInput.value) dueInput.value = todayValue();
    laneSelect.value = 'inbox';
    if (!document.getElementById('sectionInput')) {
      const sectionInput = document.createElement('select');
      sectionInput.id = 'sectionInput';
      sectionInput.setAttribute('aria-label', '追加するセクション');
      sectionInput.innerHTML = lanes.map(lane => '<option value="'+lane+'">'+labels[lane]+'</option>').join('');
      sectionInput.value = 'inbox';
      form.querySelector('input[name="title"]')?.after(sectionInput);
      sectionInput.addEventListener('change', () => {
        laneSelect.value = sectionInput.value;
        if (dueInput && sectionInput.value === 'now') dueInput.value = todayValue();
      });
      sectionInput.classList.add('section-native-hidden');
      const sectionPicker = document.createElement('div');
      sectionPicker.className = 'section-picker';
      const sectionButton = document.createElement('button');
      sectionButton.type = 'button';
      sectionButton.className = 'section-picker-button';
      sectionButton.setAttribute('aria-haspopup', 'listbox');
      sectionButton.setAttribute('aria-expanded', 'false');
      const sectionMenu = document.createElement('div');
      sectionMenu.className = 'section-picker-menu';
      sectionMenu.setAttribute('role', 'listbox');
      const availableSections = ['inbox', 'now', 'next', 'waiting'];
      const sectionNames = {inbox:'インボックス', now:'今やる', next:'今日やる', waiting:'対応待ち'};
      const syncSectionPicker = () => {
        sectionButton.textContent = sectionNames[sectionInput.value] || 'インボックス';
        sectionMenu.querySelectorAll('button').forEach(button => button.classList.toggle('selected', button.dataset.value === sectionInput.value));
      };
      const closeSectionPicker = () => {
        sectionPicker.classList.remove('open');
        sectionButton.setAttribute('aria-expanded', 'false');
      };
      availableSections.forEach(lane => {
        const option = document.createElement('button');
        option.type = 'button';
        option.dataset.value = lane;
        option.setAttribute('role', 'option');
        option.textContent = sectionNames[lane];
        option.addEventListener('click', () => {
          sectionInput.value = lane;
          sectionInput.dispatchEvent(new Event('change', {bubbles:true}));
          syncSectionPicker();
          closeSectionPicker();
        });
        sectionMenu.append(option);
      });
      sectionButton.addEventListener('click', event => {
        event.stopPropagation();
        const open = sectionPicker.classList.toggle('open');
        sectionButton.setAttribute('aria-expanded', String(open));
      });
      sectionPicker.addEventListener('click', event => event.stopPropagation());
      document.addEventListener('click', closeSectionPicker);
      sectionPicker.append(sectionButton, sectionMenu);
      sectionInput.after(sectionPicker);
      syncSectionPicker();
      const sectionCss = document.createElement('style');
      sectionCss.textContent = '#sectionInput.section-native-hidden{display:none!important}.section-picker{position:relative;flex:1;min-width:128px}.section-picker-button{position:relative;width:100%;min-height:40px;padding:10px 34px 10px 12px;border:1px solid #e1e6e3;border-radius:12px;background:#fff;color:#4d5952;font:500 12px/1.2 -apple-system,BlinkMacSystemFont,sans-serif;text-align:left;cursor:pointer}.section-picker-button:after{content:"⌄";position:absolute;right:12px;top:50%;transform:translateY(-54%);color:#98a19b;font-size:15px}.section-picker-menu{position:absolute;z-index:1000;top:calc(100% + 7px);left:0;display:none;width:148px;padding:6px;border:1px solid #e5e7e9;border-radius:13px;background:#fff;box-shadow:0 12px 30px #1d1d1f1c}.section-picker.open .section-picker-menu{display:grid;gap:3px}.section-picker-menu button{padding:9px 10px;border:0;border-radius:9px;background:transparent;color:#555b60;font:500 12px/1.2 -apple-system,BlinkMacSystemFont,sans-serif;text-align:left;cursor:pointer}.section-picker-menu button:hover,.section-picker-menu button.selected{background:#eaf7fc;color:#39748b}@media(max-width:620px){.section-picker{order:5}.section-picker-menu{position:fixed;left:18px;right:18px;top:auto;bottom:18px;width:auto;padding:9px;border-radius:18px}.section-picker-menu button{padding:13px 14px;font-size:14px}}';
      document.head.append(sectionCss);
      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const title = form.querySelector('input[name="title"]')?.value.trim();
        if (!title) return;
        tasks.push({
          id:Date.now(), title, lane:sectionInput.value,
          category:form.querySelector('[name="category"]')?.value || '',
          priority:form.querySelector('[name="priority"]')?.value || 'medium',
          due:sectionInput.value === 'now' ? todayValue() : (dueInput?.value || todayValue()),
          done:false, spent:0, running:false, started:0
        });
        save();
        form.reset();
        sectionInput.value = 'inbox';
        laneSelect.value = 'inbox';
        if (dueInput) dueInput.value = todayValue();
        syncSectionPicker();
        form.querySelector('[name="priority"]').value = 'medium';
        form.querySelector('[name="category"]').value = '';
        form.querySelector('[name="category"]').dispatchEvent(new Event('change', {bubbles:true}));
        render();
      }, true);
    }
  }

  const categoryColorKey = 'kanban-category-colors-v1';
  const categoryColors = JSON.parse(localStorage.getItem(categoryColorKey) || '{}');
  const categoryNameKey = 'kanban-category-names-v1';
  const categoryNames = JSON.parse(localStorage.getItem(categoryNameKey) || '{}');
  const categoryLabelState = typeof categoryLabels === 'object' ? categoryLabels : {};
  Object.assign(categoryLabelState, categoryNames);
  const colorChoices = ['#ac725e','#d06b64','#f83a22','#fa573c','#ff7537','#ffad46','#42d692','#16a765','#7bd148','#b3dc6c','#fbe983','#fad165','#92e1c0','#9fe1e7','#9fc6e7','#4986e7','#9a9cff','#b99aff','#c2c2c2','#f691b2'];
  function categoryColor(id) {
    return categoryColors[id] || ({school:'#aecbfa',career:'#fbbc04',private:'#d7aefb',other:'#cbf0f8'}[id] || '#e5e7eb');
  }
  function paintCategoryColors() {
    document.querySelectorAll('.task .category').forEach(tag => {
      const card = tag.closest('.task');
      const task = tasks.find(item => item.id === Number(card?.dataset.id));
      if (!task) return;
      tag.style.background = categoryColor(task.category);
      tag.style.color = '#3e454a';
    });
  }
  new MutationObserver(paintCategoryColors).observe(document.getElementById('board'), {childList:true, subtree:true});
  paintCategoryColors();

  const categoryButton = document.createElement('button');
  categoryButton.type = 'button';
  categoryButton.className = 'category-manage';
  categoryButton.textContent = '属性を管理';
  form?.querySelector('[name="category"]')?.after(categoryButton);
  const categoryModal = document.createElement('div');
  categoryModal.className = 'category-modal';
  categoryModal.innerHTML = '<section class="category-sheet"><button class="category-close" type="button" aria-label="閉じる">×</button><h2>属性を管理</h2><div class="category-add"><input id="newCategoryName" maxlength="20" placeholder="新しい属性名"><button id="categoryColorTrigger" class="category-current-color" type="button" aria-label="色を選ぶ"></button><div id="categoryColors" class="category-colors"></div><button id="saveCategory" type="button">属性を追加</button></div><div id="categoryList" class="category-list"></div></section>';
  document.body.append(categoryModal);
  const categoryCss = document.createElement('style');
  categoryCss.textContent = '.category-manage{padding:6px 8px;border:0;border-radius:8px;background:#f0f0f2;color:#667;font-size:10px}.category-modal{display:none;position:fixed;inset:0;z-index:1250;padding:24px;background:#1d1d1f3b;align-items:center;justify-content:center}.category-modal.open{display:flex}.category-sheet{position:relative;width:min(440px,100%);padding:24px;background:#fff;border-radius:20px;box-shadow:0 20px 60px #1d1d1f30}.category-sheet h2{margin:0 0 17px;font-size:19px}.category-close{position:absolute;top:14px;right:14px;width:30px;height:30px;border:0;border-radius:50%;background:#f0f0f2;color:#666;font-size:20px}.category-add{display:grid;gap:10px}.category-add input{padding:10px;border:1px solid #e5e5e7;border-radius:10px;font:inherit}.category-current-color{width:28px;height:28px!important;padding:0!important;border:3px solid #fff!important;border-radius:50%!important;box-shadow:0 0 0 1px #d9d9de}.category-colors{display:none;gap:8px;flex-wrap:nowrap;overflow-x:auto;padding:3px;scrollbar-width:none}.category-colors::-webkit-scrollbar,.category-row-colors::-webkit-scrollbar{display:none}.category-colors.open{display:flex}.category-color{flex:0 0 auto;width:22px;height:22px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px #d9d9de}.category-color.selected{box-shadow:0 0 0 3px #5d9fbd}.category-add>button:not(.category-current-color){padding:10px;border:0;border-radius:10px;background:#5d9fbd;color:#fff;font-weight:700}.category-list{display:grid;gap:7px;margin-top:17px}.category-row{display:grid;grid-template-columns:1fr;gap:7px;padding:10px 0;border-top:1px solid #eee}.category-name-edit{padding:8px 9px;border:1px solid #e5e5e7;border-radius:8px;font:inherit;font-size:12px}.category-row-header{display:flex;align-items:center;gap:8px}.category-row-colors{display:none;gap:6px;overflow-x:auto;padding:2px;scrollbar-width:none}.category-row-colors.open{display:flex}.category-row-colors button{flex:0 0 auto;width:18px;height:18px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px #d9d9de}.category-row-colors button.selected{box-shadow:0 0 0 3px #5d9fbd}.category-row-trigger{width:22px;height:22px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px #d9d9de}';
  document.head.append(categoryCss);
  let selectedCategoryColor = colorChoices[0];
  function renderCategoryManager() {
    document.getElementById('categoryColors').innerHTML = colorChoices.map(color => '<button class="category-color '+(color === selectedCategoryColor ? 'selected':'')+'" type="button" data-color="'+color+'" style="background:'+color+'"></button>').join('');
    document.getElementById('categoryColorTrigger').style.background = selectedCategoryColor;
    document.getElementById('categoryColorTrigger').onclick = () => {
      document.getElementById('categoryColors').classList.toggle('open');
      document.querySelectorAll('.category-row-colors').forEach(colors => colors.classList.remove('open'));
    };
    document.querySelectorAll('.category-color').forEach(button => button.onclick = () => { selectedCategoryColor = button.dataset.color; document.getElementById('categoryColors').classList.remove('open'); renderCategoryManager(); });
    const allCategories = [...customCategories];
    document.getElementById('categoryList').innerHTML = allCategories.map(([id,label]) => '<div class="category-row" data-category-id="'+id+'"><div class="category-row-header"><button class="category-row-trigger" type="button" style="background:'+categoryColor(id)+'"></button><input class="category-name-edit" maxlength="20" value="'+esc(label)+'"></div><div class="category-row-colors">'+colorChoices.map(color => '<button type="button" class="'+(categoryColor(id)===color?'selected':'')+'" data-color="'+color+'" style="background:'+color+'"></button>').join('')+'</div></div>').join('');
    document.querySelectorAll('.category-row').forEach(row => {
      const id = row.dataset.categoryId;
      row.querySelector('.category-row-trigger').onclick = () => {
        row.querySelector('.category-row-colors').classList.toggle('open');
        document.querySelectorAll('.category-row-colors').forEach(colors => { if (!row.contains(colors)) colors.classList.remove('open'); });
        document.getElementById('categoryColors').classList.remove('open');
      };
      row.querySelector('.category-name-edit').onchange = event => {
        const name = event.target.value.trim();
        if (!name) return;
        const custom = customCategories.find(item => item[0] === id);
        if (custom) { custom[1] = name; saveCategories(); }
        else { categoryLabelState[id] = name; categoryNames[id] = name; localStorage.setItem(categoryNameKey, JSON.stringify(categoryNames)); }
        refreshCategories(); render(); paintCategoryColors();
      };
      row.querySelectorAll('[data-color]').forEach(button => button.onclick = () => {
        categoryColors[id] = button.dataset.color;
        localStorage.setItem(categoryColorKey, JSON.stringify(categoryColors));
        refreshCategories(); render(); paintCategoryColors(); renderCategoryManager();
      });
    });
  }
  categoryButton.onclick = () => { renderCategoryManager(); categoryModal.classList.add('open'); };
  categoryModal.onclick = event => { if (event.target === categoryModal || event.target.closest('.category-close')) categoryModal.classList.remove('open'); };
  document.getElementById('saveCategory').onclick = () => {
    const input = document.getElementById('newCategoryName');
    const label = input.value.trim();
    if (!label) return;
    const id = 'custom_'+Date.now();
    customCategories.push([id,label]);
    categoryColors[id] = selectedCategoryColor;
    saveCategories();
    localStorage.setItem(categoryColorKey, JSON.stringify(categoryColors));
    refreshCategories();
    input.value = '';
    renderCategoryManager();
  };

  if (!lanes.includes('overdue')) lanes.push('overdue');
  labels.overdue = '期限超過';
  labels.next = '今日やる';
  let compactedSections = false;
  tasks.forEach(task => {
    if (task.lane === 'later' || task.lane === 'someday') {
      task.lane = 'inbox';
      compactedSections = true;
    }
  });
  if (compactedSections) save();
  ['later','someday'].forEach(lane => {
    const index = lanes.indexOf(lane);
    if (index >= 0) lanes.splice(index, 1);
  });
  const sectionPicker = document.getElementById('sectionInput');
  if (sectionPicker) {
    sectionPicker.innerHTML = lanes.filter(lane => lane !== 'overdue').map(lane => '<option value="'+lane+'">'+labels[lane]+'</option>').join('');
    sectionPicker.value = 'inbox';
  }
  const overdueStyle = document.createElement('style');
  overdueStyle.textContent = '.board{grid-template-columns:repeat(3,minmax(0,1fr))!important}.lane[data-lane="overdue"]{display:none!important;order:3!important}.lane[data-lane="overdue"].has-overdue{display:flex!important}.lane[data-lane="now"]{order:1!important}.lane[data-lane="next"]{order:2!important}.lane[data-lane="inbox"]{order:4!important}.lane[data-lane="waiting"]{order:5!important;grid-column:span 2!important}.board.has-overdue{grid-template-columns:repeat(4,minmax(0,1fr))!important}.board.has-overdue .lane[data-lane="overdue"]{align-self:stretch!important}.board.has-overdue .lane[data-lane="inbox"]{grid-row:span 2!important}.board.has-overdue .lane[data-lane="waiting"]{grid-column:span 3!important}.lane[data-lane="overdue"] .lane-title{color:#c65a5e!important}.lane[data-lane="overdue"] .lane-body{padding:8px!important;background:#f5e5e5!important}#sectionInput{appearance:auto!important;background:transparent!important;color:#86868b!important;border:0!important;border-left:1px solid #e5e5e7!important;border-radius:0!important;padding:11px 12px!important;font-size:12px!important;font-weight:400!important}';
  document.head.append(overdueStyle);
  function updateSectionLayout() {
    const hasOverdue = tasks.some(task => task.lane === 'overdue');
    document.querySelector('.lane[data-lane="overdue"]')?.classList.toggle('has-overdue', hasOverdue);
    document.getElementById('board')?.classList.toggle('has-overdue', hasOverdue);
    document.querySelectorAll('.lane[data-lane="next"] .lane-title').forEach(title => title.textContent = '今日やる');
  }

  function syncOverdueTasks() {
    const today = new Date();
    today.setHours(0,0,0,0);
    let changed = false;
    tasks.forEach(task => {
      if (task.userAssignedLane) return;
      const overdue = task.due && !task.done && new Date(task.due + 'T23:59:59') < today;
      if (overdue && task.lane !== 'overdue') {
        task.laneBeforeOverdue = task.lane;
        task.lane = 'overdue';
        task.wasOverdue = true;
        changed = true;
      } else if (!overdue && task.lane === 'overdue') {
        task.lane = task.laneBeforeOverdue || 'inbox';
        delete task.laneBeforeOverdue;
        changed = true;
      }
    });
    if (changed) save();
  }

  // ドラッグ＆ドロップでレーン移動した際に userAssignedLane を記録
  document.addEventListener('drop', e => {
    const laneZone = e.target.closest('.lane-body');
    if (!laneZone || typeof dragId === 'undefined' || !dragId) return;
    const targetTask = tasks.find(x => String(x.id) === String(dragId));
    if (targetTask) {
      targetTask.userAssignedLane = true;
      save();
    }
  }, true);

  const baseRender = render;
  let lastRenderKey = '';
  function prioritySort() {}
  function renderKey() {
    return tasks.map(task => [task.id,task.lane,task.title,task.category,task.priority,task.due,task.done,task.spent,task.running]).join('|');
  }
  function refreshRunningTimes() {
    tasks.filter(task => task.running).forEach(task => {
      const total = task.spent + Math.floor((Date.now() - task.started) / 1000);
      const label = document.querySelector('.task[data-id="'+task.id+'"] .spent');
      if (label) label.textContent = '⏱ ' + time(total);
    });
  }
  function preserveOverdueLabels() {
    document.querySelectorAll('.task').forEach(card => {
      const task = tasks.find(item => String(item.id) === String(card.dataset.id));
      if (!task) return;
      const due = card.querySelector('.due');
      if (!due) return;
      const overdue = task.wasOverdue || task.lane === 'overdue';
      due.classList.toggle('overdue', overdue);
      if (overdue) {
        const dateText = task.due ? date(task.due) : '';
        due.textContent = dateText ? `期限切れ · ${dateText}` : '期限切れ';
      }
    });
  }
  render = function() {
    syncOverdueTasks();
    prioritySort();
    const nextKey = renderKey();
    if (nextKey === lastRenderKey && tasks.some(task => task.running)) {
      refreshRunningTimes();
      preserveOverdueLabels();
      return;
    }
    baseRender();
    lastRenderKey = renderKey();
    updateSectionLayout();
    preserveOverdueLabels();
  };
  syncOverdueTasks();
  prioritySort();
  baseRender();
  lastRenderKey = renderKey();
  updateSectionLayout();

  function addTimeResetButtons() {
    document.querySelectorAll('.task').forEach(card => {
      if (card.querySelector('.time-reset')) return;
      const button = document.createElement('button');
      button.className = 'icon time-reset';
      button.type = 'button';
      button.textContent = '↺';
      button.title = '計測時間をリセット';
      button.setAttribute('aria-label', '計測時間をリセット');
      button.onclick = event => {
        event.stopPropagation();
        const task = tasks.find(item => item.id === Number(card.dataset.id));
        if (!task) return;
        task.spent = 0; task.running = false; task.started = 0;
        save(); render();
      };
      card.querySelector('.actions')?.insertBefore(button, card.querySelector('.remove'));
    });
  }
  new MutationObserver(addTimeResetButtons).observe(document.getElementById('board'), {childList:true, subtree:true});
  addTimeResetButtons();

  function paintPriorityLines() {
    document.querySelectorAll('.task').forEach(card => {
      const task = tasks.find(item => item.id === Number(card.dataset.id));
      if (task) card.dataset.priority = task.priority;
    });
  }
  new MutationObserver(paintPriorityLines).observe(document.getElementById('board'), {childList:true, subtree:true});
  paintPriorityLines();

  const editorModal = document.createElement('div');
  editorModal.className = 'task-editor-modal';
  editorModal.innerHTML = '<form class="task-editor" id="taskEditor"><button type="button" class="task-editor-close" aria-label="閉じる">×</button><h2>タスクを編集</h2><label>タスク名<input name="title" required maxlength="100"></label><label>属性<select name="category"></select></label><label>優先度<select name="priority"><option value="high">高</option><option value="medium">中</option><option value="low">低</option></select></label><label>締切<input name="due" type="date"></label><button class="task-editor-save">保存</button></form>';
  document.body.append(editorModal);
  const editorCss = document.createElement('style');
  editorCss.textContent = '.task-editor-modal{display:none;position:fixed;inset:0;z-index:1200;padding:24px;background:#1d1d1f3b;align-items:center;justify-content:center}.task-editor-modal.open{display:flex}.task-editor{position:relative;width:min(410px,100%);padding:24px;background:#fff;border-radius:20px;box-shadow:0 20px 60px #1d1d1f30}.task-editor h2{margin:0 0 18px;font-size:19px}.task-editor label{display:grid;gap:6px;margin:12px 0;color:#666;font-size:12px}.task-editor input,.task-editor select{width:100%;padding:9px 10px;border:1px solid #e5e5e7;border-radius:10px;background:#fff;color:#1d1d1f;font:inherit}.task-editor-close{position:absolute;right:14px;top:14px;width:30px;height:30px;border:0;border-radius:50%;background:#f0f0f2;color:#666;font-size:20px}.task-editor-save{width:100%;margin-top:9px;padding:10px;border:0;border-radius:10px;background:#5d9fbd;color:#fff;font:inherit;font-weight:700}';
  document.head.append(editorCss);
  let editingId = null;
  function openEditor(id) {
    const task = tasks.find(item => item.id === id);
    if (!task) return;
    editingId = id;
    const form = editorModal.querySelector('form');
    form.title.value = task.title;
    form.category.innerHTML = [['','属性なし'],...customCategories].map(([value,label]) => '<option value="'+value+'">'+esc(label)+'</option>').join('');
    form.category.value = task.category;
    form.priority.value = task.priority;
    form.due.value = task.due || '';
    editorModal.classList.add('open');
    form.title.focus();
  }
  document.getElementById('board').addEventListener('click', event => {
    if (event.target.closest('button')) return;
    const card = event.target.closest('.task');
    if (card) openEditor(Number(card.dataset.id));
  });
  const editTapStyle = document.createElement('style');
  editTapStyle.textContent = '.lane .task{cursor:pointer!important}.lane .task:active{transform:scale(.995)}';
  document.head.append(editTapStyle);
  function bindAllCardEditors() {
    document.querySelectorAll('#board .task').forEach(card => {
      if (card.dataset.editTapBound) return;
      card.dataset.editTapBound = 'true';
      card.addEventListener('click', event => {
        if (event.target.closest('button')) return;
        event.stopPropagation();
        openEditor(Number(card.dataset.id));
      });
    });
  }
  new MutationObserver(bindAllCardEditors).observe(document.getElementById('board'), {childList:true, subtree:true});
  bindAllCardEditors();
  editorModal.onclick = event => { if (event.target === editorModal || event.target.closest('.task-editor-close')) editorModal.classList.remove('open'); };
  editorModal.querySelector('form').onsubmit = event => {
    event.preventDefault();
    const task = tasks.find(item => item.id === editingId);
    if (!task) return;
    const form = event.currentTarget;
    task.title = form.title.value.trim();
    task.category = form.category.value;
    task.priority = form.priority.value;
    task.due = form.due.value;
    save(); render(); editorModal.classList.remove('open');
  };

  const archiveKey = 'kanban-task-archive-v1';
  let archive = JSON.parse(localStorage.getItem(archiveKey) || '[]');
  let undoTimer;
  function playCompletionTick() {
    const sound = new Audio('completion-sound.wav');
    sound.volume = .65;
    sound.play().catch(() => {});
  }
  function completeWithFeedback(check, complete) {
    if (!check || check.dataset.completing) return;
    check.dataset.completing = 'true';
    playCompletionTick();
    check.classList.remove('check-pop');
    void check.offsetWidth;
    check.classList.add('check-completing', 'check-pop');
    check.textContent = '✓';
    setTimeout(complete, 180);
  }
  function saveArchive() { localStorage.setItem(archiveKey, JSON.stringify(archive)); }
  function startOf(period) {
    const now = new Date();
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === 'today') return day;
    if (period === 'week') { day.setDate(day.getDate() - ((day.getDay() + 6) % 7)); return day; }
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  function archiveTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index < 0) return;
    const [task] = tasks.splice(index, 1);
    archive.unshift({...task, archivedIndex:index, done:true, running:false, started:0, completedAt:Date.now()});
    save(); saveArchive(); render(); updateArchiveStats();
    showUndo(task.id);
  }
  const undoToast = document.createElement('div');
  undoToast.className = 'undo-toast';
  undoToast.innerHTML = '<span>タスクを完了しました</span><button>元に戻す</button>';
  document.body.append(undoToast);
  const undoCss = document.createElement('style');
  undoCss.textContent = '.undo-toast{position:fixed;right:22px;bottom:22px;z-index:1100;display:flex;align-items:center;gap:12px;padding:10px 12px 10px 15px;border-radius:13px;background:#27343a;color:#fff;font-size:12px;box-shadow:0 12px 30px #1d1d1f2b;opacity:0;transform:translateY(10px);pointer-events:none;transition:.2s}.undo-toast.show{opacity:1;transform:none;pointer-events:auto}.undo-toast button{border:0;border-radius:8px;padding:6px 9px;background:#dff2fa;color:#39748b;font-weight:700;font-size:12px}';
  document.head.append(undoCss);
  function restoreArchivedTask(id) {
    const index = archive.findIndex(task => task.id === id);
    if (index < 0) return;
    const [task] = archive.splice(index, 1);
    const restoreIndex = Number.isInteger(task.archivedIndex) ? Math.min(task.archivedIndex, tasks.length) : tasks.length;
    tasks.splice(restoreIndex, 0, {...task, lane:task.lane || 'inbox', done:false, completedAt:null, running:false, started:0});
    save(); saveArchive(); render(); updateArchiveStats();
  }
  function showUndo(id) {
    clearTimeout(undoTimer);
    undoToast.classList.add('show');
    undoToast.querySelector('button').onclick = () => {
      restoreArchivedTask(id);
      undoToast.classList.remove('show');
      clearTimeout(undoTimer);
    };
    undoTimer = setTimeout(() => undoToast.classList.remove('show'), 10000);
  }
  function updateArchiveStats() {
    [['doneToday','today'],['doneWeek','week'],['doneMonth','month']].forEach(([id, period]) => {
      const target = document.getElementById(id);
      if (target) target.textContent = archive.filter(task => new Date(task.completedAt) >= startOf(period)).length;
    });
  }
  document.getElementById('board')?.addEventListener('click', event => {
    const check = event.target.closest('.check');
    if (!check) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const task = check.closest('.task');
    if (task) completeWithFeedback(check, () => archiveTask(Number(task.dataset.id)));
  }, true);

  const modal = document.createElement('div');
  modal.className = 'archive-modal';
  modal.innerHTML = '<section class="archive-sheet" role="dialog" aria-modal="true"><button class="archive-close" aria-label="閉じる">×</button><h2 id="archiveTitle">完了タスク</h2><div id="archiveList"></div></section>';
  document.body.append(modal);
  const archiveCss = document.createElement('style');
  archiveCss.textContent = '.stat{cursor:pointer}.stat:hover{transform:translateY(-1px)}.archive-modal{display:none;position:fixed;inset:0;z-index:1000;padding:24px;background:#1d1d1f3b;align-items:center;justify-content:center}.archive-modal.open{display:flex}.archive-sheet{position:relative;width:min(560px,100%);max-height:min(650px,85vh);overflow:auto;padding:25px;background:#fff;border-radius:20px;box-shadow:0 20px 60px #1d1d1f30}.archive-sheet h2{margin:0 0 18px;font-size:20px}.archive-close{position:absolute;top:15px;right:15px;width:30px;height:30px;border:0;border-radius:50%;background:#f0f0f2;color:#666;font-size:20px}.archive-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #eee}.archive-row:last-child{border:0}.archive-info{min-width:0}.archive-name{font-weight:650;word-break:break-word}.archive-date{margin-top:3px;color:#86868b;font-size:11px}.restore{flex:0 0 auto;padding:7px 10px;border:0;border-radius:9px;background:#e4f4fb;color:#39748b;font-size:12px}.archive-empty{padding:34px 0;text-align:center;color:#86868b;font-size:13px}';
  document.head.append(archiveCss);
  function openArchive(period) {
    const names = {today:'今日完了',week:'今週完了',month:'今月完了'};
    const list = archive.filter(task => new Date(task.completedAt) >= startOf(period));
    document.getElementById('archiveTitle').textContent = names[period];
    const root = document.getElementById('archiveList');
    root.innerHTML = list.length ? list.map(task => '<div class="archive-row" data-id="'+task.id+'"><div class="archive-info"><div class="archive-name">'+esc(task.title)+'</div><div class="archive-date">'+new Date(task.completedAt).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})+' に完了</div></div><button class="restore">タスクに戻す</button></div>').join('') : '<div class="archive-empty">この期間に完了したタスクはありません</div>';
    modal.classList.add('open');
  }
  document.getElementById('archiveList').onclick = event => {
    const row = event.target.closest('.archive-row');
    if (!row || !event.target.closest('.restore')) return;
    const index = archive.findIndex(task => task.id === Number(row.dataset.id));
    if (index < 0) return;
    restoreArchivedTask(Number(row.dataset.id));
    row.remove();
  };
  modal.onclick = event => { if (event.target === modal || event.target.closest('.archive-close')) modal.classList.remove('open'); };
  [['doneToday','today'],['doneWeek','week'],['doneMonth','month']].forEach(([id, period]) => {
    const stat = document.getElementById(id)?.closest('.stat');
    if (stat) stat.onclick = () => openArchive(period);
  });
  tasks.filter(task => task.done).forEach(task => {
    archive.unshift({...task, done:true, running:false, started:0, completedAt:task.completedAt || Date.now()});
  });
  if (tasks.some(task => task.done)) { tasks = tasks.filter(task => !task.done); save(); saveArchive(); render(); }
  updateArchiveStats();
  setInterval(updateArchiveStats, 15000);

  const weeklySection = document.getElementById('weeklyBoard');
  const legacyWeekRoot = document.getElementById('weekColumns');
  let weekRoot = null;
  let weekSizeButton = null;
  let calendarMode = false;
  let calendarOpen = true;
  let viewToggle = null;
  if (weeklySection && legacyWeekRoot) {
    legacyWeekRoot.id = 'weekColumnsDisabled';
    weekRoot = document.createElement('div');
    weekRoot.id = 'interactiveWeekColumns';
    weekRoot.className = 'weekly-board';
    legacyWeekRoot.replaceWith(weekRoot);
    document.getElementById('weekHeightToggle')?.remove();
    const weeklyTitle = weeklySection.querySelector('.weekly-title');
    // 既存の「今週のタスク」は、週次/月次の切り替え見出しに置き換える。
    weeklyTitle.textContent = '';
    viewToggle = document.createElement('span');
    viewToggle.className = 'calendar-view-toggle';
    viewToggle.innerHTML = '<button type="button" data-view="weekly">週次カレンダー</button><button type="button" data-view="monthly">月次カレンダー</button>';
    weeklyTitle.prepend(viewToggle);
    weekSizeButton = document.createElement('button');
    weekSizeButton.textContent = 'カレンダーを閉じる';
    weekSizeButton.className = 'week-size-toggle';
    weeklyTitle.append(weekSizeButton);
    const weeklyCss = document.createElement('style');
    weeklyCss.textContent = `
      .weekly-title{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important}
      .week-size-toggle{padding:7px 11px;border:1px solid #d4d5d8;border-radius:9px;background:#eeeeef;color:#1d1d1f;font-size:11px;font-weight:700;box-shadow:0 2px 7px #1d1d1f0d;cursor:pointer;transition:transform .15s ease,box-shadow .15s ease,background .15s ease}
      .week-size-toggle:hover{background:#e2e2e4}
      .calendar-view-toggle{display:inline-flex;align-items:center;gap:8px;margin-left:2px}
      .calendar-view-toggle button{order:1;padding:0;border:0;background:transparent;color:#aaa4b0;font-size:12px;font-weight:650;cursor:pointer}
      .calendar-view-toggle button.active{order:0;color:#3f3a46;font-size:15px;font-weight:780}
      .calendar-view-toggle button:hover{color:#39748b}
      .weekly-board{display:none!important}
      .weekly-board.open{display:grid!important;align-items:stretch!important}
      .weekly-board .week-day{height:auto!important;min-height:138px!important;max-height:none!important;overflow:visible!important}
      .week-day>div:first-child{position:sticky;top:-9px;z-index:2;margin:-9px -9px 3px;padding:9px;background:#e9e9ec;border-radius:15px 15px 0 0}
      .week-day.today>div:first-child{background:#e2f3fa}
      .week-task{display:grid!important;grid-template-columns:22px minmax(0,1fr)!important;gap:7px!important;align-items:start!important;cursor:grab;user-select:none}
      .week-task.dragging{opacity:.45}
      .week-check{display:grid;place-items:center;width:22px;height:22px;margin-top:0;padding:0;border:1.5px solid #b8bbc1;border-radius:50%;background:#fff;color:#fff;font-size:14px;font-weight:800;line-height:1;transition:transform .16s ease,box-shadow .16s ease}
      .week-check.check-completing{background:#397f9a;border-color:#397f9a;box-shadow:0 3px 8px #397f9a44}
      .week-card-title{font-size:11px;line-height:1.35;word-break:break-word}
      .week-card-meta{display:flex;align-items:center;gap:5px;margin-top:5px;font-size:9px;color:#777}
      .week-card-category{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:2px 5px;border-radius:5px}
      .week-day.week-drop{box-shadow:inset 0 0 0 2px #69b3d1;background:#e8f5fa!important}
      .task-calendar-drop{outline:2px solid #69b3d1;outline-offset:-2px;background:#e8f5fa!important}
    `;
    document.head.append(weeklyCss);
    let weeklyDragId = null;
    function weekIso(date) { return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,10); }
    function drawInteractiveWeek() {
      const base = new Date(), todayKey = weekIso(base), jp = ['日','月','火','水','木','金','土'];
      weekRoot.innerHTML = '';
      for (let i=0;i<7;i++) {
        const date = new Date(base);
        date.setDate(base.getDate()+i);
        const key = weekIso(date), items = tasks.filter(task => task.due === key);
        const column = document.createElement('div');
        column.className = 'week-day'+(key===todayKey?' today':'');
        column.dataset.date = key;
        column.innerHTML = '<div><span class="week-date">'+(date.getMonth()+1)+'/'+date.getDate()+'</span><span class="week-weekday">('+jp[date.getDay()]+')</span></div>'+(items.length?items.map(task => '<article class="week-task" draggable="true" data-id="'+task.id+'"><button class="week-check" aria-label="完了"></button><div><div class="week-card-title">'+esc(task.title)+'</div><div class="week-card-meta"><span class="week-card-category" style="background:'+categoryColor(task.category)+'">'+esc(getCategoryLabel(task.category))+'</span></div></div></article>').join(''):'<div class="week-empty">予定なし</div>');
        column.ondragover = event => { event.preventDefault(); column.classList.add('week-drop'); };
        column.ondragleave = event => { if (!column.contains(event.relatedTarget)) column.classList.remove('week-drop'); };
        column.ondrop = event => {
          event.preventDefault();
          column.classList.remove('week-drop');
          const task = tasks.find(item => item.id === weeklyDragId);
          if (!task) return;
          task.due = column.dataset.date;
          save();
          render();
          drawInteractiveWeek();
        };
        weekRoot.append(column);
      }
      weekRoot.querySelectorAll('.week-task').forEach(card => {
        card.ondragstart = () => { weeklyDragId = Number(card.dataset.id); card.classList.add('dragging'); };
        card.ondragend = () => { weeklyDragId = null; card.classList.remove('dragging'); weekRoot.querySelectorAll('.week-drop').forEach(column => column.classList.remove('week-drop')); };
        card.onclick = event => {
          if (event.target.closest('.week-check')) return;
          openEditor(Number(card.dataset.id));
        };
        card.querySelector('.week-check').onclick = event => {
          event.stopPropagation();
          const check = event.currentTarget;
          completeWithFeedback(check, () => {
            archiveTask(Number(card.dataset.id));
            drawInteractiveWeek();
          });
        };
      });
    }
    new MutationObserver(drawInteractiveWeek).observe(document.getElementById('board'), {childList:true});
    drawInteractiveWeek();
  }

  const historyToolbar = document.createElement('div');
  historyToolbar.className = 'task-history-toolbar';
  historyToolbar.innerHTML = '<button type="button" class="task-history-undo" aria-label="元に戻す" title="元に戻す（⌘Z）">←</button><button type="button" class="task-history-redo" aria-label="やり直す" title="やり直す（⌘⇧Z）">→</button>';
  document.body.append(historyToolbar);
  const historyStyle = document.createElement('style');
  historyStyle.textContent = '.task-history-toolbar{display:none!important}';
  document.head.append(historyStyle);

  const undoButton = historyToolbar.querySelector('.task-history-undo');
  const redoButton = historyToolbar.querySelector('.task-history-redo');
  const undoHistory = [];
  const redoHistory = [];
  const originalSaveTasks = save;
  const originalSaveArchive = saveArchive;
  const cloneHistoryState = () => ({
    tasks: JSON.parse(JSON.stringify(tasks)),
    archive: JSON.parse(JSON.stringify(archive))
  });
  const historySignature = state => JSON.stringify({
    tasks: state.tasks.map(({spent, running, started, ...task}) => task),
    archive: state.archive
  });
  let committedHistoryState = cloneHistoryState();
  let restoringHistory = false;
  function updateHistoryButtons() {
    undoButton.disabled = undoHistory.length === 0;
    redoButton.disabled = redoHistory.length === 0;
  }
  function captureHistoryChange() {
    if (restoringHistory) return;
    const current = cloneHistoryState();
    if (historySignature(current) === historySignature(committedHistoryState)) {
      committedHistoryState = current;
      return;
    }
    undoHistory.push(committedHistoryState);
    if (undoHistory.length > 50) undoHistory.shift();
    redoHistory.length = 0;
    committedHistoryState = current;
    updateHistoryButtons();
  }
  save = function() {
    captureHistoryChange();
    originalSaveTasks();
  };
  saveArchive = function() {
    captureHistoryChange();
    originalSaveArchive();
  };
  function restoreHistoryState(state) {
    restoringHistory = true;
    tasks = JSON.parse(JSON.stringify(state.tasks));
    archive = JSON.parse(JSON.stringify(state.archive));
    committedHistoryState = cloneHistoryState();
    originalSaveTasks();
    originalSaveArchive();
    render();
    updateArchiveStats();
    restoringHistory = false;
    updateHistoryButtons();
  }
  undoButton.onclick = () => {
    if (!undoHistory.length) return;
    redoHistory.push(cloneHistoryState());
    restoreHistoryState(undoHistory.pop());
  };
  redoButton.onclick = () => {
    if (!redoHistory.length) return;
    undoHistory.push(cloneHistoryState());
    restoreHistoryState(redoHistory.pop());
  };
  document.addEventListener('keydown', event => {
    const target = event.target;
    if (target?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
    const command = event.metaKey || event.ctrlKey;
    if (!command || event.key.toLowerCase() !== 'z') return;
    event.preventDefault();
    if (event.shiftKey) redoButton.click();
    else undoButton.click();
  });

  const reorderStyle = document.createElement('style');
  reorderStyle.textContent = `
    .task{position:relative!important}
    .task.reorder-before::before,.task.reorder-after::after{
      content:"";position:absolute;left:8px;right:8px;height:3px;
      border-radius:999px;background:#69b3d1;box-shadow:0 0 0 2px #e5f5fb;
      pointer-events:none;z-index:4
    }
    .task.reorder-before::before{top:-5px}
    .task.reorder-after::after{bottom:-5px}
    .lane-body.reorder-empty{box-shadow:inset 0 0 0 2px #8bc8df}
  `;
  document.head.append(reorderStyle);

  let boardDragId = null;
  let boardDropTask = null;
  let boardDropAfter = false;
  function clearBoardDropMarkers() {
    document.querySelectorAll('.task.reorder-before,.task.reorder-after')
      .forEach(card => card.classList.remove('reorder-before', 'reorder-after'));
    document.querySelectorAll('.lane-body.reorder-empty')
      .forEach(zone => zone.classList.remove('reorder-empty'));
    boardDropTask = null;
    boardDropAfter = false;
  }
  function insertTaskAtDrop(taskId, lane, targetId, after) {
    const fromIndex = tasks.findIndex(task => task.id === taskId);
    if (fromIndex < 0) return;
    const [moved] = tasks.splice(fromIndex, 1);
    moved.lane = lane;
    if (targetId != null && targetId !== taskId) {
      const targetIndex = tasks.findIndex(task => task.id === targetId);
      tasks.splice(targetIndex < 0 ? tasks.length : targetIndex + (after ? 1 : 0), 0, moved);
    } else {
      let lastLaneIndex = -1;
      tasks.forEach((task, index) => { if (task.lane === lane) lastLaneIndex = index; });
      tasks.splice(lastLaneIndex + 1, 0, moved);
    }
    save();
    render();
  }
  board?.addEventListener('dragstart', event => {
    const card = event.target.closest('.task');
    if (!card || !board.contains(card)) return;
    event.stopImmediatePropagation();
    boardDragId = Number(card.dataset.id);
    dragId = boardDragId;
    card.classList.add('dragging');
    event.dataTransfer?.setData('text/plain', String(boardDragId));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }, true);
  board?.addEventListener('dragover', event => {
    if (boardDragId == null) return;
    const zone = event.target.closest('.lane-body');
    if (!zone || !board.contains(zone)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    clearBoardDropMarkers();
    const card = event.target.closest('.task');
    if (card && Number(card.dataset.id) === boardDragId) {
      boardDropTask = boardDragId;
    } else if (card) {
      const rect = card.getBoundingClientRect();
      boardDropTask = Number(card.dataset.id);
      boardDropAfter = event.clientY > rect.top + rect.height / 2;
      card.classList.add(boardDropAfter ? 'reorder-after' : 'reorder-before');
    } else {
      zone.classList.add('reorder-empty');
    }
  }, true);
  board?.addEventListener('drop', event => {
    if (boardDragId == null) return;
    const zone = event.target.closest('.lane-body');
    if (!zone || !board.contains(zone)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const taskId = boardDragId;
    const targetId = boardDropTask;
    const after = boardDropAfter;
    const lane = zone.dataset.lane;
    clearBoardDropMarkers();
    boardDragId = null;
    dragId = null;
    if (targetId === taskId) return;
    insertTaskAtDrop(taskId, lane, targetId, after);
  }, true);
  board?.addEventListener('dragend', event => {
    if (!event.target.closest('.task')) return;
    event.stopImmediatePropagation();
    boardDragId = null;
    dragId = null;
    clearBoardDropMarkers();
    document.querySelectorAll('.task.dragging').forEach(card => card.classList.remove('dragging'));
  }, true);

  const deletedTaskKey = 'kanban-deleted-tasks-v1';
  const deletedRetention = 7 * 24 * 60 * 60 * 1000;
  let deletedTasks = JSON.parse(localStorage.getItem(deletedTaskKey) || '[]');
  let deleteUndoTimer = null;
  function saveDeletedTasks() { localStorage.setItem(deletedTaskKey, JSON.stringify(deletedTasks)); }
  function purgeDeletedTasks() {
    const limit = Date.now() - deletedRetention;
    const next = deletedTasks.filter(item => Number(item.deletedAt) >= limit);
    if (next.length !== deletedTasks.length) { deletedTasks = next; saveDeletedTasks(); }
    updateDeletedButton();
  }
  const deletedButton = document.createElement('button');
  deletedButton.id = 'deletedTasksButton';
  deletedButton.type = 'button';
  const completionStats = document.getElementById('completionStats');
  completionStats?.append(deletedButton);
  function updateDeletedButton() { deletedButton.textContent = '削除済タスク' + (deletedTasks.length ? '  '+deletedTasks.length : ''); }

  const deletedModal = document.createElement('div');
  deletedModal.className = 'deleted-task-modal';
  deletedModal.innerHTML = '<section class="deleted-task-sheet" role="dialog" aria-modal="true"><button class="deleted-task-close" aria-label="閉じる">×</button><h2>削除済タスク</h2><p>削除から1週間だけ保存されます。</p><div id="deletedTaskList"></div></section>';
  document.body.append(deletedModal);
  const deleteUndoToast = document.createElement('div');
  deleteUndoToast.className = 'delete-undo-toast';
  deleteUndoToast.innerHTML = '<span>タスクを削除しました</span><button type="button">元に戻す</button>';
  document.body.append(deleteUndoToast);
  const deletedStyle = document.createElement('style');
  deletedStyle.textContent = '#completionStats{align-items:stretch}#deletedTasksButton{align-self:center;margin-left:auto;padding:7px 10px;border:1px solid #e0e3e5;border-radius:9px;background:#f8f9f9;color:#899096;font-size:10px;cursor:pointer}#deletedTasksButton:hover{background:#fff;color:#606a70}.deleted-task-modal{display:none;position:fixed;inset:0;z-index:1150;align-items:center;justify-content:center;padding:22px;background:#1d1d1f3b}.deleted-task-modal.open{display:flex}.deleted-task-sheet{position:relative;width:min(560px,100%);max-height:82vh;overflow:auto;padding:24px;border-radius:20px;background:#fff;box-shadow:0 20px 60px #1d1d1f30}.deleted-task-sheet h2{margin:0 0 5px;font-size:19px}.deleted-task-sheet>p{margin:0 0 16px;color:#92979b;font-size:11px}.deleted-task-close{position:absolute;top:14px;right:14px;width:31px;height:31px;border:0;border-radius:50%;background:#f0f1f2;color:#6e7478;font-size:20px}.deleted-task-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid #eceeef}.deleted-task-row:last-child{border:0}.deleted-task-name{font-size:13px;font-weight:650}.deleted-task-date{margin-top:3px;color:#92979b;font-size:10px}.deleted-task-restore{flex:none;padding:7px 10px;border:0;border-radius:8px;background:#e6f3f8;color:#39748b;font-size:11px;font-weight:700}.deleted-task-empty{padding:34px 0;text-align:center;color:#9a9fa3;font-size:12px}.delete-undo-toast{position:fixed;right:22px;bottom:22px;z-index:1200;display:flex;align-items:center;gap:12px;padding:10px 12px 10px 15px;border-radius:13px;background:#27343a;color:#fff;font-size:12px;box-shadow:0 12px 30px #1d1d1f2b;opacity:0;transform:translateY(10px);pointer-events:none;transition:.2s}.delete-undo-toast.show{opacity:1;transform:none;pointer-events:auto}.delete-undo-toast button{border:0;border-radius:8px;padding:6px 9px;background:#dff2fa;color:#39748b;font-size:12px;font-weight:700}@media(max-width:620px){#deletedTasksButton{margin-left:0}}';
  document.head.append(deletedStyle);
  function restoreDeletedTask(id) {
    const deletedIndex = deletedTasks.findIndex(item => String(item.task?.id) === String(id));
    if (deletedIndex < 0) return;
    const [item] = deletedTasks.splice(deletedIndex,1);
    const restoreIndex = Math.max(0,Math.min(Number(item.originalIndex)||0,tasks.length));
    tasks.splice(restoreIndex,0,{...item.task,done:false,running:false,started:0});
    save(); saveDeletedTasks(); render(); updateDeletedButton();
  }
  function showDeleteUndo(id) {
    clearTimeout(deleteUndoTimer);
    deleteUndoToast.classList.add('show');
    deleteUndoToast.querySelector('button').onclick = () => {
      restoreDeletedTask(id);
      deleteUndoToast.classList.remove('show');
      clearTimeout(deleteUndoTimer);
    };
    deleteUndoTimer = setTimeout(() => deleteUndoToast.classList.remove('show'),10000);
  }
  function deleteTaskSoftly(id) {
    const index = tasks.findIndex(task => String(task.id) === String(id));
    if (index < 0) return;
    const [task] = tasks.splice(index,1);
    stop(task);
    deletedTasks.unshift({task:{...task,running:false,started:0},originalIndex:index,deletedAt:Date.now()});
    save(); saveDeletedTasks(); render(); updateDeletedButton(); showDeleteUndo(task.id);
  }
  board?.addEventListener('click', event => {
    const remove = event.target.closest('.remove');
    if (!remove) return;
    const card = remove.closest('.task');
    if (!card) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    deleteTaskSoftly(card.dataset.id);
  }, true);
  function openDeletedTasks() {
    purgeDeletedTasks();
    const root = document.getElementById('deletedTaskList');
    root.innerHTML = deletedTasks.length ? deletedTasks.map(item => '<div class="deleted-task-row" data-id="'+item.task.id+'"><div><div class="deleted-task-name">'+esc(item.task.title)+'</div><div class="deleted-task-date">'+new Date(item.deletedAt).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})+' に削除</div></div><div style="display:flex;align-items:center;gap:7px"><button class="deleted-task-restore">復元</button><button class="deleted-task-permanent" aria-label="完全に削除" title="完全に削除" style="width:30px;height:30px;border:0;border-radius:50%;background:#fff0f0;color:#c97878;font-size:15px;cursor:pointer">🗑</button></div></div>').join('') : '<div class="deleted-task-empty">削除済みのタスクはありません</div>';
    deletedModal.classList.add('open');
  }
  deletedButton.onclick = openDeletedTasks;
  deletedModal.onclick = event => {
    if (event.target === deletedModal || event.target.closest('.deleted-task-close')) deletedModal.classList.remove('open');
    const row = event.target.closest('.deleted-task-row');
    if (row && event.target.closest('.deleted-task-restore')) { restoreDeletedTask(row.dataset.id); row.remove(); if (!deletedTasks.length) document.getElementById('deletedTaskList').innerHTML='<div class="deleted-task-empty">削除済みのタスクはありません</div>'; }
    if (row && event.target.closest('.deleted-task-permanent')) { if (!window.confirm('このタスクを完全に削除しますか？')) return; deletedTasks = deletedTasks.filter(item => String(item.task.id) !== String(row.dataset.id)); saveDeletedTasks(); row.remove(); updateDeletedButton(); if (!deletedTasks.length) document.getElementById('deletedTaskList').innerHTML='<div class="deleted-task-empty">削除済みのタスクはありません</div>'; }
  };
  purgeDeletedTasks();
  setInterval(purgeDeletedTasks,60*60*1000);

  const colorPolish = document.createElement('style');
  colorPolish.textContent = `
    body{background:linear-gradient(180deg,#f5fbfe 0,#f7f7f8 330px,#f5f5f7 100%)!important}
    .composer{border:1px solid #dcecf3!important;box-shadow:0 12px 34px #5793ad12!important}
    .task-board-section-title{color:#477f98!important}
    .lane-title{display:flex!important;align-items:center!important;gap:7px!important;color:#555d62!important}
    .lane-title::before{content:'';width:8px;height:8px;border-radius:50%;background:#aab2b7;box-shadow:0 0 0 4px #aab2b71b}
    .lane[data-lane="now"] .lane-title::before{background:#6ab6d4;box-shadow:0 0 0 4px #6ab6d422}
    .lane[data-lane="next"] .lane-title::before{background:#e8b56f;box-shadow:0 0 0 4px #e8b56f24}
    .lane[data-lane="inbox"] .lane-title::before{background:#a797d2;box-shadow:0 0 0 4px #a797d224}
    .lane[data-lane="waiting"] .lane-title::before{background:#7fbd98;box-shadow:0 0 0 4px #7fbd9824}
    .lane[data-lane="overdue"] .lane-title::before{background:#df8487;box-shadow:0 0 0 4px #df848724}
    .lane-count{min-width:22px;padding:3px 7px;border-radius:999px;background:#fff;color:#7d858a!important;text-align:center;box-shadow:0 1px 5px #1d1d1f0c}
    .lane[data-lane="now"] .lane-body{background:linear-gradient(145deg,#e7f3f8,#e9e9ec 72%)!important}
    .lane[data-lane="next"] .lane-body{background:linear-gradient(145deg,#f5eee4,#e9e9ec 72%)!important}
    .lane[data-lane="inbox"] .lane-body{background:linear-gradient(145deg,#f0edf8,#e9e9ec 72%)!important}
    .lane[data-lane="waiting"] .lane-body{background:linear-gradient(145deg,#eaf3ed,#e9e9ec 72%)!important}
    .task{border:1px solid #ffffff!important;box-shadow:0 3px 10px #43515a0b!important}
    .task:hover{box-shadow:0 7px 18px #43515a14!important}
    .add{background:#579fbe!important;box-shadow:0 5px 12px #579fbe28}
  `;
  document.head.append(colorPolish);

  // タスクごとの時間計測は廃止：既存の計測状態も止め、カードから操作・表示を外す。
  tasks.forEach(task => { task.running = false; task.started = 0; });
  save();
  const timeFeatureStyle = document.createElement('style');
  timeFeatureStyle.textContent = '.count,.task .spent,.task .play,.task .time-reset{display:none!important}.task .meta{grid-template-columns:minmax(0,1fr)!important}.lane[data-lane="now"] .meta{display:flex!important}.task-editor [name="spent"],.task-editor label:has([name="spent"]){display:none!important}';
  document.head.append(timeFeatureStyle);

  updateHistoryButtons();

  // --- 月次カレンダー表示 ---
  (function(){
    const calView = document.createElement('div');
    calView.id = 'taskCalendarView';
    calView.style.cssText = 'display:none;margin-bottom:28px;background:#fff;border-radius:18px;padding:18px;box-shadow:0 12px 32px #1d1d1f0d;border:1px solid #e0e5e0';
    weeklySection?.after(calView);

    let calDate = new Date();

    function renderTaskCalendar() {
      const year = calDate.getFullYear();
      const month = calDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDayOfWeek = (firstDay.getDay() + 7) % 7;
      const totalDays = lastDay.getDate();

      let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <h3 style="margin:0;font-size:16px;color:#35463c">${year}年 ${month + 1}月</h3>
        <div style="display:flex;gap:6px">
          <button id="calPrev" style="padding:5px 10px;border:0;border-radius:8px;background:#f0f2ef;color:#555;cursor:pointer">前月</button>
          <button id="calToday" style="padding:5px 10px;border:0;border-radius:8px;background:#f0f2ef;color:#555;cursor:pointer">今月</button>
          <button id="calNext" style="padding:5px 10px;border:0;border-radius:8px;background:#f0f2ef;color:#555;cursor:pointer">次月</button>
        </div>
      </div>`;

      html += `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;text-align:center;font-size:11px;font-weight:700;color:#86868b;margin-bottom:6px">
        <span style="color:#e5484d">日</span><span>月</span><span>火</span><span>水</span><span>木</span><span>金</span><span style="color:#0071e3">土</span>
      </div>`;

      html += `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">`;

      for (let i = 0; i < startDayOfWeek; i++) {
        html += `<div style="min-height:80px;background:#f9faf9;border-radius:10px"></div>`;
      }

      const todayStr = new Date().toISOString().slice(0, 10);
      for (let d = 1; d <= totalDays; d++) {
        const curDate = new Date(year, month, d);
        const curIso = new Date(curDate.getTime() - curDate.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
        const dayTasks = tasks.filter(t => t.due === curIso);
        const isToday = curIso === todayStr;

        html += `<div class="task-calendar-cell" data-date="${curIso}" draggable="false" style="min-height:80px;padding:6px;background:${isToday ? '#e8f4ec' : '#f9faf9'};border:1px solid ${isToday ? '#4e9b70' : '#eef2ee'};border-radius:10px">
          <div style="font-size:11px;font-weight:700;margin-bottom:4px;color:${isToday ? '#4e9b70' : '#333'}">${d}</div>
          <div style="display:flex;flex-direction:column;gap:3px">`;
        dayTasks.forEach(t => {
          html += `<div class="task-calendar-item" data-task-id="${t.id}" draggable="true" style="padding:3px 6px;border-radius:6px;background:#fff;font-size:10px;line-height:1.2;color:#333;box-shadow:0 1px 3px rgba(0,0,0,0.06);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${t.done ? 'text-decoration:line-through;opacity:0.6' : ''}" title="${esc(t.title)}">${esc(t.title)}</div>`;
        });
        html += `</div></div>`;
      }

      html += `</div>`;
      calView.innerHTML = html;

      document.getElementById('calPrev').onclick = () => { calDate.setMonth(calDate.getMonth() - 1); renderTaskCalendar(); };
      document.getElementById('calToday').onclick = () => { calDate = new Date(); renderTaskCalendar(); };
      document.getElementById('calNext').onclick = () => { calDate.setMonth(calDate.getMonth() + 1); renderTaskCalendar(); };

      calView.querySelectorAll('.task-calendar-item').forEach(item => {
        item.ondragstart = event => {
          event.dataTransfer?.setData('text/plain', String(item.dataset.taskId));
          event.dataTransfer && (event.dataTransfer.effectAllowed = 'move');
          item.style.opacity = '0.5';
        };
        item.ondragend = () => {
          item.style.opacity = '';
          calView.querySelectorAll('.task-calendar-drop').forEach(node => node.classList.remove('task-calendar-drop'));
        };
      });
      calView.querySelectorAll('.task-calendar-cell').forEach(cell => {
        cell.ondragover = event => { event.preventDefault(); cell.classList.add('task-calendar-drop'); };
        cell.ondragleave = event => { if (!cell.contains(event.relatedTarget)) cell.classList.remove('task-calendar-drop'); };
        cell.ondrop = event => {
          event.preventDefault();
          cell.classList.remove('task-calendar-drop');
          const taskId = Number(event.dataTransfer?.getData('text/plain') || 0);
          const task = tasks.find(item => item.id === taskId);
          if (!task) return;
          task.due = cell.dataset.date;
          save();
          render();
          renderTaskCalendar();
        };
      });
    }

    const boardEl = document.getElementById('board');
    const hintEl = document.querySelector('.hint');
    function syncBoardAndCalendarView() {
      const shouldShow = calendarOpen;
      if (calendarMode) {
        // 月次表示でも切り替え見出しは残し、週次へ戻れるようにする。
        if (weeklySection) weeklySection.style.display = '';
        if (weekRoot) weekRoot.classList.remove('open');
        calView.style.display = shouldShow ? 'block' : 'none';
        if (hintEl) hintEl.style.display = 'none';
        if (weekSizeButton) {
          weekSizeButton.textContent = calendarOpen ? 'カレンダーを閉じる' : 'カレンダーを開く';
        }
        if (shouldShow) renderTaskCalendar();
      } else {
        if (weeklySection) weeklySection.style.display = shouldShow ? '' : 'none';
        if (weekRoot) weekRoot.classList.toggle('open', shouldShow);
        calView.style.display = 'none';
        if (hintEl) hintEl.style.display = '';
        if (weekSizeButton) {
          weekSizeButton.textContent = calendarOpen ? 'カレンダーを閉じる' : 'カレンダーを開く';
        }
      }
      viewToggle.querySelectorAll('button').forEach(button => button.classList.toggle('active', (button.dataset.view === 'monthly') === calendarMode));
    }
    if (weekSizeButton) {
      weekSizeButton.onclick = () => {
        calendarOpen = !calendarOpen;
        syncBoardAndCalendarView();
      };
    }
    viewToggle.querySelectorAll('button').forEach(button => {
      button.onclick = () => {
        calendarMode = button.dataset.view === 'monthly';
        calendarOpen = true;
        syncBoardAndCalendarView();
      };
    });
    syncBoardAndCalendarView();
  })();
})();
