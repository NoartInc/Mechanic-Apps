import React from "react";

function Footer() {
  return (
    <div className="footer bg-white">
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2023{" "}
        <a href="/" className="hover:underline">
          IT BRM
        </a>
        . Your Best Roofing Solution.
      </span>
    </div>
  );
}

export default Footer;
