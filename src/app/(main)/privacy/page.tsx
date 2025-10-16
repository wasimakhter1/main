'use client';
import { useState, useEffect } from 'react';
import Workspace from '@/components/workspace';

export default function PrivacyPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);
  
  return (
    <Workspace title="Privacy Policy" description="Your privacy is important to us.">
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: {lastUpdated || '...'}</p>
        
        <h2 className="text-foreground">Introduction</h2>
        <p>
          ImageResizeKit ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our website and services.
        </p>
        
        <h2 className="text-foreground">No Data Collection</h2>
        <p>
          We do not collect, store, or transmit any of your personal data or the images you process. All image manipulation, including resizing, converting, and compressing, is performed directly in your web browser on your own device.
        </p>
        <p>
          Because we do not have servers that process or store your images, your files never leave your computer. This ensures the highest level of privacy and security for your data.
        </p>

        <h2 className="text-foreground">Cookies and Local Storage</h2>
        <p>
          We use `localStorage` in your browser for the sole purpose of remembering your theme preference (light or dark mode) and sidebar state. This information is stored only on your device and is not accessible by us. We do not use tracking cookies or any other analytics tools to monitor your activity.
        </p>
        
        <h2 className="text-foreground">Third-Party Services</h2>
        <p>
          Our website does not integrate with any third-party services that would collect your personal information.
        </p>

        <h2 className="text-foreground">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>
        
        <h2 className="text-foreground">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, you can contact us by email.
        </p>
      </div>
    </Workspace>
  );
}
