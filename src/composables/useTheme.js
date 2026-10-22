import { ref, onMounted, onUnmounted } from 'vue';

const isDark = ref(false);
let listeners = 0;
let synced = false;

function applyTheme(dark) {
  isDark.value = dark;
  document.body.classList.toggle('dark-mode', dark);
  document.documentElement.classList.toggle('dark-mode', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {
    /* private mode */
  }
}

function readStoredTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved === 'dark';
  } catch {
    /* ignore */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
}

/** Call once at app boot so auth/account routes get the saved theme without Header. */
export function initTheme() {
  if (synced) return;
  synced = true;
  applyTheme(readStoredTheme());
}

export function useTheme() {
  const onStorage = (e) => {
    if (e.key === 'theme') applyTheme(e.newValue === 'dark');
  };

  const onSystem = (e) => {
    try {
      if (localStorage.getItem('theme')) return;
    } catch {
      return;
    }
    applyTheme(e.matches);
  };

  onMounted(() => {
    if (!synced) initTheme();
    else applyTheme(isDark.value || readStoredTheme());
    listeners += 1;
    if (listeners === 1) {
      window.addEventListener('storage', onStorage);
      window.matchMedia?.('(prefers-color-scheme: dark)')?.addEventListener?.('change', onSystem);
    }
  });

  onUnmounted(() => {
    listeners = Math.max(0, listeners - 1);
    if (listeners === 0) {
      window.removeEventListener('storage', onStorage);
      window.matchMedia?.('(prefers-color-scheme: dark)')?.removeEventListener?.('change', onSystem);
    }
  });

  const toggleTheme = () => applyTheme(!isDark.value);
  const setTheme = (mode) => applyTheme(mode === 'dark');

  return { isDark, toggleTheme, setTheme };
}
