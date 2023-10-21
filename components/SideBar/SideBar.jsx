// @ts-nocheck
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import { useDispatch } from "react-redux";
import "./Sidebar.css";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { taskActions } from "../../store/reducers/tasks";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../store/actions/user";
import { HOST } from "@/utils/server";
import { redirect } from "next/navigation";

const logoutSession = async () => {
  try {
    // const { data } = await axios.post(`${server}/api/users/logout`, null, {
    //   withCredentials: true,
    // });

    const res = await fetch(`${HOST}/api/users/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({}),
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

const navMenu = [
  {
    icon: <PersonIcon />,
    label: "Profile",
    ref: "/profile",
  },

  {
    icon: <AssignmentIcon />,
    label: "To Do",
    ref: "/to-do",
  },
];

const SideBar = ({ setToggleSidebar, userInfo, activeTab }) => {
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
    <>
      <aside className="sidebar z-10 hidden max-h-screen min-h-screen w-1/5 min-w-[300px] overflow-x-hidden border-r bg-gray-800 pb-14 text-white md:block">
        <div className="my-4 mx-3.5 flex items-center gap-3 rounded-lg bg-gray-700 p-2 shadow-lg">
          <Avatar alt="Avatar" src={userInfo?.avatar} />
          <div className="flex flex-col gap-0">
            <span className="w-full truncate text-lg font-medium">
              {/* {userInfo?.name} */}
              Team 7
            </span>
            {/* <span className="w-full truncate text-sm text-gray-300">
            {userInfo?.email}
          </span> */}
          </div>
          <button
            onClick={() => setToggleSidebar(false)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 sm:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="my-8 flex w-full flex-col gap-0">
          {navMenu.map((item, index) => {
            const { icon, label } = item;

            return (
              <button
                key={`but_${index}`}
                onClick={() => dispatch(taskActions.setActiveTab(label))}
                className={`${
                  activeTab === label ? "bg-gray-700" : "hover:bg-gray-700"
                } flex items-center gap-3 py-3 px-4 font-medium`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 py-3 px-4 font-medium hover:bg-gray-700`}
          >
            <span>
              <LogoutIcon />
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
