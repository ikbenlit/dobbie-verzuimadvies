/**
 * Unit tests voor contract helper functies
 * 
 * Test coverage voor:
 * - calculateContractDates()
 * - isInOptOutPeriod()
 * - isContractActive()
 */

import {
  calculateContractDates,
  isInOptOutPeriod,
  isContractActive,
} from '../contract';
import { addDays, addMonths } from 'date-fns';

describe('contract helpers', () => {
  describe('calculateContractDates', () => {
    it('should calculate correct contract dates for a given start date', () => {
      const startDate = new Date('2025-01-15T10:00:00Z');
      const result = calculateContractDates(startDate);

      expect(result.contract_start_date).toEqual(startDate);
      expect(result.contract_end_date).toEqual(addMonths(startDate, 12));
      expect(result.opt_out_deadline).toEqual(addDays(startDate, 14));
    });

    it('should calculate contract_end_date exactly 12 months after start', () => {
      const startDate = new Date('2025-01-15T10:00:00Z');
      const result = calculateContractDates(startDate);

      const expectedEndDate = addMonths(startDate, 12);
      expect(result.contract_end_date.getTime()).toBe(expectedEndDate.getTime());
    });

    it('should calculate opt_out_deadline exactly 14 days after start', () => {
      const startDate = new Date('2025-01-15T10:00:00Z');
      const result = calculateContractDates(startDate);

      const expectedDeadline = addDays(startDate, 14);
      expect(result.opt_out_deadline.getTime()).toBe(expectedDeadline.getTime());
    });

    it('should handle leap year correctly', () => {
      const startDate = new Date('2024-02-15T10:00:00Z'); // Leap year
      const result = calculateContractDates(startDate);

      // Contract end should be 12 months later (Feb 15, 2025)
      expect(result.contract_end_date.getFullYear()).toBe(2025);
      expect(result.contract_end_date.getMonth()).toBe(1); // February (0-indexed)
      expect(result.contract_end_date.getDate()).toBe(15);
    });

    it('should handle month-end dates correctly', () => {
      const startDate = new Date('2025-01-31T10:00:00Z');
      const result = calculateContractDates(startDate);

      // Should handle month-end correctly (Jan 31 -> Feb 28/29 -> Mar 31)
      expect(result.contract_end_date.getFullYear()).toBe(2026);
      expect(result.contract_end_date.getMonth()).toBe(0); // January (0-indexed)
    });
  });

  describe('isInOptOutPeriod', () => {
    it('should return true when current date is before opt-out deadline', () => {
      const deadline = new Date('2025-02-01T00:00:00Z');
      const referenceDate = new Date('2025-01-20T00:00:00Z'); // Before deadline

      const result = isInOptOutPeriod(deadline.toISOString(), referenceDate);
      expect(result).toBe(true);
    });

    it('should return true when current date equals opt-out deadline', () => {
      const deadline = new Date('2025-02-01T00:00:00Z');
      const referenceDate = new Date('2025-02-01T00:00:00Z'); // Same as deadline

      const result = isInOptOutPeriod(deadline.toISOString(), referenceDate);
      expect(result).toBe(true);
    });

    it('should return false when current date is after opt-out deadline', () => {
      const deadline = new Date('2025-02-01T00:00:00Z');
      const referenceDate = new Date('2025-02-02T00:00:00Z'); // After deadline

      const result = isInOptOutPeriod(deadline.toISOString(), referenceDate);
      expect(result).toBe(false);
    });

    it('should return false when opt-out deadline is null', () => {
      const result = isInOptOutPeriod(null);
      expect(result).toBe(false);
    });

    it('should use current date as default reference date', () => {
      const futureDeadline = addDays(new Date(), 5).toISOString();
      const result = isInOptOutPeriod(futureDeadline);
      expect(result).toBe(true); // Should be true if deadline is in future
    });

    it('should handle edge case: exactly at midnight', () => {
      const deadline = new Date('2025-02-01T00:00:00Z');
      const referenceDate = new Date('2025-02-01T00:00:01Z'); // 1 second after

      const result = isInOptOutPeriod(deadline.toISOString(), referenceDate);
      expect(result).toBe(false);
    });
  });

  describe('isContractActive', () => {
    it('should return true when current date is before contract end date', () => {
      const endDate = new Date('2026-01-15T00:00:00Z');
      const referenceDate = new Date('2025-12-01T00:00:00Z'); // Before end

      const result = isContractActive(endDate.toISOString(), referenceDate);
      expect(result).toBe(true);
    });

    it('should return true when current date equals contract end date', () => {
      const endDate = new Date('2026-01-15T00:00:00Z');
      const referenceDate = new Date('2026-01-15T00:00:00Z'); // Same as end

      const result = isContractActive(endDate.toISOString(), referenceDate);
      expect(result).toBe(true);
    });

    it('should return false when current date is after contract end date', () => {
      const endDate = new Date('2026-01-15T00:00:00Z');
      const referenceDate = new Date('2026-01-16T00:00:00Z'); // After end

      const result = isContractActive(endDate.toISOString(), referenceDate);
      expect(result).toBe(false);
    });

    it('should return false when contract end date is null', () => {
      const result = isContractActive(null);
      expect(result).toBe(false);
    });

    it('should use current date as default reference date', () => {
      const futureEndDate = addMonths(new Date(), 6).toISOString();
      const result = isContractActive(futureEndDate);
      expect(result).toBe(true); // Should be true if end date is in future
    });

    it('should handle expired contract correctly', () => {
      const pastEndDate = new Date('2024-01-15T00:00:00Z');
      const referenceDate = new Date('2025-01-15T00:00:00Z'); // 1 year later

      const result = isContractActive(pastEndDate.toISOString(), referenceDate);
      expect(result).toBe(false);
    });

    it('should handle edge case: exactly at contract end time', () => {
      const endDate = new Date('2026-01-15T12:00:00Z');
      const referenceDate = new Date('2026-01-15T12:00:01Z'); // 1 second after

      const result = isContractActive(endDate.toISOString(), referenceDate);
      expect(result).toBe(false);
    });
  });
});

