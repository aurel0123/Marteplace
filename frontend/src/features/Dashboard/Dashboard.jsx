import AppSidebar from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Main } from "@/components/layout/main";
import { Outlet } from "react-router-dom";
import ProfileDropdown from "@/components/profile-dropdown";
import Searchs from "@/components/Search";
import ThemeSwitch from "@/components/theme-switch";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header qui reste collé en haut de son parent */}
        <header
          className="sticky top-0 z-10 flex h-16 items-center gap-2 px-4 bg-white/30 backdrop-blur-md border-b
          dark:bg-gray-900/50 transition-all"
        >
          {/* Conteneur du header */}
          <div className="flex w-full justify-between items-center">
            {/* Bouton Sidebar + Séparateur */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" />
              <Searchs />
            </div>

            {/* Switch de thème et Profil */}
            <div className="flex items-center gap-4">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <Main>
          <Outlet />
        </Main>
      </SidebarInset>
    </SidebarProvider>
  );
}
