"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "@/lib/slice/authSlice";

const AuthLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return null;
};

export default AuthLoader;
