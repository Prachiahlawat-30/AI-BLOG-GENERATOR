import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import StatusMessage from "../Alert/StatusMessage";
import { useMutation } from "@tanstack/react-query";
import { loginAPI } from "../../apis/user/usersAPI";
import { useAuth } from "../AuthContext/AuthContext";
import { useLocation } from "react-router-dom";

// ✅ Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // ✅ Redirect ONLY when auth state changes
 

const location = useLocation();

useEffect(() => {
  if (isAuthenticated && location.pathname !== "/dashboard") {
    navigate("/dashboard");
  }
}, [isAuthenticated, navigate, location.pathname]);

  // ✅ API mutation
  const mutation = useMutation({
    mutationFn: loginAPI,
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values); // ✅ ONLY API call (no manual navigate)
    },
  });

  // ✅ Update auth state after successful login
  useEffect(() => {
    if (mutation.isSuccess) {
      login(); // triggers redirect via useEffect above
    }
  }, [mutation.isSuccess, login]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 m-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login to Your Account
        </h2>

        {/* 🔄 Loading */}
        {mutation.isPending && (
          <StatusMessage type="loading" message="Loading..." />
        )}

        {/* ❌ Error */}
        {mutation.isError && (
          <StatusMessage
            type="error"
            message={mutation?.error?.response?.data?.message}
          />
        )}

        {/* ✅ Success */}
        {mutation.isSuccess && (
          <StatusMessage type="success" message="Login successful" />
        )}

        {/* 📝 Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email" // ✅ fix warning
              {...formik.getFieldProps("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-1">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 block mb-2"
            >
              Your Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="current-password" // ✅ fix warning
              {...formik.getFieldProps("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Register link */}
          <div className="text-sm">
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Register
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white bg-linear-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;