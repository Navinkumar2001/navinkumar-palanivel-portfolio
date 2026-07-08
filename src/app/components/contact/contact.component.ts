import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="contact" class="contact-section section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">&lt;Contact /&gt;</span>
          <h2 class="section-title gradient-text">Let's Connect</h2>
          <p class="section-subtitle">Have a project in mind? Let's discuss how we can work together.</p>
        </div>

        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-card glass" *ngFor="let info of contactInfo">
              <!-- Cyber Corners -->
              <div class="cyber-corner top-left"></div>
              <div class="cyber-corner top-right"></div>
              <div class="cyber-corner bottom-left"></div>
              <div class="cyber-corner bottom-right"></div>

              <div class="info-icon">{{ info.icon }}</div>
              <div>
                <span class="info-label">{{ info.label }}</span>
                <a [href]="info.href" class="info-value" target="_blank" rel="noopener">{{ info.value }}</a>
              </div>
            </div>

            <div class="social-links">
              <a href="https://linkedin.com/in/navinkumarpalanivel-fullstack-dev" 
                 target="_blank" rel="noopener" class="social-link glass-sm" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="mailto:navinkumar.it.2001&#64;gmail.com" 
                 class="social-link glass-sm" aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>

            <!-- Cyber HUD Diagnostics Panel -->
            <div class="hud-panel glass-sm">
              <div class="hud-header">
                <span class="hud-dot pulsing"></span>
                <span class="hud-title">HUD DIAGNOSTICS</span>
              </div>
              <div class="hud-logs">
                <div class="hud-log-line"><span class="log-tag">[OK]</span> PORTFOLIO CLIENT ESTABLISHED</div>
                <div class="hud-log-line"><span class="log-tag">[OK]</span> SECURE TRANSPORT READY</div>
                <div class="hud-log-line"><span class="log-tag">[PING]</span> LATENCY: 24MS</div>
                <div class="hud-log-line"><span class="log-tag">[ACTIVE]</span> AWAITING INCOMING CORRESPONDENCE...</div>
              </div>
            </div>
          </div>

          <form class="contact-form glass" #formRef (ngSubmit)="onSubmit()" #contactForm="ngForm">
            <!-- Cyber Corners -->
            <div class="cyber-corner top-left"></div>
            <div class="cyber-corner top-right"></div>
            <div class="cyber-corner bottom-left"></div>
            <div class="cyber-corner bottom-right"></div>

            <!-- Status message -->
            <div class="form-status" *ngIf="statusMessage" [class.success]="!sendError" [class.error]="sendError">
              <span class="status-icon">{{ sendError ? '✕' : '✓' }}</span>
              {{ statusMessage }}
            </div>

            <div class="form-group" [class.focused]="nameFocused" [class.filled]="name.length > 0">
              <span class="terminal-prompt">></span>
              <input type="text" id="name" [(ngModel)]="name" name="from_name" required
                     (focus)="nameFocused = true" (blur)="nameFocused = false">
              <label for="name">Your Name</label>
              <div class="form-line"></div>
            </div>

            <div class="form-group" [class.focused]="emailFocused" [class.filled]="email.length > 0">
              <span class="terminal-prompt">></span>
              <input type="email" id="email" [(ngModel)]="email" name="from_email" required
                     (focus)="emailFocused = true" (blur)="emailFocused = false">
              <label for="email">Your Email</label>
              <div class="form-line"></div>
            </div>

            <div class="form-group" [class.focused]="messageFocused" [class.filled]="message.length > 0">
              <span class="terminal-prompt">></span>
              <textarea id="message" [(ngModel)]="message" name="message" rows="4" required
                        (focus)="messageFocused = true" (blur)="messageFocused = false"></textarea>
              <label for="message">Your Message</label>
              <div class="form-line"></div>
            </div>

            <button type="submit" class="btn-primary magnetic-btn submit-btn" [disabled]="sending || submitted">
              <span *ngIf="!sending && !submitted">Send Message</span>
              <span *ngIf="sending" class="sending-text">
                <span class="spinner"></span> Sending...
              </span>
              <span *ngIf="submitted">Message Sent! ✓</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      position: relative;
      z-index: 10;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 80px;
    }

    .section-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #00d4ff;
      margin-bottom: 16px;
      display: block;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .info-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;

      &:hover {
        transform: translateX(8px);
        border-color: rgba(0, 212, 255, 0.2);
      }

      .info-icon {
        font-size: 1.5rem;
      }

      .info-label {
        display: block;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba(255, 255, 255, 0.4);
        margin-bottom: 2px;
      }

      .info-value {
        color: #fff;
        text-decoration: none;
        font-size: 0.95rem;
        transition: color 0.3s;

        &:hover { color: #00d4ff; }
      }
    }

    .social-links {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }

    .social-link {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      color: rgba(255, 255, 255, 0.6);
      transition: all 0.3s ease;

      &:hover {
        color: #00d4ff;
        transform: translateY(-4px);
        border-color: rgba(0, 212, 255, 0.3);
      }
    }

    /* Diagnostics HUD panel */
    .hud-panel {
      margin-top: 20px;
      padding: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      border-color: rgba(0, 212, 255, 0.12);
      border-radius: 16px;
      position: relative;
    }

    .hud-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 8px;
    }

    .hud-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      
      &.pulsing {
        box-shadow: 0 0 8px #10b981;
        animation: pulse-ring 2s infinite;
      }
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.9); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 12px #10b981; }
      100% { transform: scale(0.9); opacity: 0.5; }
    }

    .hud-title {
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      letter-spacing: 1px;
    }

    .hud-logs {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: rgba(255, 255, 255, 0.4);
    }

    .log-tag {
      color: #00d4ff;
    }

    .contact-form {
      padding: 40px;
      position: relative;
    }

    .form-group {
      position: relative;
      margin-bottom: 32px;
      display: flex;
      align-items: center;

      .terminal-prompt {
        font-family: 'JetBrains Mono', monospace;
        color: #00d4ff;
        margin-right: 12px;
        font-size: 1.1rem;
        opacity: 0.4;
        transition: all 0.3s ease;
        user-select: none;
      }

      input, textarea {
        width: 100%;
        padding: 16px 0 8px;
        background: transparent;
        border: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        font-size: 1rem;
        font-family: inherit;
        outline: none;
        resize: none;
        transition: border-color 0.3s ease;
      }

      label {
        position: absolute;
        top: 16px;
        left: 24px;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.4);
        pointer-events: none;
        transition: all 0.3s ease;
      }

      &::after {
        content: '_';
        position: absolute;
        right: 0;
        bottom: 8px;
        color: #00d4ff;
        font-family: 'JetBrains Mono', monospace;
        opacity: 0;
        font-weight: 700;
      }

      &.focused::after {
        opacity: 1;
        animation: blink 1s infinite steps(2);
      }

      @keyframes blink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }

      &.focused label,
      &.filled label {
        top: -4px;
        left: 24px;
        font-size: 0.7rem;
        color: #00d4ff;
      }

      &.focused .terminal-prompt {
        opacity: 1;
        color: #a855f7;
        text-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
      }

      .form-line {
        position: absolute;
        bottom: 0;
        left: 24px;
        right: 0;
        height: 2px;
        width: 0;
        background: linear-gradient(90deg, #00d4ff, #a855f7);
        transition: width 0.3s ease;
      }

      &.focused .form-line {
        width: calc(100% - 24px);
      }
    }

    .submit-btn {
      width: 100%;
      padding: 16px;
      font-size: 1rem;
      border: none;
      cursor: pointer;

      &:disabled {
        opacity: 0.7;
        cursor: default;
      }
    }

    /* Form status message */
    .form-status {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: slideDown 0.3s ease;

      &.success {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #10b981;
      }

      &.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
      }
    }

    .status-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 0.7rem;
      font-weight: 700;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Sending spinner */
    .sending-text {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class ContactComponent implements AfterViewInit {
  @ViewChild('formRef') formRef!: ElementRef<HTMLFormElement>;

  name = '';
  email = '';
  message = '';
  nameFocused = false;
  emailFocused = false;
  messageFocused = false;
  submitted = false;
  sending = false;
  sendError = false;
  statusMessage = '';

  // EmailJS credentials from environment config
  private readonly EMAILJS_SERVICE_ID = environment.emailJs.serviceId;
  private readonly EMAILJS_TEMPLATE_ID = environment.emailJs.templateId;
  private readonly EMAILJS_AUTO_REPLY_TEMPLATE_ID = environment.emailJs.autoReplyTemplateId;
  private readonly EMAILJS_PUBLIC_KEY = environment.emailJs.publicKey;

  contactInfo = [
    { icon: '📧', label: 'Email', value: 'navinkumar.it.2001@gmail.com', href: 'mailto:navinkumar.it.2001@gmail.com' },
    { icon: '📱', label: 'Phone', value: '+91 7397063122', href: 'tel:+917397063122' },
    { icon: '💼', label: 'LinkedIn', value: 'navinkumar-palanivel', href: 'https://linkedin.com/in/navinkumar-palanivel-fullstack-dev' },
    { icon: '📍', label: 'Location', value: 'Chennai, India', href: '#' },
  ];

  ngAfterViewInit(): void {
    document.querySelectorAll('.info-card').forEach((card) => {
      (card as HTMLElement).style.opacity = '1';
    });
    const form = document.querySelector('.contact-form') as HTMLElement;
    if (form) form.style.opacity = '1';
  }

  onSubmit(): void {
    if (!this.name || !this.email || !this.message) return;

    this.sending = true;
    this.statusMessage = '';
    this.sendError = false;

    const formElement = this.formRef.nativeElement;

    // Send notification email to you + auto-reply to sender
    Promise.all([
      emailjs.sendForm(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        formElement,
        this.EMAILJS_PUBLIC_KEY,
      ),
      emailjs.sendForm(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_AUTO_REPLY_TEMPLATE_ID,
        formElement,
        this.EMAILJS_PUBLIC_KEY,
      ),
    ])
      .then(
        () => {
          this.sending = false;
          this.submitted = true;
          this.statusMessage = 'Message sent successfully! Check your inbox for a confirmation.';
          this.sendError = false;

          setTimeout(() => {
            this.submitted = false;
            this.statusMessage = '';
            this.name = '';
            this.email = '';
            this.message = '';
          }, 5000);
        },
      )
      .catch(
        (error) => {
          this.sending = false;
          this.sendError = true;
          this.statusMessage = 'Failed to send message. Please try again or email me directly.';
          console.error('EmailJS Error:', error);

          setTimeout(() => {
            this.statusMessage = '';
          }, 5000);
        },
      );
  }
}
