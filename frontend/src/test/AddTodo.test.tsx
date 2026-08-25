import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodo from "../function-components/AddTodo";

describe("AddTodo", () => {
    it("renders an input and a submit button", () => {
        render(<AddTodo onAdd={() => {}} />);

        const input = screen.getByRole("textbox");
        const button = screen.getByRole("button");

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it("calls onAdd with the input value when the form is submitted", async () => {
        const user = userEvent.setup();
        const mockFn = vi.fn();

        render(<AddTodo onAdd={mockFn} />);

        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.click(screen.getByRole("button"));

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("Task 1");
    });

    it("calls onAdd with the input value when the Enter key is pressed", async () => {
        const user = userEvent.setup();
        const mockFn = vi.fn();

        render(<AddTodo onAdd={mockFn} />);

        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.keyboard("{Enter}");

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith("Task 1");
    })

    it("shows an error when input is only whitespace", async () => {
        const user = userEvent.setup();
        const mockFn = vi.fn();

        render(<AddTodo onAdd={mockFn} />);

        await user.type(screen.getByRole("textbox"), "    ");
        await user.click(screen.getByRole("button"));

        expect(mockFn).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Task cannot be empty.")).toBeInTheDocument();
    });

    it("clears the error when the user starts typing after a failed submit", async () => {
        const user = userEvent.setup();
        const mockFn = vi.fn();

        render(<AddTodo onAdd={mockFn} />);

        await user.click(screen.getByRole("button"));
        expect(screen.getByText("Task cannot be empty.")).toBeInTheDocument();

        await user.type(screen.getByRole("textbox"), "Task 2");
        expect(screen.queryByText("Task cannot be empty.")).not.toBeInTheDocument();
    });

    it("rejects input values exceeding 100 characters", async () => {
        const user = userEvent.setup();
        const mockFn = vi.fn();

        render(<AddTodo onAdd={mockFn} />);

        await user.type(screen.getByRole("textbox"), "a".repeat(101));
        await user.click(screen.getByRole("button"));

        expect(mockFn).toHaveBeenCalledTimes(0);
        expect(screen.getByText("Max 100 characters.")).toBeInTheDocument();
    });
})