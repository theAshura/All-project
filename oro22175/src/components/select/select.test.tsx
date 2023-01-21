/* SELECT COMPONENT UNIT TEST
   ========================================================================== */

import { render, screen } from "@testing-library/react";

import Select from "./select";

test("Renders Select", () => {
  render(<Select label={"Test"} options={[]} onChange={() => null} />);
  const text = screen.getByText(/Text field/i);
  expect(text).toBeInTheDocument();
});
