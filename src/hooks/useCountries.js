import { useState, useEffect, useCallback } from "react";
import {
  fetchAllCountries,
  searchCountries as apiSearchCountries,
  filterByRegion as apiFilterByRegion,
} from "../services/countriesApi";

export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllCountries();
        setCountries(data);
      } catch (err) {
        setError("Failed to load countries");
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  // Search countries
  const searchCountries = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      // If empty search, reload all countries
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        setCountries(data);
      } catch (err) {
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiSearchCountries(searchTerm);
      setCountries(data);
    } catch (err) {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter by region
  const filterByRegion = useCallback(async (region) => {
    if (!region) {
      // If no region selected, reload all countries
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        setCountries(data);
      } catch (err) {
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiFilterByRegion(region);
      setCountries(data);
    } catch (err) {
      setError("Filter failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    countries,
    loading,
    error,
    searchCountries,
    filterByRegion,
  };
}
