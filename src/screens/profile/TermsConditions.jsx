import Header from '../../components/Header';
import './ProfilePages.css';

export default function TermsConditions() {
  return (
    <div className="screen screen-with-header" id="terms-conditions-screen">
      <Header title="Terms & Conditions" />
      <div className="screen-content">
        <div className="legal-content animate-fadeInUp">
          <p className="legal-updated">Last updated: May 01, 2026</p>

          <h4 className="legal-heading">1. Acceptance of Terms</h4>
          <p className="legal-text">
            By downloading, installing, or using the Auto Pro application, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the app.
          </p>

          <h4 className="legal-heading">2. Services Offered</h4>
          <p className="legal-text">Auto Pro provides the following services:</p>
          <ul className="legal-list">
            <li>Car inspection booking and reports</li>
            <li>Buy and sell used/new cars</li>
            <li>Car accessories marketplace</li>
            <li>Emergency roadside assistance (Jump Starter, Towing)</li>
            <li>Car-related consultation and support</li>
          </ul>

          <h4 className="legal-heading">3. User Account</h4>
          <p className="legal-text">
            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
          </p>

          <h4 className="legal-heading">4. Bookings & Payments</h4>
          <ul className="legal-list">
            <li>All bookings are subject to availability and confirmation</li>
            <li>Prices displayed are inclusive of applicable taxes unless stated otherwise</li>
            <li>Payments can be made via UPI, cards, or cash on service</li>
            <li>Cancellations made 2+ hours before scheduled time are eligible for full refund</li>
            <li>Late cancellations may incur a cancellation fee</li>
          </ul>

          <h4 className="legal-heading">5. Car Listings</h4>
          <p className="legal-text">
            When listing a car for sale, you must provide accurate information about the vehicle's condition, history, and pricing. Misleading or fraudulent listings will be removed and may result in account suspension.
          </p>

          <h4 className="legal-heading">6. Inspection Reports</h4>
          <p className="legal-text">
            Inspection reports are prepared by qualified mechanics based on their professional assessment. While we strive for accuracy, Auto Pro does not guarantee the condition of any vehicle beyond what is stated in the report.
          </p>

          <h4 className="legal-heading">7. User Conduct</h4>
          <p className="legal-text">You agree not to:</p>
          <ul className="legal-list">
            <li>Use the app for any unlawful purpose</li>
            <li>Post false, misleading, or fraudulent content</li>
            <li>Interfere with the app's functionality</li>
            <li>Harass other users or service providers</li>
            <li>Attempt to access other users' accounts</li>
          </ul>

          <h4 className="legal-heading">8. Limitation of Liability</h4>
          <p className="legal-text">
            Auto Pro acts as a platform connecting users with car services. We are not liable for any damages arising from the use of third-party services facilitated through our app, including but not limited to inspection errors, vehicle conditions, or service delays.
          </p>

          <h4 className="legal-heading">9. Intellectual Property</h4>
          <p className="legal-text">
            All content, logos, trademarks, and intellectual property in the Auto Pro app are owned by Auto Pro and protected by applicable laws. Unauthorized use is prohibited.
          </p>

          <h4 className="legal-heading">10. Termination</h4>
          <p className="legal-text">
            We reserve the right to suspend or terminate your account if you violate these terms. You may also delete your account at any time through the app settings.
          </p>

          <h4 className="legal-heading">11. Governing Law</h4>
          <p className="legal-text">
            These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
          </p>

          <h4 className="legal-heading">12. Contact Us</h4>
          <p className="legal-text">
            For any questions regarding these terms, contact us at:
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
