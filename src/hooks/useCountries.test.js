import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useCountries } from "./useCountries";
import * as countriesApi from "../services/countriesApi";

vi.mock("../services/countriesApi");

describe("useCountries Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads all countries on initial render", async () => {
    const mockCountries = [
      { name: { common: "Japan" }, cca3: "JPN" },
      { name: { common: "France" }, cca3: "FRA" },
    ];

    countriesApi.fetchAllCountries.mockResolvedValue(mockCountries);
    const { result } = renderHook(() => useCountries());

    expect(result.current.loading).toBe(true);
    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe(null);


    await waitFor(() => {
      expect(result.current.loading).toBe(false);
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
    const initialCountries = [
      { name: { common: "Japan" }, cca3: "JPN" },
      { name: { common: "France" }, cca3: "FRA" },
    ];

    const mockSearchResults = [{ name: { common: "Japan" }, cca3: "JPN" }];

    countriesApi.fetchAllCountries.mockResolvedValue(initialCountries);
    countriesApi.searchCountries.mockResolvedValue(mockSearchResults);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual(initialCountries);

    await act(async () => {
      await result.current.searchCountries("Japan");
    });

    await waitFor(() => {
      expect(result.current.countries).toEqual(mockSearchResults);
    });

    expect(countriesApi.searchCountries).toHaveBeenCalledWith("Japan");
  });

  it("filters countries by region", async () => {
    const initialCountries = [
      { name: { common: "Japan" }, cca3: "JPN" },
      { name: { common: "France" }, cca3: "FRA" },
    ];

    const mockFilterResults = [{ name: { common: "Japan" }, region: "Asia" }];

    countriesApi.fetchAllCountries.mockResolvedValue(initialCountries);
    countriesApi.filterByRegion.mockResolvedValue(mockFilterResults);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual(initialCountries);

    await act(async () => {
      await result.current.filterByRegion("asia");
    });

    await waitFor(() => {
      expect(result.current.countries).toEqual(mockFilterResults);
    });

    expect(countriesApi.filterByRegion).toHaveBeenCalledWith("asia");
  });

  it("resets to all countries when search term is empty", async () => {
    const allCountries = [
      { name: { common: "Japan" }, cca3: "JPN" },
      { name: { common: "France" }, cca3: "FRA" },
    ];

    countriesApi.fetchAllCountries.mockResolvedValue(allCountries);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.searchCountries("");
    });

    await waitFor(() => {
      expect(result.current.countries).toEqual(allCountries);
    });

    // Should call fetchAllCountries twice (initial + reset)
    expect(countriesApi.fetchAllCountries).toHaveBeenCalledTimes(2);
  });

  it("resets to all countries when region filter is cleared", async () => {
    const allCountries = [
      { name: { common: "Japan" }, cca3: "JPN" },
      { name: { common: "France" }, cca3: "FRA" },
    ];

    countriesApi.fetchAllCountries.mockResolvedValue(allCountries);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.filterByRegion("");
    });

    await waitFor(() => {
      expect(result.current.countries).toEqual(allCountries);
    });

    expect(countriesApi.fetchAllCountries).toHaveBeenCalledTimes(2);
  });
});
