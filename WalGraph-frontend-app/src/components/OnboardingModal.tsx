import { useState, useEffect } from 'react';
import { ConnectButton } from '@mysten/dapp-kit';

interface OnboardingModalProps {
  open: boolean;
  onComplete: (username: string) => void;
  currentAccount: { address: string } | null;
}

export default function OnboardingModal({ open, onComplete, currentAccount }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (currentAccount && step === 1) {
      setStep(2);
    }
  }, [currentAccount, step]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setUsername('');
      setError('');
      setTouched(false);
    }
  }, [open]);

  const validateUsername = (name: string) => {
    if (!name) return 'Username is required.';
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(name)) return '3-20 chars, letters, numbers, underscore.';
    return '';
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setTouched(true);
    setError(validateUsername(e.target.value));
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateUsername(username);
    setError(err);
    setTouched(true);
    if (!err) {
      localStorage.setItem('walgraph_userId', username);
      onComplete(username);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-cyan-700 relative animate-fade-in-up">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome to WalGraph</h2>
        {step === 1 && (
          <div className="flex flex-col items-center space-y-6">
            <p className="text-gray-300 text-center mb-2">To get started, connect your Sui wallet.</p>
            <ConnectButton />
            <p className="text-xs text-gray-500 mt-2 text-center">Your address is never stored on our servers.</p>
          </div>
        )}
        {step === 2 && (
          <form onSubmit={handleUsernameSubmit} className="flex flex-col items-center space-y-6">
            <div className="w-full">
              <label htmlFor="username" className="block text-gray-300 mb-2 text-sm font-medium">Choose a username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onBlur={() => setTouched(true)}
                className={`w-full px-4 py-2 rounded-lg border ${error && touched ? 'border-red-500' : 'border-cyan-500'} bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all`}
                placeholder="e.g. graph_wizard"
                autoFocus
                maxLength={20}
              />
              {error && touched && (
                <p className="text-red-400 text-xs mt-1">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:scale-105 transition-all disabled:opacity-60"
              disabled={!!error || !username}
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 