import React, { Component } from 'react';
import Post from './Post';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    posts: undefined
  };

  async componentDidMount() {
    const res = await fetch('/api/posts');

    try {
      const posts = await res.json();
      this.setState({posts});
    } catch (e) {
      // error
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          {Array.isArray(this.state.posts) && this.state.posts.map((post, index) => (
            <Post key={index} title={post.title} body={post.body} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
