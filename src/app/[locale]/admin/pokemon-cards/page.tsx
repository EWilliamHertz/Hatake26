'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface TCGDexCard {
  id: string;
  name: string;
  imageUrl: string;
  setCode: string;
  setName: string;
  cardNumber: string;
  rarity?: string;
  tcgdexId: string;
}

interface TCGDexSet {
  id: string;
  name: string;
}

export default function PokemonCardsAdmin() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [searchResults, setSearchResults] = useState<TCGDexCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<TCGDexCard | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [stockInput, setStockInput] = useState('1');
  const [submitting, setSubmitting] = useState(false);
  const [sets, setSets] = useState<TCGDexSet[]>([]);
  const [loadingSets, setLoadingSets] = useState(true);

  // Fetch available sets on mount
  React.useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoadingSets(true);
      const response = await fetch('https://api.tcgdex.net/v2/en/sets');
        const data = await response.json();
        setSets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch sets:', err);
      } finally {
        setLoadingSets(false);
      }
    };

    fetchSets();
  }, []);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSelectedCard(null);

    try {
      const params = new URLSearchParams();
      params.append('q', searchQuery);
      if (selectedSet) {
        params.append('setId', selectedSet);
      }

      const response = await fetch(`/api/tcgdex/search?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      setSearchResults(data.cards || []);

      if (data.cards.length === 0) {
        setError('No cards found');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Search failed';
      setError(errorMsg);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSet]);

  const handleAddCard = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCard || !priceInput) {
      setError('Please select a card and enter a price');
      return;
    }

    const price = parseFloat(priceInput);
    const stock = parseInt(stockInput) || 1;

    if (isNaN(price) || price < 0) {
      setError('Invalid price');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedCard.name,
          // Ensure we send a placeholder to the API if the TCGDex image is missing
          imageUrl: selectedCard.imageUrl || '/placeholder.png',
          images: [selectedCard.imageUrl || '/placeholder.png'],
          category: 'POKEMON',
          isSingle: true,
          tcgdexId: selectedCard.tcgdexId,
          setCode: selectedCard.setCode,
          edition: `${selectedCard.setName} #${selectedCard.cardNumber}`,
          price,
          stock,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Look for exact API details first, then fallback to standard error
        throw new Error(result.details || result.error || 'Failed to add card');
      }

      alert(`Card added successfully! ID: ${result.id}`);
      setSelectedCard(null);
      setPriceInput('');
      setStockInput('1');
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to add card';
      setError(errorMsg);
      console.error('Add card error:', err);
    } finally {
      setSubmitting(false);
    }
  }, [selectedCard, priceInput, stockInput]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-slate-900">Add Pokémon Cards</h1>
        <p className="text-slate-600 mb-8">Search TCGDex and add individual Pokémon singles to your catalog with custom pricing.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Search TCGDex</h2>

              {/* Set Filter */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Filter by Set (Optional)
                </label>
                <select
                  value={selectedSet}
                  onChange={(e) => setSelectedSet(e.target.value)}
                  disabled={loadingSets}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                >
                  <option value="">All Sets</option>
                  {sets.map((set) => (
                    <option key={set.id} value={set.id}>
                      {set.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Card Name
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Pikachu, Charizard, Mewtwo..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-slate-400"
              >
                {loading ? 'Searching...' : 'Search Cards'}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {searchResults.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setSelectedCard(card);
                      setPriceInput('');
                      setStockInput('1');
                    }}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition transform hover:scale-105 ${
                      selectedCard?.id === card.id
                        ? 'border-green-500 ring-2 ring-green-300'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="aspect-[2.5/3.5] bg-slate-100 relative">
                      <Image
                        src={card.imageUrl || '/placeholder.png'}
                        alt={card.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2 bg-white">
                      <p className="text-xs font-semibold text-slate-700 truncate">{card.name}</p>
                      <p className="text-xs text-slate-500">{card.setCode}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Card Form */}
          {selectedCard && (
            <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Add Card</h2>

              {/* Card Preview */}
              <div className="mb-6">
                <div className="aspect-[2.5/3.5] bg-slate-100 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={selectedCard.imageUrl || '/placeholder.png'}
                    alt={selectedCard.name}
                    width={200}
                    height={280}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{selectedCard.name}</h3>
                  <p className="text-sm text-slate-600 mb-1">{selectedCard.setName}</p>
                  <p className="text-sm text-slate-600 mb-3">Card #{selectedCard.cardNumber}</p>
                  {selectedCard.rarity && (
                    <p className="text-xs text-slate-500 mb-3">
                      <strong>Rarity:</strong> {selectedCard.rarity}
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={handleAddCard}>
                {/* Price Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price (SEK)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="49.99"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Stock Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={stockInput}
                    onChange={(e) => setStockInput(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-slate-400"
                >
                  {submitting ? 'Adding...' : 'Add to Catalog'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCard(null);
                    setPriceInput('');
                    setStockInput('1');
                  }}
                  className="w-full mt-2 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
