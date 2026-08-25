import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "../function-components/TodoItem";
import { Todo } from "../types";

const defaultTodo: Todo = { id: 1, text: "Task 1", completed: false };

const defaultProps = {
    todo: defaultTodo,
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
};

describe("TodoItem", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("renders the todo text and a checkbox", () => {
        render(<TodoItem {...defaultProps} />);

        expect(screen.getByRole("checkbox")).toBeInTheDocument();
        expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    it("calls onToggle when the checkbox is clicked", async () => {
        const user = userEvent.setup();
        render(<TodoItem {...defaultProps} />);

        await user.click(screen.getByRole("checkbox"));

        expect(defaultProps.onToggle).toHaveBeenCalledWith(defaultProps.todo.id);
    });

    it("calls onDelete when the ✕ button is clicked", async () => {
        const user = userEvent.setup();
        render(<TodoItem {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "✕" }));

        expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.todo.id);
    });

    it("enters the edit mode when double-clicking the text", async () => {
        const user = userEvent.setup();
        render(<TodoItem {...defaultProps} />);

        await user.dblClick(screen.getByText("Task 1"));

        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toHaveValue("Task 1");
    });

    it("submits the new task name after pressing the Enter key", async () => {
        const user = userEvent.setup();
        render(<TodoItem {...defaultProps} />);

        await user.dblClick(screen.getByText("Task 1"));
        await user.clear(screen.getByRole("textbox"));
        await user.type(screen.getByRole("textbox"), "Updated task");
        await user.keyboard("{Enter}");

        expect(defaultProps.onEdit).toHaveBeenCalledWith(1, "Updated task");
    });

    it("cancels the edit when Escape is pressed", async () => {
        const user = userEvent.setup();
        render(<TodoItem {...defaultProps} />);

        await user.dblClick(screen.getByText("Task 1"));
        await user.keyboard("{Escape}");

        expect(defaultProps.onEdit).not.toHaveBeenCalled();
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    it("submits the edit when the input loses focus", async () => {
        const user = userEvent.setup();
        render(<TodoItem {...defaultProps} />);

        await user.dblClick(screen.getByText("Task 1"));
        await user.clear(screen.getByRole("textbox"));
        await user.type(screen.getByRole("textbox"), "Updated task");
        await user.tab();

        expect(defaultProps.onEdit).toHaveBeenCalledWith(1, "Updated task");
    });

    it("does not call onEdit when the edit input is cleared", async () => {
        const user = userEvent.setup();

        render(<TodoItem {...defaultProps} />);

        await user.dblClick(screen.getByText("Task 1"));
        await user.clear(screen.getByRole("textbox"));
        await user.keyboard("{Enter}");

        expect(defaultProps.onEdit).not.toHaveBeenCalled();
    });

    it("applies the completed class when the todo is completed", async () => {
        render(<TodoItem {...defaultProps} todo={{ ...defaultTodo, completed: true }} />);

        expect(screen.getByRole("listitem")).toHaveClass("todo-item--completed");
    });
})