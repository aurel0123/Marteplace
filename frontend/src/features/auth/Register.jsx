import { GalleryVerticalEnd } from "lucide-react";
import PlaceHolder from "@/assets/images/placeholder.svg";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner"
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState("");
  const navigate =useNavigate()
  const password = watch("password", "");

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    if (strength < 40) {
      setPasswordLabel("Faible");
    } else if (strength < 80) {
      setPasswordLabel("Moyen");
    } else {
      setPasswordLabel("Fort");
    }
    return strength;
  };

  const getProgressColor = (strength) => {
    if (strength < 40) return "bg-red-500";
    if (strength < 80) return "bg-orange-500";
    return "bg-green-500";
  };

  const onSubmit = async (data) => {
    console.log(data)
    if (data.password !== data.confirmpassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      resetField("password");
      resetField("confirmpassword")

      return;
    }
    console.log('Password ' + data.password + 'Confirm' + data.confirmpassword)
    try {
      const response = await axios.post("http://localhost:8000/register/", {
        email: data.email,
        password: data.password,
      });
      console.log(response)
      toast.success(response.data.message);
      localStorage.setItem('authTokens', JSON.stringify({
        access: response.data.access,
        refresh: response.data.refresh
      }));
      localStorage.setItem('user', JSON.stringify(
        response.data.user
      ))
      setTimeout(() => {
      navigate('/auth/otp' , {state : {email : data.email}})
      }, 1000);
    } catch (error) {
      console.error("Une erreur est survenue lors de l'inscription.", error);
      if(error.response){
        toast.error(error.response.data.error)
      }
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
    
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Ecoservices Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
          <Toaster position='top-right'/>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <h1 className="text-2xl font-bold text-center">
                Créer votre compte
              </h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email", { required: "L'email est requis" })}
                  />
                  {errors.email && (
                    <span className="text-red-500 text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", {
                      required: "Le mot de passe est requis",
                      minLength: { value: 8, message: "Minimum 8 caractères" },
                    })}
                    onChange={(e) => {
                      setShowProgress(true);
                      setPasswordStrength(
                        calculatePasswordStrength(e.target.value)
                      );
                    }}
                  />
                  {showProgress && (
                    <>
                    <Progress value={passwordStrength} className={`mt-2 bg-none h-1 ${getProgressColor(passwordStrength)}`} />
                    <span className="text-xs mt-1 text-gray-600">{passwordLabel}</span>
                  </>
                  )}
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmpassword">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmpassword"
                    type="password"
                    {...register("confirmpassword", {
                      required: "Veuillez confirmer le mot de passe",
                    })}
                  />
                  {errors.confirmpassword && (
                    <span className="text-red-500 text-xs">
                      {errors.confirmpassword.message}
                    </span>
                  )}
                </div>
                <Button type="submit" className="w-full cursor-pointer">
                  S'inscrire
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      fill="currentColor"
                    />
                  </svg>
                  Login with GitHub
                </Button>
              </div>
              <div className="text-center text-sm">
                Vous avez un compte ?{" "}
                <a href="#" className="underline underline-offset-4">
                  Connexion
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={PlaceHolder}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
