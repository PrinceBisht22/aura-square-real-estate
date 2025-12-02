import { useState, useEffect } from "react";
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "firebase/auth";

const auth = getAuth();

export const useOtpAuth = () => {
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize the Recaptcha Verifier lazily
    // We attach it to the window so it persists across renders
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("Recaptcha verified");
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.warn("Recaptcha expired");
        },
      });
    }
  }, []);

  /**
   * Step 1: Send the OTP to the phone number
   * Format phone number as E.164 (e.g., +15555555555)
   */
  const sendOtp = async (phoneNumber) => {
    setLoading(true);
    setError(null);
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setLoading(false);
      return true; // Success
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Error sending OTP:", err);
      // Reset recaptcha on error so user can try again
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
            window.grecaptcha.reset(widgetId);
        });
      }
      return false;
    }
  };

  /**
   * Step 2: Verify the code entered by the user
   */
  const verifyOtp = async (otpCode) => {
    setLoading(true);
    setError(null);
    try {
      if (!confirmationResult) {
        throw new Error("No OTP request found. Send OTP first.");
      }
      const result = await confirmationResult.confirm(otpCode);
      setUser(result.user);
      setLoading(false);
      return result.user; // Returns the authenticated user
    } catch (err) {
      setLoading(false);
      setError("Invalid OTP or expired code.");
      console.error("Error verifying OTP:", err);
      return null;
    }
  };

  return {
    sendOtp,
    verifyOtp,
    confirmationResult, // If this exists, it means OTP was sent
    user,               // If this exists, user is logged in
    loading,
    error,
  };
};