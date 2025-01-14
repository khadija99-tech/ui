/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosResponse } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { useQuery } from 'react-query';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { GenericQueryOptions } from './invoices';
import { Client } from '../interfaces/client';
import { GenericSingleResourceResponse } from '../interfaces/generic-api-response';
import { route } from '../helpers/route';

interface BlankQueryParams {
  refetchOnWindowFocus?: boolean;
}

export function useBlankClientQuery(params: BlankQueryParams) {
  const hasPermission = useHasPermission();

  return useQuery(
    '/api/v1/clients/create',
    () =>
      request('GET', endpoint('/api/v1/clients/create')).then(
        (response) => response.data.data
      ),
    {
      refetchOnWindowFocus: Boolean(params.refetchOnWindowFocus),
      staleTime: Infinity,
      enabled: hasPermission('create_client'),
    }
  );
}

interface Props {
  enabled?: boolean;
}

export function useClientsQuery(props: Props) {
  return useQuery(
    ['/api/v1/clients', 'filter_deleted_clients=true', 'per_page=500'],
    () =>
      request('GET', endpoint('/api/v1/clients?per_page=500')).then(
        (response) => response.data.data
      ),
    { enabled: props.enabled ?? true, staleTime: Infinity }
  );
}

export function useClientQuery({ id, enabled }: GenericQueryOptions) {
  return useQuery(
    route('/api/v1/clients/:id', { id }),
    () =>
      request('GET', endpoint('/api/v1/clients/:id', { id })).then(
        (response: GenericSingleResourceResponse<Client>) => response.data.data
      ),
    {
      enabled,
      staleTime: Infinity,
    }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'delete'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/clients/bulk'), {
    action,
    ids: Array.from(id),
  });
}
