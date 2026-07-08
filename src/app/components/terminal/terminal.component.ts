import {
  Component,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TerminalLine {
  type: 'input' | 'output' | 'ascii' | 'error' | 'success';
  text: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss',
})
export class TerminalComponent implements AfterViewChecked {
  @ViewChild('terminalBody') terminalBodyRef!: ElementRef<HTMLElement>;
  @ViewChild('inputEl') inputElRef!: ElementRef<HTMLInputElement>;

  isOpen = false;
  currentInput = '';
  history: TerminalLine[] = [];
  commandHistory: string[] = [];
  historyIndex = -1;
  private shouldScroll = false;

  asciiArt = [
    ' _   _             _       _                                ',
    '| \\ | | __ ___   _(_)_ __ | | ___   _ _ __ ___   __ _ _ __ ',
    '|  \\| |/ _` \\ \\ / / | \'_ \\| |/ / | | | \'_ ` _ \\ / _` | \'__|',
    '| |\\  | (_| |\\ V /| | | | |   <| |_| | | | | | | (_| | |   ',
    '|_| \\_|\\__,_| \\_/ |_|_| |_|_|\\_\\\\__,_|_| |_| |_|\\__,_|_|   ',
  ].join('\n');

  private commands: Record<string, () => string[]> = {
    help: () => [
      '<span style="color:#ffd740">Available Commands:</span>',
      '',
      '  <span style="color:#00d4ff">whoami</span>        - About me',
      '  <span style="color:#00d4ff">skills</span>        - My tech stack',
      '  <span style="color:#00d4ff">experience</span>    - Work history',
      '  <span style="color:#00d4ff">projects</span>      - Featured projects',
      '  <span style="color:#00d4ff">contact</span>       - How to reach me',
      '  <span style="color:#00d4ff">hire me</span>       - Why you should hire me',
      '  <span style="color:#00d4ff">resume</span>        - Download my resume',
      '  <span style="color:#00d4ff">social</span>        - Social links',
      '  <span style="color:#00d4ff">sudo rm -rf doubts</span> - Easter egg',
      '  <span style="color:#00d4ff">clear</span>         - Clear terminal',
      '  <span style="color:#00d4ff">exit</span>          - Close terminal',
    ],
    whoami: () => [
      '<span style="color:#69f0ae">Navinkumar Palanivel</span>',
      '',
      'Full-Stack Developer',
      'Intellect Design Arena Ltd',
      'Chennai, India | 3+ Years Experience',
      '',
      'I build enterprise-grade FinTech and AI-powered platforms.',
    ],
    skills: () => [
      '<span style="color:#ffd740">Technical Skills:</span>',
      '',
      '  <span style="color:#ff5f57">Frontend</span>   - Angular, Vue.js, TypeScript, JavaScript',
      '  <span style="color:#28c840">Backend</span>    - Python, FastAPI, Node.js',
      '  <span style="color:#febc2e">Database</span>   - PostgreSQL, MongoDB, SQL',
      '  <span style="color:#00d4ff">DevOps</span>     - Docker, CI/CD, Git',
      '  <span style="color:#a855f7">AI/ML</span>      - Document Processing, NLP, OCR',
    ],
    experience: () => [
      '<span style="color:#ffd740">Work Experience:</span>',
      '',
      '<span style="color:#00d4ff">Intellect Design Arena Ltd</span>',
      'Full-Stack Developer | 2021 - Present',
      '',
      '- Enterprise FinTech platform development',
      '- AI-powered insurance systems',
      '- Legacy system migration to Angular',
      '- 50+ features shipped to production',
    ],
    projects: () => [
      '<span style="color:#ffd740">Featured Projects:</span>',
      '',
      '<span style="color:#00d4ff">FinTech Banking Platform</span> - Enterprise banking app, 1000+ daily users',
      '<span style="color:#a855f7">AI Insurance Underwriting</span> - ML-powered risk assessment',
      '<span style="color:#69f0ae">Legacy Migration Framework</span> - Zero-downtime migration tool',
      '<span style="color:#ff80ab">Intelligent Doc Processor</span> - OCR + NLP, 90%+ accuracy',
    ],
    contact: () => [
      '<span style="color:#ffd740">Contact:</span>',
      '',
      '  Email: navinkumar.it.2001&#64;gmail.com',
      '  Phone: +91 7397063122',
      '  LinkedIn: navinkumar-palanivel-fullstack-dev',
      '  Location: Chennai, India',
    ],
    'hire me': () => [
      '<span style="color:#28c840">Why hire me?</span>',
      '',
      '  - 3+ years enterprise development',
      '  - Full-stack: frontend to deployment',
      '  - Platforms serving thousands daily',
      '  - AI/ML integration expertise',
      '  - Zero-downtime migration specialist',
      '',
      '  <span style="color:#28c840">Status: Open to opportunities</span>',
    ],
    resume: () => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = 'assets/Navinkumar_Palanivel_Updated_Resume.pdf';
        link.download = 'Navinkumar_Palanivel_Resume.pdf';
        link.click();
      }, 500);
      return ['<span style="color:#28c840">Downloading resume...</span>'];
    },
    social: () => [
      '<span style="color:#ffd740">Social Links:</span>',
      '',
      '  LinkedIn: linkedin.com/in/navinkumar-palanivel-fullstack-dev',
      '  Email: navinkumar.it.2001&#64;gmail.com',
    ],
    'sudo rm -rf doubts': () => [
      '',
      '  <span style="color:#ff5f57">[sudo]</span> password for visitor: ********',
      '  <span style="color:#28c840">Successfully removed all doubts!</span>',
      '',
      '  rm: removing /doubts/can-he-code.............. <span style="color:#28c840">done</span>',
      '  rm: removing /doubts/is-he-reliable........... <span style="color:#28c840">done</span>',
      '  rm: removing /doubts/will-he-deliver.......... <span style="color:#28c840">done</span>',
      '',
      '  <span style="color:#ffd740">0 doubts remaining. Hire with confidence!</span>',
    ],
    clear: () => {
      this.history = [];
      return [];
    },
    exit: () => {
      setTimeout(() => this.close(), 300);
      return ['<span style="color:rgba(255,255,255,0.4)">Closing terminal... Goodbye!</span>'];
    },
  };

  @HostListener('document:keydown', ['$event'])
  onGlobalKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && (event.key === '`' || event.key === '~' || event.key === '/' || event.code === 'Backquote')) {
      event.preventDefault();
      this.toggle();
    }
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
    if (this.isOpen && this.inputElRef) {
      this.inputElRef.nativeElement.focus();
    }
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  onOverlayClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('terminal-overlay')) {
      this.close();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.executeCommand();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.currentInput = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.currentInput = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
      } else {
        this.historyIndex = -1;
        this.currentInput = '';
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      this.autocomplete();
    }
  }

  private executeCommand(): void {
    const input = this.currentInput.trim();
    if (!input) return;

    this.history.push({ type: 'input', text: input });
    this.commandHistory.push(input);
    this.historyIndex = -1;
    this.currentInput = '';

    const cmd = input.toLowerCase();
    const handler = this.commands[cmd];

    if (handler) {
      const output = handler();
      output.forEach((line) => {
        this.history.push({ type: 'output', text: line });
      });
    } else {
      this.history.push({
        type: 'error',
        text: 'command not found: ' + input + '. Type <span style="color:#ffd740">help</span> for available commands.',
      });
    }

    this.shouldScroll = true;
  }

  private autocomplete(): void {
    const input = this.currentInput.toLowerCase();
    if (!input) return;

    const matches = Object.keys(this.commands).filter((cmd) => cmd.startsWith(input));
    if (matches.length === 1) {
      this.currentInput = matches[0];
    } else if (matches.length > 1) {
      this.history.push({ type: 'output', text: matches.join('  ') });
      this.shouldScroll = true;
    }
  }

  private scrollToBottom(): void {
    const el = this.terminalBodyRef?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
