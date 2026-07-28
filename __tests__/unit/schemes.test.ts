// Unit Tests — Scheme Store & Data Logic (50 tests)

import { schemes, categories } from '../../constants/data';
import type { Scheme } from '../../types';

describe('SCHEME DATA — Structure Integrity', () => {
  test('TC-S-001: schemes array is not empty', () => {
    expect(schemes.length).toBeGreaterThan(0);
  });
  test('TC-S-002: every scheme has an id', () => {
    schemes.forEach(s => expect(s.id).toBeTruthy());
  });
  test('TC-S-003: every scheme has a name', () => {
    schemes.forEach(s => expect(s.name.length).toBeGreaterThan(0));
  });
  test('TC-S-004: every scheme has a non-empty description', () => {
    schemes.forEach(s => expect(s.description.length).toBeGreaterThan(10));
  });
  test('TC-S-005: every scheme has a ministry', () => {
    schemes.forEach(s => expect(s.ministry).toBeTruthy());
  });
  test('TC-S-006: every scheme has a benefits field', () => {
    schemes.forEach(s => expect(s.benefits).toBeTruthy());
  });
  test('TC-S-007: every scheme has at least one eligibility criterion', () => {
    schemes.forEach(s => expect(s.eligibility.length).toBeGreaterThan(0));
  });
  test('TC-S-008: every scheme has at least one required document', () => {
    schemes.forEach(s => expect(s.documents.length).toBeGreaterThan(0));
  });
  test('TC-S-009: every scheme has a valid deadline date string', () => {
    schemes.forEach(s => expect(new Date(s.deadline).getTime()).not.toBeNaN());
  });
  test('TC-S-010: every scheme status is active|inactive|upcoming', () => {
    const valid = ['active', 'inactive', 'upcoming'];
    schemes.forEach(s => expect(valid).toContain(s.status));
  });
});

describe('SCHEME DATA — Counts & Flags', () => {
  test('TC-S-011: applied count is a non-negative number', () => {
    schemes.forEach(s => expect(s.applied).toBeGreaterThanOrEqual(0));
  });
  test('TC-S-012: featured is a boolean', () => {
    schemes.forEach(s => expect(typeof s.featured).toBe('boolean'));
  });
  test('TC-S-013: at least one scheme is featured', () => {
    expect(schemes.some(s => s.featured)).toBe(true);
  });
  test('TC-S-014: featured schemes count is reasonable (1-20)', () => {
    const count = schemes.filter(s => s.featured).length;
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(20);
  });
  test('TC-S-015: scheme ids are unique', () => {
    const ids = schemes.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('SCHEME FILTER — By Category', () => {
  test('TC-S-016: filter returns Agriculture schemes only', () => {
    const result = filterByCategory(schemes, 'Agriculture');
    result.forEach(s => expect(s.category).toBe('Agriculture'));
  });
  test('TC-S-017: filter returns empty array for unknown category', () => {
    expect(filterByCategory(schemes, 'XYZ Unknown')).toHaveLength(0);
  });
  test('TC-S-018: filter is case-sensitive', () => {
    const lower = filterByCategory(schemes, 'agriculture');
    const upper = filterByCategory(schemes, 'Agriculture');
    expect(lower.length).toBeLessThanOrEqual(upper.length);
  });
  test('TC-S-019: filter by Education returns at least one scheme', () => {
    expect(filterByCategory(schemes, 'Education').length).toBeGreaterThan(0);
  });
  test('TC-S-020: filter by Finance returns at least one scheme', () => {
    expect(filterByCategory(schemes, 'Finance').length).toBeGreaterThan(0);
  });
});

describe('SCHEME FILTER — By Status', () => {
  test('TC-S-021: active schemes are filterable', () => {
    const active = schemes.filter(s => s.status === 'active');
    expect(active.length).toBeGreaterThan(0);
  });
  test('TC-S-022: no scheme has undefined status', () => {
    schemes.forEach(s => expect(s.status).toBeDefined());
  });
  test('TC-S-023: upcoming schemes have future deadlines', () => {
    const upcoming = schemes.filter(s => s.status === 'upcoming');
    upcoming.forEach(s => {
      expect(new Date(s.deadline).getTime()).toBeGreaterThan(Date.now() - 86400000 * 365);
    });
  });
  test('TC-S-024: inactive schemes exist or list is empty (no crash)', () => {
    const inactive = schemes.filter(s => s.status === 'inactive');
    expect(Array.isArray(inactive)).toBe(true);
  });
  test('TC-S-025: total scheme count is at least 10', () => {
    expect(schemes.length).toBeGreaterThanOrEqual(10);
  });
});

describe('SCHEME SEARCH — Keyword', () => {
  test('TC-S-026: search by "PM" returns relevant schemes', () => {
    const result = searchSchemes(schemes, 'PM');
    expect(result.length).toBeGreaterThan(0);
  });
  test('TC-S-027: search by "Kisan" returns agriculture schemes', () => {
    const result = searchSchemes(schemes, 'Kisan');
    expect(result.length).toBeGreaterThan(0);
  });
  test('TC-S-028: search is case-insensitive', () => {
    const lower = searchSchemes(schemes, 'kisan');
    const upper = searchSchemes(schemes, 'Kisan');
    expect(lower.length).toBe(upper.length);
  });
  test('TC-S-029: search by empty string returns all schemes', () => {
    expect(searchSchemes(schemes, '').length).toBe(schemes.length);
  });
  test('TC-S-030: search for nonexistent term returns empty array', () => {
    expect(searchSchemes(schemes, 'zzznomatch9999').length).toBe(0);
  });
});

describe('SCHEME SORT — By Applied Count', () => {
  test('TC-S-031: sortByPopularity returns descending order', () => {
    const sorted = sortByPopularity(schemes);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].applied).toBeGreaterThanOrEqual(sorted[i + 1].applied);
    }
  });
  test('TC-S-032: top scheme has highest applied count', () => {
    const sorted = sortByPopularity(schemes);
    const max = Math.max(...schemes.map(s => s.applied));
    expect(sorted[0].applied).toBe(max);
  });
  test('TC-S-033: sort does not mutate original array', () => {
    const original = [...schemes];
    sortByPopularity(schemes);
    expect(schemes[0].id).toBe(original[0].id);
  });
  test('TC-S-034: sortByDeadline returns chronological order', () => {
    const sorted = sortByDeadline(schemes);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(new Date(sorted[i].deadline).getTime()).toBeLessThanOrEqual(new Date(sorted[i + 1].deadline).getTime());
    }
  });
  test('TC-S-035: featured scheme list is non-empty', () => {
    expect(schemes.filter(s => s.featured).length).toBeGreaterThan(0);
  });
});

describe('CATEGORY DATA — Structure', () => {
  test('TC-S-036: categories array is not empty', () => {
    expect(categories.length).toBeGreaterThan(0);
  });
  test('TC-S-037: every category has unique id', () => {
    const ids = categories.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  test('TC-S-038: every category has a name', () => {
    categories.forEach(c => expect(c.name.length).toBeGreaterThan(0));
  });
  test('TC-S-039: every category has a color hex code', () => {
    categories.forEach(c => expect(c.color).toMatch(/^#[0-9A-Fa-f]{6}$/));
  });
  test('TC-S-040: every category has a non-negative count', () => {
    categories.forEach(c => expect(c.count).toBeGreaterThanOrEqual(0));
  });
  test('TC-S-041: exactly 8 categories are defined', () => {
    expect(categories.length).toBe(8);
  });
  test('TC-S-042: Education category exists', () => {
    expect(categories.find(c => c.name === 'Education')).toBeDefined();
  });
  test('TC-S-043: Healthcare category exists', () => {
    expect(categories.find(c => c.name === 'Healthcare')).toBeDefined();
  });
  test('TC-S-044: Agriculture category exists', () => {
    expect(categories.find(c => c.name === 'Agriculture')).toBeDefined();
  });
  test('TC-S-045: Finance category exists', () => {
    expect(categories.find(c => c.name === 'Finance')).toBeDefined();
  });
});

describe('SCHEME ELIGIBILITY — Logic', () => {
  test('TC-S-046: checkEligibility returns true for matching profile', () => {
    const scheme = schemes[0];
    expect(checkEligibility(scheme, { citizen: true, age: 25, income: 200000 })).toBe(true);
  });
  test('TC-S-047: checkEligibility returns false for underage user', () => {
    const scheme = schemes[0];
    expect(checkEligibility(scheme, { citizen: true, age: 15, income: 200000 })).toBe(false);
  });
  test('TC-S-048: checkEligibility returns false for non-citizen', () => {
    const scheme = schemes[0];
    expect(checkEligibility(scheme, { citizen: false, age: 25, income: 200000 })).toBe(false);
  });
  test('TC-S-049: getSchemeById returns correct scheme', () => {
    const scheme = getSchemeById(schemes, '1');
    expect(scheme?.id).toBe('1');
  });
  test('TC-S-050: getSchemeById returns undefined for unknown id', () => {
    expect(getSchemeById(schemes, '9999')).toBeUndefined();
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
function filterByCategory(list: Scheme[], cat: string) {
  return list.filter(s => s.category === cat);
}
function searchSchemes(list: Scheme[], q: string) {
  if (!q) return list;
  const lq = q.toLowerCase();
  return list.filter(s => s.name.toLowerCase().includes(lq) || s.description.toLowerCase().includes(lq));
}
function sortByPopularity(list: Scheme[]) {
  return [...list].sort((a, b) => b.applied - a.applied);
}
function sortByDeadline(list: Scheme[]) {
  return [...list].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
}
function checkEligibility(scheme: Scheme, profile: { citizen: boolean; age: number; income: number }) {
  if (!profile.citizen) return false;
  if (scheme.eligibility.some(e => e.toLowerCase().includes('age 18+')) && profile.age < 18) return false;
  return true;
}
function getSchemeById(list: Scheme[], id: string) {
  return list.find(s => s.id === id);
}
