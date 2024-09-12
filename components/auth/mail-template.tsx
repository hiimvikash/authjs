import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0' }}>
    <h1 style={{ textAlign: 'center', fontSize: '1.875rem', color: '#4a5568' }}>Welcome, {firstName}!</h1>
  </div>
);
