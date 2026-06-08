import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoFilter from "../function-components/TodoFilter";
import { FilterType } from "../types";

const defaultProps = {
    currentFilter: "all" as FilterType,
    onFilterChange: vi.fn(),
};

describe("TodoFilter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all three filter buttons", async () => {
        render(<TodoFilter {...defaultProps} />);

        expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /completed/i })).toBeInTheDocument();
    });

    it("calls onFilterChange with the correct value when a filter is clicked", async () => {
        const user = userEvent.setup();
        render(<TodoFilter {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: /all/i }));
        expect(defaultProps.onFilterChange).toHaveBeenCalledWith("all");

        await user.click(screen.getByRole("button", { name: /active/i }));
        expect(defaultProps.onFilterChange).toHaveBeenCalledWith("active");

        await user.click(screen.getByRole("button", { name: /completed/i }));
        expect(defaultProps.onFilterChange).toHaveBeenCalledWith("completed");
    });

    it("applies the active class to the current filter button", async () => {
        render(<TodoFilter {...defaultProps} currentFilter="active" />);
        expect(screen.getByRole("button", { name: /active/i })).toHaveClass("todo-filter__btn--active");
    });

    it("hides the filter options when the toggle button is clicked", async () => {
        const user = userEvent.setup();
        render(<TodoFilter {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: /filter/i }));

        expect(screen.queryByRole("button", { name: /all/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /active/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /completed/i })).not.toBeInTheDocument();
    });
})