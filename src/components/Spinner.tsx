import React from "react";
import "./Spinner.css";

const Spinner: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="spinner" style={{ width: size, height: size }} />
);

export default Spinner;
