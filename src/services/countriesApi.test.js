import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchAllCountries,
  fetchCountryByName,
  searchCountries,
  filterByRegion,
} from "./countriesApi";

global.fetch = vi.fn();

describe("Countries API Service", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchAllCountries", () => {
    it("fetches all countries successfully", async () => {
      const mockCountries = [
        {
          name: { common: "Japan", official: "Japan" },
          flags: { png: "https://example.com/japan.png" },
          population: 125000000,
          region: "Asia",
          capital: ["Tokyo"],
        },
        {
          name: { common: "France", official: "French Republic" },
          flags: { png: "https://example.com/france.png" },
          population: 67000000,
          region: "Europe",
          capital: ["Paris"],
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCountries,
      });

      const result = await fetchAllCountries();

      expect(fetch).toHaveBeenCalledWith(
        "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3"
      );
      expect(result).toEqual(mockCountries);
    });

    it("throws error when API request fails", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(fetchAllCountries()).rejects.toThrow(
        "Failed to fetch countries"
      );
    });

    it("throws error when API returns non-ok response", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(fetchAllCountries()).rejects.toThrow(
        "Failed to fetch countries"
      );
    });
  });

  describe("fetchCountryByName", () => {
    it("fetches a specific country by name", async () => {
      const mockCountry = {
        name: { common: "Japan", official: "Japan" },
        flags: { png: "https://example.com/japan.png" },
        population: 125000000,
        region: "Asia",
        subregion: "Eastern Asia",
        capital: ["Tokyo"],
        languages: { jpn: "Japanese" },
        currencies: { JPY: { name: "Japanese yen", symbol: "¥" } },
        borders: ["CHN", "KOR", "RUS"],
        timezones: ["UTC+09:00"],
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockCountry],
      });

      const result = await fetchCountryByName("Japan");

      expect(fetch).toHaveBeenCalledWith(
        "https://restcountries.com/v3.1/name/Japan?fullText=true&fields=name,flags,population,region,subregion,capital,languages,currencies,borders,timezones,cca3"
      );
      expect(result).toEqual(mockCountry);
    });

    it("throws error when country is not found", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchCountryByName("NonExistentCountry")).rejects.toThrow(
        "Country not found"
      );
    });
  });

  describe("searchCountries", () => {
    it("searches countries by name", async () => {
      const mockResults = [
        { name: { common: "Japan" }, population: 125000000 },
        { name: { common: "Jamaica" }, population: 3000000 },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const result = await searchCountries("Ja");

      expect(fetch).toHaveBeenCalledWith(
        "https://restcountries.com/v3.1/name/Ja?fields=name,flags,population,region,capital,cca3"
      );
      expect(result).toEqual(mockResults);
    });

    it("returns empty array when no countries match", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await searchCountries("xyz");
      expect(result).toEqual([]);
    });
  });

  describe("filterByRegion", () => {
    it("filters countries by region", async () => {
      const mockResults = [
        { name: { common: "Japan" }, region: "Asia" },
        { name: { common: "China" }, region: "Asia" },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResults,
      });

      const result = await filterByRegion("asia");

      expect(fetch).toHaveBeenCalledWith(
        "https://restcountries.com/v3.1/region/asia?fields=name,flags,population,region,capital,cca3"
      );
      expect(result).toEqual(mockResults);
    });
  });
});
