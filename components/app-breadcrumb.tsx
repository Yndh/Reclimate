"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

export const AppBreadcrumb = () => {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname === "/app" ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">App</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : (
          segments.map((segment, index) => {
            const href = `/app/${segments.slice(0, index + 1).join("/")}`;

            return (
              <>
                <BreadcrumbItem>
                  {index === segments.length - 1 ? (
                    <span>{capitalize(segment)}</span>
                  ) : (
                    <BreadcrumbLink href={href}>
                      {capitalize(segment)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < segments.length - 1 && <BreadcrumbSeparator />}
              </>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
