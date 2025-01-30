import type React from "react";

interface BackgroundLinesProps {
  className?: string;
}

const BackgroundLines: React.FC<BackgroundLinesProps> = ({ className }) => {
  return (
    <div className={`lines-background ${className || ""}`}>
      <div className="line line-1" />
      <div className="line line-2" />
      <div className="line line-3" />
    </div>
  );
};

export default BackgroundLines;
