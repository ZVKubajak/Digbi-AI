import { useState, FormEvent, ChangeEvent } from "react";

import Auth from '../utils/auth';  // Import the Auth utility for managing authentication state
import { login } from "../api/authAPI";  // Import the login function from the API
import { UserLogin } from "../interfaces/UserLogin";  // Import the interface for UserLogin


const Login = () => {

    const [loginData, setLoginData] = useState<UserLogin>({
        email: '',
        password: ''
      });
    
      // Handle changes in the input fields
      const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setLoginData({
          ...loginData,
          [name]: value
        });
      };
    
      // Handle form submission for login
      const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
          // Call the login API endpoint with loginData
          const data = await login(loginData);
          // If login is successful, call Auth.login to store the token in localStorage
          Auth.login(data.token);
        } catch (err) {
          console.error('Failed to login', err);  // Log any errors that occur during login
        }
      };
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-16 px-6 sm:px-8 lg:px-12">
        <div className="max-w-lg w-full space-y-12">
          <div>
            <h2 className="mt-6 text-center text-4xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <p className="mt-4 text-center text-base text-gray-600">
              Don't have an account yet? 
              <a
                href="#"
                className="font-medium text-gray-700 hover:text-gray-900 ml-2"
              >
                Sign up here
              </a>
            </p>
          </div>
          <form
            className="space-y-8"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="rounded-md shadow-sm space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-lg"
                  placeholder="Enter email"
                  value={loginData.email || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-lg"
                  placeholder="Enter password"
                  value={loginData.password || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;
  