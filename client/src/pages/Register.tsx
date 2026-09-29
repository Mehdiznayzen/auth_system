import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import AuthLayout from "../layouts/AuthLayout";
import { toast } from "react-toastify";
import axios from "axios";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [dataForm, setDataForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setDataForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!dataForm.name.trim() || !dataForm.email.trim() || !dataForm.password || !dataForm.confirmPassword) {
    toast.error("Please fill in all fields.");
    return;
  }

  if (dataForm.password !== dataForm.confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  try {
    setIsLoading(true);

    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
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
    } else {
      toast.error(response.data.msg);
    }
  } catch (error: any) {
    console.error("Register error:", error);

    toast.error(
      error.response?.data?.msg || "Something went wrong. Please try again."
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
            Create an account
          </h1>

          <p className="mt-2 text-center text-sm text-slate-400">
            Create your account and start your journey with us.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <Input
            label="Full name"
            name="name"
            type="text"
            placeholder="John Doe"
            leftIcon={<User className="h-4 w-4" />}
            value={dataForm.name}
            onChange={handleChange}
            required
          />

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

          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer text-slate-300 transition-colors hover:text-white"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
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

          <Input
            label="Confirm password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="cursor-pointer text-slate-300 transition-colors hover:text-white"
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
            }
            value={dataForm.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            leftIcon={<ArrowRight className="h-4 w-4" />}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

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