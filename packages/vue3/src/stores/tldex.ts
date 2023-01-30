import { TLLanguageCode } from "@/utils/consts";
import { getTLLangRecommendation } from "@/utils/functions";
import { useLangStore } from "./lang";
import { defineStore } from "pinia";

interface State {
  // whether live TL sticks to the bottom or not
  liveTlStickBottom: boolean;
  // language of dexTL
  liveTlLang: TLLanguageCode;
  // font size
  liveTlFontSize: number;
  // whether to show verified.
  liveTlShowVerified: boolean; // show verified messages
  // whether to show moderators
  liveTlShowModerator: boolean; // show moderator messages
  // whether to show vtubers
  liveTlShowVtuber: boolean; // show vtuber messages
  // whether to show local time
  liveTlShowLocalTime: boolean; // show client local time
  // window size
  liveTlWindowSize: number; // Default size, otherwise percentage height
  // subtitle on/off
  liveTlShowSubtitle: boolean; // Show subtitles on videos
  // hide spoilers or not?
  liveTlHideSpoiler: boolean; // Hide message past current video time

  // blocked liveTL users.
  liveTlBlocked: string[];
}

export const useTLStore = defineStore("pref-dexTL", {
  state: (): State => {
    const langStore = useLangStore();
    const lang = getTLLangRecommendation(langStore.lang);
    return {
      liveTlStickBottom: false,
      liveTlLang: lang,
      liveTlFontSize: 13,
      liveTlShowVerified: true, // show verified messages
      liveTlShowModerator: true, // show moderator messages
      liveTlShowVtuber: true, // show vtuber messages
      liveTlShowLocalTime: false, // show client local time
      liveTlWindowSize: 0.3, // Default size, otherwise percentage height
      liveTlShowSubtitle: true, // Show subtitles on videos
      liveTlHideSpoiler: false, // Hide message past current video time
      liveTlBlocked: [],
    };
  },
  getters: {
    blockset: (state): Set<string> => {
      return new Set(state.liveTlBlocked);
    },
  },
  actions: {
    saveNewDefaults(newState: State) {
      this.$state = newState;
    },
    toggleBlocked(name: string) {
      const index = this.liveTlBlocked.indexOf(name);
      console.log(this.liveTlBlocked);
      if (index === -1) {
        this.liveTlBlocked.push(name);
      } else {
        this.liveTlBlocked.splice(index);
      }
    },
  },
  share: {
    enable: true,
    initialize: true, // when initializing, fetch from another tab.
  },
  persistedState: {
    persist: true,
  },
});
