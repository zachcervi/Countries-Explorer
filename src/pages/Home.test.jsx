import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "./Home";

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByText("Countries Explorer")).toBeInTheDocument();
  });
  it("renders the welcome message", () => {
    render(<Home />);
    expect(
      screen.getByText("Welcome to the Countries Explorer app!")
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
  it("contains search filter component", () => {
    render(<Home />);
    expect(
      screen.getByPlaceholderText(/search countries/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by region/i)).toBeInTheDocument();
  });
});
