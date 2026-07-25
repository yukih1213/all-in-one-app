import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js';

const app = initializeApp({
  apiKey: 'AIzaSyB2zhIwPhxG2mVvU6RTGLoHIDOwiIJLDZQ',
  authDomain: 'allinone-96e4f.firebaseapp.com',
  projectId: 'allinone-96e4f',
  storageBucket: 'allinone-96e4f.firebasestorage.app',
  messagingSenderId: '238276487927',
  appId: '1:238276487927:web:c1d682a638cba88e5681f2'
});

const auth = getAuth(app);
const db = getFirestore(app);
const keys = [
  'kanban-tasks-v2', 'kanban-categories-v1', 'kanban-category-colors-v1',
  'kanban-category-names-v1', 'kanban-reports-v1', 'kanban-reflections-v1',
  'kanban-report-pages-v1', 'kanban-deleted-tasks-v1', 'kanban-task-archive-v1',
  'study-plus-local-v1', 'study-timer-material-v1', 'study-timer-remainders-v1',
  'habit-tracker-v1', 'habit-weekly-order-v1', 'habit-mini-order-v1',
  'habit-streak-metric-v1', 'habit-calendar-view-v1', 'mooda-diary-local-v1'
];

let user = null;
let lastLocalHash = '';
let syncBusy = false;

const hash = value => JSON.stringify(value);
const dataRef = () => doc(db, 'users', user.uid, 'app', 'state');
const taskBlankSlateVersion = 1;
const emptyTaskValues = {
  'kanban-tasks-v2': '[]',
  'kanban-categories-v1': '[]',
  'kanban-category-colors-v1': '{}',
  'kanban-category-names-v1': '{}',
  'kanban-deleted-tasks-v1': '[]',
  'kanban-task-archive-v1': '[]'
};
const emptyTaskData = data => ({ ...(data || {}), ...emptyTaskValues });
const localBlankKey = 'michikusa-task-blank-v2';
if (localStorage.getItem(localBlankKey) !== '1') {
  Object.entries(emptyTaskValues).forEach(([key, value]) => localStorage.setItem(key, value));
  localStorage.setItem(localBlankKey, '1');
  queueMicrotask(() => location.reload());
}
const sampleTaskTitles = new Set(['ポモドーロを試す', '今日の予定を確認する']);
const cleanTaskValue = value => {
  try {
    const tasks = JSON.parse(value);
    if (!Array.isArray(tasks)) return value;
    return JSON.stringify(tasks.filter(task => !sampleTaskTitles.has(task?.title)));
  } catch {
    return value;
  }
};
const readLocal = () => Object.fromEntries(keys.flatMap(key => {
  let value = localStorage.getItem(key);
  if (value === null) return [];
  if (key === 'kanban-tasks-v2') {
    const cleaned = cleanTaskValue(value);
    if (cleaned !== value) {
      value = cleaned;
      localStorage.setItem(key, value);
    }
  }
  return [[key, value]];
}));
const hasMeaningfulData = data => Object.values(data || {}).some(value => {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.length > 0;
    if (parsed && typeof parsed === 'object') return Object.keys(parsed).length > 0;
    return Boolean(parsed);
  } catch {
    return Boolean(value);
  }
});

function showStatus(message, isError = false) {
  let toast = document.getElementById('firebaseSyncStatus');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'firebaseSyncStatus';
    toast.style.cssText = 'position:fixed;right:18px;top:62px;z-index:10001;padding:8px 11px;border-radius:10px;background:#eef8f2;color:#4b745b;box-shadow:0 5px 18px #0001;font:500 11px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;transition:.2s';
    document.body.append(toast);
  }
  toast.style.background = isError ? '#fff0f0' : '#eef8f2';
  toast.style.color = isError ? '#a54f4f' : '#4b745b';
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(showStatus.timer);
  showStatus.timer = setTimeout(() => { toast.style.opacity = '0'; }, 2600);
}

async function downloadOrCreate() {
  if (!user || syncBusy) return;
  syncBusy = true;
  try {
    const snapshot = await getDoc(dataRef());
    const localBefore = readLocal();
    if (!snapshot.exists() || !snapshot.data().appData) {
      const blankLocal = emptyTaskData(localBefore);
      await setDoc(dataRef(), { appData: blankLocal, taskBlankSlateVersion, updatedAt: Date.now() }, { merge: true });
      lastLocalHash = hash(blankLocal);
      showStatus('この端末のデータを同期しました');
      return;
    }

    const cloudState = snapshot.data();
    let cloud = { ...cloudState.appData };
    const resetCloudTasks = Number(cloudState.taskBlankSlateVersion || 0) < taskBlankSlateVersion;
    if (resetCloudTasks) cloud = emptyTaskData(cloud);
    let cleanedCloud = false;
    if (typeof cloud['kanban-tasks-v2'] === 'string') {
      const cleanedTasks = cleanTaskValue(cloud['kanban-tasks-v2']);
      cleanedCloud = cleanedTasks !== cloud['kanban-tasks-v2'];
      cloud['kanban-tasks-v2'] = cleanedTasks;
    }
    if (!hasMeaningfulData(cloud) && hasMeaningfulData(localBefore)) {
      await setDoc(dataRef(), { appData: localBefore, taskBlankSlateVersion, updatedAt: Date.now() }, { merge: true });
      lastLocalHash = hash(localBefore);
      showStatus('この端末のデータをクラウドへ保存しました');
      return;
    }
    Object.entries(cloud).forEach(([key, value]) => {
      if (keys.includes(key) && typeof value === 'string') localStorage.setItem(key, value);
    });
    if (cleanedCloud || resetCloudTasks) {
      await setDoc(dataRef(), { appData: cloud, taskBlankSlateVersion, updatedAt: Date.now() }, { merge: true });
    }
    lastLocalHash = hash(readLocal());
    const version = String(snapshot.data().updatedAt || lastLocalHash.length);
    const reloadKey = `firebase-cloud-loaded-${user.uid}`;
    if (hash(localBefore) !== lastLocalHash && sessionStorage.getItem(reloadKey) !== version) {
      sessionStorage.setItem(reloadKey, version);
      location.reload();
      return;
    }
    showStatus('クラウドと同期済み');
  } finally {
    syncBusy = false;
  }
}

async function uploadIfChanged() {
  if (!user || syncBusy) return;
  const local = readLocal();
  const nextHash = hash(local);
  if (nextHash === lastLocalHash) return;
  syncBusy = true;
  try {
    await setDoc(dataRef(), { appData: local, updatedAt: Date.now() }, { merge: true });
    lastLocalHash = nextHash;
    showStatus('変更を同期しました');
  } finally {
    syncBusy = false;
  }
}

function mountAuthButton() {
  if (document.getElementById('firebaseAuthButton')) return;
  const button = document.createElement('button');
  button.id = 'firebaseAuthButton';
  button.type = 'button';
  button.style.cssText = 'position:fixed;top:14px;right:18px;z-index:10000;display:flex;align-items:center;gap:7px;min-height:36px;border:1px solid #0000000d;border-radius:999px;padding:5px 11px 5px 6px;background:#fff;box-shadow:0 4px 16px #0001;color:#3b403d;font:500 12px/1 -apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer';
  button.onclick = async () => {
    try {
      if (user) {
        if (confirm('ログアウトしますか？')) await signOut(auth);
      } else {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error(error);
      showStatus('ログイン処理でエラーが発生しました', true);
    }
  };
  document.body.append(button);
}

function paintAuthButton() {
  const button = document.getElementById('firebaseAuthButton');
  if (!button) return;
  button.replaceChildren();
  if (!user) {
    button.style.paddingLeft = '11px';
    button.textContent = 'Googleでログイン';
    return;
  }
  button.style.paddingLeft = '6px';
  if (user.photoURL) {
    const image = document.createElement('img');
    image.src = user.photoURL;
    image.alt = '';
    image.referrerPolicy = 'no-referrer';
    image.style.cssText = 'width:26px;height:26px;border-radius:50%;object-fit:cover';
    button.append(image);
  }
  const name = document.createElement('span');
  name.textContent = user.displayName || user.email || 'ログイン中';
  button.append(name);
}

onAuthStateChanged(auth, async signedInUser => {
  user = signedInUser;
  mountAuthButton();
  paintAuthButton();
  if (!user) return;
  try {
    await downloadOrCreate();
  } catch (error) {
    console.error(error);
    showStatus('同期に失敗しました。Firestoreのルールを確認してください', true);
  }
});

setInterval(() => uploadIfChanged().catch(error => {
  console.error(error);
  showStatus('変更を同期できませんでした', true);
}), 2000);
