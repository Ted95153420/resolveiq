import { render, screen } from "@testing-library/react";

function TestComponent() {
    return <h1>Vitest is working</h1>;
}

describe("frontend test setup", () => {
    it("renders a React component", () => {
        render(<TestComponent />);

        expect(
            screen.getByRole("heading", {
                name: "Vitest is working",
            })
        ).toBeInTheDocument();
    });
});