import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountryList } from "./CountryList";
import { BrowserRouter } from "react-router-dom";


const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};


describe("CountryList Component", () => {
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

  it("shows loading state when loading is true", () => {
    renderWithRouter(<CountryList countries={[]} loading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText("Japan")).not.toBeInTheDocument();
  });

  it("renders countries when provided", () => {
    renderWithRouter(<CountryList countries={mockCountries} loading={false} />);

    expect(screen.getByText("Japan")).toBeInTheDocument();
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("shows empty state when no countries and not loading", () => {
    renderWithRouter(<CountryList countries={[]} loading={false} />);

    expect(screen.getByText(/no countries found/i)).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("renders the correct number of countries", () => {
    renderWithRouter(<CountryList countries={mockCountries} loading={false} />);

    const countryCards = screen.getAllByTestId("country-card");
    expect(countryCards).toHaveLength(2);
  });

  it("has accessible list structure", () => {
    renderWithRouter(<CountryList countries={mockCountries} loading={false} />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });
});
