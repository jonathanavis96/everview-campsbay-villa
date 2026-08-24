import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { RidgelineMark } from "@/components/Ridgeline";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404: attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center">
      <div className="container text-center">
        <RidgelineMark className="h-10 w-40 mx-auto mb-6 text-stone-text" />
        <p className="text-label text-stone-text mb-3">404</p>
        <h1 className="text-display-l mb-6">This page doesn't exist.</h1>
        <Link to="/" className="text-body underline hover:no-underline">
          Back to Everview
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
