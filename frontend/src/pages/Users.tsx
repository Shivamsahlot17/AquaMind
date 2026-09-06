import { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import {
  getUsers,
  updateUserRole,
  deleteUser,
  type User,
} from "../services/userService";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(
    userId: string,
    role: User["role"]
  ) {
    try {
      const updatedUser = await updateUserRole(userId, role);

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId ? updatedUser : user
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update user role.");
    }
  }

  async function handleDelete(userId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(userId);

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userId)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  }

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "5px" }}>👥 User Management</h1>

          <p style={{ color: "#666", marginTop: "0" }}>
            Manage AquaMind users and their roles.
          </p>
        </div>

        <button
          onClick={loadUsers}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            background: "#0f4c81",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {loading && <p>Loading users...</p>}

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#b00020",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          No users found.
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#0f4c81",
                    color: "white",
                    textAlign: "left",
                  }}
                >
                  <th style={headerStyle}>Name</th>
                  <th style={headerStyle}>Email</th>
                  <th style={headerStyle}>Role</th>
                  <th style={headerStyle}>Created</th>
                  <th style={headerStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={cellStyle}>
                      <strong>{user.name}</strong>
                    </td>

                    <td style={cellStyle}>{user.email}</td>

                    <td style={cellStyle}>
                      <select
                        value={user.role}
                        onChange={(event) =>
                          handleRoleChange(
                            user.id,
                            event.target.value as User["role"]
                          )
                        }
                        style={{
                          padding: "7px 10px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          cursor: "pointer",
                        }}
                      >
                        <option value="VIEWER">VIEWER</option>
                        <option value="ENGINEER">ENGINEER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td style={cellStyle}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td style={cellStyle}>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          padding: "7px 12px",
                          border: "none",
                          borderRadius: "6px",
                          background: "#c62828",
                          color: "white",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

const headerStyle = {
  padding: "14px 16px",
  fontSize: "15px",
};

const cellStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #eee",
};

export default Users;