import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Home } from "./Home";
import * as countriesApi from "../services/countriesApi";

vi.mock("../services/countriesApi");

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByText("Countries Explorer")).toBeInTheDocument();
  });
  it("renders the welcome message", () => {
    render(<Home />);
    expect(
      screen.getByText(
        "Discover amazing facts, cultures, and information about countries from around the world"
      )
    ).toBeInTheDocument();
  });
  it("has the correct page structure", () => {
    render(<Home />);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
  it("renders without crashing", () => {
    render(<Home />);
  });
  it("renders a header section", () => {
    render(<Home />);
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });
  it("renders a countries list section", () => {
    render(<Home />);
    const countriesSection = screen.getByTestId("countries-section");
    expect(countriesSection).toBeInTheDocument();
  });
  it("has proper HTML structure", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});

describe("Home Component Search", () => {
  it("renders a search input", () => {
    render(<Home />);
    const searchInput = screen.getByPlaceholderText(/Search countries/i);
    expect(searchInput).toBeInTheDocument();
  });
  it("renders a region filter", () => {
    render(<Home />);
    const regionFilter = screen.getByLabelText(/filter by region/i);
    expect(regionFilter).toBeInTheDocument();
  });
});

describe("Home Component Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with loading state initially", () => {
    countriesApi.fetchAllCountries.mockResolvedValue([]);

    render(<Home />);

    expect(screen.getByText("Countries Explorer")).toBeInTheDocument();
    expect(screen.getByText(/discover amazing facts/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search countries/i)
    ).toBeInTheDocument();
  });

  it("displays countries after loading", async () => {
    const mockCountries = [
      {
        name: { common: "Japan" },
        flags: { png: "https://example.com/japan.png" },
        population: 125000000,
        region: "Asia",
        capital: ["Tokyo"],
        cca3: "JPN",
      },
      {
        name: { common: "France" },
        flags: { png: "https://example.com/france.png" },
        population: 67000000,
        region: "Europe",
        capital: ["Paris"],
        cca3: "FRA",
      },
    ];

    countriesApi.fetchAllCountries.mockResolvedValue(mockCountries);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Japan")).toBeInTheDocument();
    });

    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.queryByText(/ready to explore/i)).not.toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    countriesApi.fetchAllCountries.mockRejectedValue(new Error("API Error"));

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load countries/i)).toBeInTheDocument();
    });
  });

  it("searches countries when typing in search input", async () => {
    const user = userEvent.setup();

    // Initial load
    countriesApi.fetchAllCountries.mockResolvedValue([]);
    // Search result
    countriesApi.searchCountries.mockResolvedValue([
      {
        name: { common: "Japan" },
        flags: { png: "https://example.com/japan.png" },
        population: 125000000,
        region: "Asia",
        capital: ["Tokyo"],
        cca3: "JPN",
      },
    ]);

    render(<Home />);

    const searchInput = screen.getByPlaceholderText(/search countries/i);
    await user.type(searchInput, "Japan");

    // Wait for debounce delay (300ms) plus some buffer
    await waitFor(
      () => {
        expect(countriesApi.searchCountries).toHaveBeenCalledWith("Japan");
      },
      { timeout: 1000 }
    );
  });

  it("filters countries when selecting a region", async () => {
    const user = userEvent.setup();

    // Initial load
    countriesApi.fetchAllCountries.mockResolvedValue([]);
    // Filter result
    countriesApi.filterByRegion.mockResolvedValue([
      {
        name: { common: "Japan" },
        region: "Asia",
        cca3: "JPN",
      },
    ]);

    render(<Home />);

    const regionSelect = screen.getByLabelText(/filter by region/i);
    await user.selectOptions(regionSelect, "asia");

    await waitFor(() => {
      expect(countriesApi.filterByRegion).toHaveBeenCalledWith("asia");
    });
  });

  it("contains search filter component", () => {
    render(<Home />);
    expect(
      screen.getByPlaceholderText(/search countries/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by region/i)).toBeInTheDocument();
  });
});
