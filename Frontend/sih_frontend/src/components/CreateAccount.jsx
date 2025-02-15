import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "./SnackbarComponent";
import {Button} from "@mui/material";
import google_icon from "../assets/google_logo.png";
import linkedin_logo from "../assets/linkedin_logo.png";

const CreateAccount = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password === confirmPassword) {
      setError("");

      try {
        const response = await axios.post(
          "http://localhost:8080/api/v1/auth/register",
          {
            name: fullName,
            email: email,
            password: password,
            contact: contact,
            roleName: role,
          }
        );

        if (response.status == 200) {
          showSnackbar("User registered successfully..");
        } else {
          showSnackbar("Some error has occurred!!.");
        }
      } catch (err) {
        setError("Some error has occurred!!");
        console.error(err);
      }
    } else {
      setError("Password Mismatched");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-neutral-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-white">
          Create your Jobly account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="mb-4">
              <label htmlFor="full_name" className="sr-only">
                Full Name
              </label>
              <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirm_password" className="sr-only">
                Confirm Password
              </label>
              <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirm_password" className="sr-only">
                Contact
              </label>
              <input
                  id="contact"
                  name="contact"
                  type="text"
                  maxLength={10}
                  autoComplete="contact"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Contact"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                  id="role"
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 bg-neutral-700 border border-neutral-600 placeholder-neutral-400 text-neutral-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="RECRUITER">Recruiter</option>
                <option value="JOB_SEEKER">Job Seeker</option>
              </select>
            </div>
          </div>

          {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <div>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-gradient-to-r from-orange-500 to-orange-800 hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Create Account
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-neutral-400"> Already have an account?</p>
          <Link
              to="/login"
              className="font-medium text-orange-600 hover:text-orange-500"
          >
            Sign in
          </Link>
        </div>
        <div className="w-full h-auto">
          <p className="w-full text-center">OR</p>
        </div>
        <div className="w-full h-auto">
          <Button variant="outlined"
                  startIcon={<img src={google_icon} alt="Google logo" style={{width: 20, height: 20}}/>}
                  className="w-full bg-orange-800 py-2 px-6 rounded-md text-white">Sign in with Google</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
