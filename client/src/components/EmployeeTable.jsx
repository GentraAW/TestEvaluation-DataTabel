import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [updatedEmployees, setUpdatedEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/employee")
      .then((response) => {
        const employeesWithOperation = response.data.map((employee) => ({
          ...employee,
          operation: "update", // Default operation buat employee yang sudah ada
        }));
        setEmployees(employeesWithOperation);
        setUpdatedEmployees(employeesWithOperation);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setEmployees([]);
          setUpdatedEmployees([]);
        } else {
          setError("Fetching error " + error.message);
        }
      });
  }, []);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updated = [...updatedEmployees];
    updated[index][name] = value;
    setUpdatedEmployees(updated);
  };

  const handleAddRow = () => {
    setUpdatedEmployees([
      ...updatedEmployees,
      {
        id: null,
        name: "",
        age: "",
        email: "",
        phone: "",
        operation: "create", // Default operation untu row baru
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updated = [...updatedEmployees];
    if (updated[index].operation === "create") {
      updated.splice(index, 1);
    } else {
      updated[index].operation = "delete";
    }
    setUpdatedEmployees(updated);
  };

  const handleSave = () => {
    axios
      .post("http://localhost:8080/api/employee/bulk", updatedEmployees)
      .then((response) => {
        console.log("Employee berhasil update", response);
        alert("Save Berhasil!");
        window.location.reload();
      })
      .catch((error) => {
        setError("Error update data" + error.message);
      });
  };

  return (
    <div className="container mx-auto p-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <table className="table-auto w-full ">
        <thead>
          <tr className="bg-gray-200">
            <th className="border-2 border-black p-2">ID</th>
            <th className="border-2 border-black p-2">Name</th>
            <th className="border-2 border-black p-2">Age</th>
            <th className="border-2 border-black p-2">Email</th>
            <th className="border-2 border-black p-2">Phone</th>
            <th className="border-2 border-black p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {updatedEmployees.map((employee, index) => (
            <tr key={employee.id || index}>
              <td className="border-2 border-black p-2">{employee.id}</td>
              <td className="border-2 border-black p-2">
                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full p-1 "
                />
              </td>
              <td className="border-2 border-black p-2">
                <input
                  type="number"
                  name="age"
                  value={employee.age}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full p-1"
                />
              </td>
              <td className="border-2 border-black p-2">
                <input
                  type="email"
                  name="email"
                  value={employee.email}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full p-1"
                />
              </td>
              <td className="border-2 border-black p-2">
                <input
                  type="tel"
                  name="phone"
                  value={employee.phone}
                  onChange={(e) => handleInputChange(index, e)}
                  className="w-full p-1"
                />
              </td>
              <td className="border-2 border-black p-2 ">
                <div className="flex justify-center">
                  <button
                    onClick={() => handleDeleteRow(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded "
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddRow}
        className="mt-4 px-4 py-2 mr-2 bg-green-500 text-white rounded"
      >
        + Add Row
      </button>
      {updatedEmployees.length > 0 && (
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default EmployeeTable;
