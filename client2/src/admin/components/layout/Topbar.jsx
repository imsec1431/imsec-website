import React from "react";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {

    const { admin } = useAuth();

    return (

        <div className="topbar">

            <div>
                <h4>Dashboard</h4>
            </div>

            <div className="topbar-right">

                <FaBell className="notification-icon"/>

                <div className="profile-box">

                    <strong>{admin?.name}</strong>

                    <small>{admin?.email}</small>

                </div>

            </div>

        </div>

    );
};

export default Topbar;