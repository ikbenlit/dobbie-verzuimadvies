'use client';

export function TypingIndicator() {
  return (
    <div className="typing-indicator flex gap-1 p-3 bg-[#F5F2EB] rounded-lg self-start mb-2 w-fit">
      <div
        className="typing-dot w-2 h-2 bg-[#D1D5DB] rounded-full animate-bounce"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="typing-dot w-2 h-2 bg-[#D1D5DB] rounded-full animate-bounce"
        style={{ animationDelay: '0.2s' }}
      />
      <div
        className="typing-dot w-2 h-2 bg-[#D1D5DB] rounded-full animate-bounce"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
}
