import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isTomorrow from "dayjs/plugin/isTomorrow";

dayjs.extend(localizedFormat);
dayjs.extend(isTomorrow);
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const thresholds = [
    { l: "s", r: 1 },
    { l: "m", r: 1 },
    { l: "mm", r: 59, d: "minute" },
    { l: "h", r: 1 },
    { l: "hh", r: 24, d: "hour" },
    { l: "d", r: 1 },
    { l: "dd", r: 29, d: "day" },
    { l: "M", r: 1 },
    { l: "MM", r: 11, d: "month" },
    { l: "y" },
    { l: "yy", d: "year" },
];
dayjs.extend(relativeTime, {
    thresholds,
});

export function formatDuration(millisecs) {
    const negate = millisecs < 0;
    const secs = millisecs / 1000;
    const h = Math.floor(secs / (60 * 60));
    const m = Math.floor((secs % (60 * 60)) / 60);
    const s = Math.floor((secs % (60 * 60)) % 60);
    const hStr = h ? `${h}:` : "";
    const mStr = String(m).padStart(h ? 2 : 1, "0");
    const sStr = String(s).padStart(2, "0");
    return `${negate ? "-" : ""}${hStr}${mStr}:${sStr}`;
}

// eslint-disable-next-line no-unused-vars
export function localizedDayjs(time, lang) {
    // const dayjsName = {
    //     "en-CA": "en-ca",
    //     "en-GB": "en-gb",
    //     zh: "zh-tw",
    //     "es-ES": "es",
    //     "pt": "pt-br",
    // }
    // // eslint-disable-next-line no-param-reassign
    // lang = dayjsName[lang] || lang;
    return dayjs(time);
}

export function titleTimeString(available_at, lang) {
    const ts = localizedDayjs(available_at, lang);
    const ts1 = ts.format(`${ts.isTomorrow() ? "ddd " : ""}LT zzz`);
    const ts2 = ts
        .tz("Asia/Tokyo")
        .format(`${ts.isTomorrow() ? "ddd " : ""}LT zzz`);
    if (ts1 === ts2) {
        return ts1;
    }
    return `${ts1}\n${ts2}`;
}

export function formatDistance(time, lang, $t, allowNegative = true, now = dayjs()) {
    if (!time) return "?";
    const minutesDiff = now.diff(time, "minutes");
    if (Math.abs(minutesDiff) < 1) return $t("time.soon");
    if (!allowNegative && minutesDiff > 0) return $t("time.soon");
    // if (Math.abs(now.diff(time, "days")) > 60) return localizedDayjs(time, lang).format("ll");
    const hourDiff = now.diff(time, "hour");
    if (hourDiff < -23) {
        return $t("time.diff_future_date", [
            localizedDayjs(time, lang).format("l"),
            localizedDayjs(time, lang).format("LT"),
        ]);
    }
    if (hourDiff > 23) {
        return `${localizedDayjs(time, lang).format("l")} (${localizedDayjs(time, lang).format("LT")})`;
    }
    const timeObj = localizedDayjs(time, lang);
    if (new Date(time) > Date.now()) {
        return $t("time.diff_future_date", [
            timeObj.fromNow(),
            timeObj.format(`${timeObj.isTomorrow() ? "ddd " : ""}LT`),
        ]);
    }
    return $t("time.distance_past_date", [localizedDayjs(time, lang).fromNow()]);
}

export function secondsToHuman(s) {
    // console.log(s);
    return new Date(s * 1000).toISOString().substr(11, 8);
}

export function formatDurationShort(secs) {
    if (secs < 0) return "0m";
    const h = secs / (60 * 60);
    const m = (secs % (60 * 60)) / 60;
    return h >= 1 ? `${Math.round(h)}h` : `${Math.round(m)}m`;
}

export { dayjs };
