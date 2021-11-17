import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import weakMemoize from "@emotion/weak-memoize";
import { FrameContextConsumer } from "react-frame-component";

let memoizedCreateCacheWithContainer = weakMemoize(container => {
  let newCache = createCache({ container });
  return newCache;
});

export const FrameEmotionProvider = props => (
  <FrameContextConsumer>
    {({ document }) => {
      return (
        <CacheProvider value={memoizedCreateCacheWithContainer(document.head)}>
          {props.children}
        </CacheProvider>
      );
    }}
  </FrameContextConsumer>
);
