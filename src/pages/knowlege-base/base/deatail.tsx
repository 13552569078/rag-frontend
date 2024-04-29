import { useMutation } from "@tanstack/react-query";
import { Button, Input, Popover } from "antd";
import type { SearchProps } from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFileListApi, apiKnowledgeBaseDetail } from "@/api";
import SearchIcon from "@/assets/knowlege-base/search1.svg";
import up_file from "@/assets/knowlege-base/up_file.svg";
import up_file_active from "@/assets/knowlege-base/up_file_active.svg";
import up_ppt from "@/assets/knowlege-base/up_ppt.svg";
import up_ppt_active from "@/assets/knowlege-base/up_ppt_active.svg";
import up_table from "@/assets/knowlege-base/up_table.svg";
import up_table_active from "@/assets/knowlege-base/up_table_active.svg";
import up_url from "@/assets/knowlege-base/up_url.svg";
import up_url_active from "@/assets/knowlege-base/up_url_active.svg";
import Back from "@/components/back";
import { useQueryParams } from "@/hook";
import type { ITotal, Iknowfile, IsourceType } from "@/types";

import FileTable from "./file-table.tsx";
import FileUpload from "./upload.tsx";
import UpUrl from "./upurl.tsx";

const searchStyle = {
  width: 360,
};

// 上传pover
const up_action = [
  {
    key: "file",
    name: "上传文档",
    icon: up_file,
    activeIcon: up_file_active,
  },
  {
    key: "link",
    name: "上传网址",
    icon: up_url,
    activeIcon: up_url_active,
  },
  {
    key: "ppt",
    name: "上传PPT",
    icon: up_ppt,
    activeIcon: up_ppt_active,
  },
  // {
  //   key: "table",
  //   name: "上传CSV",
  //   icon: up_table,
  //   activeIcon: up_table_active,
  // },
];

const KnowlegeBaseDetail: React.FC = () => {
  // 使用useParams获取路由参数
  const paramsQuery = useQueryParams();

  // 确保存在key
  const queryWithDefaults = {
    ...paramsQuery,
    id: paramsQuery.id || "",
    name: paramsQuery.name || "",
  };

  // 上传文档来源
  const [sourceType, setSourceType] = useState<IsourceType>("file");

  const [filelist, setfilelist] = useState<Iknowfile[]>([]);
  const [chatAble, setChatAble] = useState(false);
  // 详情
  const [detailObj, setdetailObj] = useState({
    kb_id: "",
    kb_name: "",
    timestamp: "",
    page_size: "",
    file_count: "",
  });

  const [searchName, setSearchName] = useState("");
  const [uploadShow, setUploadShow] = useState(false);

  // 上传url show
  const [uploadUrlShow, setUploadUrlShow] = useState(false);

  const navgite = useNavigate();

  const goChat = () => {
    navgite({
      pathname: "/knowlegeBaseChat",
      search: `kbname=${paramsQuery.name}&kbid=${paramsQuery.id}`,
    });
  };

  const { Search } = Input;

  const onSearch: SearchProps["onSearch"] = (value, _e) => {
    setSearchName(value);
  };

  // 文件列表
  const { mutate: fileListMutate } = useMutation({
    mutationFn: apiFileListApi,
    onSuccess: (e: { details: Iknowfile[]; total: ITotal }) => {
      setfilelist(e.details);
      // 上传文件至少解析成功一个才可以问答
      setChatAble(e.total?.green > 0);
    },
  });

  // 知识库详情
  const { mutate: apiKnowledgeBaseDetailMutate } = useMutation({
    mutationFn: apiKnowledgeBaseDetail,
    onSuccess: (e) => {
      setdetailObj(e[0]);
    },
  });

  useEffect(() => {
    reload();
    // 设置十秒一次的定时器
    const timerId = setInterval(reload, 10000);
    // 清除定时器的函数
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const reload = () => {
    fileListMutate({ kb_id: queryWithDefaults.id });
    apiKnowledgeBaseDetailMutate({ kb_id: queryWithDefaults.id });
  };

  // 筛选文件
  const filterList = filelist?.filter((item: Iknowfile) => {
    return item.file_name.includes(searchName);
  });

  const content = (
    <div className="py-2">
      {up_action.map((item) => {
        return (
          <div
            className="hover-my cursor-pointer mb-1 flex justify-between items-center hover:bg-[#F9FAFE] py-2 px-4 hover:text-active"
            key={item.key}
            onClick={() => {
              handleUpclick(item.key);
            }}
          >
            <div className="flex items-center justify-center cursor-pointer">
              <img src={item.icon} alt="model" className="no-hidden"></img>
              <img src={item.activeIcon} alt="model" className="hidden"></img>
              <span className="ml-[10px] mr-[20px]">{item.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  const handleUpclick = (key: string) => {
    switch (key) {
      case "file":
        setSourceType("file");
        setUploadShow(true);
        break;
      case "link":
        setUploadUrlShow(true);
        break;
      case "ppt":
        setSourceType("ppt");
        setUploadShow(true);
        break;
      case "table":
        setSourceType("table");
        setUploadShow(true);
        break;
      default:
        console.log("end");
    }
  };

  const suffix = <img src={SearchIcon} />;

  return (
    <div className="py-[24px] px-[60px]">
      <Back bread={`${paramsQuery.name}知识空间`} />
      {/* 总数及新增 */}
      <div className="mt-[40px] flex justify-between items-center flex-row">
        <div className="mt flex justify-between items-center flex-row">
          <span className="icon-[base--total] mr-2 text-16"></span>
          {paramsQuery.name}空间文件数
          <span className="text-active ml-2 font-bold">
            {detailObj?.file_count || 0}
          </span>
          <span className="ml-1 mr-2 font-bold">个</span>
          总页数
          <span className="text-active ml-2 font-bold">
            {detailObj?.page_size || 0}
          </span>
          <span className="ml-1 mr-2 font-bold">页</span>
        </div>
        <div className="flex">
          <Button
            className="border-radius-0 justify-between items-center flex"
            onClick={goChat}
            disabled={!chatAble}
          >
            <span className="icon-[base--chat] mr-2 text-16"></span>
            <span className="text-active">开始问答</span>
          </Button>
          <Popover
            content={content}
            title={null}
            overlayClassName="pover-padding-none"
          >
            <Button
              type="primary"
              className="border-radius-0 ml-4 items-center flex"
            >
              <span className="icon-[base--upload] mr-2 text-16"></span>
              上传知识文档
            </Button>
          </Popover>
        </div>
      </div>
      {/* 搜索 */}
      <Search
        className="my-[20px] cec-inputSearch"
        defaultValue={searchName}
        placeholder="请输入文件名查询"
        allowClear
        onSearch={onSearch}
        suffix={suffix}
        style={searchStyle}
      />
      {/* 表格 */}
      <FileTable list={filterList} query={queryWithDefaults} reload={reload} />
      {/* 上传文档及ppt */}
      {uploadShow && (
        <FileUpload
          sourceType={sourceType}
          show={uploadShow}
          close={() => setUploadShow(false)}
          reload={reload}
          query={queryWithDefaults}
        ></FileUpload>
      )}
      {/* 上传url */}
      {uploadUrlShow && (
        <UpUrl
          show={uploadUrlShow}
          query={queryWithDefaults}
          close={() => setUploadUrlShow(false)}
          reload={reload}
        ></UpUrl>
      )}
    </div>
  );
};

export default KnowlegeBaseDetail;
