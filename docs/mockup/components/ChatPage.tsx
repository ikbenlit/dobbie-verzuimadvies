
import React, { useState } from 'react';

const ChatPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-brand-light font-sans">
      {/* Sidebar */}
      <aside 
        className={`bg-white/40 border-r border-gray-200/60 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-80' : 'w-0'}`}
      >
        <div className={`p-4 border-b border-gray-200/60 flex justify-between items-center ${!sidebarOpen && 'hidden'}`}>
          <h2 className="font-serif text-2xl font-bold text-[#5A0D29]">Recente Chats</h2>
        </div>
        <div className={`flex-1 overflow-y-auto ${!sidebarOpen && 'hidden'}`}>
          {/* Chat History Items */}
          <div className="p-4 space-y-2">
            <div className="p-3 bg-rose-100/80 rounded-lg cursor-pointer">
              <p className="font-semibold text-[#5A0D29]">Verzuimprotocol medewerker A</p>
              <p className="text-sm text-brand-text truncate">Ok, ik zal het protocol opstellen...</p>
            </div>
            <div className="p-3 hover:bg-rose-100/50 rounded-lg cursor-pointer">
              <p className="font-semibold text-brand-dark">Langdurig verzuim en Wet Poortwachter</p>
              <p className="text-sm text-brand-text truncate">De stappen zijn als volgt...</p>
            </div>
            <div className="p-3 hover:bg-rose-100/50 rounded-lg cursor-pointer">
              <p className="font-semibold text-brand-dark">Advies over preventieve maatregelen</p>
              <p className="text-sm text-brand-text truncate">Laten we beginnen met een werkplek...</p>
            </div>
          </div>
        </div>
        <div className={`p-4 border-t border-gray-200/60 ${!sidebarOpen && 'hidden'}`}>
          <button className="w-full bg-[#771138] text-white font-bold py-3 px-4 rounded-full shadow-lg hover:bg-[#5A0D29] transition-all">
            + Nieuwe Chat
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white/60 p-2 rounded-full shadow-md hover:bg-rose-100/80 transition-all z-10"
          aria-label={sidebarOpen ? 'Sluit zijbalk' : 'Open zijbalk'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
          </svg>
        </button>

        {/* Chat Header */}
        <header className="p-4 border-b border-gray-200/60 bg-white/40 flex justify-between items-center">
          <h1 className="text-xl font-bold text-brand-dark">Verzuimprotocol medewerker A</h1>
          <button className="group flex items-center gap-2 bg-[#E9B046] text-black font-bold py-2 pl-3 pr-4 rounded-full hover:bg-opacity-80 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap text-sm font-bold">
              Exporteer Chat
            </span>
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Dobbie's Message */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E9B046] flex items-center justify-center font-bold text-brand-dark text-lg">D</div>
            <div className="bg-white rounded-lg p-4 max-w-lg shadow-sm">
              <p className="text-brand-text text-sm">
                Goedendag! Ik ben DOBbie, uw online verzuimadviseur. Waarmee kan ik u vandaag helpen met betrekking tot het verzuimprotocol voor medewerker A?
              </p>
            </div>
          </div>

          {/* User's Message */}
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-[#771138] text-white rounded-lg p-4 max-w-lg shadow-sm">
              <p className="text-sm">
                Hallo Dobbie, ik moet een verzuimprotocol opstellen voor een medewerker die regelmatig kortdurend verzuimt. Kun je me de belangrijkste stappen geven?
              </p>
            </div>
          </div>
          
          {/* Dobbie's Message with list */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E9B046] flex items-center justify-center font-bold text-brand-dark text-lg">D</div>
            <div className="bg-white rounded-lg p-4 max-w-lg shadow-sm">
              <p className="text-brand-text mb-2 text-sm">
                Zeker! Hier zijn de belangrijkste stappen voor een effectief verzuimprotocol bij kortdurend verzuim:
              </p>
              <ul className="list-disc list-inside text-brand-text space-y-1 text-sm">
                <li>Leg de meldingsprocedure duidelijk vast.</li>
                <li>Plan een frequent-verzuimgesprek in.</li>
                <li>Analyseer de oorzaken van het verzuim.</li>
                <li>Maak concrete afspraken en leg deze vast.</li>
                <li>Evalueer de voortgang periodiek.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/60 border-t border-gray-200/60">
          <div className="flex items-center bg-white rounded-full shadow-md">
            <input 
              type="text" 
              placeholder="Typ uw vraag..." 
              className="flex-1 p-4 bg-transparent rounded-full focus:outline-none text-brand-text"
            />
            <button className="bg-[#E9B046] text-black font-bold py-2 px-6 m-2 rounded-full hover:bg-opacity-80 transition-all">
              Verstuur
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
