/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { GenericSelectorProps } from '$app/common/interfaces/generic-selector-props';
import { Vendor } from '$app/common/interfaces/vendor';
import {
  DebouncedCombobox,
  Record,
} from '$app/components/forms/DebouncedCombobox';
import { CreateVendorModal } from '$app/pages/vendors/components/CreateVendorModal';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface VendorSelectorProps extends GenericSelectorProps<Vendor> {
  initiallyVisible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  setSelectedIds?: Dispatch<SetStateAction<string[]>>;
  staleTime?: number;
}

export function VendorSelector(props: VendorSelectorProps) {
  const [t] = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CreateVendorModal
        visible={props.initiallyVisible || isModalOpen}
        setVisible={props.setVisible || setIsModalOpen}
        setSelectedIds={props.setSelectedIds}
        onVendorCreated={(vendor) => props.onChange(vendor)}
      />

      {!props.setSelectedIds && (
        <DebouncedCombobox
          inputLabel={props.inputLabel}
          value="id"
          endpoint="/api/v1/vendors?status=active"
          label="name"
          onChange={(value: Record<Vendor>) =>
            value.resource && props.onChange(value.resource)
          }
          defaultValue={props.value}
          disabled={props.readonly}
          clearButton={props.clearButton}
          onClearButtonClick={props.onClearButtonClick}
          queryAdditional
          initiallyVisible={props.initiallyVisible}
          actionLabel={t('new_vendor')}
          onActionClick={() => setIsModalOpen(true)}
          sortBy="name|asc"
          staleTime={props.staleTime || 500}
          errorMessage={props.errorMessage}
        />
      )}
    </>
  );
}
