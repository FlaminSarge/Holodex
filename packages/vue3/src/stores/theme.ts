import { convertToDaisyHSLAndColor } from "./../hooks/theme-changer/daisy-utils/daisy-color-fns";
import { Theme, VuetifyBrandColors } from "@/hooks/theme-changer/helpers";
import { DaisyDefaults, presets } from "@/hooks/theme-changer/presets";
import {
  DaisyColorShorthand,
  DaisyColorName,
} from "@/hooks/theme-changer/daisy-utils/daisy-types";

interface CachedTheme {
  /**
   * Cached output of Vuetify Brand color map (primary => #c01023) and Daisy Color Shorthand mapping (--p => #c01023).
   */
  outputCache: [VuetifyBrandColors, Record<DaisyColorShorthand, string>];
  /**
   * Timestamp of last outputCache computation
   */
  outputCacheTS: number;
  /**
   * Timestamp of last modification to the Theme object (name, colors, dark).
   */
  lastModified: number;
}

export const useThemeStore = defineStore("site-theme", {
  // convert to a function
  state: (): Theme & CachedTheme => {
    // const outputCache = out;

    const ts = Date.now();
    setTimeout(useThemeStore().init, 100); // initialize ?
    return {
      outputCache: [{}, {}] as any,
      ...presets[0],
      outputCacheTS: 0,
      lastModified: ts,
    };
  },
  getters: {},
  actions: {
    setTheme(name: string) {
      console.log(name);
      const a = presets.find((x) => x.name === name);
      if (!a) return;
      const init = presets[0].colors;
      this.colors = {
        ...init,
        ...a.colors,
        "color-scheme": a.dark ? "dark" : "light",
      };
      this.dark = a.dark;
      this.name = a.name;

      this.lastModified = Date.now();

      this._saveAndCacheVuetify();
      // Dark.set(this.dark);
    },
    setCustomTheme(prop: DaisyColorName, color: `#${string}`) {
      this.name = "USER";
      this.colors[prop] = color;

      this.lastModified = Date.now();
      this._saveAndCacheVuetify();
    },
    setCustomThemeDark(bool: boolean) {
      this.dark = bool;
      this.lastModified = Date.now();
      this._saveAndCacheVuetify();
    },
    init() {
      console.time("Theme Init");
      this._saveAndCacheVuetify();
      console.timeEnd("Theme Init");
    },
    _saveAndCacheVuetify() {
      if (this.outputCacheTS === this.lastModified) return; // no changes needed.
      // console.log("compiling site-theme (expensive)");
      const [convert, colormap] = convertToDaisyHSLAndColor(
        {
          ...this.colors,
          ...DaisyDefaults,
        },
        this.dark
      );

      const out: [VuetifyBrandColors, Record<DaisyColorShorthand, string>] = [
        {
          background: colormap["--b1"].rgb().hex(),
          surface: (colormap["--b2"] || colormap["--b1"].darken(0.1))
            .rgb()
            .hex(),
          primary: colormap["--p"].rgb().hex(),
          secondary: colormap["--s"].rgb().hex(),
          accent: colormap["--a"].rgb().hex(),
          error: colormap["--er"].rgb().hex(),
          success: colormap["--su"].rgb().hex(),
          info: colormap["--in"].rgb().hex(),
          warning: colormap["--wa"].rgb().hex(),
        },
        convert,
      ];

      this.outputCache = out;
      this.outputCacheTS = Number(this.lastModified);
    },
  },
  share: {
    enable: true,
    initialize: true, // when initializing, fetch from another tab.
  },
  persistedState: {
    persist: true,
    overwrite: true,
  },
});
