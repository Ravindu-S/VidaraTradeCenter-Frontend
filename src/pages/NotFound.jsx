import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      <h1 className="text-8xl font-extrabold text-primary dark:text-white">
        404
      </h1>
      <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-8 flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white transition-transform active:scale-95 hover:shadow-lg"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;