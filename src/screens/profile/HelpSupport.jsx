import Header from '../../components/Header';
import './ProfilePages.css';

const SUPPORT_NUMBER = '8839533202';

export default function HelpSupport() {
  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I need help with Auto Pro app.');
    window.open(`https://wa.me/91${SUPPORT_NUMBER}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:+91${SUPPORT_NUMBER}`);
  };

  const faqs = [
    {
      q: 'How do I book an inspection?',
      a: 'Go to Home → Book Inspection → Fill car details → Choose pickup location → Confirm booking.'
    },
    {
      q: 'What is the inspection cost?',
      a: 'Basic inspection starts at ₹499. Premium and comprehensive plans are also available.'
    },
    {
      q: 'Can I cancel my booking?',
      a: 'Yes, you can cancel up to 2 hours before the scheduled pickup time for a full refund.'
    },
    {
      q: 'How to sell my car?',
      a: 'Go to Sell Car from home screen, fill in car details with photos, and submit. Our team will contact you.'
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support UPI, Debit/Credit cards, and Cash on Service.'
    },
  ];

  return (
    <div className="screen screen-with-header" id="help-support-screen">
      <Header title="Help & Support" />
      <div className="screen-content">
        {/* Contact Section */}
        <div className="help-contact-section animate-fadeInUp">
          <div className="help-contact-header">
            <div className="help-contact-icon">🎧</div>
            <div>
              <h3 className="help-contact-title">Need Help?</h3>
              <p className="help-contact-desc">Our support team is available 24/7</p>
            </div>
          </div>

          <div className="help-contact-buttons">
            <button className="help-contact-btn help-whatsapp-btn" onClick={handleWhatsApp} id="btn-whatsapp-support">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <span className="help-btn-label">WhatsApp</span>
                <span className="help-btn-number">+91 {SUPPORT_NUMBER}</span>
              </div>
            </button>

            <button className="help-contact-btn help-call-btn" onClick={handleCall} id="btn-call-support">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <div>
                <span className="help-btn-label">Call Us</span>
                <span className="help-btn-number">+91 {SUPPORT_NUMBER}</span>
              </div>
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="help-faq-section animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
          <h4 className="payment-section-title">Frequently Asked Questions</h4>
          {faqs.map((faq, index) => (
            <details key={index} className="help-faq-item">
              <summary className="help-faq-question">
                <span>{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </summary>
              <p className="help-faq-answer">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* Email Section */}
        <div className="help-email-section animate-fadeInUp" style={{ animationDelay: '0.25s' }}>
          <div className="payment-option-card">
            <div className="payment-option-icon">📧</div>
            <div className="payment-option-info">
              <p className="payment-option-name">Email Support</p>
              <p className="payment-option-desc">support@autopro.in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
