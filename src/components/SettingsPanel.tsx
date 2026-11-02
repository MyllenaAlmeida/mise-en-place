import type { ReaderSettings } from '../types';
import { useState } from 'react';

interface SettingsPanelProps {
  settings: ReaderSettings;
  onSettingsChange: (settings: ReaderSettings) => void;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  const [draftSettings, setDraftSettings] = useState(settings);

  return (
    <div className="fixed inset-0 bg-charcoal-900/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-ivory-50 to-ivory-100 rounded-2xl sm:rounded-3xl shadow-elegant w-full max-w-lg overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-8 bg-gradient-to-r from-burgundy-600 to-burgundy-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-semibold text-ivory-50 tracking-wide">
                Configurações
              </h2>
              <p className="text-ivory-200 text-xs sm:text-sm mt-1 font-sans font-light">
                Personalize sua experiência de leitura
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-3 rounded-xl hover:bg-burgundy-500 text-ivory-50 transition-all duration-300 hover:rotate-90"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto flex-1">
          {/* Font Size */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-charcoal-700 mb-3 sm:mb-4 tracking-wide uppercase">
              Tamanho da Fonte
            </label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-charcoal-600">12px</span>
                <span className="text-base sm:text-lg font-semibold text-burgundy-600">{draftSettings.fontSize}px</span>
                <span className="text-xs sm:text-sm text-charcoal-600">24px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                value={draftSettings.fontSize}
                onChange={(e) => setDraftSettings({ ...draftSettings, fontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-ivory-300 rounded-full appearance-none cursor-pointer accent-burgundy-600"
                style={{
                  background: `linear-gradient(to right, #de4f4f 0%, #de4f4f ${((draftSettings.fontSize - 12) / 12) * 100}%, #e6ceb2 ${((draftSettings.fontSize - 12) / 12) * 100}%, #e6ceb2 100%)`
                }}
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-8 bg-gradient-to-r from-ivory-50 to-ivory-100 border-t border-ivory-300 flex-shrink-0">
          <button
            onClick={() => { onSettingsChange(draftSettings); onClose(); }}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-ivory-50 rounded-xl sm:rounded-2xl hover:shadow-glow hover:scale-[1.02] transition-all duration-300 font-sans font-semibold text-base sm:text-lg tracking-wide"
          >
            Aplicar configurações
          </button>
        </div>
      </div>
    </div>
  );
}
