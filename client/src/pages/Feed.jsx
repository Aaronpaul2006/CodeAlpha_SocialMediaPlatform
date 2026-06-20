import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { ReactionPicker, ReactionsSummary } from '../components/ReactionPicker.jsx';

export default function Feed() {
  const { user: currentUser } = useAuth();
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

  const handleReaction = async (postId, reactionType) => {
    await api.put(`/posts/${postId}/react`, { type: reactionType });
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
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ margin: 0, fontWeight: 500 }}>No posts yet. Follow people or create your first post!</p>
        </div>
      )}

      {posts.map((post) => {
        const userReactionObj = post.reactions?.find(r => {
          const rUserId = typeof r.user === 'object' ? r.user._id : r.user;
          return rUserId === currentUser?.id;
        });
        const userReaction = userReactionObj ? userReactionObj.type : null;

        return (
          <div className="card" key={post._id}>
            <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px dashed rgba(30, 27, 75, 0.15)', paddingBottom: 8 }}>
              <strong>
                <Link to={`/profile/${post.author._id}`} style={{ textDecoration: 'none', color: 'var(--accent-purple)', fontSize: '1.25rem', fontFamily: 'var(--heading-font)' }}>
                  ★ {post.author.name} ★
                </Link>
              </strong>
              <span className="badge badge-purple" style={{ fontSize: '0.8rem' }}>POST</span>
            </div>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.5', margin: '8px 0 16px 0' }}>{post.text}</p>
            {post.image && (
              <div style={{ margin: '12px 0', border: '1px solid var(--glass-border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
                <img src={post.image} alt="post" style={{ width: '100%', display: 'block', maxHeight: '420px', objectFit: 'cover' }} />
              </div>
            )}
            
            <ReactionsSummary 
              post={post} 
              currentUser={currentUser} 
              onReactionClick={handleReaction} 
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <ReactionPicker 
                postId={post._id} 
                onReact={handleReaction} 
                userReaction={userReaction} 
              />
              <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', marginRight: 0 }}>
                <button className="secondary">💬 Comments</button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
