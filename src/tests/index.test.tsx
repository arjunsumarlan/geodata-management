import React from "react";
import { act, fireEvent, getByText, render, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import GeoDataMngPage from "@/pages/index";
import * as AuthContextModule from "@/context/auth-context";
import { User } from "@prisma/client";

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

describe("GeoData Management Page", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(window, "alert").mockImplementation(() => {});
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      route: "/login",
      pathname: "/login",
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("redirects to login if not authenticated", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: null, isAuthenticated: false },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );
    expect(useRouter().push).toHaveBeenCalledWith("/login");
  });

  it("fetches users and displays them", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.resolve(
        createMockResponse(
          {
            data: {
              users: [
                {
                  id: "1",
                  name: "John Doe",
                  email: "john@example.com",
                  role: "User",
                  geojson: "{}",
                },
              ],
            },
          },
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    const { findByText } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );
    const userData = await findByText("John Doe");
    expect(userData).toBeInTheDocument();
  });

  test("should handle previous page correctly", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    const users: User[] = [];
    for (let i = 0; i < 25; i++) {
      users.push({
        name: `User - ${Math.floor(i/10) + 1}`,
        email: "user@gmail.com",
        role: "User",
        geojson: "{}",
        id: Math.floor(Math.random() * 100),
        password: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.resolve(
        createMockResponse(
          {
            data: {
              total: 25,
              users,
            },
          },
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    const { getAllByText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    await waitFor(() => expect(getAllByText("User - 1")[0]).toBeInTheDocument());
    fireEvent.click(getByRole("button", {name: "Next"}));
    await waitFor(() => expect(getAllByText("User - 2")[0]).toBeInTheDocument());
    fireEvent.click(getByRole("button", {name: "Previous"}));
    await waitFor(() => expect(getAllByText("User - 1")[0]).toBeInTheDocument());
  });

  test("should handle next page correctly", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    const users: User[] = [];
    for (let i = 0; i < 20; i++) {
      users.push({
        name: `User - ${Math.floor(i/10) + 1}`,
        email: "user@gmail.com",
        role: "user",
        geojson: "{}",
        id: i,
        password: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.resolve(
        createMockResponse(
          {
            data: {
              total: 20,
              users,
            },
          },
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    const { getAllByText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    await waitFor(() => expect(getAllByText("User - 1")[0]).toBeInTheDocument());
    fireEvent.click(getByRole("button", {name: "Next"}));
    await waitFor(() => expect(getAllByText("User - 2")[0]).toBeInTheDocument());
  });

  test("should not go to previous page if already on the first page", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: `User - ${Math.floor(i/10) + 1}`,
        email: "user@gmail.com",
        role: "User",
        geojson: "{}",
        id: Math.floor(Math.random() * 100),
        password: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.resolve(
        createMockResponse(
          {
            data: {
              total: 10,
              users,
            },
          },
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    const { getAllByText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    await waitFor(() => expect(getAllByText("User - 1")[0]).toBeInTheDocument());
    fireEvent.click(getByRole("button", {name: "Previous"}));
    await waitFor(() => expect(getAllByText("User - 1")[0]).toBeInTheDocument());
  });

  test("should not go to next page if on the last page", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        name: `User - ${Math.floor(i/10) + 1}`,
        email: "user@gmail.com",
        role: "User",
        geojson: "{}",
        id: Math.floor(Math.random() * 100),
        password: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.resolve(
        createMockResponse(
          {
            data: {
              total: 10,
              users,
            },
          },
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    const { getByRole, getAllByText } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    fireEvent.click(getByRole("button", {name: "Next"}));
    await waitFor(() => expect(getAllByText("User - 1")[0]).toBeInTheDocument());
    
    fireEvent.click(getByRole("button", {name: "Next"}));
    await waitFor(() => expect(getAllByText("User - 1")[0]).toBeInTheDocument());
  });

  it("handles API fetch errors gracefully", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: null, isAuthenticated: false },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.reject(
        createMockResponse(
          {
            message: "Network Error",
          },
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("Failed to get the users.");
    });
  });

  it("logs out and redirects when unauthorized", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: null, isAuthenticated: false },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn((input: RequestInfo, init?: RequestInit) =>
      Promise.resolve(
        createMockResponse(
          {
            message: "error",
          },
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
            ...init,
          }
        )
      )
    ) as jest.Mock;

    render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/login");
    });
  });

  it("handles geodata popup with the correct data on button click", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              users: [
                {
                  id: "1",
                  name: "John Doe",
                  email: "john@example.com",
                  role: "User",
                  geojson: "{}",
                },
              ],
            },
          }),
        status: 200,
      })
    ) as jest.Mock;

    const { getByRole, getByText } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    await waitFor(() => {
      const showDataButton = getByRole("button", { name: "Show Data" });
      fireEvent.click(showDataButton);

      // If there's supposed to be a modal opening, you can check for that as well
      expect(getByText("GeoJSON Data")).toBeInTheDocument();
    });

    const showJSONButton = getByRole("button", { name: "Show JSON" });
    fireEvent.click(showJSONButton);

    expect(getByText("Show Map")).toBeInTheDocument();

    const closeModalButton = getByRole("button", { name: "X" });
    fireEvent.click(closeModalButton);

    expect(closeModalButton).not.toBeInTheDocument();
  });

  it("should handle the upload geodata process", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            message: "GeoJSON processed successfully",
            data: {
              users: [
                {
                  id: "1",
                  name: "John Doe",
                  email: "john@example.com",
                  role: "User",
                  geojson: "{}",
                },
              ],
            },
          }),
        status: 200,
      })
    ) as jest.Mock;

    const { getByLabelText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );
    fireEvent.change(getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });

    // Set the files property of the input element
    const mockFileList = generateMockFileList(
      "geodata.json",
      "application/json"
    );
    const input = getByLabelText("GeoJSON:");
    Object.defineProperty(input, "files", {
      value: mockFileList,
      writable: false,
    });
    fireEvent.change(input);

    fireEvent.click(getByRole("button", { name: "Upload Data" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "GeoJSON processed successfully"
      );
    });
  });

  function generateMockFileList(filename: string, type: string) {
    // Simulate setting GeoJson data
    const str = JSON.stringify({
      type: "FeatureCollection",
      features: [],
    });
    const geoJsonFile = new File([str], filename, {
      type,
    });
    // Create a mock FileList
    const mockFileList = {
      0: geoJsonFile,
      length: 1,
      item: () => geoJsonFile,
    };

    return mockFileList;
  }

  it("should handles errors when upload geodata", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            status: "error",
            message: "Bad Requests",
          }),
        status: 400,
      })
    ) as jest.Mock;

    const { getByLabelText, getByText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    fireEvent.change(getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });

    // Set the files property of the input element
    const mockFileList = generateMockFileList(
      "geodata.json",
      "application/json"
    );
    const input = getByLabelText("GeoJSON:");
    Object.defineProperty(input, "files", {
      value: mockFileList,
      writable: false,
    });
    fireEvent.change(input);

    fireEvent.click(getByRole("button", { name: "Upload Data" }));

    await waitFor(() => {
      expect(getByText("Bad Requests")).toBeInTheDocument();
    });
  });

  it("should handles network error when upload geodata", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn(() =>
      Promise.reject({
        json: () =>
          Promise.resolve({
            status: "error",
            message: "Network Error",
          }),
        status: 500,
      })
    ) as jest.Mock;

    const { getByLabelText, getByText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    fireEvent.change(getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });

    // Set the files property of the input element
    const mockFileList = generateMockFileList(
      "geodata.json",
      "application/json"
    );
    const input = getByLabelText("GeoJSON:");
    Object.defineProperty(input, "files", {
      value: mockFileList,
      writable: false,
    });
    fireEvent.change(input);

    fireEvent.click(getByRole("button", { name: "Upload Data" }));

    await waitFor(() => {
      expect(
        getByText("Failed to parse the GeoJSON file.")
      ).toBeInTheDocument();
    });
  });

  it("should handles errors when upload geodata file with wrong format", async () => {
    jest.spyOn(AuthContextModule, "useAuth").mockImplementation(() => ({
      auth: { token: "123", isAuthenticated: true },
      login: jest.fn(),
      logout: jest.fn(),
    }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: {
              users: [
                {
                  id: "1",
                  name: "John Doe",
                  email: "john@example.com",
                  role: "User",
                  geojson: "{}",
                },
              ],
            },
          }),
        status: 200,
      })
    ) as jest.Mock;

    const { getByLabelText, getByText, getByRole } = render(
      <AuthContextModule.AuthProvider>
        <GeoDataMngPage />
      </AuthContextModule.AuthProvider>
    );

    fireEvent.change(getByLabelText("Email:"), {
      target: { value: "test@example.com" },
    });

    // Set the files property of the input element
    const mockFileList = generateMockFileList("geodata.txt", "text/plain");
    const input = getByLabelText("GeoJSON:");
    Object.defineProperty(input, "files", {
      value: mockFileList,
      writable: false,
    });
    fireEvent.change(input);

    await waitFor(() => {
      expect(
        getByText("Please upload a valid GeoJSON file.")
      ).toBeInTheDocument();
    });

    fireEvent.click(getByRole("button", { name: "Upload Data" }));

    await waitFor(() => {
      expect(
        getByText("No file selected or file format is incorrect.")
      ).toBeInTheDocument();
    });
  });
});
