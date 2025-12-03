const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isInitialized = false;

export const initGA = () => {
  if (!GA_MEASUREMENT_ID || isInitialized) return;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false
  });

  isInitialized = true;
};

export const trackPageView = (pageName) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  
  window.gtag('event', 'page_view', {
    page_title: pageName,
    page_path: `/${pageName.toLowerCase()}`
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) return;
  
  window.gtag('event', eventName, params);
};

export const trackSignup = (purpose) => {
  trackEvent('sign_up', {
    method: 'email',
    purpose: purpose
  });
};

export const trackLogin = () => {
  trackEvent('login', {
    method: 'email'
  });
};

export const trackAssessmentComplete = (scores) => {
  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
  trackEvent('assessment_complete', {
    average_score: avgScore.toFixed(1),
    ...scores
  });
};

export const trackAIChat = () => {
  trackEvent('ai_chat_message');
};

export const trackDiagnosis = () => {
  trackEvent('diagnosis_requested');
};

export const trackShare = (platform) => {
  trackEvent('share', {
    method: platform
  });
};
