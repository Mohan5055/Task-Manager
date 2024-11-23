

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBars, FaCaretDown, FaUserCircle } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import ls from "localstorage-slim";
import { deleteCookie } from "cookies-next";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [role, setRole] = useState<string>("unknown");
  const [email, setEmail] = useState<string>("unknown");
  const router = useRouter();

  // Fetch role and email when component mounts
  useEffect(() => {
    const storedRole:any = ls.get("u", { encrypt: true }) || "unknown";
    const storedEmail:any = ls.get("e", { encrypt: true }) || "unknown";
    setRole(storedRole);
    setEmail(storedEmail);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const Logout = () => {
    ls.remove("e");
    ls.remove("u");
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    router.push("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col p-4 h-full">
          {/* Sidebar Toggle Button */}
          <button className="text-black mb-6" onClick={toggleSidebar}>
            <FaBars size={24} />
          </button>

          {/* Sidebar Title */}
          <div className="flex items-center mb-8">
            <span className="text-purple-600 text-2xl font-bold">
              {isOpen ? "APCO " : ""}
            </span>
          </div>
          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            {role === "user" && (
              <div>
              <div
                className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer"
                // onClick={() => router.push("/userdashboard")}
                >
                <RiDashboardFill className="mr-2 text-purple-600" size={24} />
                {isOpen && <span className="text-gray-700">Dashboard</span>}
              </div>
              <div
                className="flex items-center p-2 hover:bg-gray-200 rounded cursor-pointer"
                // onClick={() => router.push("/form")}
                >
                <RiDashboardFill className="mr-2 text-purple-600" size={24} />
                {isOpen && <span className="text-gray-700">Task</span>}
              </div>
              </div>
            )}
          </div>

          {/* User Info and Logout */}
          <div className="absolute bottom-6 left-0 w-full px-4">
            <Popover className="py-5 border-t-[1px] border-t-gray-300 flex items-center gap-x-3 relative">
              <PopoverButton className="cursor-pointer">
                <FaUserCircle
                  data-tooltip-id
                  data-tooltip-content={email}
                  data-tooltip-place="right"
                  size={32}
                />
              </PopoverButton>
              {isOpen && (
                <div className="flex flex-col justify-center text-xs gap-x-2">
                  <p className="font-semibold uppercase">{role}</p>
                  <p className="text-gray-400 text-[10px] capitalize">{email}</p>
                </div>
              )}
              <PopoverButton className="cursor-pointer">
                <FaCaretDown size={16} className="absolute right-1" />
              </PopoverButton>

              <PopoverPanel className="flex flex-col bg-white py-1 z-50 border-[1px] border-gray-400 rounded-xl text-sm shadow-lg">
                <button
                  className="hover:bg-gray-100 px-4 py-1 dark:bg-slate-800"
                  onClick={Logout}
                >
                  Logout
                </button>
              </PopoverPanel>
            </Popover>
          </div>
        </div>
      </div>
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        }`}
      ></div>
    </div>
  );
};

export default Sidebar;
