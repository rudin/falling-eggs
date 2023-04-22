import React from "react";
import { useEffect, useState } from "react";

const Delay = ({ ms = 400, children, placeholder = null }) => {
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setWaiting(false), ms);
    return () => clearTimeout(timeout);
  }, [ms]);
  return waiting ? <>{placeholder}</> : <>{children}</>;
};

export default Delay;
