const darkSwitch = document.getElementById('darkSwitch');
function initTheme() {
  const e =
    null !== localStorage.getItem('darkSwitch') &&
    'dark' === localStorage.getItem('darkSwitch');
  (darkSwitch.checked = e),
    e
      ? document.body.setAttribute('data-theme', 'dark')
      : document.body.removeAttribute('data-theme');
}
function resetTheme() {
  darkSwitch.checked
    ? (document.body.setAttribute('data-theme', 'dark'),
      localStorage.setItem('darkSwitch', 'dark'))
    : (document.body.removeAttribute('data-theme'),
      localStorage.removeItem('darkSwitch'));
}
window.addEventListener('load', () => {
  darkSwitch &&
    (initTheme(),
    darkSwitch.addEventListener('change', () => {
      resetTheme();
    }));
});
