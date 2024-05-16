import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import RegisterPage from "@/pages/register";
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
    route: "/login",
    pathname: "/login",
    query: {},
    asPath: "/login",
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

describe("RegisterPage", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      route: "/login",
      pathname: "/login",
    });
  });

  it("should handle the register process", async () => {
    const { getByLabelText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <RegisterPage />
      </AuthContextModule.AuthProvider>
    );

    const inputName = getByLabelText("Name:");
    const inputEmail = getByLabelText("Email:");
    const inputPassword = getByLabelText("Password:");
    const inputRole = getByLabelText("Role:");
    const registerButton = getByRole("button", { name: "Register" });

    await act(async () => {
      fireEvent.change(inputName, { target: { value: "Test User" } });
      fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "password123" } });
      fireEvent.change(inputRole, { target: { value: "user" } });
    });
    await act(async () => {
      fireEvent.click(registerButton);
      fireEvent.submit(getByRole('form'));
    });

    // Ensure that the useRouter push method was called
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/login");
    });
  });
});

describe("RegisterPage Error Tests", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      route: "/login",
      pathname: "/login",
    });
  });
  
  it("should handle the register process with bad request", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: null, isAuthenticated: false },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.resolve(
        createMockResponse(
          { message: "Bad Requests" },
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    const { getByLabelText, getByRole, getByText } = render(
      <AuthContextModule.AuthProvider>
        <RegisterPage />
      </AuthContextModule.AuthProvider>
    );
    
    const inputName = getByLabelText("Name:");
    const inputEmail = getByLabelText("Email:");
    const inputPassword = getByLabelText("Password:");
    const inputRole = getByLabelText("Role:");
    const registerButton = getByRole("button", { name: "Register" });

    await act(async () => {
      fireEvent.change(inputName, { target: { value: "Test User" } });
      fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "password123" } });
      fireEvent.change(inputRole, { target: { value: "user" } });
    });
    await act(async () => {
      fireEvent.click(registerButton);
      fireEvent.submit(getByRole('form'));
    });

    await waitFor(() => {
      expect(getByText("Bad Requests")).toBeInTheDocument();
    });

    // Clean up the mock to not affect other tests
    jest.restoreAllMocks();
  });

  it("displays a general error message on fetch failure", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: null, isAuthenticated: false },
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
        <RegisterPage />
      </AuthContextModule.AuthProvider>
    );

    const inputName = getByLabelText("Name:");
    const inputEmail = getByLabelText("Email:");
    const inputPassword = getByLabelText("Password:");
    const inputRole = getByLabelText("Role:");
    const registerButton = getByRole("button", { name: "Register" });

    await act(async () => {
      fireEvent.change(inputName, { target: { value: "Test User" } });
      fireEvent.change(inputEmail, { target: { value: "test@example.com" } });
      fireEvent.change(inputPassword, { target: { value: "password123" } });
      fireEvent.change(inputRole, { target: { value: "user" } });
    });
    await act(async () => {
      fireEvent.click(registerButton);
      fireEvent.submit(getByRole('form'));
    });

    expect(await findByText("Failed to register.")).toBeInTheDocument();
  });

  it('redirects to the home page if the user is already authenticated', async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    render(
      <AuthContextModule.AuthProvider>
        <RegisterPage />
      </AuthContextModule.AuthProvider>
    );

    // Check if the router pushes to the home page immediately after the component mounts
    expect(useRouter().push).toHaveBeenCalledWith('/');
  });
});

