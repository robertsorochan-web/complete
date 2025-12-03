import React from 'react';
import ModernAssessment from './ModernAssessment';

const Assessment = ({ assessmentData, setAssessmentData, purpose }) => {
  return <ModernAssessment assessmentData={assessmentData} setAssessmentData={setAssessmentData} purpose={purpose} />;
};

export default Assessment;
