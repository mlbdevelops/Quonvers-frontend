import React, { useMemo, useRef, useCallback, ReactNode, useEffect } from 'react';
import { StyleSheet, Dimensions, BackHandler } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView, BottomSheetFlatList, BottomSheetFlashList } from '@gorhom/bottom-sheet';

type SheetProps = {
  snaps: any,
  children: ReactNode,
  ref: any,
  backgroundStyle: any,
  handleIndicatorStyle: any,
  props?: React.PropsWithChildren
}

export default function Sheet({snaps = [], children, ref, backgroundStyle, handleIndicatorStyle, props}: SheetProps) {
  
  const snapPoints = useMemo(() => snaps.length? snaps : ['50%', '100%'], []);
  
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.6}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{...styles.sheetBackground, ...backgroundStyle}}
      handleIndicatorStyle={{...styles.indicator, ...handleIndicatorStyle}}
      {...props}
    >
      {children}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#171717',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  indicator: {
    backgroundColor: 'rgba(135,135,135,0.4)',
    width: 50,
  }
});