'use client';
import { useState } from 'react';
import { requestOTP, verifyOTP, verifyGoogleAuth } from '@/app/actions/adminAuth';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/app/das/firebase';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1 = Request, 2 = Verify
    const [status, setStatus] = useState('idle'); // idle, loading, error, success
    const [message, setMessage] = useState('');
    const router = useRouter();
    const { theme } = useTheme();

    const handleGoogleLogin = async () => {
        setStatus('loading');
        setMessage('');

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            
            const verifyResult = await verifyGoogleAuth(idToken);
            if (verifyResult.success) {
                setStatus('success');
                setMessage('Google login successful. Redirecting...');
                router.push('/admin');
                router.refresh();
            } else {
                setStatus('error');
                setMessage(verifyResult.error);
                auth.signOut();
            }
        } catch (error) {
            console.error("Google login error:", error);
            setStatus('error');
            setMessage('Failed to authenticate with Google.');
        }
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const result = await requestOTP(email);

        if (result.success) {
            setStep(2);
            setStatus('success');
            setMessage('OTP sent to your email.');
        } else {
            setStatus('error');
            setMessage(result.error);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const result = await verifyOTP(email, otp);

        if (result.success) {
            setStatus('success');
            setMessage('Login successful. Redirecting...');
            router.push('/admin');
            router.refresh(); // Ensure middleware picks up the new cookie
        } else {
            setStatus('error');
            setMessage(result.error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} data-bs-theme={theme === 'dark' ? 'dark' : 'light'}>
            <div className="admin-panel" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h2>Admin Verification</h2>
                <p className="text-muted small mb-4">{step === 1 ? 'Enter your admin email to receive a One-Time Passcode.' : 'Enter the code sent to your email.'}</p>

                {step === 1 ? (
                    <div>
                        <form onSubmit={handleRequestOTP}>
                            <input
                                type="email"
                                placeholder="Admin Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control mb-3"
                                required
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="btn btn-dark w-100"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>

                        <div className="d-flex align-items-center my-4">
                            <hr className="flex-grow-1" />
                            <span className="px-3 text-muted small">OR</span>
                            <hr className="flex-grow-1" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={status === 'loading'}
                            className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
                        >
                            <i className="bi bi-google"></i> Continue with Google
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleVerifyOTP}>
                        <input
                            type="text"
                            placeholder="6-Digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="form-control mb-3"
                            style={{ letterSpacing: '5px', textAlign: 'center', fontSize: '1.2rem' }}
                            required
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="btn btn-dark w-100"
                        >
                            {status === 'loading' ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep(1); setOtp(''); setStatus('idle'); setMessage(''); }}
                            className="btn btn-link w-100 mt-2 text-muted"
                            style={{ textDecoration: 'none' }}
                        >
                            Use different email
                        </button>
                    </form>
                )}

                {message && (
                    <p className={status === 'error' ? 'text-danger mt-3 fw-medium' : 'text-success mt-3 fw-medium'}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
