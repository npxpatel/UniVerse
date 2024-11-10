import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, GraduationCap, Library, Users } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8" />
          <span className="text-2xl font-bold">MIT</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
          <li>
              <button className="hover:underline" onClick={() => navigate("/")}>
                Home
              </button>
            </li>
            
            <li>
              <button className="hover:underline" onClick={() => navigate("/login")}>
                Admissions
              </button>
            </li>

            <li>
              <Link to="#" className="hover:underline">
                Campus Life
              </Link>
            </li>
            <li>
              <button className="hover:underline"  onClick={() => navigate("/library-section")}>
                Library
              </button>
            </li>

            <li>
              <Link to="/login">
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Login
                </button>
              </Link>
            </li>
            <li>
              <Link to="/">
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
