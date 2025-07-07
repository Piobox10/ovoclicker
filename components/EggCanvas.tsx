
import React, { useRef, useEffect } from 'react';
import { Decimal } from 'decimal.js';
import { EggStage, EggForm } from '../types';

interface EggCanvasProps {
  currentStage: EggStage;
  nextStageThreshold: Decimal | null;
  activeEggForms: EggForm[];
  onClick: () => void;
  formatNumber: (num: Decimal) => string;
}

const EggCanvas: React.FC<EggCanvasProps> = ({ currentStage, nextStageThreshold, activeEggForms, onClick, formatNumber }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const particleAnimationTime = useRef(0); // For continuous particle-like animations

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

    const drawEgg = (time: number) => {
      particleAnimationTime.current = time; // Store time for continuous animations
      const parentWidth = canvas.parentElement?.clientWidth || 300;
      if(canvas.width !== parentWidth) resizeCanvas(); 

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadiusX = canvas.width * 0.25;
      const baseRadiusY = canvas.height * 0.35;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pulseFactor = (Math.sin(time * 0.0015) + 1) / 2; 
      const eggScale = 1 + pulseFactor * 0.015; 
      const dynamicShadowBlurBase = 15 + pulseFactor * 10; 

      ctx.save(); 
      ctx.translate(centerX, centerY);
      ctx.scale(eggScale, eggScale);
      ctx.translate(-centerX, -centerY);

      // Base egg shape
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, baseRadiusX, baseRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = currentStage.color;

      if (activeEggForms && activeEggForms.length > 0) {
        ctx.shadowBlur = 25 + pulseFactor * 15;
        // Use a neutral "magic" glow for multiple forms, or a specific accent for one.
        ctx.shadowColor = activeEggForms.length > 1 ? '#a78bfa' : '#6ee7b7';
      } else {
        ctx.shadowBlur = dynamicShadowBlurBase;
        ctx.shadowColor = currentStage.color;
      }
      ctx.fill();
      ctx.shadowBlur = 0; 

      // Active egg form visual effects - now loops through all active forms
      activeEggForms.forEach(activeEggForm => {
        if (activeEggForm) {
            ctx.save();
            ctx.translate(centerX, centerY); 

            const detailScaleFactor = 1 / eggScale; 

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
                ctx.globalAlpha = 0.3 + Math.sin(time * 0.001) * 0.1; 
                ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.ellipse(0,0, baseRadiusX * (0.5 + i * 0.1) * detailScaleFactor, baseRadiusY * (0.5 + i * 0.1) * detailScaleFactor, 0,0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.restore();
            } else if (activeEggForm.id === 'fractalCrystalEgg') {
                const numShards = 15;
                for (let i = 0; i < numShards; i++) {
                    const angle = (i / numShards) * Math.PI * 2 + (time * 0.0002);
                    const distance = (baseRadiusX * 0.9 + Math.sin(time * 0.0005 + i) * 10) * detailScaleFactor;
                    const x = distance * Math.cos(angle);
                    const y = distance * Math.sin(angle) * (baseRadiusY / baseRadiusX); // Adjust for ellipse shape
                    
                    const shardSize = (10 + Math.sin(time * 0.001 + i * 0.5) * 5) * detailScaleFactor;
                    const shardAngle = Math.random() * Math.PI * 2;

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(shardAngle + time * 0.0003);
                    ctx.beginPath();
                    ctx.moveTo(0, -shardSize / 2);
                    ctx.lineTo(shardSize / 3, shardSize / 2);
                    ctx.lineTo(-shardSize / 3, shardSize / 2);
                    ctx.closePath();

                    const alpha = 0.4 + Math.sin(time * 0.001 + i) * 0.2;
                    ctx.fillStyle = `rgba(173, 216, 230, ${alpha})`; // Light blue
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha + 0.2})`; // White border
                    ctx.lineWidth = 1 * detailScaleFactor;
                    ctx.fill();
                    ctx.stroke();
                    ctx.restore();
                }
            } else if (activeEggForm.id === 'dreamWeaverEgg') {
                const numSwirls = 8;
                for (let i = 0; i < numSwirls; i++) {
                    const angleOffset = (i / numSwirls) * Math.PI * 2;
                    const swirlRadius = (baseRadiusX * 0.6 + Math.sin(time * 0.0003 + angleOffset) * 15) * detailScaleFactor;
                    const x = swirlRadius * Math.cos(time * 0.0002 + angleOffset);
                    const y = swirlRadius * Math.sin(time * 0.0002 + angleOffset) * (baseRadiusY / baseRadiusX) * 0.7;

                    const particleSize = (3 + Math.cos(time * 0.0005 + i) * 2) * detailScaleFactor;
                    const alpha = 0.3 + Math.sin(time * 0.0008 + i * 0.7) * 0.2;

                    ctx.beginPath();
                    ctx.arc(x, y, particleSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(221, 214, 254, ${alpha})`; // Lavender (violet-100)
                    ctx.shadowColor = `rgba(196, 181, 253, ${alpha * 0.5})`; // violet-300
                    ctx.shadowBlur = 5 * detailScaleFactor;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            } else if (activeEggForm.id === 'necroEnergyEgg') {
                const numWisps = 10;
                ctx.strokeStyle = `rgba(109, 40, 217, ${0.4 + Math.sin(time * 0.001) * 0.2})`; // violet-700
                ctx.lineWidth = (2 + Math.sin(time * 0.0005) * 1) * detailScaleFactor;
                ctx.shadowColor = `rgba(76, 29, 149, 0.5)`; // violet-900
                ctx.shadowBlur = 8 * detailScaleFactor;

                for (let i = 0; i < numWisps; i++) {
                    ctx.beginPath();
                    const startAngle = (i / numWisps) * Math.PI * 2 + time * 0.0001;
                    const startX = baseRadiusX * 0.7 * Math.cos(startAngle) * detailScaleFactor;
                    const startY = baseRadiusY * 0.7 * Math.sin(startAngle) * detailScaleFactor;
                    ctx.moveTo(startX, startY);

                    const controlX1 = startX + (Math.sin(time * 0.0004 + i * 1.1) * 20) * detailScaleFactor;
                    const controlY1 = startY + (Math.cos(time * 0.0004 + i * 1.2) * 20) * detailScaleFactor;
                    const controlX2 = startX + (Math.cos(time * 0.0003 + i * 1.3) * 40) * detailScaleFactor;
                    const controlY2 = startY + (Math.sin(time * 0.0003 + i * 1.4) * 40) * detailScaleFactor;
                    const endX = startX + (Math.sin(time * 0.0002 + i * 1.5) * 60) * detailScaleFactor;
                    const endY = startY + (Math.cos(time * 0.0002 + i * 1.6) * 60) * detailScaleFactor;

                    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
            }
            ctx.restore(); 
        }
      });
      ctx.restore(); 

      // Text inside the egg
      ctx.fillStyle = 'var(--egg-stage-text-color, #e0e7ff)'; 
      ctx.font = 'bold clamp(1rem, 4vw, 1.25rem) Inter'; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const words = currentStage.name.split(' ');
      const maxTextWidth = canvas.width * 0.4; 
      
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

      ctx.font = 'clamp(0.8rem, 3vw, 0.95rem) Inter'; 
      ctx.fillStyle = 'var(--egg-stage-text-color, #c7d2fe)'; 
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
    };
  }, [currentStage, activeEggForms, nextStageThreshold, formatNumber]);

  return (
    <canvas
      ref={canvasRef}
      onClick={onClick}
      className="bg-[var(--bg-panel-primary)] rounded-2xl border-2 border-[var(--egg-canvas-border)] shadow-[inset_0_0_15px_var(--egg-canvas-shadow)] w-full h-[350px] cursor-pointer mb-4"
      aria-label="Clique no ovo para incubar"
    />
  );
};

export default EggCanvas;
