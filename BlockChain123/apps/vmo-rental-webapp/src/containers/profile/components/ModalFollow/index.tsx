import ModalContainer from '@components/Modal/ModalContainer';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import React, { useMemo } from 'react';
import Tabs, { ITab } from '@namo-workspace/ui/Tabs';
import UserScrollList from './UserScrollList';

interface Props {
  lenderName?: string;
  isOpen: boolean;
  onClose?: () => void;
  totalFollowers?: number;
  totalFollowings?: number;
}

const fakeListUser: any[] = [
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
  {
    id: 'e96eca53-59de-4dc2-adfe-8b6543da77d5',
    createdAt: '2022-09-07T03:29:06.846Z',
    updatedAt: '2022-10-20T10:09:52.706Z',
    address: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
    nonce: '88898043-a953-4d29-8bc9-67c3cfe176db',
    name: 'Jennifer Le',
    userName: 'gianglh99',
    role: 'USER',
    bio: 'A\nhgf\nbdfh\ngffh\ntfhjh',
    isSigned: true,
    coverImage:
      'https://namo-dev.s3.amazonaws.com/profiles/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5/a494e5aa-df5a-4183-9aeb-0c7afa65d4e5_original.PNG',
    avatar:
      'https://namo-dev.s3.amazonaws.com/profiles/9beecaf8-fca2-4404-941a-54e29291fee9/9beecaf8-fca2-4404-941a-54e29291fee9_original.JPG',
    email: 'giang-b@namo.gallery.vn.fn',
    socialMediaLink:
      '{"tiktok":"@abc","twitter":"haha","instagram":"tran3duy","facebook":""}',
    follower: null,
    following: null,
    viewCount: 426,
    proxyWallet: {
      id: '4f151315-7a91-4c0f-8f0e-f3f66c4344ed',
      createdAt: '2022-10-14T03:08:10.439Z',
      updatedAt: '2022-10-19T02:33:51.455Z',
      ownerAddress: '0xf6551f48c21ac6d13acd6bae005d99ca118188c0',
      proxyAddress: '0x50ee5181605de1f7fe0e236ae0ac1d51350ec20e',
      keyStore:
        '{"version":3,"id":"10938db4-7eec-4085-b153-22e39e7d29a9","address":"50ee5181605de1f7fe0e236ae0ac1d51350ec20e","crypto":{"ciphertext":"0f3caefb91dd24539e53475da61c71bdd38ece9d1ba2655f5e4c6190c5027867","cipherparams":{"iv":"f7a44b92dbfffcd1c358262e5f463c04"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"645853e25755369216ec5dd613d0069b8431aa57136f1546347417f61214595e","n":8192,"r":8,"p":1},"mac":"b9634376ed44b4e12b4b9ed372514916b82cefe27ec86c34e5f27e2a0d8c2cc9"}}',
      signature:
        '0x4bf748f7e808e041709929d1522bd8b53b0ced13efef97beb6a03e0608ef4337375fb913929ecaa9017b677a4dba31828d2f6dc2788a1bbd7f7ee1ff0664a7421b',
      deadlineSignature: 1666233231,
    },
    totalFollowers: 0,
    totalFollowings: 0,
  },
];
export default function ModalFollow({
  isOpen,
  lenderName,
  onClose,
  totalFollowers,
  totalFollowings,
}: Props) {
  const isMobile = useMediaQuery(QUERY.ONLY_MOBILE);
  const tabs: ITab[] = useMemo(
    () => [
      { key: 'follower', label: `${totalFollowers} Followers` },
      { key: 'folowing', label: `${totalFollowings} Followings` },
    ],
    [totalFollowers, totalFollowings]
  );
  return (
    <ModalContainer
      closeButton
      onClose={onClose}
      size={isMobile ? 'small' : 'large'}
      isOpen={isOpen}
      title={lenderName}
      contentClassName="w-100"
      description={
        <Tabs tabs={tabs} style={{ maxHeight: '50vh' }}>
          {({ activeKey }) => {
            return (
              <UserScrollList
                tabName={activeKey}
                fetchMoreData={() => {
                  //do nothing
                }}
                hasMore={true}
                listUser={fakeListUser.reduce(function (
                  res,
                  current,
                  index,
                  array
                ) {
                  return res.concat([current, current]);
                },
                [])}
              />
            );
          }}
        </Tabs>
      }
    />
  );
}
