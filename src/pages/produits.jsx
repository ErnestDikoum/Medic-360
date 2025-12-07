"use client";

import React, { useEffect, useState } from "react";
import { api } from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ nom: "", prix: "", quantite: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Récupérer tous les produits
  const getProduits = async () => {
    try {
      setLoading(true);
      const res = await api.get("/produits");
      setProduits(res.data);
    } catch (err) {
      toast.error("Impossible de récupérer les produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduits();
  }, []);

  // 🔹 Ajouter ou modifier un produit
  const saveProduit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editing) {
        await api.put(`/produits/${editing.id}`, form);
        toast.success("Produit modifié avec succès !");
      } else {
        await api.post("/produits", form);
        toast.success("Produit ajouté avec succès !");
      }
      setForm({ nom: "", prix: "", quantite: "" });
      setEditing(null);
      getProduits();
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement du produit");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Supprimer un produit
  const deleteProduit = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      setLoading(true);
      await api.delete(`/produits/${id}`);
      toast.success("Produit supprimé !");
      getProduits();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Préparer l’édition
  const editProduit = (p) => {
    setEditing(p);
    setForm({ nom: p.nom, prix: p.prix, quantite: p.quantite });
  };

  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">
          Gestion des Produits Pharmaceutiques
        </h1>

        {/* Formulaire */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
          <form
            onSubmit={saveProduit}
            className="grid md:grid-cols-4 gap-4 items-end"
          >
            <input
              type="text"
              placeholder="Nom"
              className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Prix (FCFA)"
              className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Quantité"
              className="border p-3 rounded-md w-full focus:ring-2 focus:ring-green-400 focus:outline-none"
              value={form.quantite}
              onChange={(e) => setForm({ ...form, quantite: e.target.value })}
              required
            />

            <div className="flex gap-2 md:col-span-1">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold w-full"
              >
                {editing ? "Modifier" : "Ajouter"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({ nom: "", prix: "", quantite: "" });
                  }}
                  className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition font-semibold w-full"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-100 text-green-800">
              <tr>
                <th className="p-4 font-semibold">Nom</th>
                <th className="p-4 font-semibold">Prix</th>
                <th className="p-4 font-semibold">Quantité</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-6 text-center text-gray-500 italic"
                  >
                    Aucun produit disponible.
                  </td>
                </tr>
              ) : (
                produits.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-green-50 transition"
                  >
                    <td className="p-4">{p.nom}</td>
                    <td className="p-4">{p.prix} FCFA</td>
                    <td className="p-4">{p.quantite}</td>
                    <td className="p-4 text-center space-x-3">
                      <button
                        onClick={() => editProduit(p)}
                        className="text-blue-600 hover:text-blue-800 text-lg"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteProduit(p.id)}
                        className="text-red-600 hover:text-red-800 text-lg"
                      >
                        🗑️
                      </button>
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
