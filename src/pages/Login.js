import React, { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import * as Yup from "yup";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/contextApi/auth";
import axios from "axios";
import { baseURL } from "../utils/baseUrl";

const Login = () => {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (loginData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/v1/driver/login-driver`,
        loginData
      );

      const loginDataRes = response?.data;

      console.log(loginDataRes);
      if (loginDataRes?.success) {
        setAuth({ user: loginDataRes, token: loginDataRes?.accessToken });
        setIsLoading(false);
        navigate("/homepage");
      } else {
        toast.error("Authorizatin failed Please login again");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    empId: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    empId: Yup.string().required("Required Employe Id"),
    password: Yup.string().min(5).required("Required Password"),
  });

  const onSubmit = (values, actions) => {
    login(values);

    actions.resetForm();
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <section className="h-svh bg-blue-300 flex justify-center items-center">
      <div className="p-5 md:w-11/12 md:mx-auto md:h-[50%] md:my-auto shadow shadow-black bg-white rounded-md flex flex-col justify-center gap-y-10">
        {error && <p className="text-red-700">{error}</p>}
        <h3>Login</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-10">
          <div className="flex flex-col gap-y-5 w-[75%]">
            <TextField
              label="Enter Employee Id"
              variant="outlined"
              type="text"
              name="empId"
              id="empId"
              value={values.empId}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.empId && touched.empId ? "p-2 border-red-600" : "p-2"
              }
            />
            {errors.empId && touched.empId && (
              <p className="text-red-600 font-bold">{errors.empId}</p>
            )}
          </div>
          <div className="flex flex-col gap-y-5 w-[75%]">
            <TextField
              label="Enter Password"
              variant="outlined"
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.password && touched.password
                  ? "p-2 border-red-600"
                  : "p-2"
              }
            />
            {errors.password && touched.password && (
              <p className="text-red-950 font-bold">{errors.password}</p>
            )}
          </div>

          {isLoading ? (
            <div className="p-3 w-[75%] bg-red-950 text-white rounded-lg">
              Loading...
            </div>
          ) : (
            <Button variant="contained" type="submit" className="p-2 w-[75%]">
              Submit
            </Button>
          )}
        </form>
      </div>
    </section>
  );
};

export default Login;
