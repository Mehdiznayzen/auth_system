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
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FieldLabel } from "@/components/ui/field";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface UserProps {
  _id?: string;
  name: string;
  email: string;
}

function Profile() {
  const [user, setUser] = useState<UserProps>({
    _id: "",
    name: "",
    email: "",
  });

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
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
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user.name.trim() || !user.email.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update-user/${user._id}`,
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

        setPassword("");

        // Si ton backend retourne l'utilisateur modifié
        if (response.data.user) {
          setUser({
            _id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
          });
        }

        // Si ton backend invalide le token après modification
        // du compte, tu peux garder cette redirection.
        // Sinon, supprime ces deux lignes.
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        toast.error(response.data.msg);
      }
    } catch (error: any) {
      console.error("Update profile error:", error);

      toast.error(
        error.response?.data?.msg ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
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

        {/* Header */}
        <div className="text-center flex flex-col gap-2 items-center justify-center">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <User className="w-10 h-10 text-blue-400" />
          </div>

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="text-slate-400">
            Manage your personal information
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl w-full">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="name">
                Full name
              </FieldLabel>

              <div className="relative">
                <User className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={user.name}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="email">
                Email
              </FieldLabel>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={user.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="password">
                New Password
              </FieldLabel>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Leave empty to keep current password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
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

              <p className="text-xs text-slate-500">
                Leave this field empty if you don't want to
                change your password.
              </p>
            </div>

            {/* Save */}
            <Button
              type="submit"
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save changes
                </>
              )}
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;