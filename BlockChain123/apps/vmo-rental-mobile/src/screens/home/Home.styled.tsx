import { Colors } from '@namo-workspace/themes';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import View from '@namo-workspace/ui/view/View';
import { Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

const width = Dimensions.get('window').width;

export const Home = styled.View`
  flex: 1;
  margin-top: 30px;
`;
export const InputSearchContainer = styled.View`
  align-items: center;
  padding: 16px 16px 0 16px;
`;
export const ArrowButton = styled(TouchableOpacity)`
  padding-vertical: 6px;
  padding-horizontal: 8px;
  border-width: 1px;
  border-color: ${Colors.strokeLevel1};
  border-radius: 5px;
`;
export const ImageContainer = styled(View)`
  flex: 1;
  justify-content: center;
  margin-horizontal: 5px;
`;
export const ArrowContainer = styled(View)`
  position: absolute;
  width: 100%;
  padding-horizontal: 15px;
`;
export const Container = styled(View)`
  width: ${width}px;
`;
export const Image = styled(FastImage)`
  height: 200px;
  border-radius: 10px;
`;
export const BackgroundImage = styled(FastImage)`
  width: 100%;
  height: 100%;
  position: absolute;
`;
export const Dots = styled(View)`
  width: 5px;
  height: 5px;
  border-radius: 2.5px;
  margin-horizontal: 3px;
`;
