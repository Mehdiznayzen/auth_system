import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { FieldLabel } from "@/components/ui/field";
import AuthLayout from "../layouts/AuthLayout";
import Checkbox from "../components/ui/Checkbox";
import ForgotPasswordModal from "@/components/forgot-password-modal";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dataForm.email.trim() || !dataForm.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          email: dataForm.email,
          password: dataForm.password,
        }
      );

      if (response.data.status) {
        toast.success(response.data.msg);

        localStorage.setItem("token", response.data.token);

        setDataForm({
          email: "",
          password: "",
        });

        navigate("/profile");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error: any) {
      console.error("Login error:", error);

      toast.error(
        error.response?.data?.msg ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-8">

        <div className="mb-2">
          <h1 className="text-center text-2xl font-bold text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to your account to continue where you left off.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="email" className="text-stone-50">
              Email
            </FieldLabel>

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={dataForm.email}
                onChange={handleChange}
                autoComplete="email"
                className="pl-10 text-stone-50"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="password" className="text-stone-50">
              Password
            </FieldLabel>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400"
              />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={dataForm.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="pl-10 pr-10 text-stone-50"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              name="remember"
              label="Remember me"
            />

            <ForgotPasswordModal>
              <p
                className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300 cursor-pointer"
              >
                Forgot password?
              </p>
            </ForgotPasswordModal>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            Register
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
};

export default LoginPage;