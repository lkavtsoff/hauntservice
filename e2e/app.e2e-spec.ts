import { BookexPage } from './app.po';

describe('bookex App', () => {
  let page: BookexPage;

  beforeEach(() => {
    page = new BookexPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
