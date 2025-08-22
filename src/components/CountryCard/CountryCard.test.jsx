import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CountryCard } from "./CountryCard";

describe("CountryCard Component", () => {
  const mockCountry = {
    name: { common: "Japan" },
    flags: { png: "https://example.com/japan.png", alt: "Flag of Japan" },
    population: 125000000,
    region: "Asia",
    capital: ["Tokyo"],
    cca3: "JPN",
  };

  it("renders country information correctly", () => {
    render(<CountryCard country={mockCountry} />);

    expect(screen.getByText("Japan")).toBeInTheDocument();
    expect(screen.getByText("Asia")).toBeInTheDocument();
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("125,000,000")).toBeInTheDocument();
  });

  it("renders country flag with proper alt text", () => {
    render(<CountryCard country={mockCountry} />);

    const flag = screen.getByRole("img");
    expect(flag).toHaveAttribute("src", "https://example.com/japan.png");
    expect(flag).toHaveAttribute("alt", "Flag of Japan");
  });

  it("handles missing capital gracefully", () => {
    const countryWithoutCapital = {
      ...mockCountry,
      capital: undefined,
    };

    render(<CountryCard country={countryWithoutCapital} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("handles multiple capitals", () => {
    const countryWithMultipleCapitals = {
      ...mockCountry,
      capital: ["Pretoria", "Cape Town", "Bloemfontein"],
    };

    render(<CountryCard country={countryWithMultipleCapitals} />);

    expect(
      screen.getByText("Pretoria, Cape Town, Bloemfontein")
    ).toBeInTheDocument();
  });

  it("formats large population numbers correctly", () => {
    const countryWithLargePopulation = {
      ...mockCountry,
      population: 1439323776, // China's population
    };

    render(<CountryCard country={countryWithLargePopulation} />);

    expect(screen.getByText("1,439,323,776")).toBeInTheDocument();
  });

  it("is clickable and has proper accessibility", () => {
    const mockOnClick = vi.fn();

    render(<CountryCard country={mockCountry} onClick={mockOnClick} />);

    const card = screen.getByRole("button");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("aria-label", "View details for Japan");
  });

  it("calls onClick when card is clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<CountryCard country={mockCountry} onClick={mockOnClick} />);

    const card = screen.getByRole("button");
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledWith(mockCountry);
  });
});
