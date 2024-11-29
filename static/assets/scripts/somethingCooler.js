document.addEventListener("DOMContentLoaded", function() {
  const cursorBlur = document.createElement("div");
  cursorBlur.classList.add("cursor-blur");
  document.body.appendChild(cursorBlur);
  let cursorX = 0;
  let cursorY = 0;
  let currentX = 0;
  let currentY = 0;
  let lastMoveTime = Date.now();
  let isPulsing = false;
  document.addEventListener("mousemove", function(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    lastMoveTime = Date.now();
    if (isPulsing) {
      cursorBlur.classList.remove("pulsing");
      isPulsing = false;
    }
  });
  function updateCursorPosition() {
    const dx = cursorX - currentX;
    const dy = cursorY - currentY;
    currentX += (dx / 2) * 0.1;
    currentY += dy * 0.1;
    cursorBlur.style.transform = `translate(${currentX}px, ${currentY}px)`;
    if (Date.now() - lastMoveTime > 500 && !isPulsing) {
      cursorBlur.classList.add("pulsing");
      isPulsing = true;
    }
    requestAnimationFrame(updateCursorPosition);
  }
  updateCursorPosition();
});
