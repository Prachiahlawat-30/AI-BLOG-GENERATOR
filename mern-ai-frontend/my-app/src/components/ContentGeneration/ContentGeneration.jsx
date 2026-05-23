import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getUserProfileAPI } from "../../apis/user/usersAPI";
import { generateContentAPI } from "../../apis/ChatGPT/ChatGPT";

import StatusMessage from "../Alert/StatusMessage";

const BlogPostAIAssistant = () => {

  const [generatedContent, setGeneratedContent] = useState("");

  // Get User Profile
  const {
    isLoading,
    isError,
    data,
    error,
  } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
  });

  // Mutation
  const mutation = useMutation({
    mutationFn: generateContentAPI,
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      prompt: "",
      tone: "",
      category: "",
    },

    validationSchema: Yup.object({
      prompt: Yup.string().required("A prompt is required"),
      tone: Yup.string().required("Selecting a tone is required"),
      category: Yup.string().required("Selecting a category is required"),
    }),

    onSubmit: async (values) => {

      const prompt = `
Generate a professional blog post.

Topic: ${values.prompt}

Category: ${values.category}

Tone: ${values.tone}

Requirements:
- SEO optimized
- Human-like writing
- Proper headings
- Subheadings
- Attractive introduction
- Conclusion
- Markdown formatting
`;

      mutation.mutate(prompt, {
        onSuccess: (response) => {

          console.log(response);

          // Backend returns:
          // {
          //   success: true,
          //   data: "generated text"
          // }

          setGeneratedContent(response.data);
        },
      });
    },
  });

  // Loading
  if (isLoading) {
    return (
      <StatusMessage
        type="loading"
        message="Loading please wait..."
      />
    );
  }

  // Error
  if (isError) {
    return (
      <StatusMessage
        type="error"
        message={error?.response?.data?.message}
      />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-900 flex justify-center items-center p-6">

      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-2xl w-full p-6">

        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          AI Blog Post Generator
        </h2>

        {/* Mutation Loading */}
        {mutation?.isPending && (
          <StatusMessage
            type="loading"
            message="Generating content..."
          />
        )}

        {/* Mutation Success */}
        {mutation?.isSuccess && (
          <StatusMessage
            type="success"
            message="Content generated successfully"
          />
        )}

        {/* Mutation Error */}
        {mutation?.isError && (
          <StatusMessage
            type="error"
            message={
              mutation?.error?.response?.data?.message ||
              "Something went wrong"
            }
          />
        )}

        {/* User Plan */}
        <div className="flex mt-3">

          <div className="mr-2 mb-2">
            <span className="text-sm font-semibold bg-green-200 px-4 py-2 rounded-full">
              Plan: {data?.user?.subscriptionPlan}
            </span>
          </div>

          <div className="mr-2 mb-2">
            <span className="text-sm font-semibold bg-green-200 px-4 py-2 rounded-full">
              Credit: {data?.user?.apiRequestCount} /{" "}
              {data?.user?.monthlyRequestCount}
            </span>
          </div>

        </div>

        {/* Form */}
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4"
        >

          {/* Prompt */}
          <div>

            <label
              htmlFor="prompt"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Enter a topic or idea
            </label>

            <input
              id="prompt"
              type="text"
              {...formik.getFieldProps("prompt")}
              className="px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a topic or idea"
            />

            {formik.touched.prompt && formik.errors.prompt && (
              <div className="text-red-500 mt-1">
                {formik.errors.prompt}
              </div>
            )}

          </div>

          {/* Tone */}
          <div>

            <label
              htmlFor="tone"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Select Tone
            </label>

            <select
              id="tone"
              {...formik.getFieldProps("tone")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a tone...</option>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
              <option value="humorous">Humorous</option>
            </select>

            {formik.touched.tone && formik.errors.tone && (
              <div className="text-red-500 mt-1">
                {formik.errors.tone}
              </div>
            )}

          </div>

          {/* Category */}
          <div>

            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Select Category
            </label>

            <select
              id="category"
              {...formik.getFieldProps("category")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose a category...</option>

              <option value="technology">
                Technology
              </option>

              <option value="health">
                Health
              </option>

              <option value="business">
                Business
              </option>

            </select>

            {formik.touched.category &&
              formik.errors.category && (
                <div className="text-red-500 mt-1">
                  {formik.errors.category}
                </div>
              )}

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-linear-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Content
          </button>

          {/* History Link */}
          <Link to="/history">
            View history
          </Link>

        </form>

        {/* Generated Content */}
        {generatedContent && (

          <div className="mt-6 p-4 bg-gray-100 rounded-md">

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Generated Content:
            </h3>

            <p className="text-gray-600 whitespace-pre-wrap">
              {generatedContent}
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default BlogPostAIAssistant;