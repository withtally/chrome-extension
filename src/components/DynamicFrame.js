import React, { useState, useEffect, useCallback, RefObject } from "react";
import Frame from "react-frame-component";

export const DynamicFrame = (props) => {
  const { children } = props;
  const [height, setHeight] = useState(500);
  const iframeRef = React.createRef();

  const handleResize = useCallback((iframe) => {
    const height = iframe.current?.node.contentDocument?.body.scrollHeight ?? 0;
    if (height !== 0) {
      setHeight(height);
    }
  }, []);

  useEffect(() => handleResize(iframeRef), [handleResize, iframeRef]);

  return (
    <Frame
      ref={iframeRef}
      style={{
        height,
      }}
      onLoad={() => handleResize(iframeRef)}
    >
      {children}
    </Frame>
  );
};