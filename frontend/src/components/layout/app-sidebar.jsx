import { Sidebar, SidebarHeader , SidebarContent , SidebarFooter , SidebarRail } from "../ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import {data} from "./data/data"
import {ScrollArea} from '../ui/scroll-area'
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-users"
import { NavBanner } from "./nav-banner"
import { NavOther } from "./nav-other"
import { NavInfoUser } from "./nav-infouser"
export default function AppSideBar (props) {
  return(
    <Sidebar collapsible="icon"  {...props} variant="">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams}/>
      </SidebarHeader>
      <SidebarContent>
        {/* Ajout du ScrollArea ici pour que seul le contenu central défile */}
        <ScrollArea className="h-full rounded-md">
          <NavMain items={data.navMain} />
          <NavBanner items={data.navBanner}/>
          <NavUser items = {data.navUsers}/>
          <NavOther items = {data.navSetting}/>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavInfoUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}