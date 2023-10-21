"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { userActions } from "../../../store/reducers/user";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HOST } from "@/utils/server";
import axios from "axios";
import { LoadingButton } from "@mui/lab";

const signup = async ({ formData }) => {
  try {
    const { data } = await axios.post(`${HOST}/api/users/register`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    throw new Error(error?.response.data.message);
  }
};

const LoginPage = () => {
  const dispatch = useDispatch();

  const userState = useSelector((state) => state.user);
  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => signup({ formData }),
    onSuccess: (data) => {
      Cookies.set("user", JSON.stringify(data?.user), { expires: 7 });
      dispatch(userActions.setUserInfo(data?.user));
      toast.success("Registered Successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const submitHandler = (data) => {
    const { name, email, password } = data;

    const newForm = new FormData();
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);

    mutate(newForm);
  };

  useEffect(() => {
    if (userState?.userInfo) {
      redirect("/");
    }
  }, [userState?.userInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="container mx-auto px-5 py-10">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="mb-8 text-center font-roboto text-2xl font-bold text-dark-hard">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="mb-6 flex w-full flex-col">
            <label
              htmlFor="email"
              className="block font-semibold text-[#5a7184] capitalize"
            >
              name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", {
                required: {
                  value: true,
                  message: "name is required",
                },
              })}
              placeholder="Enter name"
              className={`mt-3 block rounded-lg border px-5 py-4 font-semibold text-dark-hard outline-none placeholder:text-[#959ead] ${
                errors.name ? "border-red-500" : "border-[#c3cad9]"
              }`}
            />
            {errors.name?.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className="mb-6 flex w-full flex-col">
            <label
              htmlFor="email"
              className="block font-semibold text-[#5a7184]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Email is required",
                },
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Please enter a valid email",
                },
              })}
              placeholder="Enter email"
              className={`mt-3 block rounded-lg border px-5 py-4 font-semibold text-dark-hard outline-none placeholder:text-[#959ead] ${
                errors.email ? "border-red-500" : "border-[#c3cad9]"
              }`}
            />
            {errors.email?.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className="mb-6 flex w-full flex-col">
            <label
              htmlFor="password"
              className="block font-semibold text-[#5a7184]"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password length must be atleast six characters",
                },
                required: {
                  value: true,
                  message: "password is required",
                },
              })}
              placeholder="Enter password"
              className={`mt-3 block rounded-lg border px-5 py-4 font-semibold text-dark-hard outline-none placeholder:text-[#959ead] ${
                errors.password ? "border-red-500" : "border-[#c3cad9]"
              }`}
            />
            {errors.password?.message && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password?.message}
              </p>
            )}
          </div>
          {isLoading ? (
            <LoadingButton
              loading
              variant="outlined"
              sx={{
                width: "100%",
                mb: "24px",
                borderRadius: "10px",
                backgroundColor: "rgb(59, 130, 246)",
                padding: "16px 32px",
                fontWeight: "700",
                color: "white",
              }}
            >
              Submit
            </LoadingButton>
          ) : (
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="mb-6 w-full rounded-lg bg-blue-500 py-4 px-8 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              Sign in
            </button>
          )}
          <p className="text-sm font-semibold text-[#5a7184]">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
