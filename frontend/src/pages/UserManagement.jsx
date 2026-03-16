import React, { useEffect, useState } from "react";
import apiProxy from "../utils/proxyClient";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiProxy.get("/users/"); // Assuming admin endpoint
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'agent' : 'admin';
        try {
            await apiProxy.patch(`/users/${userId}/`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            alert("Failed to update role.");
        }
    };

    if (loading) return <div>Loading Users...</div>;

    return (
        <div className="page-content">
            <h2>User Role Management</h2>
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Current Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.full_name}</td>
                                <td>{user.email}</td>
                                <td><span className={`role-badge ${user.role}`}>{user.role.toUpperCase()}</span></td>
                                <td>
                                    <button className="edit-btn" onClick={() => toggleRole(user.id, user.role)}>
                                        Change to {user.role === 'admin' ? 'Agent' : 'Admin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
