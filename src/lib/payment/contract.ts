/**
 * Contract helper functies voor subscription contract tracking
 * 
 * Deze functies helpen met het berekenen en valideren van contract datums
 * voor 12-maanden contracten met 14-dagen opt-out periode.
 */

import { addMonths, addDays, isAfter, isBefore } from 'date-fns';

/**
 * Contract dates result interface
 */
export interface ContractDates {
  contract_start_date: Date;
  contract_end_date: Date;
  opt_out_deadline: Date;
}

/**
 * Bereken contract datums op basis van start datum
 * 
 * Volgens Epic 0 migratie:
 * - contract_start_date: Start van 12-maanden contractperiode
 * - contract_end_date: Einde van 12-maanden contractperiode (contract_start_date + 12 maanden)
 * - opt_out_deadline: Deadline voor 14-dagen bedenktijd (contract_start_date + 14 dagen)
 * 
 * @param startDate - Start datum van het contract (meestal vandaag)
 * @returns Object met contract_start_date, contract_end_date, en opt_out_deadline
 * 
 * @example
 * ```typescript
 * const dates = calculateContractDates(new Date());
 * // dates.contract_start_date = vandaag
 * // dates.contract_end_date = vandaag + 12 maanden
 * // dates.opt_out_deadline = vandaag + 14 dagen
 * ```
 */
export function calculateContractDates(startDate: Date): ContractDates {
  return {
    contract_start_date: startDate,
    contract_end_date: addMonths(startDate, 12),
    opt_out_deadline: addDays(startDate, 14),
  };
}

/**
 * Check of we nog in de opt-out periode zitten
 * 
 * De opt-out periode is 14 dagen vanaf contract_start_date.
 * Als opt_out_deadline null is, betekent dit dat er geen opt-out periode is.
 * 
 * @param optOutDeadline - Deadline voor opt-out (ISO string of null)
 * @param referenceDate - Optionele referentie datum (default: nu)
 * @returns true als we nog in de opt-out periode zitten, false anders
 * 
 * @example
 * ```typescript
 * const inOptOut = isInOptOutPeriod('2025-01-15T00:00:00Z');
 * // true als vandaag < 15 januari 2025
 * ```
 */
export function isInOptOutPeriod(
  optOutDeadline: string | null,
  referenceDate: Date = new Date()
): boolean {
  if (!optOutDeadline) {
    return false;
  }

  const deadline = new Date(optOutDeadline);
  return isBefore(referenceDate, deadline) || referenceDate.getTime() === deadline.getTime();
}

/**
 * Check of het contract nog actief is
 * 
 * Een contract is actief als contract_end_date in de toekomst ligt of vandaag is.
 * Als contract_end_date null is, betekent dit dat er geen contractperiode is gedefinieerd.
 * 
 * @param contractEndDate - Einde datum van contract (ISO string of null)
 * @param referenceDate - Optionele referentie datum (default: nu)
 * @returns true als contract nog actief is, false anders
 * 
 * @example
 * ```typescript
 * const active = isContractActive('2026-01-15T00:00:00Z');
 * // true als vandaag <= 15 januari 2026
 * ```
 */
export function isContractActive(
  contractEndDate: string | null,
  referenceDate: Date = new Date()
): boolean {
  if (!contractEndDate) {
    return false;
  }

  const endDate = new Date(contractEndDate);
  return isAfter(endDate, referenceDate) || endDate.getTime() === referenceDate.getTime();
}

