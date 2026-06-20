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
        <h2>{profile.name}</h2>
        {editing ? (
          <>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} />
            <button onClick={handleSaveBio}>Save</button>{' '}
            <button className="secondary" onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <p>{profile.bio || 'No bio yet.'}</p>
        )}
        <p>
          {profile.followers.length} followers · {profile.following.length} following
        </p>
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

      <h3>Posts</h3>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div className="card" key={post._id}>
          <p>{post.text}</p>
          {post.image && <img src={post.image} alt="post" style={{ maxWidth: '100%', borderRadius: 6 }} />}
          <small>❤ {post.likes.length}</small>
        </div>
      ))}
    </div>
  );
}
