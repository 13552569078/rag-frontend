import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useMutation } from "@tanstack/react-query";
import { useMount } from "ahooks";
import { message } from "antd";
import { debounce, groupBy } from "native-lodash";
import React, { useRef, useState } from "react";
import { useImmer } from "use-immer";

import { apiHistory, apiHistoryLatestId, apiRecord } from "@/api";
import { apiFileChatUrl, apiKnowLLmChatUrl } from "@/api/document";
import Back from "@/components/back";
import { DEFAULT_MODEL_TYPE } from "@/constants";
import { useQueryParams } from "@/hook";
import { useUserStore } from "@/store/useUser";
import type { Isource } from "@/types";
import { trimExceptNewlines } from "@/utils";

import Preview from "../preview/preview";

import Abstract from "./abstract";
import AiChat from "./ai-chat";
import ChatInput from "./chat-input";
import Loading from "./loading";
import Source from "./source";
import Suggest from "./suggest";
import UserChat from "./user-chat";

const ADD_CHAT_ITEM = {
  answer: "",
  question: "",
  type: "",
  like: 0,
  id: "",
};

const FileChat: React.FC = () => {
  // 用户信息
  const { userInfo } = useUserStore();

  const paramsQuery = useQueryParams();

  const chatRef = useRef<HTMLDivElement>(null);

  const serachParms = {
    kb_ids: [paramsQuery.kbid || ""],
    file_ids: [paramsQuery.fileid || ""],
    chat_types: [0, 2],
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

  // 滚动某一聊天到视图 根据index实体来  历史记录和会话是一一对应 可用index判断
  const goAnyDomBottom = (idx: number) => {
    itemRefs.current.forEach((ref, index) => {
      if (index === idx) {
        if (ref) {
          ref.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    });
  };

  // 获取历史记录
  const { mutate: apiHistoryMutate } = useMutation({
    mutationFn: apiHistory,
    onSuccess: (e) => {
      SET_QA_LIST(() =>
        e.reverse().map((item) => {
          return {
            ...item,
            answer: item.answer.trim().replaceAll("\n", "<br/>"),
          };
        })
      );
      setTimeout(() => {
        goChatBottom();
      }, 200);
    },
  });

  const getHistoryList = () => {
    apiHistoryMutate(serachParms);
  };

  // 获取最后一个历史记录id
  const { mutate: apiHistoryLatestIdMutate } = useMutation({
    mutationFn: apiHistoryLatestId,
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

  // 溯源
  const [sourceList, setSourceList] = useImmer<any>({});

  // 模型选择
  const [modelType, setModelType] = useImmer(DEFAULT_MODEL_TYPE);

  // 以下为聊天记录
  const [QA_LIST, SET_QA_LIST] = useImmer<any[]>([]);

  // 创建一个与QA_LIST长度相同的ref数组，并添加类型注解
  const itemRefs = useRef(new Array(QA_LIST.length).fill(null));

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
    }, 200);

    // 溯源置空
    setSourceList(() => {
      return {};
    });
    // 加载框
    setLoading(true);

    ctrl = new AbortController();

    // 处理URL
    const url = modelType === DEFAULT_MODEL_TYPE ? apiFileChatUrl : apiKnowLLmChatUrl;

    fetchEventSource(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: ["text/event-stream", "application/json"] as unknown as string,
        Authorization: userInfo.token,
      },
      body: JSON.stringify({
        user_id: userInfo.id,
        kb_ids: [paramsQuery.kbid],
        file_ids: [paramsQuery.fileid],
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
          // setId();
        } else if (e.headers.get("content-type") === "application/json") {
          return e
            .json()
            .then((data: any) => {
              // 取消加载框
              setLoading(false);
              ctrl?.abort();
              message.error(data?.msg || "出错了,请稍后刷新重试。");
            })
            .catch(() => {
              // 取消加载框
              setLoading(false);
              ctrl?.abort();
              message.error("出错了,请稍后刷新重试。");
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

        // 设置溯源
        if (res?.source_documents?.length) {
          const sourceList = res?.source_documents.map((item: Isource) => {
            return {
              ...item,
              open: false,
            };
          });
          const groupBySourceList = groupBy(sourceList, "file_id");
          setSourceList(() => {
            return groupBySourceList;
          });
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
        // 取消加载框
        setLoading(false);
        ctrl?.abort();
        message.error(err.msg || "出错了");
      },
    });
  };

  useMount(() => {
    getHistoryList();
  });

  return (
    <div className="w-full h-full grid grid-cols-5">
      {/* 返回 及溯源 empty */}
      <div className="flex flex-col overflow-y-hidden col-span-2">
        <div className="py-[20px] px-[30px] bg-[#F9FAFE]">
          <Back type={3} bread={`${paramsQuery?.filename}`} showSitch={false} />
        </div>
        {/* 溯源为空 亦或 来源回显 */}
        {Object.keys(sourceList).length ? (
          <Source detail={sourceList} />
        ) : (
          <div className="overflow-y-auto">
            <Preview openPreview={true} />
          </div>
        )}
      </div>
      {/* chat模块 */}
      <div className="h-[100%] overflow-y-hidden bg-gray-100 flex flex-col col-span-3">
        <div
          className="pt-[30px] px-[30px] bg-gray-100 overflow-auto pb-[50px] flex-1"
          ref={chatRef}
        >
          {/* 推荐问答 */}
          <Suggest send={send}></Suggest>
          {/* 摘要 */}
          <Abstract></Abstract>
          {/* 问答逻辑 */}
          {QA_LIST.map((item, index) => {
            return (
              <div
                key={index}
                ref={(node) => (itemRefs.current[index] = node)}
                className={`${item.id}`}
              >
                {item.question && <UserChat message={item} />}
                {item.answer && (
                  <AiChat
                    message={item}
                    handleLike={handleLike}
                    index={index}
                  />
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
            send={send}
            loading={loading}
            modelType={modelType}
            changeModel={(type: string) => setModelType(type)}
            goAnyDomBottom={goAnyDomBottom}
            getHistoryListParent={getHistoryList}
          ></ChatInput>
        </div>
      </div>
    </div>
  );
};

export default FileChat;
