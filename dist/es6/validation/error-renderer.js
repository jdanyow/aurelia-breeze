export class ErrorRenderer {
  render(rootElement, error, property) {
    throw new Error('An error renderer must implement "render".');
  }
  unrender(rootElement, error, property) {
    throw new Error('An error renderer must implement "unrender".');
  }
}
