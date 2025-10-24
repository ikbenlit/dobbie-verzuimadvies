'use client';

import { useMemo } from 'react';
import { marked, Renderer, Tokens } from 'marked';
import { cn } from '@/lib/utils/cn';

interface ChatMessageProps {
  message: string;
  sender: 'bot' | 'user';
  showAvatar?: boolean;
  className?: string;
}

// Helper function to parse basic markdown
function parseBasicMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
}

// Create custom renderer for DoBbie-specific content
function createDoBbieRenderer(): Renderer {
  const renderer = new marked.Renderer();

  // Custom text rendering for professional keywords
  renderer.text = (token: Tokens.Text | Tokens.Escape | Tokens.Tag) => {
    let text = String(token.text ?? '');

    // Process steps marking
    text = text.replace(/stap (\d+)/gi, (_match: string, stepNum: string) => {
      return `<span class="inline-flex items-center bg-gray-200 text-gray-dark px-2 py-1 rounded-lg text-sm font-medium">
        📝 Stap ${stepNum}
      </span>`;
    });

    return text;
  };

  // Custom links for professional content
  renderer.link = function (token: Tokens.Link) {
    const { href, text } = token;
    if (text === '[RICHTLIJN]' || text === 'RICHTLIJN') {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-bordeaux text-white rounded-lg hover:bg-bordeaux-hover transition-colors duration-200 font-medium text-sm shadow-sm">
        📋 Bekijk richtlijn →
      </a>`;
    }
    if (text === '[FORMULIER]' || text === 'FORMULIER') {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold-light transition-colors duration-200 font-medium text-sm shadow-sm">
        📄 Download formulier →
      </a>`;
    }
    if (text === '[ADVIES]' || text === 'ADVIES') {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-gray-dark text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm shadow-sm">
        💡 Lees meer advies →
      </a>`;
    }
    // Regular links
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-bordeaux underline hover:text-bordeaux-hover transition-colors font-medium">${text}</a>`;
  };

  // Custom list item rendering
  renderer.listitem = function (token: Tokens.ListItem) {
    const text = parseBasicMarkdown(token.text);
    return `<li class="flex items-start"><span class="mr-2 mt-1 text-bordeaux">•</span><span>${text}</span></li>`;
  };

  // Custom list rendering
  renderer.list = function (token: Tokens.List) {
    const ordered = token.ordered ?? false;
    const procedureKeywords = ['Meld', 'Plan', 'Vraag', 'Bespreek', 'Controleer', 'Documenteer'];

    const itemsHtml = token.items
      .map((item) => {
        const text = parseBasicMarkdown(item.text);
        return `<li class="flex items-start"><span class="mr-2 mt-1 text-bordeaux">•</span><span>${text}</span></li>`;
      })
      .join('');

    const rawTextContent = token.items.map((item) => item.text).join(' ');
    const isProcedureList = procedureKeywords.some((keyword) =>
      rawTextContent.includes(keyword)
    );

    if (isProcedureList) {
      return `<div class="bg-cream rounded-lg p-4 mb-4">
        <h4 class="font-semibold text-bordeaux text-lg mb-3 flex items-center">
          📋 <span class="ml-2">Te ondernemen stappen:</span>
        </h4>
        <ul class="space-y-2 text-gray-dark">${itemsHtml}</ul>
      </div>`;
    }

    return `<${ordered ? 'ol' : 'ul'} class="space-y-1 text-gray-dark">${itemsHtml}</${ordered ? 'ol' : 'ul'}>`;
  };

  // Custom blockquotes
  renderer.blockquote = function (token: Tokens.Blockquote) {
    const text = this.parser.parse(token.tokens);
    return `<div class="bg-cream/80 p-4 my-4 rounded-lg">
      <div class="text-gray-dark">${text}</div>
    </div>`;
  };

  // Custom strong rendering
  renderer.strong = function (token: Tokens.Strong) {
    const text = this.parser.parseInline(token.tokens);
    return `<strong class="font-semibold text-bordeaux">${text}</strong>`;
  };

  return renderer;
}

// Configure marked once
const renderer = createDoBbieRenderer();
marked.setOptions({
  renderer,
  breaks: true, // Line breaks become <br>
  gfm: true, // GitHub flavored markdown
});

export default function ChatMessage({
  message,
  sender,
  showAvatar = false,
  className,
}: ChatMessageProps) {
  // Parse message only for bot messages
  const formattedMessage = useMemo(() => {
    return sender === 'bot' ? marked(message) : message;
  }, [message, sender]);

  if (sender === 'bot') {
    return (
      <div className={cn('chat-message mb-4 flex items-start gap-3', className)}>
        {showAvatar ? (
          <div className="chat-avatar flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-bordeaux md:h-10 md:w-10">
            <span className="text-sm font-semibold text-white">DB</span>
          </div>
        ) : (
          <div className="chat-avatar-spacer w-8 flex-shrink-0 md:w-10"></div>
        )}
        <div className="speech-bubble left max-w-[75%] rounded-[16px_16px_16px_4px] border border-gray-light/30 bg-cream text-black shadow-sm">
          <div
            className="prose prose-dobie prose-sm max-w-none px-4 py-3"
            dangerouslySetInnerHTML={{ __html: formattedMessage as string }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('chat-message mb-4 flex items-start justify-end gap-3', className)}>
      <div className="speech-bubble right max-w-[75%] rounded-[16px_16px_4px_16px] bg-bordeaux text-white shadow-sm">
        <div
          className="px-4 py-3 font-medium"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    </div>
  );
}
