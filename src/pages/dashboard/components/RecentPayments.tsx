/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { t } from 'i18next';
import { route } from '$app/common/helpers/route';
import { Link } from '$app/components/forms/Link';
import { Payment } from '$app/common/interfaces/payment';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Card } from '$app/components/cards';
import { generatePath } from 'react-router-dom';
import dayjs from 'dayjs';
import { Badge } from '$app/components/Badge';
import { useState } from 'react';
import { ViewAll } from './ViewAll';

export function RecentPayments() {
  const formatMoney = useFormatMoney();
  const company = useCurrentCompany();

  const [viewedAll, setViewedAll] = useState<boolean>(false);

  const columns: DataTableColumns<Payment> = [
    {
      id: 'number',
      label: t('number'),
      format: (value, payment) => {
        return (
          <Link to={route('/payments/:id/edit', { id: payment.id })}>
            {payment.number}
          </Link>
        );
      },
    },
    {
      id: 'client_id',
      label: t('client'),
      format: (value, payment) => (
        <Link to={route('/clients/:id', { id: payment.client_id })}>
          {payment.client?.display_name}
        </Link>
      ),
    },
    {
      id: 'invoice_number',
      label: t('invoice'),
      format: (value, payment) =>
        payment.invoices &&
        payment.invoices[0] && (
          <Link
            to={generatePath('/invoices/:id/edit', {
              id: payment.invoices[0].id,
            })}
          >
            {payment.invoices[0].number}
          </Link>
        ),
    },
    {
      id: 'date',
      label: t('date'),
      format: (value) => dayjs(value).format('MMM DD'),
    },
    {
      id: 'amount',
      label: t('amount'),
      format: (value, payment) => (
        <Badge variant="green">
          {formatMoney(
            value,
            payment.client?.country_id || company.settings.country_id,
            payment.client?.settings.currency_id || company.settings.currency_id
          )}
        </Badge>
      ),
    },
  ];

  return (
    <Card
      title={t('recent_payments')}
      className="h-96 relative"
      withoutBodyPadding
    >
      <DataTable
        resource="payment"
        columns={columns}
        endpoint={route(
          '/api/v1/payments?include=client,invoices&sort=date|desc&per_page=50&page=1&view_all=:viewedAll',
          {
            viewedAll,
          }
        )}
        withoutActions
        withoutPagination
        withoutPadding
        withoutBottomBorder={true}
        style={{
          height: viewedAll ? '19.8rem' : '17rem',
        }}
      />

      <ViewAll viewedAll={viewedAll} setViewedAll={setViewedAll} />
    </Card>
  );
}
