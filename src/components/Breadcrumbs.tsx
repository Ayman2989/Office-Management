"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const Breadcrumbs = () => {
  const pathname = usePathname();

  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");

    // Check if it's a MongoDB ObjectID (24 hex characters)
    const isMongoId = /^[a-f0-9]{24}$/i.test(segment);

    const label = isMongoId
      ? "..."
      : segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

    const isLast = index === segments.length - 1;

    return { label, href, isLast };
  });

  return (
    <nav aria-label="breadcrumb" className="text-md text-primary pl-20 p-2">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map(({ label, href, isLast }, idx) => (
          <li key={idx} className="flex items-center">
            {!isLast ? (
              <Link
                href={href}
                className="hover:text-secondary transition-colors"
              >
                {label}
              </Link>
            ) : (
              <span className="text-gray-500 font-medium">{label}</span>
            )}
            {!isLast && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
