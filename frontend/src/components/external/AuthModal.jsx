import React, { useEffect } from 'react';
import GlassSurface from './GlassSurface.jsx';
import Button from './Button.jsx';

const AuthModal = ({ open, mode = 'login', onClose, onSubmit }) => {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = '');
  }, [open]);

  if (!open) return null;

  const isSignup = mode === 'signup';

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    onSubmit?.(data, mode);
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <GlassSurface
        width={520}
        height={'auto'}
        borderRadius={18}
        className="relative z-10 p-6 max-w-[92%] w-[520px]"
        mixBlendMode="normal"
      >
        <div className="w-full text-white">
          <h3 className="text-2xl font-semibold mb-2">{isSignup ? 'Create an account' : 'Welcome back'}</h3>
          <p className="text-sm text-white/80 mb-4">{isSignup ? 'Sign up to get access' : 'Log in to continue'}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm text-white/80 mb-1" htmlFor="name">Name</label>
                <input id="name" name="name" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/6 text-white outline-none focus:ring-2 focus:ring-violet-500" required />
              </div>
            )}

            <div>
              <label className="block text-sm text-white/80 mb-1" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/6 text-white outline-none focus:ring-2 focus:ring-violet-500" required />
            </div>

            <div>
              <label className="block text-sm text-white/80 mb-1" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/6 text-white outline-none focus:ring-2 focus:ring-violet-500" required />
            </div>

            <div className="flex items-center justify-between"> 
              <Button onClick={handleSubmit} className='-translate-x-4'>{isSignup ? 'Sign up' : 'Log in'}</Button>
              <button type="button" onClick={onClose} className="text-sm text-white cursor-pointer mx-1">Cancel</button>
            </div>
          </form>
        </div>
      </GlassSurface>
    </div>
  );
};

export default AuthModal;
