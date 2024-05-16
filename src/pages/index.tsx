"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GeoJsonObject } from "geojson";
import FileUploader from "@/components/FileUploader";
import MapDisplay from "@/components/MapDisplay";
import PopupGeoData from "@/components/PopupGeoData";
import { useAuth } from "@/context/auth-context";
import { User } from "@prisma/client";

const Home: React.FC = () => {
  const { auth, logout } = useAuth();
  const router = useRouter();
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedGeoJson, setSelectedGeoJson] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const fetchUserDatas = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/users?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.status === 200) {
        setUsers(result.data.users);
        setTotal(result.data.total);
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.log("Failed to get the users.");
    }
  };

  useEffect(() => {
    fetchUserDatas();
  }, [geoJsonData, page]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [auth, auth.isAuthenticated, router]);

  const handleGeoJsonData = async (data: GeoJsonObject | null) => {
    setGeoJsonData(data);
    if (data) {
      await fetchUserDatas();
    }
  };

  const handleShowGeoJson = (geoJsonData: string) => {
    setSelectedGeoJson(geoJsonData);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePrevious = () => {
    setPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPage((prev) => (prev * limit < total ? prev + 1 : prev));
  };

  return (
    <div className="flex flex-col lg:flex-row mx-auto dark:bg-gray-700 dark:text-gray-400">
      <div className="py-3 px-5 lg:pr-0 lg:pl-20 lg:mt-5">
        <h1 className="text-xl font-bold my-6">Update User GeoData</h1>
        <FileUploader onUpload={handleGeoJsonData} />
        {geoJsonData && <MapDisplay geojsonData={geoJsonData} />}
      </div>
      <div className="pt-10 px-5 lg:px-32">
        <div className="pagination mb-2">
          <button
            className="button-page text-sm"
            onClick={handlePrevious}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-xs">
            Page {page} of {totalPages} - Total Users: {total}
          </span>
          <button
            className="button-page text-sm"
            onClick={handleNext}
            disabled={page * limit >= total}
          >
            Next
          </button>
        </div>
        {users.length > 0 ? (
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg mb-10">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Role
                  </th>
                  <th scope="col" className="py-3 px-6">
                    GeoJSON
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, id) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={id}
                  >
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">{user.role}</td>
                    <td className="py-4 px-6">
                      <button
                        className="text-blue-500 hover:text-blue-800"
                        onClick={() => handleShowGeoJson(user.geojson)}
                      >
                        Show Data
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      {new Date(user.updatedAt).toString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full w-full py-10 px-20 lg:px-80">
            <p className="text-lg text-gray-700">No data available.</p>
          </div>
        )}
      </div>
      <PopupGeoData
        isOpen={modalOpen}
        closeModal={closeModal}
        content={selectedGeoJson}
      />
    </div>
  );
};

export default Home;
