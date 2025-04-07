// src/components/NavSideBar.js
import Link from "next/link";
import { useSidebar } from "@/src/components/ui/sidebar";
import { Button } from "@/src/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/src/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/src/components/ui/collapsible";

export function AppSidebar() {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity z-[70]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Controlled Sidebar using shadcn defaults */}
      <Sidebar
        open={open}
        onOpenChange={setOpen}
        collapsible="offcanvas"
        className="fixed top-0 left-0 h-full w-64 z-[80]"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Premium Alimentos</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">Inicio</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Collapsible "Tienda" Menu */}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Link
                        href={{ pathname: "/tienda" }}
                        className="border-b-[2.5px] border-pm-naranja"
                      >
                        Tienda
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem asChild>
                        <Link
                          href={{
                            pathname: "/tienda",
                            query: { marca: "Royal Canin" },
                          }}
                          className="text-sm hover:border-b-2 hover:border-zinc-400"
                        >
                          Royal Canin
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem asChild>
                        <Link
                          href={{
                            pathname: "/tienda",
                            query: { marca: "Diamond Naturals" },
                          }}
                          className="text-sm hover:border-b-2 hover:border-zinc-400"
                        >
                          Diamond Naturals
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem asChild>
                        <Link
                          href={{
                            pathname: "/tienda",
                            query: { marca: "Taste of The Wild" },
                          }}
                          className="text-sm hover:border-b-2 hover:border-zinc-400"
                        >
                          Taste of The Wild
                        </Link>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem asChild>
                        <Link
                          href={{
                            pathname: "/tienda",
                            query: { marca: "Blue Buffalo" },
                          }}
                          className="text-sm hover:border-b-2 hover:border-zinc-400"
                        >
                          Blue Buffallo
                        </Link>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/nosotros">Nosotros</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contacto">Contacto</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Wrapper div for the close button to animate its left position */}
      <div
        className={`fixed top-3 z-[90] transition-all duration-300 ${
          open ? "left-[16.5rem]" : "left-1"
        }`}
      >
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className={`transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          X
        </Button>
      </div>
    </>
  );
}
