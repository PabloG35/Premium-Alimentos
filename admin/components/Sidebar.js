"use client";

import { useContext } from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import AdminAuthContext from "@/context/AdminAuthContext";

export function AppSidebar() {
  const { admin, logout } = useContext(AdminAuthContext);

  return (
    <Sidebar className="flex flex-col h-full">
      {/* Sidebar Header */}
      <SidebarHeader className="p-4">
        {admin ? (
          <>
            <h1 className="text-2xl font-bold">{admin.nombre}</h1>
            <p className="text-sm text-muted-foreground">{admin.rol}</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Rol desconocido</p>
          </>
        )}
      </SidebarHeader>

      {/* Sidebar Menu with Collapsible items */}
      <SidebarContent>
        <SidebarMenu>
          {/* First Menu: Dashboard (index.js) */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link href="/" passHref>
                  <SidebarMenuButton>Dashboard</SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* Leave SidebarMenuSubItem area blank */}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Second Menu: Órdenes */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link href="/ordenes" passHref>
                  <SidebarMenuButton>Órdenes</SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* SidebarMenuSubItem area left blank */}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Third Menu: Tienda */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link href="/tienda" passHref>
                  <SidebarMenuButton>Tienda</SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* SidebarMenuSubItem area left blank */}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {/* Fourth Menu: Usuarios */}
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <Link href="/usuarios" passHref>
                  <SidebarMenuButton>Usuarios</SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* SidebarMenuSubItem area left blank */}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-4">
        <Button variant="destructive" onClick={logout} className="w-full">
          Cerrar Sesión
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
