/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { InvoiceStatus } from '$app/common/enums/invoice-status';
import { route } from '$app/common/helpers/route';
import { Credit } from '$app/common/interfaces/credit';
import { Invoice } from '$app/common/interfaces/invoice';
import { PurchaseOrder } from '$app/common/interfaces/purchase-order';
import { Quote } from '$app/common/interfaces/quote';
import { RecurringInvoice } from '$app/common/interfaces/recurring-invoice';
import { Divider } from '$app/components/cards/Divider';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Icon } from '$app/components/icons/Icon';
import { useAtom } from 'jotai';
import { creditAtom } from '$app/pages/credits/common/atoms';
import { invoiceAtom } from '$app/pages/invoices/common/atoms';
import { openClientPortal } from '$app/pages/invoices/common/helpers/open-client-portal';
import { useDownloadPdf } from '$app/pages/invoices/common/hooks/useDownloadPdf';
import { purchaseOrderAtom } from '$app/pages/purchase-orders/common/atoms';
import { quoteAtom } from '$app/pages/quotes/common/atoms';
import { recurringInvoiceAtom } from '$app/pages/recurring-invoices/common/atoms';
import { useTranslation } from 'react-i18next';
import { BiPlusCircle } from 'react-icons/bi';
import {
  MdArchive,
  MdCancel,
  MdCloudCircle,
  MdControlPointDuplicate,
  MdDelete,
  MdDownload,
  MdMarkEmailRead,
  MdPaid,
  MdPictureAsPdf,
  MdPrint,
  MdRestore,
  MdSchedule,
  MdSend,
} from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHandleArchive } from '../hooks/useHandleArchive';
import { useHandleCancel } from '../hooks/useHandleCancel';
import { useHandleDelete } from '../hooks/useHandleDelete';
import { useHandleRestore } from '../hooks/useHandleRestore';
import { useMarkPaid } from '../hooks/useMarkPaid';
import { useMarkSent } from '../hooks/useMarkSent';
import { useScheduleEmailRecord } from '$app/pages/invoices/common/hooks/useScheduleEmailRecord';
import { usePrintPdf } from '$app/pages/invoices/common/hooks/usePrintPdf';
import { getEntityState } from '$app/common/helpers';
import { EntityState } from '$app/common/enums/entity-state';
import dayjs from 'dayjs';

export function useActions() {
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();
  const downloadPdf = useDownloadPdf({ resource: 'invoice' });
  const printPdf = usePrintPdf({ entity: 'invoice' });
  const markSent = useMarkSent();
  const markPaid = useMarkPaid();
  const scheduleEmailRecord = useScheduleEmailRecord({ entity: 'invoice' });

  const archive = useHandleArchive();
  const restore = useHandleRestore();
  const destroy = useHandleDelete();
  const cancel = useHandleCancel();

  const [, setInvoice] = useAtom(invoiceAtom);
  const [, setQuote] = useAtom(quoteAtom);
  const [, setCredit] = useAtom(creditAtom);
  const [, setRecurringInvoice] = useAtom(recurringInvoiceAtom);
  const [, setPurchaseOrder] = useAtom(purchaseOrderAtom);

  const cloneToInvoice = (invoice: Invoice) => {
    setInvoice({ ...invoice, 
      number: '', 
      documents: [], 
      due_date: '', 
      date: dayjs().format('YYYY-MM-DD'),
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '',
      vendor_id: '',
      paid_to_date: 0, 
    });

    navigate('/invoices/create?action=clone');
  };

  const cloneToQuote = (invoice: Invoice) => {
    setQuote({ ...(invoice as unknown as Quote), 
      number: '', 
      documents: [], 
      date: dayjs().format('YYYY-MM-DD'),
      due_date: '',
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '',
      vendor_id: '',
      paid_to_date: 0,
    });

    navigate('/quotes/create?action=clone');
  };

  const cloneToCredit = (invoice: Invoice) => {
    setCredit({ ...(invoice as unknown as Credit), 
      number: '', 
      documents: [], 
      date: dayjs().format('YYYY-MM-DD'),
      due_date: '',
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '',
      vendor_id: '',
      paid_to_date: 0,
     });

    navigate('/credits/create?action=clone');
  };

  const cloneToRecurringInvoice = (invoice: Invoice) => {
    setRecurringInvoice({
      ...(invoice as unknown as RecurringInvoice),
      number: '',
      documents: [],
      frequency_id: '5',
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '',
      vendor_id: '',
      paid_to_date: 0,
    });

    navigate('/recurring_invoices/create?action=clone');
  };

  const cloneToPurchaseOrder = (invoice: Invoice) => {
    setPurchaseOrder({
      ...(invoice as unknown as PurchaseOrder),
      number: '',
      documents: [],
      date: dayjs().format('YYYY-MM-DD'),
      total_taxes: 0,
      exchange_rate: 1,
      last_sent_date: '',
      project_id: '',
      subscription_id: '',
      status_id: '1',
      vendor_id: '',
      paid_to_date: 0,
    });

    navigate('/purchase_orders/create?action=clone');
  };

  return [
    (invoice: Invoice) => (
      <DropdownElement
        to={route('/invoices/:id/email', { id: invoice.id })}
        icon={<Icon element={MdSend} />}
      >
        {t('email_invoice')}
      </DropdownElement>
    ),
    (invoice: Invoice) => (
      <DropdownElement
        to={route('/invoices/:id/pdf', { id: invoice.id })}
        icon={<Icon element={MdPictureAsPdf} />}
      >
        {t('view_pdf')}
      </DropdownElement>
    ),
    (invoice: Invoice) =>
      getEntityState(invoice) !== EntityState.Deleted && (
        <DropdownElement
          onClick={() => printPdf([invoice.id])}
          icon={<Icon element={MdPrint} />}
        >
          {t('print_pdf')}
        </DropdownElement>
      ),
    (invoice: Invoice) =>
      invoice.status_id !== InvoiceStatus.Paid && (
        <DropdownElement
          onClick={() => scheduleEmailRecord(invoice.id)}
          icon={<Icon element={MdSchedule} />}
        >
          {t('schedule')}
        </DropdownElement>
      ),
    (invoice: Invoice) => (
      <DropdownElement
        to={route('/invoices/:id/pdf?delivery_note=true', { id: invoice.id })}
        icon={<Icon element={MdPictureAsPdf} />}
      >
        {t('delivery_note')} ({t('pdf')})
      </DropdownElement>
    ),
    (invoice: Invoice) => (
      <DropdownElement
        onClick={() => downloadPdf(invoice)}
        icon={<Icon element={MdDownload} />}
      >
        {t('download')}
      </DropdownElement>
    ),
    (invoice: Invoice) =>
      invoice.status_id === InvoiceStatus.Draft &&
      !invoice.is_deleted && (
        <DropdownElement
          onClick={() => markSent(invoice)}
          icon={<Icon element={MdMarkEmailRead} />}
        >
          {t('mark_sent')}
        </DropdownElement>
      ),
    (invoice: Invoice) =>
      parseInt(invoice.status_id) < parseInt(InvoiceStatus.Paid) &&
      !invoice.is_deleted && (
        <DropdownElement
          onClick={() => markPaid(invoice)}
          icon={<Icon element={MdPaid} />}
        >
          {t('mark_paid')}
        </DropdownElement>
      ),
    (invoice: Invoice) =>
      parseInt(invoice.status_id) < 4 && (
        <DropdownElement
          to={route('/payments/create?invoice=:invoiceId&client=:clientId', {
            invoiceId: invoice.id,
            clientId: invoice.client_id,
          })}
          icon={<Icon element={BiPlusCircle} />}
        >
          {t('enter_payment')}
        </DropdownElement>
      ),
    (invoice: Invoice) => (
      <DropdownElement
        onClick={() => invoice && openClientPortal(invoice)}
        icon={<Icon element={MdCloudCircle} />}
      >
        {t('client_portal')}
      </DropdownElement>
    ),
    (invoice: Invoice) =>
      invoice.status_id === InvoiceStatus.Sent && (
        <DropdownElement
          onClick={() => cancel(invoice)}
          icon={<Icon element={MdCancel} />}
        >
          {t('cancel_invoice')}
        </DropdownElement>
      ),
    () => <Divider withoutPadding />,
    (invoice: Invoice) => (
      <DropdownElement
        onClick={() => cloneToInvoice(invoice)}
        icon={<Icon element={MdControlPointDuplicate} />}
      >
        {t('clone')}
      </DropdownElement>
    ),
    (invoice: Invoice) => (
      <DropdownElement
        onClick={() => cloneToQuote(invoice)}
        icon={<Icon element={MdControlPointDuplicate} />}
      >
        {t('clone_to_quote')}
      </DropdownElement>
    ),
    (invoice: Invoice) => (
      <DropdownElement
        onClick={() => cloneToCredit(invoice)}
        icon={<Icon element={MdControlPointDuplicate} />}
      >
        {t('clone_to_credit')}
      </DropdownElement>
    ),
    (invoice: Invoice) => (
      <DropdownElement
        onClick={() => cloneToRecurringInvoice(invoice)}
        icon={<Icon element={MdControlPointDuplicate} />}
      >
        {t('clone_to_recurring')}
      </DropdownElement>
    ),
    (invoice: Invoice) => (
      <DropdownElement
        onClick={() => cloneToPurchaseOrder(invoice)}
        icon={<Icon element={MdControlPointDuplicate} />}
      >
        {t('clone_to_purchase_order')}
      </DropdownElement>
    ),
    () => location.pathname.endsWith('/edit') && <Divider withoutPadding />,
    (invoice: Invoice) =>
      location.pathname.endsWith('/edit') &&
      invoice.archived_at === 0 && (
        <DropdownElement
          onClick={() => archive(invoice)}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (invoice: Invoice) =>
      location.pathname.endsWith('/edit') &&
      invoice.archived_at > 0 &&
      invoice.status_id !== InvoiceStatus.Cancelled && (
        <DropdownElement
          onClick={() => restore(invoice)}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (invoice: Invoice) =>
      location.pathname.endsWith('/edit') &&
      !invoice.is_deleted && (
        <DropdownElement
          onClick={() => destroy(invoice)}
          icon={<Icon element={MdDelete} />}
        >
          {t('delete')}
        </DropdownElement>
      ),
  ];
}
