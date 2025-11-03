import React, { useEffect, useState } from 'react';
import { api } from '../api';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ nom: '', prix: '', quantite: '' });
  const [editing, setEditing] = useState(null);

  const getProduits = async () => {
    const res = await api.get('/produits');
    setProduits(res.data);
  };

  useEffect(() => {
    getProduits();
  }, []);

  const saveProduit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/produits/${editing.id}`, form);
    } else {
      await api.post('/produits', form);
    }
    setForm({ nom: '', prix: '', quantite: '' });
    setEditing(null);
    getProduits();
  };

  const deleteProduit = async (id) => {
    await api.delete(`/produits/${id}`);
    getProduits();
  };

  const editProduit = (p) => {
    setEditing(p);
    setForm(p);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Gestion des Produits
        </h1>

        {/* Formulaire */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-10">
          <form onSubmit={saveProduit} className="grid md:grid-cols-3 gap-4 items-end">
            <input
              type="text"
              placeholder="Nom"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Prix"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={form.prix}
              onChange={e => setForm({ ...form, prix: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Quantité"
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={form.quantite}
              onChange={e => setForm({ ...form, quantite: e.target.value })}
              required
            />

            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {editing ? 'Modifier' : 'Ajouter'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(null); setForm({ nom: '', prix: '', quantite: '' }); }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-3 font-semibold">Nom</th>
                <th className="p-3 font-semibold">Prix</th>
                <th className="p-3 font-semibold">Quantité</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500 italic">
                    Aucun produit disponible.
                  </td>
                </tr>
              ) : (
                produits.map(p => (
                  <tr key={p.id} className="border-t hover:bg-blue-50 transition">
                    <td className="p-3">{p.nom}</td>
                    <td className="p-3">{p.prix} FCFA</td>
                    <td className="p-3">{p.quantite}</td>
                    <td className="p-3 text-center space-x-3">
                      <button onClick={() => editProduit(p)} className="text-blue-600 hover:text-blue-800">✏️</button>
                      <button onClick={() => deleteProduit(p.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Produits;
