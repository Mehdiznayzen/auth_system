import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/field";

import AuthLayout from "../layouts/AuthLayout";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const [dataForm, setDataForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !dataForm.name.trim() ||
      !dataForm.email.trim() ||
      !dataForm.password ||
      !dataForm.confirmPassword
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (dataForm.password !== dataForm.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          name: dataForm.name,
          email: dataForm.email,
          password: dataForm.password,
        }
      );

      if (response.data.status) {
        toast.success(response.data.msg);

        setDataForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error: any) {
      console.error("Register error:", error);

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

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-center text-2xl font-bold text-white">
            Create an account
          </h1>

          <p className="mt-2 text-center text-sm text-slate-400">
            Create your account and start your journey with us.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="name" className="text-stone-50">
              Full name
            </FieldLabel>

            <div className="relative">
              <User className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={dataForm.name}
                onChange={handleChange}
                autoComplete="name"
                className="pl-10 text-stone-50"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="email" className="text-stone-50">
              Email
            </FieldLabel>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

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

          {/* Password */}
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="password" className="text-stone-50">
              Password
            </FieldLabel>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={dataForm.password}
                onChange={handleChange}
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="confirmPassword" className="text-stone-50">
              Confirm password
            </FieldLabel>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Confirm your password"
                value={dataForm.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="pl-10 pr-10 text-stone-50"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 transition-colors hover:text-white"
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full"
          >
            {isLoading ? (
              "Creating account..."
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Login */}
        <div className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            Login
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
};

export default RegisterPage;