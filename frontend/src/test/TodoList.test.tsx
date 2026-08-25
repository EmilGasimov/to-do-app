import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "../function-components/TodoList";

const defaultProps = {
    todos: [
        { id: 1, text: "Task 1", completed: false },
        { id: 2, text: "Task 2", completed: false },
        { id: 3, text: "Task 3", completed: true },
    ],
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onEdit: vi.fn(),
};

const sortingTodos = [
    { id: 1, text: "Zebra", completed: false },
    { id: 2, text: "Apple", completed: false },
    { id: 3, text: "Mango", completed: true },
];

describe("TodoList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("shows an empty message when there are no todos", () => {
        render(<TodoList {...defaultProps} todos={[]} />);

        expect(screen.getByText(/no tasks here/i)).toBeInTheDocument();
    });

    it("renders all todos", () => {
        render(<TodoList {...defaultProps} />);

        expect(screen.getAllByRole("listitem")[0]).toHaveTextContent("Task 1");
        expect(screen.getAllByRole("listitem")[1]).toHaveTextContent("Task 2");
        expect(screen.getAllByRole("listitem")[2]).toHaveTextContent("Task 3");
    });

    it("sorts todos alphabetically by default", () => {
        render(<TodoList {...defaultProps} todos={sortingTodos} />);

        expect(screen.getAllByRole("listitem")[0]).toHaveTextContent(/apple/i);
    });

    it("sorts completed todos to the bottom when sorting by status", async () => {
        const user = userEvent.setup();
        render(<TodoList {...defaultProps} todos={sortingTodos} />);

        await user.click(screen.getByRole("button", { name: /active first/i }));
        expect(screen.getAllByRole("listitem")[2]).toHaveTextContent(/mango/i);
    });
});