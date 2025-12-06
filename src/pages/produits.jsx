import React, { useEffect, useState } from 'react';
import { api } from '../api';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ nom: '', prix: '', quantite: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Récupérer tous les produits
  const getProduits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/produits');
      setProduits(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err);
      setError('Impossible de récupérer les produits');
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduits();
  }, []);

  // Ajouter ou modifier un produit
  const saveProduit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Convertir prix et quantite en nombres pour Laravel
      const payload = {
        nom: form.nom,
        prix: Number(form.prix),
        quantite: Number(form.quantite),
      };

      if (editing) {
        await api.put(`/produits/${editing.id}`, payload);
      } else {
        await api.post('/produits', payload);
      }

      setForm({ nom: '', prix: '', quantite: '' });
      setEditing(null);
      await getProduits();
      setError('');
      setLoading(false);
    } catch (err) {
      console.error(err.response?.data || err);
      if (err.response?.data?.message) {
        setError(`Erreur : ${err.response.data.message}`);
      } else {
        setError('Erreur lors de l\'enregistrement du produit');
      }
      setLoading(false);
    }
  };

  // Supprimer un produit
  const deleteProduit = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      setLoading(true);
      await api.delete(`/produits/${id}`);
      await getProduits();
      setLoading(false);
      setError('');
    } catch (err) {
      console.error(err.response?.data || err);
      setError('Erreur lors de la suppression');
      setLoading(false);
    }
  };

  // Préparer l’édition
  const editProduit = (p) => {
    setEditing(p);
    setForm({ nom: p.nom, prix: p.prix, quantite: p.quantite });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Gestion des Produits Pharmaceutique
        </h1>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {loading && <p className="text-gray-600 mb-4 text-center">Chargement...</p>}

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
