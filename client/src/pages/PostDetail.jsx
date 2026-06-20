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
        <strong>
          <Link to={`/profile/${post.author._id}`}>{post.author.name}</Link>
        </strong>
        <p>{post.text}</p>
        {post.image && <img src={post.image} alt="post" style={{ maxWidth: '100%', borderRadius: 6 }} />}
        <button className="secondary" onClick={handleLike}>❤ {post.likes.length}</button>
      </div>

      <div className="card">
        <h4>Comments</h4>
        <form onSubmit={handleComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">Comment</button>
        </form>
        {comments.length === 0 && <p>No comments yet.</p>}
        {comments.map((c) => (
          <div className="comment" key={c._id}>
            <strong>{c.author.name}</strong>: {c.text}
          </div>
        ))}
      </div>
    </div>
  );
}
