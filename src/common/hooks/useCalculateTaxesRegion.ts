/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useResolveCountry } from './useResolveCountry';

export function useCalculateTaxesRegion(countryId: string | number): boolean {
  /**
   * Supported tax regions
   */
  const supportedCountries: string[] = ['AU', 'US', 'DE'];

  const resolveCountry = useResolveCountry();

  return supportedCountries.includes(
    resolveCountry(countryId)?.iso_3166_2 || ''
  );
}
