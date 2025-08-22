import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchFilter } from "./SearchFilter";

describe("SearchFilter Component", () => {
  it("renders search input and region filter", () => {
    render(<SearchFilter />);
    expect(
      screen.getByPlaceholderText(/search countries/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/filter by region/i)).toBeInTheDocument();
  });
  it("calls onSearch when typing in search input", async () => {
    const mockOnSearch = vi.fn();
    const user = userEvent.setup();

    render(<SearchFilter onSearch={mockOnSearch} />);
    const searchInput = screen.getByPlaceholderText(/search countries/i);
    await user.type(searchInput, "Canada");
  })
    it("calls onRegionFilter when selecting a region", async () => {
      const mockOnRegionFilter = vi.fn();
      const user = userEvent.setup();

      render(<SearchFilter onRegionFilter={mockOnRegionFilter} />);

      const regionSelect = screen.getByLabelText(/filter by region/i);
      await user.selectOptions(regionSelect, "americas");

      expect(mockOnRegionFilter).toHaveBeenCalledWith("americas");
    });
});
