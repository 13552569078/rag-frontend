import { useMutation } from "@tanstack/react-query";
import { useMount } from "ahooks";
import React, { useRef } from "react";
import LazyLoad from "react-lazyload";
import { useImmer } from "use-immer";

import { apiFilePreview } from "@/api";
import { useQueryParams } from "@/hook";

import PreviewItem from "./preview-item";

interface IPreview {
  openPreview: boolean;
}

// 引入CSS样式

const Preview: React.FC<IPreview> = ({ openPreview }) => {
  const scrollRef = useRef({} as any);

  const paramsQuery = useQueryParams();

  // 预览页面
  const [filePages, setFilePages] = useImmer([]);

  const { mutate: getPrwviewMutate } = useMutation({
    mutationFn: apiFilePreview,
    onSuccess: (e) => {
      // 基础路径 page信息
      setFilePages(() => e.pages);
    },
  });

  const init = () => {
    getPrwviewMutate({ file_id: paramsQuery.fileid || "" });
  };

  useMount(() => {
    init();
  });

  return (
    <div ref={scrollRef}>
      {filePages.map((item: any, index: number) => {
        return (
          <LazyLoad
            key={index}
            height={600}
            offset={100}
            overflow={true}
            scroll={true}
            scrollContainer={scrollRef.current}
          >
            <PreviewItem
              detail={item}
              openPreview={openPreview}
              segmentLayout={item.segment_layout}
              index={index}
            ></PreviewItem>
          </LazyLoad>
        );
      })}
    </div>
  );
};

export default Preview;
