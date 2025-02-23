"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogInMutation } from "@/lib/service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from "react-redux";
import { login as setToken } from "@/store/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [login] = useLogInMutation();

  useEffect(() => {
    if (isAuthenticated && role === "admin") {
      router.push("/");
    }
  }, [isAuthenticated, role, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await login({ email, password }).unwrap();

      if (result.user.role !== "admin") {
        toast.error("Sizda admin panelga kirish huquqi yo'q!");
        return;
      }

      dispatch(setToken({ user: result.user, token: result.accessToken }));
      toast.success("Admin sifatida muvaffaqiyatli login bo'ldingiz!");
    } catch (error) {
      toast.error(error.data?.message || "Kirishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Admin Panel Login</h1>
        <p className="text-gray-600 mt-2">
          Faqat administratorlar tizimga kira oladi.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input type="email" name="email" placeholder="Email" required />
        </div>
        <div>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Log in
        </Button>
      </form>
    </div>
  );
}
