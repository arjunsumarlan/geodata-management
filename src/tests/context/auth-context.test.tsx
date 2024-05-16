import React from "react";
import {
  render,
  act,
  fireEvent,
  getByRole,
  waitFor,
} from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/auth-context";

// Helper component to access auth context values
const ConsumerComponent = () => {
  const { auth, login, logout } = useAuth();
  return (
    <div>
      <div>Token: {auth.token}</div>
      <div>Authenticated: {auth.isAuthenticated ? "Yes" : "No"}</div>
      <button onClick={() => login("12345")}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe("AuthProvider", () => {
  beforeEach(() => {
    // Clear all items in our mock localStorage before each test
    window.localStorage.clear();
  });

  it("initializes with no authenticated user", () => {
    const { queryByText } = render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );
    expect(queryByText("Token:")).toHaveTextContent("Token:");
    expect(queryByText("Authenticated: No")).toHaveTextContent(
      "Authenticated: No"
    );
  });

  it("can log in and update the auth state", async () => {
    const { getByRole, getByText } = render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );
    act(() => {
      fireEvent.click(getByRole("button", { name: "Login" }));
    });
    await waitFor(() => {
      const tokenText = getByText(/Token:/);
      expect(tokenText).toHaveTextContent("Token: 12345");
      const authText = getByText(/Authenticated:/);
      expect(authText).toHaveTextContent("Authenticated: Yes");
    });
  });

  it("can log out and update the auth state", () => {
    const { queryByText, getByText } = render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );
    act(() => {
      fireEvent.click(getByText("Login"));
    });
    act(() => {
      fireEvent.click(getByText("Logout"));
    });
    expect(queryByText("Token:")).toHaveTextContent("Token:");
    expect(queryByText("Authenticated: No")).toHaveTextContent(
      "Authenticated: No"
    );
  });

  it("loads the initial token from localStorage", async () => {
    window.localStorage.setItem("token", "initial-token");
    const { getByText } = render(
      <AuthProvider>
        <ConsumerComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      const tokenText = getByText(/Token:/);
      expect(tokenText).toHaveTextContent("Token: initial-token");
      const authText = getByText(/Authenticated:/);
      expect(authText).toHaveTextContent("Authenticated: Yes");
    });
  });
});

// Helper component to trigger the useAuth hook
const TriggerUseAuth = () => {
  useAuth(); 
  return null;
};

describe("useAuth hook", () => {
  it("throws an error when not used within an AuthProvider", () => {
    const consoleError = jest.spyOn(console, "error");
    consoleError.mockImplementation(() => {});

    expect(() => {
      render(<TriggerUseAuth />);
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleError.mockRestore();
  });
});
