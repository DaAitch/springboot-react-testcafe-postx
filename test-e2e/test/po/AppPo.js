import {Selector} from 'testcafe';

const selectPosts = Selector('.post');

export default class AppPo {

  /**
   * @param {TestController} t 
   */
  constructor(t) {
    this.t = t;
  }

  async getPostCount() {
    return await selectPosts.count;
  }

  async getPost(index) {
    const selectPost = selectPosts.nth(index);

    return {
      title: await selectPost.find('.post-title').textContent,
      body: await selectPost.find('.post-body').textContent
    };
  }

  async getPosts() {
    const posts = [];
    for (let i = 0; i < await this.getPostCount(); i++) {
      posts.push(await this.getPost(i));
    }

    return posts;
  }
}
