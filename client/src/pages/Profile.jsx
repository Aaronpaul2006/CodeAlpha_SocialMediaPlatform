import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState('');
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  const isOwnProfile = user && user.id === id;

  const loadProfile = async () => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setProfile(data.user);
      setPosts(data.posts);
      setBio(data.user.bio || '');
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const handleFollow = async () => {
    await api.put(`/users/${id}/follow`);
    loadProfile();
  };

  const handleSaveBio = async () => {
    await api.put('/users/me', { name: profile.name, bio, avatar: profile.avatar });
    setEditing(false);
    loadProfile();
  };

  const isFollowing = profile?.followers?.some((f) => f._id === user?.id);

  if (!profile) return <p>{error || 'Loading...'}</p>;

  return (
    <div>
      <div className="card">
        <h2>★ {profile.name} ★</h2>
        {editing ? (
          <div style={{ marginBottom: '16px' }}>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} style={{ width: '100%', marginBottom: '10px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSaveBio}>Save</button>
              <button className="secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '16px', background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
            {profile.bio || 'No bio yet.'}
          </p>
        )}
        <div style={{ display: 'flex', gap: '10px', margin: '14px 0' }}>
          <span className="badge badge-cyan">{profile.followers.length} followers</span>
          <span className="badge badge-purple">{profile.following.length} following</span>
        </div>
        {isOwnProfile ? (
          !editing && <button className="secondary" onClick={() => setEditing(true)}>Edit Bio</button>
        ) : (
          user && (
            <button onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )
        )}
      </div>

      <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Posts</h3>
      {posts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <p style={{ margin: 0 }}>No posts yet.</p>
        </div>
      )}
      {posts.map((post) => (
        <div className="card" key={post._id}>
          <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px dashed rgba(30, 27, 75, 0.15)', paddingBottom: 8 }}>
            <strong style={{ fontFamily: 'var(--heading-font)', fontSize: '1.25rem', color: 'var(--text-secondary)' }}>★ {profile.name} ★</strong>
            <span className="badge badge-pink" style={{ fontSize: '0.8rem' }}>OWN POST</span>
          </div>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.5', margin: '8px 0 16px 0' }}>{post.text}</p>
          {post.image && (
            <div style={{ margin: '12px 0', border: '1px solid var(--glass-border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' }}>
              <img src={post.image} alt="post" style={{ width: '100%', display: 'block', maxHeight: '420px', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
            {post.reactions && post.reactions.length > 0 ? (
              Object.entries(
                post.reactions.reduce((acc, r) => {
                  acc[r.type] = (acc[r.type] || 0) + 1;
                  return acc;
                }, {})
              ).map(([type, count]) => (
                <span key={type} className="badge badge-pink" style={{ fontSize: '0.85rem' }}>
                  {type} {count}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.9rem', color: 'rgba(30, 27, 75, 0.4)' }}>No reactions yet</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
