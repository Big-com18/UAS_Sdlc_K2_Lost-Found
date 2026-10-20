import test from 'node:test';
import assert from 'node:assert/strict';
import { createSeedData } from '../src/data/seed.js';
import {
  approveClaim, createFoundItem, getItemCounts, getItemState, getPublicItem,
  getPublicItems, markReturned, rejectClaim, submitClaim,
} from '../src/utils/itemUtils.js';

const foundInput = {
  category: 'Tumbler / Botol Minum', color: 'Merah', brand: '', description: 'Tumbler merah',
  foundDate: '2026-10-18', foundTime: '', locationFound: 'Kantin', handedOverBy: 'Mahasiswa',
  storageLocation: 'Rak 4', highValue: false,
};
const state = (data, id) => getItemState(data, data.items.find((i) => i.id === id));

test('US1: petugas mencatat barang temuan lengkap dengan lokasi penyimpanan', () => {
  const data = createSeedData();
  assert.ok(createFoundItem(data, { ...foundInput, storageLocation: '' }).errors.storageLocation);
  const result = createFoundItem(data, foundInput);
  assert.equal(result.item.id, 'ITEM-010');
  assert.equal(result.data.items[0].storageLocation, 'Rak 4');
  assert.equal(createFoundItem(data, { ...foundInput, category: 'Laptop' }).item.highValue, true);
});

test('Mahasiswa mengajukan klaim: bukti wajib, high-value dapat kode klaim', () => {
  const data = createSeedData();
  assert.ok(submitClaim(data, 'ITEM-008', { claimantName: 'Rina', proofNotes: '' }).errors.proofNotes);

  const high = submitClaim(data, 'ITEM-008', { claimantName: 'Rina', proofNotes: 'Wallpaper kucing' }, 'ONLINE', new Date(), 'ABCD');
  assert.equal(high.claim.claimCode, 'CLM-008-ABCD');
  assert.equal(high.claim.status, 'PENDING');
  assert.equal(state(high.data, 'ITEM-008'), 'CLAIMED');

  const normal = submitClaim(data, 'ITEM-004', { claimantName: 'Rina', proofNotes: 'Payung abu' });
  assert.equal(normal.claim.claimCode, '');

  assert.equal(submitClaim(high.data, 'ITEM-008', { claimantName: 'rina', proofNotes: 'x' }).ok, false);
});

test('Petugas menyetujui atau menolak klaim', () => {
  let data = createSeedData();
  assert.equal(approveClaim(data, 'CLM-001', { verifierName: '', proofMatches: true }).ok, false);
  assert.equal(approveClaim(data, 'CLM-001', { verifierName: 'Ahmad', proofMatches: false }).ok, false);
  data = approveClaim(data, 'CLM-001', { verifierName: 'Ahmad', proofMatches: true }).data;
  assert.equal(data.claims.find((c) => c.id === 'CLM-001').status, 'APPROVED');
  assert.equal(state(data, 'ITEM-007'), 'VERIFIED');

  assert.equal(rejectClaim(data, 'CLM-001', { reason: '' }).ok, false);
  data = rejectClaim(data, 'CLM-001', { reason: 'Isi dompet tidak sesuai' }).data;
  assert.equal(data.claims.find((c) => c.id === 'CLM-001').status, 'REJECTED');
  assert.equal(state(data, 'ITEM-007'), 'STORED');
});

test('US6/US8: tidak bisa dikembalikan sebelum klaim disetujui', () => {
  let data = createSeedData();
  const blocked = markReturned(data, 'ITEM-008');
  assert.equal(blocked.ok, false);
  assert.match(blocked.error, /bernilai tinggi/);
  assert.equal(markReturned(data, 'ITEM-004').ok, false);
  assert.equal(markReturned(data, 'ITEM-007').ok, false); // klaim masih PENDING

  const returned = markReturned(data, 'ITEM-002', { handoverNotes: 'KTM dicek' });
  assert.equal(returned.ok, true);
  const item = returned.data.items.find((i) => i.id === 'ITEM-002');
  assert.equal(item.status, 'RETURNED');
  assert.equal(item.returnedTo, 'Budi');
  assert.equal(returned.data.claims.find((c) => c.id === 'CLM-002').status, 'RETURNED');
  assert.equal(markReturned(returned.data, 'ITEM-002').ok, false);
});

test('Klaim lain otomatis ditolak saat barang sudah dikembalikan', () => {
  let data = createSeedData();
  data = submitClaim(data, 'ITEM-002', { claimantName: 'Dina', proofNotes: 'Tumbler biru' }).data;
  const result = markReturned(data, 'ITEM-002');
  const dina = result.data.claims.find((c) => c.claimantName === 'Dina');
  assert.equal(dina.status, 'REJECTED');
  assert.match(dina.rejectReason, /pengklaim lain/);
});

test('Tampilan mahasiswa hanya memuat field publik', () => {
  const { items } = createSeedData();
  assert.deepEqual(Object.keys(getPublicItem(items[1])).sort(), ['category', 'foundDate', 'highValue', 'id']);
  assert.equal(getPublicItem(items[0]).category, 'Barang bernilai tinggi');
  const serialized = JSON.stringify(getPublicItems(items));
  ['Tupperware', 'Rak', 'Brankas', 'stiker', 'Kantin'].forEach((secret) => assert.ok(!serialized.includes(secret)));
});

test('Ringkasan angka konsisten', () => {
  const counts = getItemCounts(createSeedData());
  assert.equal(counts.total, 9);
  assert.equal(counts.claimed, 1);
  assert.equal(counts.verified, 1);
  assert.equal(counts.pendingClaims, 1);
  assert.equal(counts.myClaims, 1);
});
