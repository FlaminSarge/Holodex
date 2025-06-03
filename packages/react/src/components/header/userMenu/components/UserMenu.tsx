import { useAuth } from "@/hooks/useAuth";
import { userAtom } from "@/store/auth";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { UserMenuItem } from "./UserMenuItem";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { calendarDialogAtom } from "@/hooks/useFrame";
import { Badge } from "@/shadcn/ui/badge";

export function UserMenu() {
  const { t } = useTranslation();
  const user = useAtomValue(userAtom);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const setDialog = useSetAtom(calendarDialogAtom);

  const userMenuItems = [
    {
      key: "settings",
      value: t("component.mainNav.settings"),
      fn: () => navigate("/settings/user"),
      icon: <div className="i-heroicons:cog-6-tooth" />,
    },
    {
      key: "iCalFeed",
      value: "iCal Feed",
      fn: () => setDialog((x) => ({ ...x, open: true })),
      icon: <div className="i-heroicons:calendar" />,
    },
    {
      key: "logout",
      value: t("component.mainNav.logout"),
      fn: logout,
      icon: <div className="i-heroicons:arrow-up-tray" />,
    },
  ];

  if (!user) {
    return (
      <Button asChild>
        <Link to="/login">{t("component.mainNav.login")}</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="w-8 overflow-hidden rounded-full z-30 mx-2 shrink-0">
        <img
          src={`https://api.dicebear.com/9.x/shapes/svg?seed=${user.id}`}
          alt="User avatar"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-30 relative right-8 w-72">
        <DropdownMenuItem className="flex flex-row">
          <Avatar className="mx-2">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/shapes/svg?seed=${user.id}`}
              alt="userIcon"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 pl-4">
            <div className="overflow-hidden text-ellipsis font-semibold">
              {user.username}{" "}
              <Badge size="sm">{user.role === "user" ? "" : user.role}</Badge>
            </div>
            <div className="flex flex-row gap-2 text-sm">
              <div className={user.discord_id ? "" : "saturate-0"}>
                <div className="i-logos:discord-icon" />
              </div>
              <div className={user.google_id ? "" : "saturate-0"}>
                <div className="i-logos:google-icon" />
              </div>
              {/* <div
                className={user.twitter_id ? "" : "text-base"}
              >
                <div className="i-mdi:twitter" />
              </div> */}
            </div>
            <div className="flex flex-row capitalize">
              <div className="mx-1 animate-pulse i-mage:stars-c"></div>

              {user.contribution_count + " " + t("component.mainNav.points")}
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="" />
        {userMenuItems.map((item) => {
          return (
            <UserMenuItem
              key={item.key + item.value}
              item={{ key: item.key, value: item.value, icon: item.icon }}
              onClick={item.fn}
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
