import { useState } from 'react';
import Field from './Field.jsx';

// Pengajuan klaim. Mahasiswa: nama dari header (askName = false). Petugas: klaim langsung di pos (askName = true).
export default function ClaimForm({ onSubmit, askName = false, highValue = false }) {
  const [form, setForm] = useState({ claimantName: '', proofNotes: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  function handleSubmit(event) {
    event.preventDefault();
    const result = onSubmit(form);
    if (result.ok) {
      setForm({ claimantName: '', proofNotes: '' });
      setErrors({});
      setMessage({
        type: 'success',
        text: result.claim.claimCode
          ? `Klaim terkirim. Kode klaim: ${result.claim.claimCode}. Sebutkan kode ini ke petugas saat verifikasi.`
          : 'Klaim terkirim. Petugas akan memverifikasi bukti kepemilikan.',
      });
    } else {
      setErrors(result.errors ?? {});
      setMessage({ type: 'error', text: result.error });
    }
  }

  return (
    <form className="form compact" onSubmit={handleSubmit} noValidate>
      <h3>{askName ? 'Catat klaim langsung (di pos)' : 'Ajukan klaim barang ini'}</h3>
      {highValue && (
        <p className="notice warning">
          Barang bernilai tinggi: sebutkan ciri-ciri atau isi barang sedetail mungkin. Barang baru diserahkan setelah petugas memverifikasi.
        </p>
      )}
      {message.text && <p className={message.type === 'error' ? 'form-error' : 'form-success'} role="alert">{message.text}</p>}
      {askName && (
        <Field id="cf-name" label="Nama pengklaim *" error={errors.claimantName}>
          <input id="cf-name" value={form.claimantName} onChange={(e) => setForm({ ...form, claimantName: e.target.value })} />
        </Field>
      )}
      {!askName && errors.claimantName && <p className="field-error" role="alert">{errors.claimantName}</p>}
      <Field id="cf-proof" label="Ciri-ciri / isi barang (bukti kepemilikan) *" error={errors.proofNotes} hint="mis. isi dompet, ciri khusus yang tidak mudah diketahui orang lain.">
        <textarea id="cf-proof" rows={3} value={form.proofNotes} onChange={(e) => setForm({ ...form, proofNotes: e.target.value })} />
      </Field>
      <button className="primary-button" type="submit">{askName ? 'Catat Klaim' : 'Kirim Klaim'}</button>
    </form>
  );
}
