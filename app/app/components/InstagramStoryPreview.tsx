'use client';

import { CarouselCard } from '@/lib/store';
import { useEffect } from 'react';

interface InstagramStoryPreviewProps {
  card: CarouselCard;
  isOpen: boolean;
  onClose: () => void;
}

export function InstagramStoryPreview({ card, isOpen, onClose }: InstagramStoryPreviewProps) {
  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          opacity: 0.7,
          transition: 'opacity 0.2s',
          padding: '8px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        ✕
      </button>

      {/* Instagram Story Container - Responsive */}
      <div
        style={{
          maxWidth: 'min(90vw, 540px)',
          margin: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Status Bar */}
        <div
          style={{
            backgroundColor: '#000',
            padding: '8px 12px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white',
              fontSize: '12px',
              padding: '8px',
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    height: '2px',
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }}
                ></div>
              ))}
            </div>
            <span>9:41</span>
          </div>
        </div>

        {/* Feed/Carousel Content (3:4) */}
        <div
          style={{
            width: '100%',
            aspectRatio: '3 / 4',
            backgroundColor: card.colors.bg,
            color: card.colors.text,
            fontFamily: '-apple-system, "system-ui", "Segoe UI", Roboto',
            minHeight: '400px',
            maxHeight: '85vh',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Card Number - Top Right */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              fontSize: '14px',
              fontWeight: 'bold',
              opacity: 0.5,
            }}
          >
            #{card.order + 1}
          </div>

          {/* Headline - Mostrar apenas se existir */}
          {card.headline && (
            <div
              style={{
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: "16px",
                paddingRight: "16px",
                marginBottom: '20px',
              }}
            >
              <h1
                style={{
                  fontWeight: 900,
                  lineHeight: 1.1,
                  wordBreak: 'break-word',
                  fontSize: '32px',
                  letterSpacing: '-0.5px',
                  margin: 0,
                }}
              >
                {card.headline}
              </h1>
            </div>
          )}

          {/* Body Text - Cresce para preencher espaço */}
          <div
            style={{
              flex: '1 1 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: "16px",
              paddingRight: "16px",
              overflowY: 'auto',
              minHeight: 0,
            }}
          >
            <p
              style={{
                lineHeight: 1.5,
                wordBreak: 'break-word',
                fontSize: '16px',
                opacity: 0.85,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}
            >
              {card.text || 'Body text'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
