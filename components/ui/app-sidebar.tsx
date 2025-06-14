"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Settings,
  BarChart3,
} from "lucide-react"

const routes = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "#",
    color: "text-sky-500",
    disabled: true,
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    href: "/",
    color: "text-violet-500",
    disabled: false,
  },
  {
    id: "sales",
    label: "Sales",
    icon: FileText,
    href: "/sales-entry",
    color: "text-pink-700",
    disabled: false,
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    href: "#",
    color: "text-orange-700",
    disabled: true,
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    href: "#",
    color: "text-emerald-500",
    disabled: true,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "#",
    color: "text-zinc-400",
    disabled: true,
  },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            STM
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.id}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                route.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-zinc-400"
              )}
              onClick={(e) => route.disabled && e.preventDefault()}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
