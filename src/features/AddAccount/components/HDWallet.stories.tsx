import React from 'react';

import ExtendedContentPanel from '@components/ExtendedContentPanel';
import { LEDGER_DERIVATION_PATHS } from '@config';
import { fAssets, fDWAccounts, fNetworks } from '@fixtures';
import { noOp } from '@utils';

import { HDWalletProps, default as HDWalletUI } from './HDWallet';

export default {
  title: 'Organisms/HDWallet',
  component: HDWalletUI
};

const defaultProps: HDWalletProps = {
  selectedAsset: fAssets[0],
  scannedAccounts: fDWAccounts,
  isCompleted: true,
  network: fNetworks[0],
  assets: fAssets,
  dpaths: LEDGER_DERIVATION_PATHS,
  assetToUse: fAssets[0],
  selectedDPath: {
    ...fDWAccounts[0].pathItem,
    label: 'Default ETH DPath',
    value: ''
  },
  setSelectedDPath: noOp,
  updateAsset: noOp,
  addDPaths: noOp,
  scanMoreAddresses: noOp,
  handleAssetUpdate: noOp,
  onUnlock: noOp
};

const Template = () => (
  <ExtendedContentPanel width="800px">
    <HDWalletUI {...defaultProps} />
  </ExtendedContentPanel>
);

export const HDWallet = Template.bind({});
HDWallet.storyName = 'HDWallet';
HDWallet.args = {
  ...defaultProps
};
