import React, { useState, useEffect } from 'react';
import './Countdown.css';

const Countdown = () => {
    const [count, setCount] = useState(3);
    const [show, setShow] = useState(false);
    const [isBirthday, setIsBirthday] = useState(false);

    useEffect(() => {
        let timer;
        
        const startSequence = () => {
            setShow(true);
            timer = setTimeout(() => {
                setShow(false);
                setTimeout(() => {
                    setCount(prev => prev - 1);
                }, 500); // 500ms hide transition
            }, 800); // 800ms show time
        };

        if (count > 0) {
            // Give 1 second delay for initial 3
            if (count === 3 && !show) {
               timer = setTimeout(startSequence, 1000);
            } else {
               startSequence();
            }
        } else if (count === 0 && !isBirthday) {
            setIsBirthday(true);
            setShow(true);
        }

        return () => clearTimeout(timer);
    }, [count]);

    return (
        <div className="countdown-container">
            {isBirthday ? (
                <div className={`birthday-text ${show ? 'show' : ''}`}>
                    HAPPY<br/>BIRTHDAY
                </div>
            ) : (
                <div className={`countdown-text ${show ? 'show' : ''}`}>
                    {count > 0 ? count : ''}
                </div>
            )}
        </div>
    );
};

export default Countdown;
