import { Card } from "@/components/ui/card";
import AuthLayout from "./auth-layout";
import { Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner"

export default function Otp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.email) {
        setEmail(user.email);
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/verify-email/', { email, code });
      toast.success(response.data.message);
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('authTokens', JSON.stringify({
          access: response.data.access,
          refresh: response.data.refresh
        }));
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la vérification. Veuillez réessayer.');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    if (!email) {
      toast.error('Adresse email introuvable. Veuillez vous reconnecter.');
      return;
    }
    try {
      const response = await axios.post('/api/auth/resend-verification/', { email });
      toast.success(response.data.message || 'Un nouveau code a été envoyé à votre adresse email.');
      setCountdown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi du code. Veuillez réessayer.');
    }
  };
  console.log(email)
  return (
    <AuthLayout>
      <Toaster />
      <Card className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8">
        <div className="mb-4 text-left">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
            Authentification à double facteur
          </h1>
          <p className="lg:text-xs text-xs text-muted-foreground mt-2">
            Entrer le code d'authentification. <br />
            Nous avons envoyé le code d'authentification à votre email
          </p>
        </div>
        <div className="flex justify-center items-center">
          <form className="w-full max-w-xs space-y-2" onSubmit={handleVerify}>
            <div className="flex justify-center">
              <InputOTP maxLength={6} className="space-x-2" value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="size-12" />
                  <InputOTPSlot index={1} className="size-12" />
                  <InputOTPSlot index={2} className="size-12" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} className="size-12" />
                  <InputOTPSlot index={4} className="size-12" />
                  <InputOTPSlot index={5} className="size-12" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className='w-full max-w-full mt-4 sm:mt-6'>
              Vérifier
            </Button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs sm:text-sm">
          Vous ne l'avez pas reçu ? {" "}
          <button
            onClick={handleResendCode}
            className={`underline underline-offset-4 hover:text-primary ${countdown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={countdown > 0}
          >
            Renvoyer le code ({countdown}s)
          </button>
        </p>
      </Card>
    </AuthLayout>
  );
}
