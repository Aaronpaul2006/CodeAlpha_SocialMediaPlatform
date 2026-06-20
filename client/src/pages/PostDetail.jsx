import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api.js';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const loadPost = async () => {
    try {
      const { data } = await api.get(`/posts/${id}`);
      setPost(data.post);
      setComments(data.comments);
    } catch (err) {
      setError('Failed to load post');
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  const handleLike = async () => {
    await api.put(`/posts/${id}/like`);
    loadPost();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.post(`/comments/${id}`, { text });
      setText('');
      loadPost();
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  if (!post) return <p>{error || 'Loading...'}</p>;

  return (
    <div>
      <div className="card">
        <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px dashed rgba(30, 27, 75, 0.15)', paddingBottom: 8 }}>
          <strong>
            <Link to={`/profile/${post.author._id}`} style={{ textDecoration: 'none', color: 'var(--accent-purple)', fontSize: '1.25rem', fontFamily: 'var(--heading-font)' }}>
              ★ {post.author.name} ★
            </Link>
          </strong>
          <span className="badge badge-purple" style={{ fontSize: '0.8rem' }}>POST DETAIL</span>
        </div>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.5', margin: '8px 0 16px 0' }}>{post.text}</p>
        {post.image && (
          <div style={{ margin: '12px 0', border: '1px solid var(--glass-border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
            <img src={post.image} alt="post" style={{ width: '100%', display: 'block', maxHeight: '420px', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ marginTop: '14px' }}>
          <button className="secondary" onClick={handleLike}>❤ {post.likes.length}</button>
        </div>
      </div>

      <div className="card">
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>💬 Comments ({comments.length})</h4>
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ marginBottom: 0, flex: 1 }}
          />
          <button type="submit" style={{ padding: '10px 20px' }}>Comment</button>
        </form>
        {comments.length === 0 && <p style={{ fontStyle: 'italic', color: 'rgba(30, 27, 75, 0.6)' }}>No comments yet.</p>}
        {comments.map((c) => (
          <div className="comment" key={c._id} style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
            <strong style={{ fontFamily: 'var(--heading-font)', fontSize: '1.15rem', color: 'var(--text-secondary)' }}>{c.author.name}</strong>
            <span style={{ color: 'rgba(30, 27, 75, 0.4)', fontSize: '0.9rem' }}>:</span>
            <span style={{ fontSize: '1rem' }}>{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
