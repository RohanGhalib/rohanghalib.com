'use server';

import { Resend } from 'resend';

export async function sendContactEmail(formData) {
    const message = formData.get('message');

    if (!message || message.trim() === '') {
        return { success: false, error: 'Message cannot be empty.' };
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.error("RESEND_API_KEY is missing");
        return { success: false, error: 'Server configuration error. Please try again later.' };
    }

    const resend = new Resend(resendApiKey);

    try {
        const data = await resend.emails.send({
            from: 'Portfolio Contact <server@rohanghalib.com>', // Or 'onboarding@resend.dev' for testing
            to: ['muhammadrohanghalib@gmail.com'],
            subject: 'New Anonymous Message from Portfolio',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
               <h2>New Anonymous Message</h2>
               <p style="white-space: pre-wrap;">${message}</p>
               <hr>
               <small>Sent via Resend from rohanghalib.com</small>
             </div>`,
        });

        if (data.error) {
            console.error("Resend API Error:", data.error);
            return { success: false, error: 'Failed to send email via Resend.' };
        }

        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: 'Failed to send email. Please try again later.' };
    }
}
