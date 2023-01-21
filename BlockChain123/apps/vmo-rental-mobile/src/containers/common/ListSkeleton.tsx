import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import View from '@namo-workspace/ui/view/View';

export const ListSkeleton = () => {
  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ContentLoader
            speed={1}
            width="90%"
            height={170}
            backgroundColor="#f3f3f3"
            foregroundColor="#ffffff"
          >
            <Rect rx="10" ry="10" width="170" height="170" />
          </ContentLoader>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ContentLoader
            speed={1}
            width="90%"
            height={170}
            backgroundColor="#f3f3f3"
            foregroundColor="#ffffff"
          >
            <Rect rx="10" ry="10" width="170" height="170" />
          </ContentLoader>
        </View>
      </View>
      <View mt={10} style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ContentLoader
            speed={1}
            width="90%"
            height={170}
            backgroundColor="#f3f3f3"
            foregroundColor="#ffffff"
          >
            <Rect rx="10" ry="10" width="170" height="170" />
          </ContentLoader>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ContentLoader
            speed={1}
            width="90%"
            height={170}
            backgroundColor="#f3f3f3"
            foregroundColor="#ffffff"
          >
            <Rect rx="10" ry="10" width="170" height="170" />
          </ContentLoader>
        </View>
      </View>
      <View mt={10} style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ContentLoader
            speed={1}
            width="90%"
            height={170}
            backgroundColor="#f3f3f3"
            foregroundColor="#ffffff"
          >
            <Rect rx="10" ry="10" width="170" height="170" />
          </ContentLoader>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ContentLoader
            speed={1}
            width="90%"
            height={170}
            backgroundColor="#f3f3f3"
            foregroundColor="#ffffff"
          >
            <Rect rx="10" ry="10" width="170" height="170" />
          </ContentLoader>
        </View>
      </View>
    </>
  );
};
