import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { CountryCard } from "./CountryCard";

// Mock useNavigate
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

describe("CountryCard Component", () => {
  const mockCountry = {
    name: { common: "Japan" },
    flags: { png: "https://example.com/japan.png", alt: "Flag of Japan" },
    population: 125000000,
    region: "Asia",
    capital: ["Tokyo"],
    cca3: "JPN",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders country name correctly", () => {
    renderWithRouter(<CountryCard country={mockCountry} />);
    expect(screen.getByText("Japan")).toBeInTheDocument();
  });

  it("renders country flag with proper alt text", () => {
    renderWithRouter(<CountryCard country={mockCountry} />);

    const flag = screen.getByRole("img");
    expect(flag).toHaveAttribute("src", "https://example.com/japan.png");
    expect(flag).toHaveAttribute("alt", "Flag of Japan");
  });

  it("does not render population, region, or capital details", () => {
    renderWithRouter(<CountryCard country={mockCountry} />);

    // These should not be visible in the simplified card
    expect(screen.queryByText("Asia")).not.toBeInTheDocument();
    expect(screen.queryByText("Tokyo")).not.toBeInTheDocument();
    expect(screen.queryByText("125,000,000")).not.toBeInTheDocument();
  });

  it("handles missing flag data gracefully", () => {
    const countryWithoutFlag = {
      ...mockCountry,
      flags: undefined,
    };

    renderWithRouter(<CountryCard country={countryWithoutFlag} />);

    expect(screen.getByText("No flag available")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("falls back to SVG when PNG is not available", () => {
    const countryWithSvgOnly = {
      ...mockCountry,
      flags: {
        svg: "https://example.com/japan.svg",
        alt: "Flag of Japan",
      },
    };

    renderWithRouter(<CountryCard country={countryWithSvgOnly} />);

    const flag = screen.getByRole("img");
    expect(flag).toHaveAttribute("src", "https://example.com/japan.svg");
  });

  it("shows placeholder when flag URL is empty", () => {
    const countryWithEmptyFlag = {
      ...mockCountry,
      flags: { png: "", svg: "" },
    };

    renderWithRouter(<CountryCard country={countryWithEmptyFlag} />);

    expect(screen.getByText("No flag available")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("is clickable and has proper accessibility", () => {
    renderWithRouter(<CountryCard country={mockCountry} />);

    const card = screen.getByRole("button");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("aria-label", "View details for Japan");
  });

  it("navigates to country details when clicked", async () => {
    const user = userEvent.setup();

    renderWithRouter(<CountryCard country={mockCountry} />);

    const card = screen.getByRole("button");
    await user.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/country/JPN");
  });

  it("navigates to country details when Enter key is pressed", async () => {
    const user = userEvent.setup();

    renderWithRouter(<CountryCard country={mockCountry} />);

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard("{Enter}");

    expect(mockNavigate).toHaveBeenCalledWith("/country/JPN");
  });

  it("navigates to country details when Space key is pressed", async () => {
    const user = userEvent.setup();

    renderWithRouter(<CountryCard country={mockCountry} />);

    const card = screen.getByRole("button");
    card.focus();
    await user.keyboard(" ");

    expect(mockNavigate).toHaveBeenCalledWith("/country/JPN");
  });

  it("handles missing country name gracefully", () => {
    const countryWithoutName = {
      ...mockCountry,
      name: undefined,
    };

    renderWithRouter(<CountryCard country={countryWithoutName} />);

    expect(screen.getByText("Unknown Country")).toBeInTheDocument();
  });

  it("handles completely missing country data", () => {
    renderWithRouter(<CountryCard country={null} />);

    expect(screen.getByText("Unknown Country")).toBeInTheDocument();
    expect(screen.getByText("No flag available")).toBeInTheDocument();
  });

  it("handles image load errors gracefully", () => {
    renderWithRouter(<CountryCard country={mockCountry} />);

    const flag = screen.getByRole("img");

    const errorEvent = new Event("error");
    flag.dispatchEvent(errorEvent);

    expect(flag.style.display).toBe("none");
  });

  it("retries with PNG when SVG fails to load", () => {
    const countryWithBothFlags = {
      ...mockCountry,
      flags: {
        svg: "https://example.com/japan.svg",
        png: "https://example.com/japan.png",
        alt: "Flag of Japan",
      },
    };

    renderWithRouter(<CountryCard country={countryWithBothFlags} />);

    const flag = screen.getByRole("img");
    expect(flag).toHaveAttribute("src", "https://example.com/japan.svg");

    const errorEvent = new Event("error");
    flag.dispatchEvent(errorEvent);

    expect(flag).toHaveAttribute("src", "https://example.com/japan.png");
  });

  it("has proper responsive image attributes", () => {
    renderWithRouter(<CountryCard country={mockCountry} />);

    const flag = screen.getByRole("img");
    expect(flag).toHaveAttribute("loading", "lazy");
    expect(flag).toHaveAttribute("decoding", "async");
    expect(flag).toHaveAttribute("sizes");
  });
});
