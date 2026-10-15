// JavaScript to inject the CSS rule dynamically into any website
const style = document.createElement('style');
style.innerHTML = `
  * {
    -webkit-tap-highlight-color: transparent !important;
    -webkit-touch-callout: none !important;
  }
`;
document.head.appendChild(style);

document.addEventListener('touchstart', function(e) {
  // Optional: Add logic if you only want to target specific elements
}, { passive: true });