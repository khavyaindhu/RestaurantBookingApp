const EMAIL_SERVER_URL = 'https://silver-space-tribble-69x9jxgrp76j34q56-3001.app.github.dev'; // use your Codespace URL in production

export const sendBookingConfirmationEmail = async (params: {
  toEmail: string;
  userName: string;
  restaurantName: string;
  date: string;
  time: string;
  seats: number;
  totalAmount: number;
  confirmationCode: string;
}): Promise<boolean> => {
  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const result = await response.json();
    console.log('📧 Email result:', result);
    return result.success;
  } catch (error) {
    console.error('📧 Email send failed:', error);
    return false;
  }
};