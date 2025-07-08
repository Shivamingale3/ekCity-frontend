import type { RegisterFormValues } from "@/types/authTypes";
import { registerSchema } from "@/validation/authValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, Upload } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { PasswordStrength } from "./PasswordStrength";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";

function RegisterForm({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const { register } = useAuthStore();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      profilePicture: undefined, // Initialize as undefined
    },
  });

  const watchedPassword = form.watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(data);
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please login.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Could not create your account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      // Clear the preview and form value if no file is selected
      setProfilePreview(null);
      form.setValue("profilePicture", undefined);
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description:
          "Please select a valid image file (JPEG, PNG, WebP, or GIF).",
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Set the file in the form
    form.setValue("profilePicture", file);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your mobile number"
                    {...field}
                    disabled={isLoading}
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
                      placeholder="Create a password"
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-2">
            <PasswordStrength password={watchedPassword} />
          </div>

          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="col-span-2">
                <FormLabel>Profile Picture (Optional)</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {profilePreview && (
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border">
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-center">
                      <label
                        htmlFor="profile-picture"
                        className="cursor-pointer flex items-center space-x-2 text-sm text-primary hover:underline"
                      >
                        <Upload className="h-4 w-4" />
                        <span>
                          {profilePreview ? "Change Picture" : "Upload Picture"}
                        </span>
                      </label>
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureChange}
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full col-span-2"
            disabled={isLoading}
          >
            {isLoading ? <Spinner className="mr-2" size="sm" /> : null}
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default RegisterForm;
