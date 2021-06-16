import React from 'react';

import { MYC_API } from '@config';
import { TUuid } from '@types';

import Box from './Box';
import { getSVGIcon } from './Icon';

const baseURL = `${MYC_API}/images`;

function buildUrl(uuid: TUuid) {
  return `${baseURL}/${uuid}.png`;
}

interface Props {
  uuid: TUuid;
  size?: string;
  className?: string;
}

const AssetIcon = ({ uuid, size, ...props }: Props & React.ComponentProps<typeof Box>) => {
  const iconUrl = buildUrl(uuid);

  // Replace src in the eventuality the server fails to reply with the requested icon.
  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const elem = event.currentTarget;
    elem.onerror = null;
    elem.src = getSVGIcon('generic-asset-icon');
  };

  return (
    <Box display="inline-flex" height={size} width={size} {...props}>
      <img src={iconUrl} onError={handleError} />
    </Box>
  );
};

export default AssetIcon;
