"use client";
import SideBar from "@/components/SideBar/SideBar";
import Tasks from "@/components/Tasks/Tasks";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { TiPower } from "react-icons/ti";
import { HOST } from "@/utils/server";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/store/actions/user";

const logoutSession = async () => {
  try {
    const res = await fetch(`${HOST}/api/users/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    });

    const data = await res.json();

    return data;
  } catch (error) {
    if (error.response && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(error.message);
  }
};

export default function Home() {
  const { userInfo } = useSelector((state) => state.user);
  const { activeTab } = useSelector((state) => state.task);

  useEffect(() => {
    if (!userInfo) {
      toast.error("Please Login to continue! 😠");
      redirect("/login");
    }
  }, [userInfo]);
  const dispatch = useDispatch();

  const { mutate } = useMutation({
    mutationFn: () => logoutSession(),
    onSuccess: (data) => {
      dispatch(logout);
      toast.success(data?.message);
      redirect("/login");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return (
    <div className="flex h-screen w-full relative md:flex-row flex-col">
      <div className="w-full bg-blue-500 md:hidden flex items-center px-4 justify-between py-4">
        <h1 className="text-white font-semibold text-xl">To Do List</h1>
        <h1
          className="text-white flex items-center gap-2 font-semibold border-2 rounded-md px-2 py-1 hover:bg-black/5"
          onClick={handleLogout}
        >
          Logout
          <TiPower size={20} />
        </h1>
      </div>
      <SideBar userInfo={userInfo} activeTab={activeTab} />
      {activeTab === "Profile" ? (
        <>
          <div>profile</div>
        </>
      ) : (
        <Tasks />
      )}
    </div>
  );
}
