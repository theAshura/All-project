import { useUserInfo } from '@context/auth/UserInfoContext';
import { authApi } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import InputField from '@namo-workspace/ui/form/InputField';
import { Body3, Body4 } from '@namo-workspace/ui/Typography';
import View from '@namo-workspace/ui/view/View';
import subscriptionSchema from '@namo-workspace/yupSchema/subscriptionSchema';
import { showMessageError, showMessageSuccess } from '@services/showMessage';
import { Formik } from 'formik';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

interface SubscriptionInfo {
  email: string;
  userId: string;
}

export const Footer = () => {
  const { userInfo } = useUserInfo();
  const [loading, setLoading] = useState<boolean>(false);
  const initialValue = useMemo(
    () => ({
      email: '',
      userId: userInfo?.id,
    }),
    [userInfo]
  );

  const handleSubscription = async (values: SubscriptionInfo) => {
    setLoading(true);
    const params = userInfo
      ? {
          ...values,
          userId: userInfo.id,
        }
      : { email: values.email };

    await authApi
      .subscribeEmail(params)
      .then((res) => showMessageSuccess('Subscription completed!'))
      .catch((err) => showMessageError('Subcsription failed!'))
      .finally(() => setLoading(false));
  };

  return (
    <View mt={30}>
      <BackgroundImage
        source={require('../../assets/images/img_second_bg.png')}
      />
      <Body3 fontWeight="800" color={Colors.foreground} center>
        Get the latest VMO Renting System updates!
      </Body3>
      <Body3 mt={2} color={Colors.foreground} center>
        Subscribe to be the first to know about VMO Renting System updates and
        our exclusive promotions.
      </Body3>
      <Formik
        initialValues={initialValue}
        validationSchema={subscriptionSchema}
        onSubmit={handleSubscription}
        validateOnBlur={true}
      >
        {({ values, handleSubmit, dirty }) => (
          <View flexRow mt={6} px={5}>
            <InputField
              name="email"
              isRequired
              placeholder="Enter your email address"
              maxLength={250}
              style={{ flex: 1, marginRight: 10 }}
              inputStyle={{ height: 40 }}
            />
            <View>
              <Button
                activeOpacity={0.7}
                size="medium"
                style={{ height: 40 }}
                disabled={loading}
                onPress={() => handleSubmit()}
              >
                Subscribe
              </Button>
            </View>
          </View>
        )}
      </Formik>
      <View mt={6} alignCenter>
        <Body3 fontWeight="800" color={Colors.foreground}>
          [Logo] VMORS
        </Body3>
        <Body4 mt={2} color={Colors.foreground}>
          A brand new model NFT marketplace
        </Body4>
      </View>
      <View flexRow my={6} mx={5} justifyCenter>
        <View mr={4}>
          <Body3 fontWeight="800" color={Colors.foreground}>
            About
          </Body3>
          <Body4 mt={2} color={Colors.foreground}>
            About Us
          </Body4>
          <Body4 mt={2} color={Colors.foreground}>
            Terms & Conditions
          </Body4>
          <Body4 mt={2} color={Colors.foreground}>
            FAQ
          </Body4>
          <Body4 mt={2} color={Colors.foreground}>
            Help Centre
          </Body4>
        </View>
        <View ml={4}>
          <Body3 fontWeight="800" color={Colors.foreground}>
            Contact Us
          </Body3>
          <Body4 mt={2} color={Colors.foreground}>
            vmorentingsystem@vmodev.com
          </Body4>
        </View>
      </View>
    </View>
  );
};

const BackgroundImage = styled(FastImage)`
  width: 100%;
  height: 100%;
  position: absolute;
`;
