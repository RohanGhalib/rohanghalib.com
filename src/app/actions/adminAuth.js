'use server';
import { Resend } from 'resend';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/das/firebase';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'muhammadrohanghalib@gmail.com';

export async function requestOTP(email) {
    if (email !== ADMIN_EMAIL) {
        return { success: false, error: 'Unauthorized email address.' };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("RESEND_API_KEY is missing");
        return { success: false, error: 'Server configuration error.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    try {
        // Store OTP in Firestore
        await setDoc(doc(db, 'admin_otps', email), {
            code: otp,
            expiresAt: expiresAt
        });

        const resend = new Resend(resendApiKey);
        const data = await resend.emails.send({
            from: 'Portfolio Admin <server@rohanghalib.com>',
            to: [ADMIN_EMAIL],
            subject: 'Admin Login OTP',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
               <h2>Admin Login Request</h2>
               <p>Your One-Time Passcode (OTP) is: <strong>${otp}</strong></p>
               <p>This code will expire in 5 minutes.</p>
               <hr>
               <small>Sent via Resend from rohanghalib.com</small>
             </div>`,
        });

        if (data.error) {
            console.error("Resend API Error:", data.error);
            return { success: false, error: 'Failed to send OTP email.' };
        }

        return { success: true };
    } catch (error) {
        console.error("Error requesting OTP:", error);
        return { success: false, error: 'Failed to generate OTP.' };
    }
}

export async function verifyOTP(email, code) {
    if (email !== ADMIN_EMAIL) {
        return { success: false, error: 'Unauthorized email address.' };
    }

    try {
        const docRef = doc(db, 'admin_otps', email);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return { success: false, error: 'No OTP requested or it has expired.' };
        }

        const data = docSnap.data();

        if (Date.now() > data.expiresAt) {
            await deleteDoc(docRef); // Clean up expired OTP
            return { success: false, error: 'OTP has expired. Please request a new one.' };
        }

        if (data.code !== code) {
            return { success: false, error: 'Invalid OTP.' };
        }

        // OTP is valid, clean it up
        await deleteDoc(docRef);

        // Set secure cookie
        const cookieStore = await cookies();

        // Simple secure cookie for auth (in a real app, use JWT)
        cookieStore.set('admin_session', 'authenticated_admin_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return { success: true };
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, error: 'Failed to verify OTP.' };
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return { success: true };
}
