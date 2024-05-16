import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import LoginPage from "@/pages/login";
import * as AuthContextModule from "@/context/auth-context";

// Function to create a mock Response object
const createMockResponse = (body: any, init: ResponseInit = {}) => {
  return new Response(JSON.stringify(body), init);
};

// Mock fetch globally
global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
  Promise.resolve(
    createMockResponse(
      { token: "12345" },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
        ...init,
      }
    )
  )
) as jest.Mock;

// Mocking Next.js useRouter hook directly
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    route: "/",
    pathname: "/",
    query: {},
    asPath: "/",
    push: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    basePath: "",
    locale: "en-US",
    locales: ["en-US"],
    defaultLocale: "en-US",
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
  })),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      route: "/",
      pathname: "/",
    });
  });

  it("should handle the login process", async () => {
    const { getByLabelText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <LoginPage />
      </AuthContextModule.AuthProvider>
    );

    const inputEmail = getByLabelText("Email:");
    const inputPassword = getByLabelText("Password:");
    const loginButton = getByRole("button", { name: "Login" });

    await act(async () => {
      fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "password123" } });
    });
    await act(async () => {
      fireEvent.click(loginButton);
      fireEvent.submit(getByRole("form"));
    });

    // Ensure that the useRouter push method was called
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/");
    });
  });
});

describe("LoginPage Error Tests", () => {
  it("should handle the login process with error from server", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: false },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.resolve(
        createMockResponse(
          { message: "Invalid credentials" },
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    const { getByLabelText, getByRole, getByText } = render(
      <AuthContextModule.AuthProvider>
        <LoginPage />
      </AuthContextModule.AuthProvider>
    );
    fireEvent.change(getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByLabelText("Password:"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Clean up the mock to not affect other tests
    jest.restoreAllMocks();
  });

  it("displays a general error message on fetch failure", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: false },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.reject(
        createMockResponse(
          { message: "Network error" },
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;
    const { getByLabelText, getByRole, findByText } = render(
      <AuthContextModule.AuthProvider>
        <LoginPage />
      </AuthContextModule.AuthProvider>
    );

    const emailInput = getByLabelText("Email:");
    const passwordInput = getByLabelText("Password:");
    const loginButton = getByRole("button", { name: "Login" });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "testpassword" } });
      fireEvent.click(loginButton);
    });

    expect(await findByText("Failed to login.")).toBeInTheDocument();
  });
});
