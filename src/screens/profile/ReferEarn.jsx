import { useState } from 'react';
import Header from '../../components/Header';
import './ProfilePages.css';

export default function ReferEarn() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'AUTOPRO' + Math.random().toString(36).substring(2, 6).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = referralCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    const shareText = `🚗 Auto Pro - Best car inspection & services!\n\nUse my referral code: ${referralCode}\nGet ₹200 off on your first booking!\n\nDownload now!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Auto Pro - Refer & Earn',
        text: shareText
      }).catch(() => {});
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="screen screen-with-header" id="refer-earn-screen">
      <Header title="Refer & Earn" />
      <div className="screen-content">
        {/* Hero Section */}
        <div className="refer-hero animate-fadeInUp">
          <div className="refer-hero-icon">🎁</div>
          <h2 className="refer-hero-title">Earn ₹200 for every friend!</h2>
          <p className="refer-hero-desc">
            Invite your friends to Auto Pro. When they complete their first booking, 
            you both get ₹200 in your wallet!
          </p>
        </div>

        {/* Steps */}
        <div className="refer-steps animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <h4 className="payment-section-title">How it works</h4>
          <div className="refer-step">
            <div className="refer-step-num">1</div>
            <div className="refer-step-info">
              <p className="refer-step-title">Share your code</p>
              <p className="refer-step-desc">Share your unique referral code with friends</p>
            </div>
          </div>
          <div className="refer-step">
            <div className="refer-step-num">2</div>
            <div className="refer-step-info">
              <p className="refer-step-title">Friend signs up</p>
              <p className="refer-step-desc">They register using your referral code</p>
            </div>
          </div>
          <div className="refer-step">
            <div className="refer-step-num">3</div>
            <div className="refer-step-info">
              <p className="refer-step-title">Both earn ₹200</p>
              <p className="refer-step-desc">You both get ₹200 after their first booking</p>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="refer-code-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <p className="refer-code-label">Your Referral Code</p>
          <div className="refer-code-box">
            <span className="refer-code-text">{referralCode}</span>
            <button className="refer-copy-btn" onClick={handleCopy}>
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Share Button */}
        <button
          className="btn btn-primary mt-24 animate-fadeInUp"
          style={{ animationDelay: '0.3s' }}
          onClick={handleShare}
          id="btn-share-referral"
        >
          📤 Share with Friends
        </button>

        {/* Rewards Summary */}
        <div className="refer-rewards animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
          <div className="refer-reward-item">
            <span className="refer-reward-value">0</span>
            <span className="refer-reward-label">Friends Invited</span>
          </div>
          <div className="refer-reward-divider"></div>
          <div className="refer-reward-item">
            <span className="refer-reward-value">₹0</span>
            <span className="refer-reward-label">Total Earned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
