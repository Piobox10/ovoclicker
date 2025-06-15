
import React, { useRef, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { EggStage, EggForm } from '../types';

interface EggCanvasProps {
  currentStage: EggStage;
  nextStageThreshold: Decimal | null;
  activeEggForm: EggForm | null;
  onClick: () => void;
  formatNumber: (num: Decimal) => string;
}

const EggCanvas: React.FC<EggCanvasProps> = ({ currentStage, nextStageThreshold, activeEggForm, onClick, formatNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
        const parentWidth = canvas.parentElement?.clientWidth || 300;
        canvas.width = parentWidth;
        canvas.height = 350; // Keep fixed height
    };
    
    resizeCanvas(); // Initial size

    // Consider adding a resize listener if the parent can change size dynamically
    // window.addEventListener('resize', resizeCanvas);

    const drawEgg = (time: number) => {
      const parentWidth = canvas.parentElement?.clientWidth || 300;
      if(canvas.width !== parentWidth) resizeCanvas(); // Responsive resize if parent width changes

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadiusX = canvas.width * 0.25;
      const baseRadiusY = canvas.height * 0.35;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulseFactor = (Math.sin(time * 0.0015) + 1) / 2; // Oscillates between 0 and 1
      const eggScale = 1 + pulseFactor * 0.015; // Scale from 1 to 1.015
      const dynamicShadowBlurBase = 15 + pulseFactor * 10; // Base pulse: blur 15 to 25

      ctx.save(); // Save context for scaling egg
      ctx.translate(centerX, centerY);
      ctx.scale(eggScale, eggScale);
      ctx.translate(-centerX, -centerY);

      // Base egg shape
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, baseRadiusX, baseRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = currentStage.color;

      if (activeEggForm) {
        ctx.shadowBlur = 25 + pulseFactor * 15; // More intense glow for active form: 25 to 40
        ctx.shadowColor = '#6ee7b7'; // A brighter green like emerald-300 for active form glow
      } else {
        ctx.shadowBlur = dynamicShadowBlurBase;
        ctx.shadowColor = currentStage.color;
      }
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow for other elements drawn inside scaled context if any

      // Active egg form visual effects (drawn within the scaled context)
      if (activeEggForm) {
        ctx.save(); // Save for active form specific transforms if needed
        ctx.translate(centerX, centerY); // Center for active form details

        const detailScaleFactor = 1 / eggScale; // To counteract the main egg's scale for details

        if (activeEggForm.id === 'dragonEgg') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const rX = baseRadiusX * 0.8;
                const rY = baseRadiusY * 0.8;
                const x = rX * Math.cos(angle);
                const y = rY * Math.sin(angle);
                const scaleSize = 10 * detailScaleFactor;
                const offset = 5 * detailScaleFactor;
                ctx.beginPath();
                ctx.arc(x,y, scaleSize, angle -0.3, angle + 0.3);
                ctx.arc(x + Math.cos(angle)*offset,y + Math.sin(angle)*offset, scaleSize, angle -0.3 + Math.PI, angle + 0.3 + Math.PI);
                ctx.closePath();
                ctx.fill();
            }
        } else if (activeEggForm.id === 'phoenixEgg') {
            const flameColor = `rgba(255, ${Math.floor(120 + Math.random() * 135)}, 0, ${0.5 + Math.random() * 0.4})`;
            ctx.fillStyle = flameColor;
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radiusOffset = (Math.random() * 10 + 5) * detailScaleFactor;
                const x = (baseRadiusX * 0.7 * detailScaleFactor + radiusOffset) * Math.cos(angle);
                const y = (baseRadiusY * 0.7 * detailScaleFactor + radiusOffset) * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, (Math.random() * 8 + 3) * detailScaleFactor, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (activeEggForm.id === 'cosmicEggForm') {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 50; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = (Math.random() * Math.min(baseRadiusX * 0.8, baseRadiusY * 0.8)) * detailScaleFactor;
                const x = distance * Math.cos(angle);
                const y = distance * Math.sin(angle);
                ctx.beginPath();
                ctx.arc(x, y, (Math.random() * 1.5 + 0.5) * detailScaleFactor, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (activeEggForm.id === 'abyssalEgg') {
            ctx.save();
            ctx.globalAlpha = 0.3 + Math.sin(performance.now() * 0.001) * 0.1; // Abyssal has its own timing for rings
            ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.ellipse(0,0, baseRadiusX * (0.5 + i * 0.1) * detailScaleFactor, baseRadiusY * (0.5 + i * 0.1) * detailScaleFactor, 0,0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        ctx.restore(); // Restore from active form specific transforms
      }
      ctx.restore(); // Restore from main egg scaling

      // Text inside the egg (drawn on top, unscaled)
      ctx.fillStyle = '#e0e7ff'; // Lighter text color (indigo-100)
      ctx.font = 'bold clamp(1rem, 4vw, 1.25rem) Inter'; // Slightly larger base for name
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const words = currentStage.name.split(' ');
      const maxTextWidth = canvas.width * 0.4; // Max width for text inside egg
      
      // Smart text wrapping for egg name
      let line1 = currentStage.name;
      let line2 = "";
      if (ctx.measureText(line1).width > maxTextWidth && words.length > 1) {
          line1 = "";
          let currentLineWidth = 0;
          let breakIndex = -1;
          for(let i=0; i<words.length; ++i) {
            const wordWidth = ctx.measureText(words[i] + " ").width;
            if (currentLineWidth + wordWidth > maxTextWidth && i > 0) {
                breakIndex = i;
                break;
            }
            line1 += words[i] + " ";
            currentLineWidth += wordWidth;
          }
          if (breakIndex !== -1) {
            line2 = words.slice(breakIndex).join(" ");
          }
          line1 = line1.trim();
      }

      if (line2) {
          ctx.fillText(line1, centerX, centerY - 25);
          ctx.fillText(line2, centerX, centerY - 5);
      } else {
          ctx.fillText(line1, centerX, centerY - 20);
      }

      ctx.font = 'clamp(0.8rem, 3vw, 0.95rem) Inter'; // Slightly larger for threshold
      ctx.fillStyle = '#c7d2fe'; // indigo-200
      if (nextStageThreshold) {
        ctx.fillText(`Próxima: ${formatNumber(nextStageThreshold)} PI`, centerX, centerY + 18);
      } else {
        ctx.fillText('Jornada Completa!', centerX, centerY + 18);
      }

      animationFrameId.current = requestAnimationFrame(drawEgg);
    };

    animationFrameId.current = requestAnimationFrame(drawEgg);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentStage, activeEggForm, nextStageThreshold, formatNumber]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClick}
      className="bg-slate-900 rounded-2xl border-2 border-indigo-500 shadow-[inset_0_0_15px_rgba(79,70,229,0.5)] w-full h-[350px] cursor-pointer mb-4"
      // Enhanced shadow: shadow-[inset_0_0_10px_rgba(102,126,234,0.5)] to shadow-[inset_0_0_15px_rgba(79,70,229,0.5)]
      aria-label="Clique no ovo para incubar"
    />
  );
};

export default EggCanvas;
