"use client";

import { useRegister } from "@/app/hooks/useRegister";

const Hero = () => {
  const { handleSubmit, register, errors, isSubmitting } = useRegister();
  return (
    <section className="w-full max-w-380 min-h-screen">
      <div className="header w-full h-30 flex items-center justify-center">
        <div className="w-full flex items-center justify-center">
          <span>Brand</span>
        </div>
        <div className="w-full flex items-center justify-end">
          <span>Login</span>
        </div>
      </div>
      <div className="body w-full min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-160 flex items-start justify-center border rounded-xl p-4 flex-col gap-4"
        >
          <span className="text-2xl font-bold">Registration Form</span>
          <div className="w-full">
            <label htmlFor="email" className="text-xl font-semibold">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="w-full border p-4 rounded-md"
            />{" "}
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="username" className="text-xl font-semibold">
              Username
            </label>
            <input
              {...register("username")}
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              className="w-full border p-4 rounded-md"
            />{" "}
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="contact_no" className="text-xl font-semibold">
              Contact No
            </label>
            <input
              {...register("contact_no")}
              type="text"
              id="contact_no"
              name="contact_no"
              placeholder="Contact No"
              className="w-full border p-4 rounded-md"
            />{" "}
            {errors.contact_no && (
              <p className="text-red-500 text-sm">
                {errors.contact_no.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="password" className="text-xl font-semibold">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full border p-4 rounded-md"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="w-full">
            <label
              htmlFor="confirmed_password"
              className="text-xl font-semibold"
            >
              Confirm Your Password
            </label>
            <input
              {...register("confirmed_password")}
              type="password"
              id="confirmed_password"
              name="confirmed_password"
              placeholder="Confirm Your Password"
              className="w-full border p-4 rounded-md"
            />
            {errors.confirmed_password && (
              <p className="text-red-500 text-sm">
                {errors.confirmed_password.message}
              </p>
            )}
          </div>
          <div className="w-full p-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-3 rounded-md text-white transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
