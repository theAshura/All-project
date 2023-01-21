import { nftApi, SubscribeData } from '@namo-workspace/services';
import Button from '@namo-workspace/ui/Button';
import Input from '@namo-workspace/ui/Input';
import { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { SUCCESS } from '@namo-workspace/utils';

const GetLatest = () => {
  const [inputValue, setInputValue] = useState<SubscribeData>({
    email: '',
  });
  const [error, setError] = useState('');
  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    nftApi
      .subscribeGetLatest(inputValue)
      .then(() => {
        setInputValue({ email: '' });
        setError('');
        toast.success(SUCCESS.SUBSCRIBE_SUCCESS);
      })
      .catch((e) => {
        setError('Entered value does not match email format');
      });
  };

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
          <Input
            maxLength={250}
            value={inputValue.email}
            onChange={(e) =>
              setInputValue({ ...inputValue, email: e.target.value })
            }
            placeholder="Enter your email address"
          />
          <div style={{ paddingLeft: '25px' }}>
            <Button onClick={handleSubmit} className="button-subscribe">
              Subscribe
            </Button>
            <GetLatestErr>{error}</GetLatestErr>
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
export const GetLatestErr = styled.div`
  color: red;
  font-size: 16px;
  font-weight: 600;
  position: absolute;
  top: 45px;
  left: 0;
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
  width: 400px;
  display: flex;
  align-items: center;
  position: relative;

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
