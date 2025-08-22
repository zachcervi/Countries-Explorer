import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountryList } from "./CountryList";

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
    render(<CountryList countries={[]} loading={true} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText("Japan")).not.toBeInTheDocument();
  });

  it("renders countries when provided", () => {
    render(<CountryList countries={mockCountries} loading={false} />);

    expect(screen.getByText("Japan")).toBeInTheDocument();
    expect(screen.getByText("France")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("shows empty state when no countries and not loading", () => {
    render(<CountryList countries={[]} loading={false} />);

    expect(screen.getByText(/no countries found/i)).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("renders the correct number of countries", () => {
    render(<CountryList countries={mockCountries} loading={false} />);

    const countryCards = screen.getAllByTestId("country-card");
    expect(countryCards).toHaveLength(2);
  });

  it("has accessible list structure", () => {
    render(<CountryList countries={mockCountries} loading={false} />);

    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);
  });
});
