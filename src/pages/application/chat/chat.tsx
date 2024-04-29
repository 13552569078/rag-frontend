import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { debounce } from "native-lodash";
import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useImmer } from "use-immer";

import {
  apiAppChatHistoryList,
  apiAppChatUrl,
  apiAppHistoryLatestId,
  apiRecord,
} from "@/api";
import { useQueryParams } from "@/hook";
import AiChat from "@/pages/knowlege-base/chat/ai-chat";
import ChatInput from "@/pages/knowlege-base/chat/chat-input";
import Loading from "@/pages/knowlege-base/chat/loading";
import Suggest from "@/pages/knowlege-base/chat/suggest";
import UserChat from "@/pages/knowlege-base/chat/user-chat";
import { useUserStore } from "@/store/useUser";
import type { IApplicationCreate } from "@/types";
import { trimExceptNewlines } from "@/utils";

const ADD_CHAT_ITEM = {
  answer: "",
  question: "",
  type: "",
  like: 0,
  id: "",
};

interface MyComponentProps {
  detail?: IApplicationCreate;
}

const Chat: React.FC<MyComponentProps> = () => {
  // 用户信息

  const location = useLocation();
  const currentRouteName = location.pathname.replace("/", "");

  const { userInfo } = useUserStore();

  const paramsQuery = useQueryParams();

  const chatRef = useRef<HTMLDivElement>(null);

  const serachParms = {
    application_id: paramsQuery.appkey,
    chat_types: [0, 1],
  };

  // 聊天滚动底部
  const goChatBottom = async () => {
    const node = chatRef.current;
    if (node) {
      // 滚动到DOM节点的底部
      node.scroll({
        top: node.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // 获取历史记录列表
  const { data: _ } = useQuery({
    queryKey: ["appChatHistorylist"],
    queryFn: async () => {
      // 新打开窗口无记录
      if (currentRouteName.includes("ApplicationChatIframe")) return;
      const data = await apiAppChatHistoryList({
        application_id: paramsQuery.appkey || "",
      });
      // 设置当前的记录
      SET_QA_LIST(() =>
        data
          .reverse()
          .slice(-3)
          .map((item) => {
            return {
              ...item,
              answer: item.answer.trim().replaceAll("\n", "<br/>"),
            };
          })
      );
      setTimeout(() => {
        goChatBottom();
      }, 200);
      return null;
    },
  });

  // 获取最后一个历史记录id
  const { mutate: apiHistoryLatestIdMutate } = useMutation({
    mutationFn: apiAppHistoryLatestId,
    onSuccess: (e) => {
      SET_QA_LIST((prevCount) => {
        prevCount[prevCount.length - 1].id = e[0]?.id || "";
      });
    },
  });

  const setId = debounce(() => {
    apiHistoryLatestIdMutate(serachParms);
  }, 2000);

  // 评价
  const { mutate: apiRecordMutate } = useMutation({
    mutationFn: apiRecord,
  });

  // 以下为聊天记录
  const [QA_LIST, SET_QA_LIST] = useImmer<any[]>([]);

  // 添加询问问题
  const [loading, setLoading] = useState(false);

  // 添加询问
  const addQuestion = (q: string) => {
    SET_QA_LIST((prevCount) => {
      prevCount.push({
        ...ADD_CHAT_ITEM,
        question: q.trim(),
      });
    });
  };

  // like
  const handleLike = async (key: string, targetId: string, value: number) => {
    const onSuccessCallback = () => {
      SET_QA_LIST((prevCount) => {
        const targetIndex = prevCount.findIndex((item) => item.id === targetId);
        if (targetIndex !== -1) {
          prevCount[targetIndex][key] = value;
        }
      });
      message.success("操作成功");
    };
    apiRecordMutate(
      {
        record_id: targetId,
        like: value,
      },
      { onSuccess: onSuccessCallback }
    );
  };

  //  取消请求用
  let ctrl: AbortController;

  // 发送问答消息
  const send = (q: string) => {
    // 加载中不允许再次提问
    if (loading) {
      message.warning("正在回答中，请稍后");
      return false;
    }

    addQuestion(q);

    // 滚动底部
    setTimeout(() => {
      goChatBottom();
    }, 100);
    // 加载框
    setLoading(true);

    ctrl = new AbortController();

    fetchEventSource(apiAppChatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: ["text/event-stream", "application/json"] as unknown as string,
        Authorization: userInfo?.token || defaultSettings.token,
      },
      body: JSON.stringify({
        user_id: userInfo?.id || defaultSettings.defaultUser,
        application_id: paramsQuery.appkey,
        history: QA_LIST.slice(-3).map((item) => {
          return [item.question, item.answer];
        }), // 历史记录传递最后三项
        question: q,
        streaming: true,
      }),
      signal: ctrl.signal,
      onopen(e: any) {
        if (e.ok && e.headers.get("content-type") === "text/event-stream") {
          // 此处可以增加 提问的id
          // addAnswer(q);
        } else if (e.headers.get("content-type") === "application/json") {
          return e
            .json()
            .then((data: any) => {
              message.error(data?.msg || "出错了,请稍后刷新重试。");
              // 取消加载框
              setLoading(false);
              ctrl?.abort();
            })
            .catch(() => {
              // 取消加载框
              setLoading(false);
              message.error("出错了,请稍后刷新重试。");
              ctrl?.abort();
            });
        }
      },
      onmessage(msg: { data: string }) {
        // 取消加载框
        setLoading(false);
        const res: any = JSON.parse(msg.data);
        // 拼接answer
        if (res?.code === 200 && res?.response) {
          const addStr = trimExceptNewlines(res?.response).replaceAll(
            "\n",
            "<br/>"
          );
          SET_QA_LIST((prevCount) => {
            prevCount[prevCount.length - 1].answer =
              prevCount[prevCount.length - 1].answer + addStr;
          });
          // 滚动底部
          goChatBottom();
          // 设置最后一个id
          setId();
        }
        // 回答完毕 loading去除
        if (res?.history?.length) {
          // 取消加载框
          setLoading(false);
        }
      },
      onclose() {
        // 取消加载框
        setLoading(false);
        ctrl.abort();
      },
      onerror(err: any) {
        console.log(err, "onerror");
        // 取消加载框
        setLoading(false);
        ctrl?.abort();
        message.error(err.msg || "出错了");
      },
    });
  };

  return (
    <div className="h-[100%] bg-gray-100 flex flex-col overflow-y-hidden w-[100%]">
      <div
        className="pt-[30px] px-[50px] bg-gray-100 pb-[50px] flex-1 overflow-y-auto"
        ref={chatRef}
      >
        {/* 推荐问答 */}
        <Suggest send={send} source="app"></Suggest>
        {/* 问答逻辑 */}
        {QA_LIST.map((item, index) => {
          return (
            <div key={index} className={`${item.id}`}>
              {item.question && <UserChat message={item} />}
              {item.answer && (
                <AiChat message={item} handleLike={handleLike} index={index} />
              )}
            </div>
          );
        })}
        {/* 加载框添加 */}
        {loading ? <Loading /> : null}
      </div>
      <div className="px-[30px] mb-3">
        {/* 问答input */}
        <ChatInput
          showHistory={false}
          send={send}
          loading={loading}
        ></ChatInput>
      </div>
    </div>
  );
};

export default Chat;
