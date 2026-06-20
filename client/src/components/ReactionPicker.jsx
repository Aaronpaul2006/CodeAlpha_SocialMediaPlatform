import React, { useState } from 'react';

export function ReactionPicker({ postId, onReact, userReaction }) {
  const [showPicker, setShowPicker] = useState(false);
  const emojis = ['❤️', '😂', '😮', '😢', '🔥', '👍'];

  return (
    <div 
      className="reaction-picker-container" 
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button 
        className="secondary"
        onClick={() => setShowPicker(!showPicker)}
        style={{
          background: userReaction ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.2)',
          borderColor: userReaction ? 'var(--accent-pink)' : 'var(--glass-border)',
          color: userReaction ? 'var(--accent-pink)' : 'var(--text-primary)',
          boxShadow: '3px 3px 0px var(--text-primary)',
        }}
      >
        {userReaction ? `Reacted: ${userReaction}` : 'React'}
      </button>
      
      {showPicker && (
        <>
          {/* Backdrop overlay to close the picker when clicking anywhere else */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9,
              cursor: 'default',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(false);
            }}
          />
          
          <div 
            className="reaction-menu"
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '2px solid var(--text-primary)',
              borderRadius: '12px',
              padding: '4px 8px',
              display: 'flex',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(31, 38, 135, 0.25)',
              zIndex: 10,
              marginBottom: '8px',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {emojis.map(emoji => (
              <span
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  onReact(postId, emoji);
                  setShowPicker(false);
                }}
                style={{
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                  padding: '2px',
                  display: 'inline-block'
                }}
                className="emoji-item"
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.3)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {emoji}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ReactionsSummary({ post, currentUser, onReactionClick }) {
  const reactions = post.reactions || [];
  if (reactions.length === 0) return null;

  // Count by type
  const counts = {};
  reactions.forEach(r => {
    counts[r.type] = (counts[r.type] || 0) + 1;
  });

  return (
    <div className="reactions-summary" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
      {Object.entries(counts).map(([type, count]) => {
        // Check if current user reacted with this type
        const hasUserReacted = reactions.some(r => {
          const rUserId = typeof r.user === 'object' ? r.user._id : r.user;
          return rUserId === currentUser?.id && r.type === type;
        });

        return (
          <span
            key={type}
            className={`badge ${hasUserReacted ? 'badge-pink' : 'badge-cyan'}`}
            style={{ 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              padding: '4px 10px', 
              borderRadius: '12px', 
              fontSize: '0.9rem',
              border: hasUserReacted ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.4)',
              transition: 'transform 0.2s ease',
            }}
            onClick={(e) => {
              e.stopPropagation();
              onReactionClick(post._id, type);
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>{type}</span>
            <strong style={{ opacity: 0.85 }}>{count}</strong>
          </span>
        );
      })}
    </div>
  );
}
