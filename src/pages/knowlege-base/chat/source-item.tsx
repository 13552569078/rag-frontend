import { useToggle } from "ahooks";
import React, { useRef } from "react";

import UpIcon from "@/assets/knowlege-base/arrow_up1.svg";
import FileIcon from "@/components/file-icon";
import type { Isource } from "@/types";

interface MyComponentProps {
  detail: Isource;
  showIndex: boolean; // 是否开始序号
  showBorder: boolean;
  index?: number;
}

const SourceItem: React.FC<MyComponentProps> = ({
  detail,
  showIndex,
  showBorder,
  index = 0,
}) => {
  const [open, { toggle }] = useToggle(detail.open);

  const imageRef = useRef<HTMLImageElement>(null);

  // canvas画图
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 监听图片load
  const handleImageLoad = () => {
    if (canvasRef.current && imageRef.current && imageRef.current.complete) {
      // 原始宽高
      const { naturalWidth } = imageRef.current;
      console.log("图片加载完成", index, "1111111111");
      //   真实宽高
      const { width } = imageRef.current.getBoundingClientRect();
      const scaleRate = width / naturalWidth;

      // 根据 左上角 右下角 计算出几个角坐标
      if (detail.bbox?.length === 0) return;
      const text_region = [
        [detail!.bbox[0], detail!.bbox[1]],
        [detail!.bbox[2], detail!.bbox[1]],
        [detail!.bbox[2], detail!.bbox[3]],
        [detail!.bbox[0], detail!.bbox[3]],
      ];
      // 获取图片的缩放比例
      handleDrawline(text_region as number[][], scaleRate);
    }
  };

  const handleDrawline = (points: number[][], scaleRate: number) => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      //  真实宽高
      const { width, height } = imageRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      // 绘制多边形
      ctx.beginPath();
      ctx.moveTo(points[0][0] * scaleRate, points[0][1] * scaleRate);
      points.forEach((point) => {
        ctx.lineTo(point[0] * scaleRate, point[1] * scaleRate);
      });
      ctx.closePath();
      // 填充多边形为黄色
      ctx.fillStyle = "rgba(76, 192, 158, 0.15)";
      ctx.fill();
    }
  };

  return (
    <div
      className={`${showIndex && "mt-4"} ${
        showBorder && "border-solid border-0 border-b-[1px] border-gray-200"
      }`}
    >
      <div
        className="flex justify-between bg-[#F9FAFE] cursor-pointer h-[38px]"
        onClick={toggle}
      >
        <div className="flex-1 flex-row flex items-center min-w-[0]">
          <div
            className={`flex justify-center items-center h-[38px] w-[38px] ${
              showIndex && "bg-[#F2F5FA]"
            }`}
          >
            {showIndex && index + 1}
          </div>
          <div className="flex-1 flex items-center px-6 min-w-[0]">
            <FileIcon name={detail.file_name}></FileIcon>
            <div className="ml-2 text-[14px] text-ellipsis overflow-hidden whitespace-nowrap text-normal">
              {detail.file_name}
            </div>
          </div>
        </div>
        <div className="flex items-center px-6 w-[200px] justify-between">
          <span className="text-normal">相似度</span>
          <span className="text-active ml-2 font-bold flex-1 text-left">
            {(Number(detail.score) * 100).toFixed(2)}%
          </span>
          <img
            src={UpIcon}
            className={`ml-4 rotate-180-transition rotate180 cursor-pointer ${
              open ? "rotate0" : null
            }`}
          ></img>
        </div>
      </div>
      {/* 展开才可添加绘制 */}
      {open && (
        <div className="mt-3" style={{ position: "relative" }}>
          <img
            src={detail.page_url}
            alt="img"
            style={{ width: "100%" }}
            ref={imageRef}
            onLoad={handleImageLoad}
          ></img>

          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: "10",
            }}
          ></canvas>
        </div>
      )}
    </div>
  );
};

export default SourceItem;
