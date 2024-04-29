import React from "react";

import SourceItem from "./source-item";

interface MyComponentProps {
  detail: any;
}

const Source: React.FC<MyComponentProps> = ({ detail }) => {
  return (
    <div className="pb-4 px-6 flex-1 overflow-y-auto">
      {Object.keys(detail).map((key: string, index: number) => {
        return detail[key].map((item1: any, index1: number) => {
          return (
            <SourceItem
              key={key + index1}
              detail={item1}
              showIndex={key === item1.file_id && index1 === 0}
              showBorder={detail[key].length !== index1 + 1}
              index={index}
            />
          );
        });
      })}
    </div>
  );
};

export default Source;
