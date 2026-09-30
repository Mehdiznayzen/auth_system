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

import Input from "../components/ui/Input";
import AuthLayout from "../layouts/AuthLayout";
import Checkbox from "../components/ui/Checkbox";
import Button from "../components/ui/Button";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          window.location.href = "/profile";
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    checkToken()
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataForm.email.trim() || !dataForm.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          email: dataForm.email,
          password: dataForm.password,
        }
      );

      if (response.data.status) {
        toast.success(response.data.msg);
        setDataForm({
          email: "",
          password: "",
        });

        localStorage.setItem("token", response.data.token);

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

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-center text-2xl font-bold text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in to your account to continue where you left off.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          {/* Email */}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            value={dataForm.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="cursor-pointer text-slate-200 transition-colors hover:text-white"
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
            }
            value={dataForm.password}
            onChange={handleChange}
            required
          />

          {/* Remember + Forgot password */}
          <div className="flex items-center justify-between">
            <Checkbox
              name="remember"
              label="Remember me"
            />

            <Link
              to="#"
              className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            leftIcon={
              <ArrowRight className="h-4 w-4" />
            }
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Register */}
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