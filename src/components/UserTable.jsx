// src/components/UserTable.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UserTable({ users, onRefresh }) {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .insert([{ email: newEmail, full_name: newName, role: 'member' }]);
      
    if (error) setError(error.message);
    else { setNewEmail(''); setNewName(''); onRefresh(); }
    setLoading(false);
  }

  async function handleDelete(id) {
    // Note: Normalement on supprime via auth.admin côté serveur
    await supabase.from('profiles').delete().eq('id', id);
    onRefresh();
  }

  return (
    <div>
      {/* Formulaire de création */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input placeholder="Email" type="email" value={newEmail}
          onChange={e => setNewEmail(e.target.value)} required
          style={inputStyle} />
        <input placeholder="Nom complet" value={newName}
          onChange={e => setNewName(e.target.value)} required style={inputStyle} />
        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? '...' : '➕ Ajouter'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Tableau */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F1F5F9', textAlign: 'left' }}>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Nom</th>
            <th style={thStyle}>Rôle</th>
            <th style={thStyle}>Créé le</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.full_name || '-'}</td>
              <td style={tdStyle}>{u.role}</td>
              <td style={tdStyle}>
                {new Date(u.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleDelete(u.id)}
                  style={{ background: '#EF4444', color: 'white', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && <p style={{ textAlign: 'center', color: '#64748B' }}>
        Aucun utilisateur pour l'instant.</p>}
    </div>
  );
}

const thStyle = { padding: '0.75rem 1rem', textAlign: 'left' };
const tdStyle = { padding: '0.75rem 1rem', borderBottom: '1px solid #E2E8F0' };
const inputStyle = { padding: '0.5rem 0.75rem', border: '1px solid #CBD5E1', borderRadius: '4px', fontSize: '0.9rem' };
const btnStyle = { padding: '0.5rem 1rem', background: '#1A8C82', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };