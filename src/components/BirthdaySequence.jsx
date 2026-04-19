import React, { useState, useEffect, useRef } from 'react';
import MatrixRain from './MatrixRain';
import './BirthdaySequence.css';
import s1 from '../public/s1.jpg';
import s2 from '../public/s2.jpg';
import s3 from '../public/s3.jpg';
import s4 from '../public/s4.jpg';
import s5 from '../public/s5.jpg';
import bgAudio from '../public/Download.mp3';

const BirthdaySequence = () => {
  const [step, setStep] = useState(0);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const audioRef = useRef(null);

  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
    }
  };

  // Attempt to autoplay on mount
  useEffect(() => {
    startAudio();
  }, []);

  useEffect(() => {
    const sequence = [
      { step: 1, delay: 1000 },
      { step: 2, delay: 2000 },
      { step: 3, delay: 2500 },
      { step: 4, delay: 3500 },
      { step: 5, delay: 4000 },
      { step: 6, delay: 5000 },
      { step: 7, delay: 5500 },
      { step: 8, delay: 7000 },
      { step: 9, delay: 7500 },
      { step: 10, delay: 9000 },
      { step: 11, delay: 9500 },
      { step: 12, delay: 11000 },
      { step: 13, delay: 11500 },
      { step: 14, delay: 14000 },
      { step: 15, delay: 14500 }
    ];

    const timeouts = sequence.map((s) =>
      setTimeout(() => {
        setStep(s.step);
      }, s.delay)
    );

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, []);

  // Monitor when the book is fully read to trigger the final heart collage
  useEffect(() => {
    if (currentSheetIndex === 3) {
      const timer = setTimeout(() => {
        setStep(16);
      }, 2000); // Wait 2 seconds after the last page turns
      return () => clearTimeout(timer);
    }
  }, [currentSheetIndex]);

  const minSwipeDistance = 40;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSheetIndex((prev) => Math.min(prev + 1, 3)); // Max 3 (all sheets turned)
    }
    if (isRightSwipe) {
      setCurrentSheetIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const onMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
  };

  const onMouseMove = (e) => {
    if (touchStart) setTouchEnd(e.clientX);
  };

  const onMouseUp = () => {
    onTouchEndHandler();
    setTouchStart(null);
  };

  const sheets = [
    { frontType: 'cover', back: s1 },
    { front: s2, back: s3 },
    { front: s4, back: s5 }
  ];

  const allPhotos = [s1, s2, s3, s4, s5];

  // Pre-calculate heart coordinates for the collage
  const heartPhotos = [];
  const N = 26; // Number of photos to form the heart
  for (let i = 0; i < N; i++) {
    const t = (i / N) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    // Scale and translate
    const scale = 11;
    const left = x * scale;
    const top = -y * scale - 20; // Shift up slightly

    heartPhotos.push({ left, top });
  }

  return (
    <div className="birthday-container" onClick={startAudio} onTouchStart={startAudio}>
      <audio ref={audioRef} src={bgAudio} loop autoPlay />
      <MatrixRain />

      <div className="content-wrapper">
        {step < 15 && (
          <div className="message-card">
            <div className="birthday-text-container">
              <span className={`word ${step === 1 ? 'show' : 'hide'}`}>Happy</span>
              <span className={`word ${step === 3 ? 'show' : 'hide'}`}>Birthday</span>
              <span className={`word ${step === 5 ? 'show' : 'hide'}`}>to</span>
              <span className={`word ${step === 7 ? 'show' : 'hide'}`}>Sandhyaa</span>

              {step === 9 && (
                <img
                  src="https://cdn.pixabay.com/animation/2025/08/07/01/00/01-00-39-323_512.gif"
                  alt="Pink Heart"
                  className="center-heart pop-in"
                />
              )}

              {step === 11 && (
                <img
                  src="https://media.tenor.com/bK1qzNWjPUMAAAAi/cat-birthday.gif"
                  alt="Cat playing guitar"
                  className="center-cat pop-in"
                />
              )}

              {step === 13 && (
                <img
                  src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDgzOHJ4bWV2d2Zmemp6ODU1ZXIzNXh6cmxraHF5aWl0MzVlbzV6YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wumLmqIVT4yDwsZiqD/giphy.gif"
                  alt="Beautiful Cake with Candles"
                  className="center-cake fade-in-slow"
                />
              )}
            </div>
          </div>
        )}

        {step >= 15 && step < 16 && (
          <div className="book-layout fade-in-slow">
            {/* Top Text Box */}
            <div className="top-text-box">
              Happy Birthday Sandhyaaa gandhyaaa 💕
            </div>

            {/* 3D Book */}
            <div
              className="book-wrapper"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEndHandler}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            >
              {sheets.map((sheet, index) => {
                const isTurned = index < currentSheetIndex;
                const zIndex = isTurned ? index : sheets.length - index;

                return (
                  <div
                    key={index}
                    className={`sheet ${isTurned ? 'turned' : ''}`}
                    style={{ zIndex }}
                  >
                    <div className="face face-front">
                      {sheet.frontType === 'cover' ? (
                        <div className="book-cover">
                          <p>please slide me lady</p>
                        </div>
                      ) : (
                        <img src={sheet.front} alt={`Page ${index * 2 + 1}`} />
                      )}
                    </div>
                    <div className="face face-back">
                      <img src={sheet.back} alt={`Page ${index * 2 + 2}`} />
                    </div>
                  </div>
                );
              })}

              <div className="swipe-hint">Swipe to turn pages →</div>
            </div>
          </div>
        )}

        {step >= 16 && (
          <div className="heart-collage-container fade-in-slow">
            <div className="heart-collage">
              {heartPhotos.map((pos, index) => (
                <div
                  key={index}
                  className="collage-photo-wrapper"
                  style={{
                    left: `calc(50% + ${pos.left}px)`,
                    top: `calc(50% + ${pos.top}px)`,
                    animationDelay: `${index * 0.1}s`,
                    transform: `translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 20}deg)`
                  }}
                >
                  <img
                    src={allPhotos[index % allPhotos.length]}
                    alt="Collage piece"
                    className="collage-photo"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdaySequence;
