import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const role = localStorage.getItem("userRole");

    if (role?.toLowerCase() !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminRoute;
