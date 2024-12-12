import { driver } from "driver.js";

const steps = [
  {
    element: '#hero-section',
    popover: {
      title: '✨ Welcome to Innovation Hub',
      description: 'Welcome to Gujarat\'s premier innovation platform! We connect startups, investors, and researchers to build a thriving innovation ecosystem.',
      position: 'bottom'
    }
  },
  {
    element: '#startup-section',
    popover: {
      title: '🚀 For Startups',
      description: 'Register your startup to access funding opportunities, connect with mentors, and showcase your innovations to potential investors.',
      position: 'bottom'
    }
  },
  {
    element: '#researcher-section',
    popover: {
      title: '🔬 For Researchers',
      description: 'Share your research, collaborate with startups, and contribute to Gujarat\'s innovation ecosystem. Access grants and research opportunities.',
      position: 'bottom'
    }
  },
  {
    element: '#investor-section',
    popover: {
      title: '💰 For Investors',
      description: 'Discover promising startups, track investment opportunities, and be part of Gujarat\'s growth story. Get detailed analytics and portfolio management tools.',
      position: 'bottom'
    }
  },
  {
    element: '#features-section',
    popover: {
      title: '⚡ Platform Features',
      description: 'Access mentorship programs, funding schemes, networking events, and resources to accelerate your growth. Join workshops and training sessions.',
      position: 'bottom'
    }
  },
  {
    element: '#stats-section',
    popover: {
      title: '📊 Our Impact',
      description: 'Join our growing community of 1000+ startups, 50,000+ innovators, and ₹500Cr+ in funding raised. Be part of Gujarat\'s success story!',
      position: 'top'
    }
  },
  {
    element: '#resources-section',
    popover: {
      title: '📚 Resources Hub',
      description: 'Access guides, tutorials, policy documents, and case studies. Stay updated with latest industry trends and government initiatives.',
      position: 'top'
    }
  },
  {
    element: '#events-section',
    popover: {
      title: '🎯 Events & Programs',
      description: 'Participate in hackathons, pitch competitions, and networking meets. Connect with industry leaders and showcase your innovations.',
      position: 'top'
    }
  },
  {
    element: '#contact-section',
    popover: {
      title: '🤝 Support & Assistance',
      description: 'Our dedicated team is here to help! Get guidance on registration, funding applications, or any other platform-related queries.',
      position: 'top'
    }
  },
  {
    popover: {
      title: '🌟 Ready to Begin?',
      description: 'Sign up now to access all features and join Gujarat\'s largest innovation community. Let\'s build the future together!',
      position: 'center'
    }
  }
];

export const createTourDriver = () => {
  return driver({
    animate: true,
    padding: 10,
    showProgress: true,
    showButtons: ['next', 'previous', 'close'],
    steps: steps,
    className: 'driverjs-theme',
    allowClose: false,
    smoothScroll: true,
    stagePadding: 5,
    popoverClass: 'driverjs-theme',
    progressText: 'Step {{current}} of {{total}}',
    onHighlightStarted: (element) => {
      element.style.transition = 'all 0.3s ease-out';
    },
    onDeselected: (element) => {
      element.style.transition = 'all 0.3s ease-in';
    }
  });
}; 