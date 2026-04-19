import React, { useEffect, useRef } from 'react';
import './MatrixRain.css';

const MatrixRain = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789HAPPYBIRTHDAY';
        const charsArray = characters.split('');
        const fontSize = 22; 
        
        let columns = Math.floor(canvas.width / fontSize);
        let drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }

        const handleResize = () => {
            resizeCanvas();
            const newColumns = Math.floor(canvas.width / fontSize);
            if (newColumns > drops.length) {
                for (let i = drops.length; i < newColumns; i++) {
                    drops[i] = Math.floor(Math.random() * (canvas.height / fontSize)); 
                }
            } else {
                drops.length = newColumns;
            }
        };

        window.addEventListener('resize', handleResize);

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(5, 0, 5, 0.15)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = fontSize + 'px monospace';
            ctx.textAlign = 'center';

            for (let i = 0; i < drops.length; i++) {
                if (drops[i] < 0) {
                    drops[i]++;
                    continue;
                }

                const text = charsArray[Math.floor(Math.random() * charsArray.length)];
                const rand = Math.random();
                
                if (rand > 0.95) {
                    ctx.fillStyle = '#ffffff'; 
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#ff3399';
                } else if (rand > 0.8) {
                    ctx.fillStyle = '#ff99cc'; 
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = '#ff3399'; 
                    ctx.shadowBlur = 0;
                }

                const x = i * fontSize + (fontSize / 2);
                const y = drops[i] * fontSize;
                ctx.fillText(text, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const matrixInterval = setInterval(drawMatrix, 50);

        return () => {
            clearInterval(matrixInterval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="matrix-canvas" />;
};

export default MatrixRain;
