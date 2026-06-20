import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const loadFeed = async () => {
    try {
      const { data } = await api.get('/posts/feed');
      setPosts(data);
    } catch (err) {
      setError('Failed to load feed');
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post('/posts', { text, image });
      setText('');
      setImage('');
      loadFeed();
    } catch (err) {
      setError('Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    await api.put(`/posts/${postId}/like`);
    loadFeed();
  };

  return (
    <div>
      <div className="card">
        <h3>What's on your mind?</h3>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handlePost}>
          <textarea
            rows={3}
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
      </div>

      {posts.length === 0 && (
        <p>No posts yet. Follow people or create your first post!</p>
      )}

      {posts.map((post) => (
        <div className="card" key={post._id}>
          <strong>
            <Link to={`/profile/${post.author._id}`}>{post.author.name}</Link>
          </strong>
          <p>{post.text}</p>
          {post.image && <img src={post.image} alt="post" style={{ maxWidth: '100%', borderRadius: 6 }} />}
          <div>
            <button className="secondary" onClick={() => handleLike(post._id)}>
              ❤ {post.likes.length}
            </button>{' '}
            <Link to={`/post/${post._id}`}>
              <button className="secondary">Comments</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
