import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getUserProfileAPI } from "../../apis/user/usersAPI";
import StatusMessage from "../Alert/StatusMessage";

const Dashboard = () => {
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
  });

  // ✅ Loading
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  // ❌ Error
  if (isError) {
    return (
      <StatusMessage
        type="error"
        message={error?.response?.data?.message || "Something went wrong"}
      />
    );
  }

  const user = data?.user;

  // ✅ Safe calculations
  const remainingCredits =
    (user?.monthlyRequestCount || 0) - (user?.apiRequestCount || 0);

  const isTrialActive =
    user?.trialExpires && new Date(user.trialExpires) > new Date();

  return (
    <div className="mx-auto p-4 bg-gray-900 w-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        User Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Name</label>
            <p className="border rounded py-2 px-3">
              {user?.username || "N/A"}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Email</label>
            <p className="border rounded py-2 px-3">
              {user?.email || "N/A"}
            </p>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Credit Usage</h2>

          <p className="mb-2">
            Monthly Credit: {user?.monthlyRequestCount || 0}
          </p>
          <p className="mb-2">
            Credit Used: {user?.apiRequestCount || 0}
          </p>
          <p className="mb-2">Credit Remaining: {remainingCredits}</p>
          <p className="mb-2">
            Next Billing Date:{" "}
            {user?.nextBillingDate
              ? new Date(user.nextBillingDate).toDateString()
              : "No billing date"}
          </p>
        </div>

        {/* Plan */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Payment & Plans</h2>

          <p className="mb-4">Current Plan: {user?.subscription}</p>

          {user?.subscription === "trial" && (
            <p className="border mb-2 p-2 rounded">
              Trial: 1000 monthly requests
            </p>
          )}
          {user?.subscription === "free" && (
            <p className="border mb-2 p-2 rounded">
              Free: 5 monthly requests
            </p>
          )}
          {user?.subscription === "basic" && (
            <p className="border mb-2 p-2 rounded">
              Basic: 50 monthly requests
            </p>
          )}
          {user?.subscription === "premium" && (
            <p className="border mb-2 p-2 rounded">
              Premium: 100 monthly requests
            </p>
          )}

          <Link
            to="/plans"
            className="inline-block mt-3 py-2 px-4 text-white rounded bg-linear-to-r from-purple-500 to-blue-500"
          >
            Upgrade Plan
          </Link>
        </div>

        {/* Trial */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Trial Information</h2>

          <p className="mb-2">
            Trial Status:{" "}
            {isTrialActive ? (
              <span className="text-green-500">Active</span>
            ) : (
              <span className="text-yellow-600">Expired</span>
            )}
          </p>

          <p className="mb-2">
            Expires on:{" "}
            {user?.trialExpires
              ? new Date(user.trialExpires).toDateString()
              : "No trial"}
          </p>

          <Link
            to="/plans"
            className="inline-block mt-3 py-2 px-4 text-white rounded bg-linear-to-r from-purple-500 to-blue-500"
          >
            Upgrade to Premium
          </Link>
        </div>

        {/* Payments */}
        <div className="bg-white p-4 shadow rounded-lg md:col-span-2">
          <h2 className="text-2xl font-bold mb-5">Payment History</h2>

          {user?.payments?.length > 0 ? (
            <ul className="divide-y">
              {user.payments.map((payment) => (
                <li
                  key={payment._id}
                  className="py-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-indigo-600 text-sm font-medium">
                        {payment?.subscriptionPlan}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment?.createdAt).toDateString()}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <p
                        className={`text-sm font-semibold ${
                          payment?.status === "succeeded"
                            ? "text-green-500"
                            : "text-orange-500"
                        }`}
                      >
                        {payment?.status}
                      </p>

                      <p className="ml-4 text-sm">$ {payment?.amount}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No Payment History</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;