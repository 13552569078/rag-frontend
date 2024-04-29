import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Checkbox, Drawer, Input, Popover, message } from "antd";
import type { CheckboxProps } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import React, { useState } from "react";
import { useImmer } from "use-immer";

import { apiDelHistorys, apiHistory } from "@/api";
import ChatItem from "@/assets/chat/chat-item.svg";
import ClockIcon from "@/assets/chat/clock.svg";
import DelIocn from "@/assets/chat/TwoDelete.svg";
import UpIcon from "@/assets/knowlege-base/arrow_up.svg";
import { MODEL_TYPE, getModelIcon } from "@/constants";
import { useQueryParams } from "@/hook";
import type { Ihistory } from "@/types";

interface MyComponentProps {
  showHistory?: boolean;
  send: (s: string) => void;
  loading: boolean;
  modelType?: string;
  changeModel?: (s: string) => void;
  goAnyDomBottom?: (index: number) => void; // 滚动到特定问题
  getHistoryListParent?: () => void; // 重置父组件聊天记录
}

const ChatInput: React.FC<MyComponentProps> = ({
  send,
  loading,
  showHistory = true,
  modelType = "KnowBase",
  changeModel,
  goAnyDomBottom,
  getHistoryListParent,
}) => {
  const paramsQuery = useQueryParams();

  const { TextArea } = Input;
  const [open, setOpen] = useState(false);

  const { Search } = Input;

  // 删除标记
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 选择模型
  const content = (
    <div>
      {MODEL_TYPE.map((item) => {
        return (
          <div
            className="cursor-pointer mb-3 flex justify-between items-center"
            key={item.key}
            onClick={() => {
              !item.disabled && changeModel && changeModel(item.key);
            }}
          >
            <div className="flex items-center justify-between">
              <img src={item.icon} alt="model"></img>
              <span
                className={`ml-[10px] mr-2 ${
                  modelType === item.key && "text-active"
                }`}
              >
                {item.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  // 回车 发送问题
  const [value, setValue] = useState("");

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // 当按下回车键时，清空 TextArea 的内容 发送提问消息
      send(event.target.value);
      setValue("");
    }
  };

  // 历史记录
  const onSearch: SearchProps["onSearch"] = (value) => {
    setSearchName(() => value);
  };

  const showDrawer = () => {
    setDeleteOpen(false);
    // 获取历史记录
    getHistoryList();
    setOpen(true);
  };

  const onClose = () => {
    setDeleteOpen(false);
    setOpen(false);
  };

  // 历史记录
  const [historyList, setHistoryList] = useImmer<Ihistory[]>([]);
  const [searchName, setSearchName] = useState("");

  // 筛选记录
  const historyListFilter = historyList?.filter((item) => {
    return item.question.includes(searchName);
  });

  // 获取半选
  const getChecked = () => {
    const checkedList = historyList
      .filter((item) => {
        return item.checked;
      })
      .map((item1) => item1.id);
    return checkedList;
  };
  const getIndeterminate = () => {
    const checkedList = getChecked();
    return checkedList.length > 0 && checkedList.length < historyList.length;
  };

  // 获取全选
  const getAllstatus = () => {
    const checkedList = getChecked();
    return checkedList.length === historyList.length;
  };

  // 删除
  const { mutate: apiDelHistorysMutate } = useMutation({
    mutationFn: apiDelHistorys,
    onSuccess: () => {
      // 成功重新获取历史记录
      getHistoryList();
      getHistoryListParent && getHistoryListParent();
    },
  });

  const handelDel = () => {
    const checkedList = getChecked();
    if (checkedList.length === 0) {
      message.error("至少选择一个历史记录");
      return false;
    }
    // 删除成功逻辑
    apiDelHistorysMutate({ record_ids: checkedList });
  };

  // 每一个记录选中
  const onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    data: Ihistory
  ) => void = (e, data) => {
    setHistoryList((prevCount) => {
      const targetIndex = prevCount.findIndex((item) => item.id === data.id);
      prevCount[targetIndex].checked = e.target.checked;
    });
  };
  // 全选或全取消
  const onChangeAll: CheckboxProps["onChange"] = (e) => {
    setHistoryList((prevCount) => {
      return prevCount.map((item) => {
        return {
          ...item,
          checked: e.target.checked,
        };
      });
    });
  };

  // 获取历史记录的
  const { mutate: apiHistoryMutate } = useMutation({
    mutationFn: apiHistory,
    onSuccess: (e) => {
      // 设置当前的记录
      setHistoryList(() => e.reverse());
    },
  });

  const getHistoryList = () => {
    const fileid = paramsQuery?.fileid || "";
    const serachParms = {
      kb_ids: [paramsQuery.kbid || ""],
      file_ids: [],
      chat_types: [],
    };
    // 根据fileid 来判定是文件 || 知识库问答
    fileid
      ? Object.assign(serachParms, {
          file_ids: [paramsQuery.fileid || ""],
          chat_types: [0, 2],
        })
      : Object.assign(serachParms, { file_ids: [], chat_types: [0, 1] });
    apiHistoryMutate(serachParms);
  };

  return (
    <div className="flex flex-col chat-wrap">
      {showHistory && (
        <div className="flex justify-between mb-2">
          <Popover content={content} title={null}>
            <div className="py-[10px] pr-[18px] pl-[14px] bg-white border-radius-lg cursor-pointer text-normal font-semibold flex items-center model-hover">
              <img
                src={getModelIcon(modelType)}
                alt="model"
                className="mr-2"
              ></img>
              {/* 选择引擎 */}
              <span>{modelType === "KnowBase" ? "知识库" : "通用知识"}</span>
              <img
                className="ml-2 text-[12px] arrow"
                src={UpIcon}
                alt="icon"
              ></img>
            </div>
          </Popover>
          <div
            onClick={showDrawer}
            className="py-[10px] px-[18px] bg-white border-radius-lg cursor-pointer text-normal font-semibold flex items-center"
          >
            历史记录
            <img src={ClockIcon} alt="add" className="ml-2"></img>
          </div>
        </div>
      )}
      {/* 发送框 */}
      <TextArea
        rows={3}
        value={value}
        placeholder="请输入问题提问"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        className="my-chat-input"
      />
      {/* 历史记录 */}
      <Drawer
        title="历史记录"
        onClose={onClose}
        open={open}
        className="delhistory-Drawer"
      >
        <div className="overflow-y-hidden h-[100%] flex flex-col pt-4">
          <div className="px-5">
            <Search
              placeholder="请输入查询"
              onSearch={onSearch}
              className="mb-2"
            />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="overflow-y-auto px-5 flex-1">
              {historyListFilter.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center flex-row py-[10px] px-[10px] text-base cursor-pointer suggest mb-2"
                    onClick={() => {
                      !deleteOpen && goAnyDomBottom && goAnyDomBottom(index);
                    }}
                  >
                    {!deleteOpen ? (
                      <div className="flex items-center text-ellipsis">
                        <img src={ChatItem} alt="logo" className="mr-4"></img>
                        <span className="text-ellipsis text-[14px]">
                          {item.question}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-ellipsis">
                        <Checkbox
                          checked={item.checked}
                          className="mr-2 text-ellipsis"
                          onChange={(e) => onChange(e as any, item)}
                        >
                          <div className="text-ellipsis text-[14px]">
                            {item.question}
                          </div>
                        </Checkbox>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {!deleteOpen ? (
              <div
                className="cursor-pointer border-solid border-0 border-t-[1px] border-slate-200 font-semibold flex items-center px-5 h-[60px]"
                onClick={() => setDeleteOpen(true)}
              >
                批量删除 <img src={DelIocn} alt="logo" className="ml-2"></img>
              </div>
            ) : (
              <div className="cursor-pointer border-solid border-0 border-t-[1px] border-slate-200 flex items-center h-[60px] px-5">
                <Checkbox
                  checked={getAllstatus()}
                  className="mr-2"
                  onChange={onChangeAll}
                  indeterminate={getIndeterminate()}
                >
                  <span className="mr-3">全选</span>
                </Checkbox>
                <div
                  className="border-solid border-0 border-r-[1px] border-slate-200 mr-3"
                  style={{ height: "100%" }}
                ></div>
                <span
                  className="cursor-pointer text-active text-[14px]"
                  onClick={handelDel}
                >
                  <DeleteOutlined className="mr-2" />
                  <span>删除</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default ChatInput;
