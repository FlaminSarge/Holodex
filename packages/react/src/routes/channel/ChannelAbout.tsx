import { useOutletContext } from "react-router-dom";
import { ChannelOutletContext } from "../channel";
import { useTranslation } from "react-i18next";
import { LinkItTwitter, LinkItUrl } from "react-linkify-it";

export default function ChannelAbout() {
  const { t } = useTranslation();
  const { channel } = useOutletContext<ChannelOutletContext>();

  return (
    <div className="container mx-auto flex gap-4 py-4 max-sm:flex-col-reverse">
      <div className="w-full rounded-lg p-4 whitespace-pre-wrap">
        <LinkItUrl className="underline text-chart-1">
          <LinkItTwitter className="underline text-chart-1">
            {channel.description}
          </LinkItTwitter>
        </LinkItUrl>
      </div>
      <div className="w-full flex-col rounded-lg p-4 text-muted-foreground shrink-0 h-fit md:w-80 divide-y-2">
        <h3 className="p-2 text-xl font-bold">
          {t("component.channelInfo.stats")}
        </h3>
        <div className="p-2">
          {t("component.channelInfo.videoCount", {
            0: Number(channel.video_count).toLocaleString(),
          })}
        </div>
        <div className="p-2">
          {t("component.channelInfo.clipCount", {
            n: Number(channel.clip_count).toLocaleString(),
          })}
        </div>
        <div className="p-2">
          {Number(channel.view_count).toLocaleString() + " "}
          {t("component.channelInfo.totalViews")}
        </div>
      </div>
    </div>
  );
}
