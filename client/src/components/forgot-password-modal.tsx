import { useState } from "react";
import axios from "axios";
import { Mail, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FieldLabel } from "@/components/ui/field";
import type { BaseUIEvent } from "@base-ui/react";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordModalProps {
  children?: React.ReactNode;
}

const ForgotPasswordModal = ({ children }: ForgotPasswordModalProps) => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/forgot-password`,
                {
                    email: email.trim(),
                }
            );


            if (response.data.status) {
                toast.success(
                    response.data.msg ||
                    "Password reset link sent successfully."
                );

                setEmail("");
                setOpen(false);
                navigate(`/reset-password/${response.data.token}`);
            } else {
                toast.error(
                    response.data.msg ||
                    "Unable to send reset link."
                );
            }
        } catch (error: any) {
            console.error("Forgot password error:", error);

            toast.error(
                error.response?.data?.msg ||
                "Something went wrong. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onOpenChange={setOpen}
        >
            <DialogTrigger>
                {
                    children || (
                        <button
                            type="button"
                            className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                        >
                            Forgot password?
                        </button>
                    )
                }
            </DialogTrigger>

            <DialogContent
                className="
                    w-[calc(100%-2rem)]
                    max-w-md
                    border border-white/10
                    bg-slate-950
                    p-6
                    text-white
                    shadow-2xl
                    sm:rounded-xl
                "
            >
                <DialogHeader className="space-y-3">
                    <div
                        className="
                            mx-auto
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-blue-500/20
                            bg-blue-500/10
                        "
                    >
                        <Mail className="h-5 w-5 text-blue-400" />
                    </div>

                    <DialogTitle className="text-center text-xl font-bold text-white">
                        Forgot your password?
                    </DialogTitle>

                    <DialogDescription className="text-center text-sm leading-6 text-slate-400">
                        Enter the email address associated with your account
                        and we'll send you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <FieldLabel
                        htmlFor="forgot-password-email"
                        className="text-sm text-slate-200"
                    >
                        Email address
                    </FieldLabel>

                    <div className="relative w-full">
                        <Mail
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                z-20
                                h-4
                                w-4
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <Input
                            id="forgot-password-email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={isLoading}
                            className="
                                h-11
                                w-full
                                border-white/10
                                bg-white/3
                                pl-11
                                text-white
                                placeholder:text-slate-500
                                focus-visible:border-blue-500/50
                                focus-visible:ring-blue-500/20
                            "
                            required
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => setOpen(false)}
                        className="
                            w-full
                            border-white/10
                            bg-transparent
                            text-slate-300
                            hover:bg-white/5
                            hover:text-white
                            sm:w-auto
                        "
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={(e: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
                        disabled={isLoading}
                        className="
                            w-full
                            bg-blue-600
                            text-white
                            hover:bg-blue-500
                            sm:w-auto
                            cursor-pointer
                        "
                    >
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send reset link
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )
                        }
                    </Button>
                </div>

                {/* Footer information */}
                <p className="mt-2 text-center text-xs text-slate-500">
                    The reset link will expire after a limited time.
                </p>
            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordModal;