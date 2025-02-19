import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppConfig, Theme } from "../store/config";
import { useChatStore } from "../store/chat";
import { useAccessStore } from "../store/access";
import { useProjectsStore } from "../store/projects";
import { IconButton } from "./button";
import { Path } from "../constant";
import dynamic from "next/dynamic";
import {
  IconPlus,
  IconSettings,
  IconFolder,
  IconDatabase,
  IconNetwork
} from "@tabler/icons-react";
import { useMobileScreen } from "../utils";
import { showToast } from "../store/toast";

import BioChatterIcon from "../icons/biochatter.svg";
import Locale from "../locales";
import styles from "./sidebar.module.scss";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

export function SideBar(props: { className?: string }) {
  const navigate = useRouter();
  const config = useAppConfig();
  const chatStore = useChatStore();
  const currentProject = useProjectsStore((state) => state.currentProjectId);
  const projectChats = useProjectsStore((state) => state.projectChats[currentProject ?? -1] ?? []);
  const isMobileScreen = useMobileScreen();

  const showSideBar = () => {
    const shouldShow = !config.tightBorder || !isMobileScreen;
    return shouldShow;
  };

  return (
    <div
      className={`${props.className} ${styles.sidebar} ${showSideBar() ? "" : styles["sidebar-hidden"]
        }`}
    >
      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-title"]}>BioChatter</div>
        <div className={styles["sidebar-sub-title"]}>
          Your Biomedical Research Assistant
        </div>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <BioChatterIcon />
        </div>
      </div>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<IconPlus size={16} />}
          text={Locale.Home.NewChat}
          onClick={() => {
            if (currentProject) {
              useProjectsStore.getState().createChat(currentProject);
            } else {
              chatStore.newSession();
            }
          }}
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate.push(Path.Home);
          }
        }}
      >
        {currentProject ? (
          <ChatList
            items={projectChats}
            onClick={(chat) => {
              // TODO: Implement chat selection
            }}
          />
        ) : (
          <ChatList
            items={chatStore.sessions}
            onClick={(index) => {
              navigate.push(Path.Chat);
              chatStore.selectSession(index);
            }}
          />
        )}
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<IconSettings size={16} />}
              onClick={() => {
                navigate.push(Path.Settings);
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <IconButton
              icon={<IconFolder size={16} />}
              onClick={() => {
                navigate.push(Path.Projects);
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <IconButton
              icon={<IconDatabase size={16} />}
              onClick={() => {
                navigate.push(Path.RAG);
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <IconButton
              icon={<IconNetwork size={16} />}
              onClick={() => {
                navigate.push(Path.KG);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
