import { Step } from 'intro.js-react';

export const introSteps: Step[] = [
  {
    element: '#hero-section',
    intro: `
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-sky-900">Welcome to Gujarat Innovation Platform! 🚀</h2>
        <p class="text-sky-700">Your gateway to innovation and entrepreneurship in Gujarat</p>
      </div>
    `,
    position: 'bottom'
  },
  {
    element: '#get-started-btn',
    intro: `
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-sky-900">Get Started</h2>
        <p class="text-sky-700">Begin your innovation journey by registering your startup or exploring opportunities</p>
      </div>
    `,
    position: 'bottom'
  },
  {
    element: '#features-section',
    intro: `
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-sky-900">Platform Features</h2>
        <ul class="space-y-2 text-sky-700">
          <li>🎯 Access funding opportunities</li>
          <li>👥 Connect with mentors</li>
          <li>📚 Get resources & support</li>
          <li>🌐 Join innovation network</li>
        </ul>
      </div>
    `,
    position: 'bottom'
  },
  {
    element: '#stats-section',
    intro: `
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-sky-900">Our Impact</h2>
        <div class="grid grid-cols-2 gap-4 text-sky-700">
          <div>
            <div class="font-bold text-lg">1000+</div>
            <div class="text-sm">Startups</div>
          </div>
          <div>
            <div class="font-bold text-lg">₹500Cr</div>
            <div class="text-sm">Funding Raised</div>
          </div>
        </div>
      </div>
    `,
    position: 'top'
  },
  {
    element: '#contact-section',
    intro: `
      <div class="space-y-4">
        <h2 class="text-xl font-bold text-sky-900">Need Help?</h2>
        <p class="text-sky-700">Our team is here to assist you at every step of your journey</p>
      </div>
    `,
    position: 'top'
  }
];

export const introOptions = {
  showProgress: true,
  showBullets: true,
  exitOnOverlayClick: false,
  showStepNumbers: false,
  keyboardNavigation: true,
  showButtons: true,
  doneLabel: 'Get Started',
  nextLabel: 'Next →',
  prevLabel: '← Back',
  hidePrev: false,
  hideNext: false,
  overlayOpacity: 0.7,
  disableInteraction: false,
  helperElementPadding: 10,
  tooltipClass: 'intro-tooltip-custom',
  highlightClass: 'intro-highlight-custom',
  buttonClass: 'intro-button-custom'
}; 