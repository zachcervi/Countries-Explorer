import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCountries } from "./useCountries";
import * as countriesApi from "../services/countriesApi";

vi.mock("../services/countriesApi");

describe("useCountries Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads all counties on initial render", async () => {
    const mockCountries = [
      { name: { common: "Japan" }, cca3: "JPN" },
      { name: { common: "France" }, cca3: "FRA" },
    ];

    countriesApi.fetchAllCountries.mockResolvedValue(mockCountries);
    const { result } = renderHook(() => useCountries());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.countries).toEqual([]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.error).toBe(null);
    expect(countriesApi.fetchAllCountries).toHaveBeenCalledTimes(1);
  });

  it("handles API errors gracefully", async () => {
    countriesApi.fetchAllCountries.mockRejectedValue(new Error("API Error"));

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe("Failed to load countries");
  });

  it("searches countries when search term is provided", async () => {
    const mockSearchResults = [{ name: { common: "Japan" }, cca3: "JPN" }];

    countriesApi.searchCountries.mockResolvedValue(mockSearchResults);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.searchCountries("Japan");

    expect(result.current.countries).toEqual(mockSearchResults);
    expect(countriesApi.searchCountries).toHaveBeenCalledWith("Japan");
  });
  it("filters countries by region", async () => {
    const mockFilterResults = [{ name: { common: "Japan" }, region: "Asia" }];

    countriesApi.filterByRegion.mockResolvedValue(mockFilterResults);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.filterByRegion("asia");

    expect(result.current.countries).toEqual(mockFilterResults);
    expect(countriesApi.filterByRegion).toHaveBeenCalledWith("asia");
  });
});
