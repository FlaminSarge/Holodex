<template>
  <!-- https://dev.vuetifyjs.com/en/api/v-autocomplete/#props -->
  <v-autocomplete
    v-model="query"
    class="ma-auto song-lookup"
    solo
    filled
    disable-lookup
    hide-no-data
    auto-select-first
    clearable
    :autofocus="autofocus"
    :loading="isLoading"
    :items="results"
    :item-value="(x) => x.index"
    :search-input.sync="search"
    :label="$t('editor.music.itunesLookupPlaceholder')"
    :filter="(a, b) => true"
    return-object
    hide-details
    @input="onInput"
    @keydown.enter="onEnterKeyDown"
  >
    <template #selection="x">
      <div class="ma-n1 py-0 pl-3 pr-1 d-flex" style="width: 100%">
        <!-- @click="addItem(dropdownItem.item) -->
        <v-list-item-avatar tile>
          <v-img :src="x.item.artworkUrl100" />
        </v-list-item-avatar>

        <v-list-item-content class="py-1 pt-1">
          <v-list-item-subtitle class="text--primary">
            🎵 {{ x.item.trackName }} [{{
              formatDuration(x.item.trackTimeMillis)
            }}]
          </v-list-item-subtitle>
          <v-list-item-subtitle class="text--caption">
            🎤 {{ x.item.artistName }} / {{ x.item.collectionName }}
            {{
              x.item.releaseDate ? " / " + x.item.releaseDate.slice(0, 7) : ""
            }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </div>
    </template>

    <template #item="x">
      <div class="ma-n1 py-0 pl-3 pr-1 d-flex">
        <!-- @click="addItem(dropdownItem.item) -->
        <v-list-item-avatar tile>
          <v-img :src="x.item.artworkUrl100" />
        </v-list-item-avatar>

        <v-list-item-content class="py-1 pt-1">
          <v-list-item-subtitle class="text--primary">
            🎵 {{ x.item.trackName }} [{{
              formatDuration(x.item.trackTimeMillis)
            }}]
          </v-list-item-subtitle>
          <v-list-item-subtitle class="text--caption">
            🎤 {{ x.item.artistName }}
            {{ x.item.collectionName && " / " + x.item.collectionName }}
            {{
              x.item.releaseDate ? " / " + x.item.releaseDate.slice(0, 7) : ""
            }}
            <v-chip
              x-small
              outlined
              label
              class="ml-1 px-1"
              style="opacity: 0.5"
            >
              {{ x.item.src }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </div>
    </template>
    <!-- <template v-slot:append-outer>
            <v-icon key="searchbtn" large color="info" @click="commitSearch" v-text="icons.mdiMagnify"></v-icon>
        </template> -->
  </v-autocomplete>
</template>

<script lang="ts">
import {
    mdiLabel,
    mdiMagnifyPlusOutline,
    mdiAccountMultiple,
    mdiTextSearch,
    mdiFilter,
    mdiCommentSearch,
} from "@mdi/js";
import debounce from "lodash-es/debounce";
// TODO(jprochazk): type declarations for this module
import jsonp from "jsonp-es6";
import { formatDuration } from "@/utils/time";
// TODO(jprochazk): type declarations for this module
import { compareTwoStrings } from "string-similarity";
import { axiosInstance } from "@/utils/backend-api";

export default {
    name: "SongSearch",
    components: {},
    props: {
        autofocus: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Object,
            default: null,
        },
        id: {
            type: Number,
            default: null,
        },
    },
    data() {
        return {
            query: this.value,
            mdiLabel,
            mdiAccountMultiple,
            mdiMagnifyPlusOutline,
            mdiTextSearch,
            mdiCommentSearch,
            mdiFilter,
            isLoading: false,
            search: null,
            fromApi: [],
        };
    },
    computed: {
        isMobile() {
            return this.$store.state.isMobile;
        },
        results() {
            return this.fromApi.concat(this.query ? this.query : []);
        },
    },
    watch: {
        // eslint-disable-next-line func-names
        search: debounce(function (val) {
            if (!val) return;
            this.fromApi = [];
            const entropy = encodeURIComponent(val).length;
            if (entropy <= 2) return;
            this.getAutocomplete(val);
        }, 500),
        query() {
            if (this.query) this.$emit("input", this.query);
        },
    },
    methods: {
        formatDuration,
        async getAutocomplete(query) {
            this.isLoading = true;
            const [md, res, resEn] = await Promise.all([
                this.searchMusicdex(query),
                this.searchRegionsAlternative(query, "JP"),  // this.searchRegions(query, "ja_jp"),
                this.searchRegionsAlternative(query, "US"),  // this.searchRegions(query, "en_us"),
            ]);
            const lookupEn = resEn || [];
            console.log(lookupEn);
            const fnLookupFn = (id, name, altName) => {
                const foundEn = lookupEn.find((x) => x.trackId === id);
                if (!foundEn) return altName || name;
                const possibleNames = [
                    foundEn.trackCensoredName?.toUpperCase(),
                    foundEn.trackName.toUpperCase(),
                ];
                if (
                    foundEn
                    && !possibleNames.includes(name.toUpperCase())
                    && compareTwoStrings(foundEn.trackName, name) < 0.75
                ) {
                    return `${name} / ${foundEn.trackCensoredName || foundEn.trackName}`;
                }
                return altName || name;
            };
            if (res) {
                console.log(res);
                this.fromApi = [
                    ...md.slice(0, 3),
                    ...res.map(
                        ({
                            trackId,
                            collectionName,
                            releaseDate,
                            artistName,
                            trackName,
                            trackCensoredName,
                            trackTimeMillis,
                            artworkUrl100,
                            trackViewUrl,
                        }) => ({
                            trackId,
                            trackTimeMillis,
                            collectionName,
                            releaseDate,
                            artistName,
                            trackName: fnLookupFn(trackId, trackName, trackCensoredName),
                            artworkUrl100,
                            trackViewUrl,
                            src: "iTunes",
                            index: `iTunes${trackId}`,
                        }),
                    ),
                ];
            }
            this.isLoading = false;
            // console.log(res);
            return res;
        },
        async searchAutocomplete(query, lang = "ja_jp", country = "JP") {
            return jsonp("https://itunes.apple.com/search", {
                term: query,
                entity: "musicTrack",
                country,
                limit: 10,
                lang,
            });
        },
        async searchRegions(query, lang = "ja_jp", regions: Array<String> = ['JP', 'US']) {
            // Order regions by highest to lowest priority; missing IDs will merge in.
            const regionSongs = [];
            let parsedIDs = [];
            for (const r of regions) {
                const queryed = await this.searchAutocomplete(query, lang, r);
                const currentSongs = queryed.results || [];
                for (const song of currentSongs) {
                    if (!parsedIDs.includes(song.trackId)) {
                        parsedIDs.push(song.trackId)
                        regionSongs.push(song)
                    }
                }
            };
            return regionSongs;
        },
        async searchRegionsAlternative(query, lang = "JP", regions: Array<String> = ["ja_jp", 'en_us']) {
            // Order langs by highest to lowest priority; missing IDs will merge in.
            const regionSongs = [];
            let parsedIDs = [];
            for (const r of regions) {
                const queryed = await this.searchAutocomplete(query, r, lang);
                const currentSongs = queryed.results || [];
                for (const song of currentSongs) {
                    if (!parsedIDs.includes(song.trackId)) {
                        parsedIDs.push(song.trackId)
                        regionSongs.push(song)
                    }
                }
            };
            return regionSongs;
        },
        async searchMusicdex(query) {
            try {
                const resp = await axiosInstance({
                    url: "/musicdex/elasticsearch/search",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-ndjson",
                        Accept: "application/json, text/plain, */*",
                    },
                    data:
                        `{"preference":"results"}\n${
                            JSON.stringify({
                                query: {
                                    bool: {
                                        must: [
                                            {
                                                bool: {
                                                    must: [
                                                        {
                                                            multi_match: {
                                                                query,
                                                                fields: [
                                                                    "general^3",
                                                                    "general.romaji^0.5",
                                                                    "original_artist^2",
                                                                    "original_artist.romaji^0.5",
                                                                ],
                                                                type: "most_fields",
                                                            },
                                                        },
                                                        {
                                                            multi_match: {
                                                                query,
                                                                fields: [
                                                                    "name.ngram",
                                                                    "name",
                                                                ],
                                                                type: "most_fields",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                                size: 12,
                                _source: { includes: ["*"], excludes: [] },
                                from: 0,
                                sort: [{ _score: { order: "desc" } }],
                            })}\n`,
                });
                return (
                    resp?.data?.responses?.[0]?.hits?.hits?.map(({ _source }) => ({
                        trackId: _source.itunesid,
                        artistName: _source.original_artist,
                        trackName: _source.name,
                        trackTimeMillis: (_source.end - _source.start) * 1000,
                        trackViewUrl: _source.amUrl,
                        artworkUrl100: _source.art,
                        src: "Musicdex",
                        index: `Musicdex${_source.itunesid || _source.name+_source.original_artist}`,
                    })) || []
                );
            } catch (e) {
                console.error(e);
                return [];
            }
        },

        onInput() {
            this.search = null;
            this.fromApi = [];
        },
    },
};
</script>

<style></style>
