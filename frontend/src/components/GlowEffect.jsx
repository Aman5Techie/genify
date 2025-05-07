import { useEffect, useRef } from 'react';

function GlowEffect() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Track mouse position
    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Create light orbs
    const orbs = [];
    for (let i = 0; i < 5; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 200 + 100,
        color: i % 2 === 0 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(168, 85, 247, 0.15)',
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
      });
    }
    
    // Render animation
    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw mouse follower
      const grd = context.createRadialGradient(
        mouseX, mouseY, 10, 
        mouseX, mouseY, 350
      );
      grd.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
      grd.addColorStop(1, 'rgba(59, 130, 246, 0)');
      context.fillStyle = grd;
      context.beginPath();
      context.arc(mouseX, mouseY, 350, 0, Math.PI * 2);
      context.fill();
      
      // Draw orbs
      orbs.forEach(orb => {
        // Update position
        orb.x += orb.vx;
        orb.y += orb.vy;
        
        // Bounce off edges
        if (orb.x < 0 || orb.x > canvas.width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > canvas.height) orb.vy *= -1;
        
        // Draw glow
        const orbGrd = context.createRadialGradient(
          orb.x, orb.y, 0, 
          orb.x, orb.y, orb.radius
        );
        orbGrd.addColorStop(0, orb.color);
        orbGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = orbGrd;
        context.beginPath();
        context.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        context.fill();
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
}

export default GlowEffect;