import Header from '../../components/Header';
import './ProfilePages.css';

export default function PrivacyPolicy() {
  return (
    <div className="screen screen-with-header" id="privacy-policy-screen">
      <Header title="Privacy Policy" />
      <div className="screen-content">
        <div className="legal-content animate-fadeInUp">
          <p className="legal-updated">Last updated: May 01, 2026</p>

          <h4 className="legal-heading">1. Information We Collect</h4>
          <p className="legal-text">
            Auto Pro ("we", "our", or "us") collects the following information when you use our mobile application:
          </p>
          <ul className="legal-list">
            <li>Personal information (name, email, phone number) provided during registration</li>
            <li>Location data to provide nearby services and pickup/delivery</li>
            <li>Vehicle information entered for inspection and listing purposes</li>
            <li>Photos uploaded for car listings and inspection reports</li>
            <li>Payment information for processing transactions</li>
            <li>Device information and usage analytics</li>
          </ul>

          <h4 className="legal-heading">2. How We Use Your Information</h4>
          <p className="legal-text">We use your information to:</p>
          <ul className="legal-list">
            <li>Provide car inspection, buying, and selling services</li>
            <li>Process bookings and payments</li>
            <li>Send service updates and notifications</li>
            <li>Improve our app experience</li>
            <li>Provide customer support</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h4 className="legal-heading">3. Data Sharing</h4>
          <p className="legal-text">
            We do not sell your personal data to third parties. We may share data with:
          </p>
          <ul className="legal-list">
            <li>Service providers who assist in delivering our services</li>
            <li>Payment processors for secure transactions</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h4 className="legal-heading">4. Data Storage & Security</h4>
          <p className="legal-text">
            Your data is stored securely using Firebase (Google Cloud) infrastructure. We implement industry-standard security measures including encryption, secure authentication, and access controls to protect your information.
          </p>

          <h4 className="legal-heading">5. Location Data</h4>
          <p className="legal-text">
            We collect location data to provide location-based services such as nearby mechanics, pickup scheduling, and emergency roadside assistance. You can disable location access through your device settings at any time.
          </p>

          <h4 className="legal-heading">6. Camera & Photos</h4>
          <p className="legal-text">
            Camera access is used solely for uploading car photos for listings and inspection purposes. Photos are stored securely and not shared without your consent.
          </p>

          <h4 className="legal-heading">7. Your Rights</h4>
          <p className="legal-text">You have the right to:</p>
          <ul className="legal-list">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Withdraw consent for data processing</li>
            <li>Export your data</li>
          </ul>

          <h4 className="legal-heading">8. Data Retention</h4>
          <p className="legal-text">
            We retain your data as long as your account is active. Upon account deletion, your personal data will be removed within 30 days, except where retention is required by law.
          </p>

          <h4 className="legal-heading">9. Children's Privacy</h4>
          <p className="legal-text">
            Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
          </p>

          <h4 className="legal-heading">10. Changes to This Policy</h4>
          <p className="legal-text">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app.
          </p>

          <h4 className="legal-heading">11. Contact Us</h4>
          <p className="legal-text">
            If you have questions about this Privacy Policy, contact us at:
          </p>
          <ul className="legal-list">
            <li>📧 Email: support@autopro.in</li>
            <li>📱 WhatsApp: +91 8839533202</li>
            <li>📞 Phone: +91 8839533202</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
