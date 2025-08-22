import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { CountryDetails } from "./CountryDetails";
import * as countriesApi from "../services/countriesApi";

vi.mock("../services/countriesApi");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ code: "JPN" }),
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("CountryDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    countriesApi.fetchCountryByName.mockImplementation(
      () => new Promise(() => {})
    );

    renderWithRouter(<CountryDetails />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByText(/loading country details/i)).toBeInTheDocument();
  });

  it("displays country details after loading", async () => {
    const mockCountry = {
      name: {
        common: "Japan",
        official: "Japan",
        nativeName: { jpn: { common: "日本", official: "日本国" } },
      },
      flags: { png: "https://example.com/japan.png", alt: "Flag of Japan" },
      population: 125000000,
      region: "Asia",
      subregion: "Eastern Asia",
      capital: ["Tokyo"],
      languages: { jpn: "Japanese" },
      currencies: { JPY: { name: "Japanese yen", symbol: "¥" } },
      borders: ["CHN", "KOR", "RUS"],
      timezones: ["UTC+09:00"],
      cca3: "JPN",
    };

    countriesApi.fetchCountryByName.mockResolvedValue(mockCountry);

    renderWithRouter(<CountryDetails />);

    await waitFor(() => {
      expect(screen.getByText("Japan")).toBeInTheDocument();
    });

    expect(screen.getByText("125,000,000")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
    expect(screen.getByText("Eastern Asia")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("Japanese")).toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    countriesApi.fetchCountryByName.mockRejectedValue(
      new Error("Country not found")
    );

    renderWithRouter(<CountryDetails />);

    await waitFor(() => {
      expect(screen.getByText(/country not found/i)).toBeInTheDocument();
    });
  });

  it("navigates back when back button is clicked", async () => {
    const user = userEvent.setup();
    const mockCountry = {
      name: { common: "Japan" },
      flags: { png: "https://example.com/japan.png" },
      population: 125000000,
      region: "Asia",
      cca3: "JPN",
    };

    countriesApi.fetchCountryByName.mockResolvedValue(mockCountry);

    renderWithRouter(<CountryDetails />);

    await waitFor(() => {
      expect(screen.getByText("Japan")).toBeInTheDocument();
    });

    const backButton = screen.getByText(/back to countries/i);
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
