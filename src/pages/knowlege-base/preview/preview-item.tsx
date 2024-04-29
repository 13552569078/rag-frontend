import { debounce } from "native-lodash";
import React, { useRef, useState } from "react";
import { useImmer } from "use-immer";

import type { Segment_layout$2Type } from "@/types";
import { copyToClipboard, isCoordinateInsideRect } from "@/utils";

import "./preview.css";

interface MyComponentProps {
  detail: any;
  index: number;
  openPreview: boolean;
  segmentLayout: Segment_layout$2Type[];
}

const PreviewItem: React.FC<MyComponentProps> = ({
  index,
  segmentLayout,
  openPreview,
  detail,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useImmer({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  // 处理鼠标移动事件，更新提示文字的位置
  const handleMouseMove = debounce(
    (event: { clientX: number; clientY: number }) => {
      if (!openPreview) {
        return false;
      }
      // 清空
      handleMouseLeave();
      // 更新提示文字的位置，使其出现在鼠标的右上角
      if (canvasRef.current && imageRef.current) {
        const { clientX, clientY } = event;
        const { top, left } = imageRef.current.getBoundingClientRect();
        //   计算出相对于文档的坐标
        const domX = clientX - left;
        const domY = clientY - top;
        let inBox = false;
        let checkItem = null;
        for (const obj of segmentLayout) {
          if (
            isCoordinateInsideRect(
              [obj.bbox[0], obj.bbox[1]],
              [obj.bbox[2], obj.bbox[3]],
              [domX, domY],
              scaleRate
            )
          ) {
            checkItem = obj;
            inBox = true;
            break; // 跳出循环
          }
        }
        if (inBox) {
          // 仅仅处理文本信息
          if (checkItem!.type !== "text") {
            return;
          }
          setIsHovering(true);
          // 更新提示文字的位置，使其出现在鼠标的右上角
          const { clientX, clientY } = event;
          // 根据需要调整偏移量
          setTooltipPosition(() => {
            return { x: clientX + 10, y: clientY - 32 };
          });
          // 根据 左上角 右下角 计算出几个角左边
          const text_region = [
            [checkItem!.bbox[0], checkItem!.bbox[1]],
            [checkItem!.bbox[2], checkItem!.bbox[1]],
            [checkItem!.bbox[2], checkItem!.bbox[3]],
            [checkItem!.bbox[0], checkItem!.bbox[3]],
          ];
          handleDrawline(text_region as number[][]);
        }
      }
    },
    100
  );

  const handleMouseLeave = () => {
    setIsHovering(false);
    clearCanvas();
  };

  const handDoubleClick = (event: { clientX: number; clientY: number }) => {
    // 没出现双击复制 不复制文字
    if (!isHovering) return false;
    if (!openPreview) {
      return false;
    }
    // 更新提示文字的位置，使其出现在鼠标的右上角
    if (imageRef.current) {
      const { clientX, clientY } = event;
      const { top, left } = imageRef.current.getBoundingClientRect();
      //   计算出相对于文档的坐标
      const domX = clientX - left;
      const domY = clientY - top;
      for (const obj of segmentLayout) {
        if (
          isCoordinateInsideRect(
            [obj.bbox[0], obj.bbox[1]],
            [obj.bbox[2], obj.bbox[3]],
            [domX, domY],
            scaleRate
          )
        ) {
          copyToClipboard(obj.text);
          break; // 跳出循环
        }
      }
    }
  };

  // 获取图片的缩放比例
  const [scaleRate, setScaleRate] = useState(1);

  const imageRef = useRef<HTMLImageElement>(null);

  // 监听图片load
  const handleImageLoad = () => {
    if (canvasRef.current && imageRef.current && imageRef.current.complete) {
      // 原始宽高
      const { naturalWidth } = imageRef.current;
      console.log("图片加载完成", index, "1111111111");
      //   真实宽高
      const { width } = imageRef.current.getBoundingClientRect();
      setScaleRate(() => {
        return width / naturalWidth;
      });
    }
  };

  // canvas画图
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrawline = (points: number[][]) => {
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
      ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
      ctx.fill();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div
      className="image-container"
      style={{ position: "relative" }}
      onMouseMove={handleMouseMove}
      onDoubleClick={handDoubleClick}
      onMouseLeave={handleMouseLeave}
    >
      {openPreview ? (
        <img
          src={detail.marked_image_minio_path}
          alt="img"
          style={{ width: "100%" }}
          ref={imageRef}
          onLoad={handleImageLoad}
        ></img>
      ) : (
        <img
          src={detail.orig_image_minio_path}
          alt="img"
          style={{ width: "100%" }}
          ref={imageRef}
          onLoad={handleImageLoad}
        ></img>
      )}
      {isHovering && (
        <div
          ref={tooltipRef}
          className="tooltip"
          style={{
            position: "fixed",
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          双击复制
        </div>
      )}
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
  );
};

export default PreviewItem;
