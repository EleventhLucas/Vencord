/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { showNotification } from "@api/Notifications";
import { ErrorBoundary } from "@components/index";
import definePlugin from "@utils/types";
import { findByProps, findComponentByCodeLazy } from "@webpack";
import { Button, NavigationRouter, Tooltip, } from "@webpack/common";

import spoofCode from "./SpoofScript.txt";

const QuestIcon = findComponentByCodeLazy("10.47a.76.76");
const HeaderBarIcon = findComponentByCodeLazy(".HEADER_BAR_BADGE_TOP:", '.iconBadge,"top"');

function ToolBarHeader() {
    return (
        <ErrorBoundary noop={true}>
            <HeaderBarIcon
                tooltip="Inject Quest Completion Script"
                position="bottom"
                className="vc-questsStuff"
                icon={QuestIcon}
                onClick={openUI}
            >
            </HeaderBarIcon>
        </ErrorBoundary>
    );
}

function injectSpoofer() {
    try {
        eval(spoofCode);
        showNotification({ title: "questsStuff", body: "Spoofer loaded." });
    } catch (e) {
        console.error("[questsStuff] Injection failed:", e);
        showNotification({ title: "questsStuff", body: "Spoofer failed. Check console." });
    }
}

async function openUI() {
    // const ApplicationStreamingStore = findByProps("getStreamerActiveStreamMetadata");
    // const RunningGameStore = findByProps("getRunningGames");
    const QuestsStore = findByProps("getQuest");
    const quest = [...QuestsStore.quests.values()].find(x => x.id !== "1248385850622869556" && x.userStatus?.enrolledAt && !x.userStatus?.completedAt && new Date(x.config.expiresAt).getTime() > Date.now());

    if (!quest) {
        showNotification({
            title: "Quest Completer",
            body: "No Quests To Complete. Click to navigate to the quests tab",
            onClick() {
                NavigationRouter.transitionTo("/discovery/quests");
            },
        });
    } else {
        injectSpoofer();
    }
}

export default definePlugin({
    name: "questsStuff",
    description: "Fetches and injects quest spoofing script.",
    authors: [{ name: "Lucas", id: 1234567890n }],
    patches: [
        {
            find: "AppTitleBar",
            replacement: {
                match: /(?<=trailing:.{0,70}\(\i\.Fragment,{children:\[)/,
                replace: "$self.renderQuestButton(),"
            },
        }
    ],
    start() {
    },
    stop() {
    },
    renderQuestButton() {
        return (
            <Tooltip text="Inject Quest Script">
                {tooltipProps => (
                    <Button style={{ backgroundColor: "transparent", border: "none" }}
                        {...tooltipProps}
                        size={Button.Sizes.SMALL}
                        className={"vc-quest-completer-icon"}
                        onClick={openUI}
                    >
                        <QuestIcon width={20} height={20} size={Button.Sizes.SMALL} />
                    </Button>
                )}
            </Tooltip>
        );
    },
    toolbarAction(e) {
        if (Array.isArray(e.toolbar))
            return e.toolbar.push(
                <ErrorBoundary noop={true}>
                    <ToolBarHeader />
                </ErrorBoundary>
            );
        e.toolbar = [
            <ErrorBoundary noop={true} key={"QuestCompleter"}>
                <ToolBarHeader />
            </ErrorBoundary>,
            e.toolbar,
        ];
    }
});
