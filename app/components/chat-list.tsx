import { useRef, useEffect } from "react";
import { IconTrash } from "@tabler/icons-react";
import styles from "./chat-list.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { useChatStore } from "../store/chat";
import { Chat } from "../client/projects";
import Locale from "../locales";
import { useRouter } from "next/navigation";
import { Path } from "../constant";
import { showConfirm } from "./ui-lib";
import { useMobileScreen } from "../utils";

export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  time: string;
  selected: boolean;
  id: string;
  index: number;
  narrow?: boolean;
  isProjectChat?: boolean;
}) {
  const draggableRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (props.selected && draggableRef.current) {
      draggableRef.current?.scrollIntoView({
        block: "center",
      });
    }
  }, [props.selected]);

  return (
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        <div
          className={`${styles["chat-item"]} ${
            props.selected && styles["chat-item-selected"]
          }`}
          onClick={props.onClick}
          ref={(ele) => {
            draggableRef.current = ele;
            provided.innerRef(ele);
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles["chat-item-title"]}>{props.title}</div>
          <div className={styles["chat-item-info"]}>
            <div className={styles["chat-item-time"]}>{props.time}</div>
            {!props.narrow && (
              <div className={styles["chat-item-actions"]}>
                <IconTrash
                  size={16}
                  className={styles["chat-item-delete"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onDelete?.();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ChatList(props: { 
  items: any[];
  onClick: (item: any) => void;
  narrow?: boolean;
}) {
  const navigate = useRouter();
  const chatStore = useChatStore();
  const isMobileScreen = useMobileScreen();

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    chatStore.moveSession(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {props.items.map((item, index) => {
              const isProjectChat = 'project_id' in item;
              const title = isProjectChat ? item.name : `Chat ${index + 1}`;
              const time = isProjectChat 
                ? new Date(item.created_at).toLocaleString()
                : new Date(item.lastUpdate).toLocaleString();
              const id = isProjectChat ? `chat-${item.id}` : item.id;
              const selected = isProjectChat 
                ? false // TODO: Implement chat selection for project chats
                : index === chatStore.currentSessionIndex;

              return (
                <ChatItem
                  key={id}
                  id={id}
                  index={index}
                  title={title}
                  time={time}
                  selected={selected}
                  onClick={() => props.onClick(item)}
                  onDelete={async () => {
                    if (await showConfirm(Locale.Home.DeleteChat)) {
                      chatStore.deleteSession(index);
                    }
                  }}
                  narrow={props.narrow}
                  isProjectChat={isProjectChat}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
