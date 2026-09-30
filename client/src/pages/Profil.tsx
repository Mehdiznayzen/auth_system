import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface UserProps {
    _id?: string,
  name: string;
  email: string;
}

function Profile() {
  const [user, setUser] = useState<UserProps>({ _id: "", name: "", email: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser({
            _id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
        });
      } catch (error) {
        console.error(error);

        localStorage.removeItem("token");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(!user.name || !user.email){
        toast.error("Please fill in all fields.");
        return;
    }

    try{
        setSaving(true);

        const token = localStorage.getItem("token");
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/update-user/${user._id}`,
        {
            name: user.name,
            email: user.email,
            password,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        );

        if (response.data.status) {
        toast.success(response.data.msg);

        setUser({
          name: "",
          email: "",
        });
        navigate("/login");
      } else {
        toast.error(response.data.msg);
      }

    } catch(error: any) {
        console.error("Register error:", error);
        toast.error(error.response?.data?.msg || "Something went wrong. Please try again.");
    } finally {
        setSaving(false)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl flex flex-col gap-8">

        <div className="text-center mb-8 flex flex-col gap-2 items-center justify-center">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <User className="w-10 h-10 text-blue-400" />
          </div>

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your personal information
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl md:p-8 shadow-xl w-full">
          {
            message && (
                <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                    {message}
                </div>
            )
          }

          {
            error && (
                <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )
          }

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full name"
              name="name"
              type="text"
              placeholder="John Doe"
              leftIcon={<User className="h-4 w-4" />}
              value={user.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              value={user.email}
              onChange={handleChange}
              required
            />

            <div>
              <Input
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Leave empty to keep current password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="cursor-pointer text-slate-300 transition-colors hover:text-white"
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage("");
                  setError("");
                }}
              />

              <p className="mt-2 text-xs text-slate-500">
                Leave this field empty if you don't want to change
                your password.
              </p>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={saving}
              leftIcon={
                saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              }
            >
              {saving ? "Saving changes..." : "Save changes"}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
