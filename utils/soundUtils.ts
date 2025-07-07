// utils/soundUtils.ts
import { Decimal } from 'decimal.js';

/**
 * Attempts to play a sound file.
 * @param soundFile The path to the sound file (e.g., 'sounds/click.mp3').
 * @param isSoundEnabled A boolean indicating if sound effects are globally enabled.
 * @param volume Optional volume level (0.0 to 1.0). Defaults to 1.0.
 */
export const playSound = (soundFile: string, isSoundEnabled: boolean, volume: number = 1.0) => {
  if (isSoundEnabled) {
    try {
      const audio = new Audio(`/sounds/${soundFile}`); // Assuming sounds are in public/sounds
      audio.volume = Math.max(0, Math.min(1, volume)); // Clamp volume
      audio.play().catch(error => {
        // Autoplay restrictions might prevent sound without user interaction
        // Or the file might be missing. Log silently for now.
        // console.warn(`Could not play sound ${soundFile}:`, error);
      });
    } catch (e) {
      // console.warn(`Error initializing sound ${soundFile}:`, e);
    }
  }
};
