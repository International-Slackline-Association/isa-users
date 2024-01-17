Promise.all([import('./Root'), import('./app')]).then(([{ default: render }, { default: App }]) => {
  render(App);
});
