import { useEffect, useMemo, useState } from "react";
import { useFavoriteLive } from "@/services/live.service";
import { MainVideoListing } from "@/components/video/MainVideoListing";
import { useVideoCardSizes } from "@/store/video";
import PullToRefresh from "@/components/layout/PullToRefresh";
import { useVideoFilter } from "@/hooks/useVideoFilter";
import StickyTabsList from "../home/home";
import { FavoritedChannels } from "./favoritedChannels";
import { Tabs, TabsContent } from "@/shadcn/ui/tabs";
import { Helmet } from "@dr.pogodin/react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Separator } from "@/shadcn/ui/separator";
import { FavoritesArchiveTab, FavoritesClipTab } from "./favoriteOtherTabs";
import { EmptyQuip } from "../home/EmptyQuip";
import { useVideoSort } from "@/hooks/useVideoSort";

export function FavoritesLive() {
  const { size: cardSize } = useVideoCardSizes(["list", "md", "lg"]);

  const {
    data: liveOrUpcoming,
    isLoading: liveLoading,
    refetch,
  } = useFavoriteLive();

  const filtered = useVideoFilter(
    liveOrUpcoming as Video[],
    "stream_schedule",
    "favorites",
  );

  const nowLive = useMemo(
    () => filtered?.filter(({ status }) => status === "live") ?? [],
    [filtered],
  );
  const upcoming = filtered?.filter(({ status }) => status !== "live") ?? [];

  // sort livestreams by video list settings
  const nowLiveSorted = useVideoSort(nowLive, "stream_schedule");

  return (
    <>
      <PullToRefresh onRefresh={refetch}>
        <MainVideoListing
          isLoading={liveLoading}
          size={cardSize}
          videos={nowLiveSorted}
        />
        {!liveLoading && nowLiveSorted.length == 0 && <EmptyQuip />}
        <Separator className="mb-4 mt-2 w-full lg:mb-6 lg:mt-4" />
        <MainVideoListing
          isLoading={liveLoading}
          size={cardSize}
          videos={upcoming}
        />
      </PullToRefresh>
    </>
  );
}

export function FavoritesHome() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  // const { org } = useParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "live");

  // useEffect(() => {
  //   navigate(`/org/${currentOrg}`, { replace: true });
  // }, [currentOrg, navigate]);

  useEffect(() => {
    console.log(`tab changed ${activeTab}`);
    searchParams.set("tab", activeTab);
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, activeTab]);

  // TODO: probably use a different flag than "Oshis", but idk between Members or What
  return (
    <>
      <Helmet>
        <title>{t("component.mainNav.favorites")} - Holodex</title>
      </Helmet>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <StickyTabsList activeTab={activeTab} membersTabLabel="Oshis" />
        <TabsContent value="live">
          <FavoritesLive />
        </TabsContent>
        <TabsContent value="archive">
          <FavoritesArchiveTab />
        </TabsContent>
        <TabsContent value="clips">
          <FavoritesClipTab />
        </TabsContent>
        <TabsContent value="members">
          <FavoritedChannels />
        </TabsContent>
      </Tabs>
    </>
  );
}
