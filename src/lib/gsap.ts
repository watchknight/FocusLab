import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register plugins once centrally
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };
