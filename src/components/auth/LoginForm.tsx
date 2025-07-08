import type { LoginFormValues } from "@/types/loginTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../validation/authValidation";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import { useAuthStore } from "@/stores/authStore";
import { Spinner } from "../ui/spinner";

function LoginForm({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login } = useAuthStore();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    disabled={isLoading}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      disabled={isLoading}
                      className="h-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 hover:bg-transparent" />
                      ) : (
                        <Eye className="h-4 w-4 hover:bg-transparent" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setShowForgotPassword(true)}
              className="px-0"
              disabled={isLoading}
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full px-5 py-3 h-full"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="mr-2" size="sm" /> : null}
            Login
          </Button>
        </form>
      </Form>

      <ForgotPasswordDialog
        open={showForgotPassword}
        onOpenChange={setShowForgotPassword}
      />
    </div>
  );
}

export default LoginForm;
