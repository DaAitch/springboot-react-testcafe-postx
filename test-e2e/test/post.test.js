import {setup} from './setup';
import AppPo from './po/AppPo';

/* fixture() */ setup `App Test`;

test('App Test', async t => {

  const po = new AppPo(t);

  await t.navigateTo(t.fixtureCtx.serverPath('/'));

  await t.expect(await po.getPostCount()).eql(2);
  await t.expect(await po.getPosts()).eql([
    {
      title: 'TestCafe for testing UIs.',
      body: 'lorem ipsum'
    }, {
      title: 'Write your own project specific TestCafe setup!',
      body: 'dolor sit amet'
    }
  ]);

  await t.takeScreenshot();
});
