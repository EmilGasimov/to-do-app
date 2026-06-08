import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../AppFunction";

beforeEach(() => {
    vi.stubGlobal("localStorage", {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        clear: vi.fn(),
        removeItem: vi.fn(),
    });
});

describe("App", () => {
    it("adds a new todo to the list", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.click(screen.getByRole("button", { name: /add/i }));

        expect(screen.getByText("Task 1")).toBeInTheDocument();
    });

    it("toggles a todo as completed", async () => {
        const user = userEvent.setup();
        render(<App />);
        
        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await user.click(screen.getByRole("checkbox"));

        expect(screen.getByRole("listitem")).toHaveClass("todo-item--completed");
    });

    it("deletes a todo from the list", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await user.click(screen.getAllByText("✕")[0]);

        expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });

    it("filters todos by completed status", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await user.type(screen.getByRole("textbox"), "Task 2");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await user.click(screen.getAllByRole("checkbox")[0]);
        await user.click(screen.getByRole("button", { name: "Completed" }));

        expect(screen.queryByText("Task 1")).toBeInTheDocument();
        expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
    });

    it("clears all completed todos", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await user.click(screen.getByRole("checkbox"));
        await user.click(screen.getByRole("button", { name: /clear completed/i }));

        expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    });

    it("edits a todo", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await user.dblClick(screen.getByText("Task 1"));
        await user.clear(screen.getAllByRole("textbox")[1]);
        await user.type(screen.getAllByRole("textbox")[1], "Updated task");
        await user.keyboard("{Enter}");

        expect(screen.queryByText("Updated task")).toBeInTheDocument();
    });

    it("filters todos by active status", async () => {
        const user = userEvent.setup();
        render(<App />);

        await user.type(screen.getByRole("textbox"), "Task 1");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await user.type(screen.getByRole("textbox"), "Task 2");
        await user.click(screen.getByRole("button", { name: /add/i }));
        await user.click(screen.getAllByRole("checkbox")[0]);
        await user.click(screen.getByRole("button", { name: "Active" }));

        expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Task 2")).toBeInTheDocument();
    });
})