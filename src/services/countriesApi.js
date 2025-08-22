const BASE_URL = "https://restcountries.com/v3.1";
const LIST_FIELDS = "name,flags,population,region,capital,cca3";
const DETAIL_FIELDS =
  "name,flags,population,region,subregion,capital,languages,currencies,borders,timezones,cca3";

export async function fetchAllCountries() {
  try {
    const response = await fetch(`${BASE_URL}/all?fields=${LIST_FIELDS}`);

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch countries");
  }
}

export async function fetchCountryByName(name) {
  try {
    const response = await fetch(
      `${BASE_URL}/name/${name}?fullText=true&fields=${DETAIL_FIELDS}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Country not found");
      }
      throw new Error("Failed to fetch country");
    }

    const countries = await response.json();
    return countries[0];
  } catch (error) {
    if (error.message === "Country not found") {
      throw error;
    }
    throw new Error("Failed to fetch country");
  }
}

export async function searchCountries(searchTerm) {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/name/${searchTerm}?fields=${LIST_FIELDS}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No countries found
      }
      throw new Error("Search failed");
    }

    return await response.json();
  } catch (error) {
    if (error.message === "Search failed") {
      throw error;
    }
    return []; 
  }
}

export async function filterByRegion(region) {
  try {
    const response = await fetch(
      `${BASE_URL}/region/${region}?fields=${LIST_FIELDS}`
    );

    if (!response.ok) {
      throw new Error("Failed to filter by region");
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to filter by region");
  }
}

export async function fetchCountryByCode(code) {
  try {
    const response = await fetch(
      `${BASE_URL}/alpha/${code}?fields=${DETAIL_FIELDS}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Country not found");
      }
      throw new Error("Failed to fetch country");
    }

    const countries = await response.json();
    return Array.isArray(countries) ? countries[0] : countries;
  } catch (error) {
    if (error.message === "Country not found") {
      throw error;
    }
    throw new Error("Failed to fetch country");
  }
}
