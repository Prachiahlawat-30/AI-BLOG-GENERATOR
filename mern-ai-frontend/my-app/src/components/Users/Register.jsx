import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";
import { useAuth } from "../AuthContext/AuthContext";

const validationSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  username: Yup.string().required("Username is required"),
});

const Registration = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // ✅ Mutation
  const mutation = useMutation({
    mutationFn: registerAPI,
  });

  // ✅ Navigate ONLY on success
  useEffect(() => {
    if (mutation.isSuccess) {
      navigate("/login");
    }
  }, [mutation.isSuccess, navigate]);

  // ✅ Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values); // ✅ no manual navigation
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 m-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Create an Account
        </h2>

        <p className="text-center text-gray-600 mb-4">
          Create an account to get free access. No credit card required.
        </p>

        {/* 🔄 Loading */}
        {mutation.isPending && (
          <StatusMessage type="loading" message="Loading..." />
        )}

        {/* ❌ Error */}
        {mutation.isError && (
          <StatusMessage
            type="error"
            message={
              mutation.error?.response?.data?.message || "An error occurred"
            }
          />
        )}

        {/* ✅ Success */}
        {mutation.isSuccess && (
          <StatusMessage type="success" message="Registration Successful" />
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Username
            </label>
            <input
              type="text"
              autoComplete="username" // ✅ fix warning
              {...formik.getFieldProps("username")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Your name"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 mt-1">
                {formik.errors.username}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Email
            </label>
            <input
              type="email"
              autoComplete="email" // ✅ fix warning
              {...formik.getFieldProps("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="new-password" // ✅ fix warning
              {...formik.getFieldProps("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 text-white rounded-md bg-linear-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
          >
            Register
          </button>
        </form>

        <div className="text-sm mt-4 text-center">
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registration;