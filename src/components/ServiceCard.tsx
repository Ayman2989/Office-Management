"use client";
import Link from "next/link";
import React from "react";

interface ServiceCardProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, href, icon }) => {
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl px-6 py-8 shadow-primary shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center hover:bg-primary w-full max-w-[200px] mx-auto"
    >
      <div className="text-primary group-hover:text-white transition-colors duration-300 mb-2">
        {icon}
      </div>
      <h2 className="text-md font-medium text-primary group-hover:text-white transition-colors duration-300">
        {title}
      </h2>
    </Link>
  );
};

export default ServiceCard;
