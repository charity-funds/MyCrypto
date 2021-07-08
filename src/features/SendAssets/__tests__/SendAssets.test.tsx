import React from 'react';

import { APP_STATE, fireEvent, mockAppState, simpleRender, waitFor } from 'test-utils';

import SendAssets from '@features/SendAssets/SendAssets';
import { fAccounts, fAssets } from '@fixtures';
import { translateRaw } from '@translations';

// SendFlow makes RPC calls to get nonce and gas.
jest.mock('@vendor', () => {
  return {
    ...jest.requireActual('@vendor'),
    FallbackProvider: jest.fn().mockImplementation(() => ({
      getTransactionCount: () => 10
    }))
  };
});

jest.mock('@services/ApiService/Gas', () => ({
  ...jest.requireActual('@services/ApiService/Gas'),
  fetchGasPriceEstimates: jest.fn().mockResolvedValue({ fast: 20 }),
  fetchEIP1559PriceEstimates: jest
    .fn()
    .mockResolvedValue({ maxFeePerGas: '30000000000', maxPriorityFeePerGas: '1000000000' }),
  getGasEstimate: jest.fn().mockResolvedValue(21000)
}));

/* Test components */
describe('SendAssetsFlow', () => {
  const renderComponent = (networks = APP_STATE.networks) => {
    return simpleRender(<SendAssets />, {
      initialState: mockAppState({
        accounts: fAccounts,
        assets: fAssets,
        networks
      })
    });
  };

  test('Can render the first step (Send Assets Form) in the flow.', () => {
    const { getByText } = renderComponent();
    const selector = 'Send Assets';
    expect(getByText(selector)).toBeInTheDocument();
    expect(getByText(fAccounts[0].label)).toBeInTheDocument();
  });

  test('Can render too many decimals error.', async () => {
    const { getByText, container } = renderComponent();
    const amount = container.querySelector('input[name="amount"]')!;
    fireEvent.change(amount, {
      target: { value: '0.00000000000000000001' }
    });
    fireEvent.blur(amount);
    await waitFor(() =>
      expect(getByText(translateRaw('TOO_MANY_DECIMALS', { $decimals: '18' }))).toBeInTheDocument()
    );
  });

  it('can open advanced transaction form', async () => {
    const { getByText, getByDisplayValue } = renderComponent(
      APP_STATE.networks.map((n) => ({ ...n, supportsEIP1559: false }))
    );
    const button = getByText(translateRaw('ADVANCED_OPTIONS_LABEL'), { exact: false });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    expect(getByDisplayValue('20')).toBeInTheDocument();
  });

  it('can open advanced transaction form with EIP 1559 gas params', async () => {
    const { getByText, getByDisplayValue } = renderComponent(
      APP_STATE.networks.map((n) => ({ ...n, supportsEIP1559: true }))
    );
    const button = getByText(translateRaw('ADVANCED_OPTIONS_LABEL'), { exact: false });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);

    await waitFor(() => expect(getByDisplayValue('30')).toBeInTheDocument());
    expect(getByDisplayValue('1')).toBeInTheDocument();
  });
});
