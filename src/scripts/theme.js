(() => {
  const root = document.documentElement;
  const key = 'tony-ma-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = localStorage.getItem(key);

  function applyTheme() {
    const dark = preference === 'dark' || (preference !== 'light' && system.matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    const control = document.querySelector('.theme-switch__checkbox');
    if (control) {
      if (!(control instanceof HTMLInputElement)) throw new Error('主题开关必须是 input 元素');
      control.checked = dark;
      control.title = dark ? '切换浅色主题' : '切换深色主题';
    }
  }

  applyTheme();

  document.addEventListener('change', (event) => {
    const control = event.target;
    if (!(control instanceof HTMLInputElement) || !control.matches('.theme-switch__checkbox')) return;
    preference = control.checked ? 'dark' : 'light';
    localStorage.setItem(key, preference);
    applyTheme();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const control = document.querySelector('.theme-switch__checkbox');
    if (!(control instanceof HTMLInputElement)) throw new Error('页面缺少主题开关');
    applyTheme();
  });

  system.addEventListener('change', () => {
    if (preference !== 'light' && preference !== 'dark') applyTheme();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === key || event.key === null) {
      preference = localStorage.getItem(key);
      applyTheme();
    }
  });

  window.addEventListener('pageshow', () => {
    preference = localStorage.getItem(key);
    applyTheme();
  });
})();
