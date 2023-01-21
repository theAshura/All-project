import Button from '@namo-workspace/ui/Button';
import Input from '@namo-workspace/ui/Input';
import React from 'react';
import styled from 'styled-components';

const GetLatest = () => {
  return (
    <GetLatestWrapper>
      <ul>
        <GetLatestTextBold>
          Get the latest VMO Renting System updates!
        </GetLatestTextBold>
        <GetLatestText>
          Subscribe to be the first to know about VMO Renting System updates and
          our exclusive promotions.
        </GetLatestText>
        <GetLatestSearch>
          <Input placeholder="Enter your email address" />
          <div style={{ paddingLeft: '25px' }}>
            <Button className="button-subscribe">Subscribe</Button>
          </div>
        </GetLatestSearch>
      </ul>
    </GetLatestWrapper>
  );
};

export const GetLatestWrapper = styled.div`
  padding-top: 100px;
  text-align: center;
  list-style-type: none;
  width: 100%;
`;

export const GetLatestTextBold = styled.div`
  font-weight: 700;
  font-size: 24px;
  padding-bottom: 10px;
`;
export const GetLatestText = styled.div`
  font-size: 16px;
  text-align: center;
  padding-bottom: 15px;
`;

export const GetLatestSearch = styled.div`
  width: 300px;
  display: flex;
  align-items: center;

  text-align: center;
  margin: 0 auto;
  padding-bottom: 50px;
  @media (max-width: 767.98px) {
    flex-direction: column;
    width: 150px;
    .button-subscribe {
      margin-top: 15px;
    }
  }
`;

export default GetLatest;
