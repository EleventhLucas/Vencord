/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";
import { showToast } from "@webpack/common";

const GIST_URL = "https://gist.githubusercontent.com/aamiaa/204cd9d42013ded9faf646fae7f89fbb/raw";

export default definePlugin({
    name: "questsStuff",
    description: "Fetches and injects quest spoofing script.",
    authors: [{ name: "Lucas", id: 1234567890n }],

    start() {
        fetch(GIST_URL)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch spoofer: " + res.status);
                return res.text();
            })
            .then(code => {
                eval(code);
                showToast("Spoofer injected successfully", "success");
            })
            .catch(err => {
                console.error("[questsStuff] Failed to inject:", err);
                showToast("Spoofer injection failed", "error");
            });
    },

    stop() {
        showToast("questsStuff plugin disabled. Reload to clear effects.", "info");
    }
});
