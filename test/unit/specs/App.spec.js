import App from '../../../src/renderer/components/App.svelte'

describe('App.svelte', () => {
  it('should render correct contents', () => {
    const target = document.createElement('div');
    const app = new App({
      target,
      props: {
        name: 'Jim'
      },
    });

    const h1 = target.getElementsByTagName('h1')[0];
    expect(h1.textContent).to.contain('Hello Jim!')
  })
})
